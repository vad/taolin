<?php
/**
  * This file is part of taolin project (http://taolin.fbk.eu)
  * Copyright (C) 2008, 2009 FBK Foundation, (http://www.fbk.eu)
  * Authors: SoNet Group (see AUTHORS.txt)
  *
  * Taolin is free software: you can redistribute it and/or modify
  * it under the terms of the GNU Affero General Public License as published by
  * the Free Software Foundation version 3 of the License.
  *
  * Taolin is distributed in the hope that it will be useful,
  * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  * GNU Affero General Public License for more details.
  *
  * You should have received a copy of the GNU Affero General Public License
  * along with Taolin. If not, see <http://www.gnu.org/licenses/>.
  *
  */
?>
<?php

uses('sanitize');

class CalendarsController extends AppController {
    var $name = 'Calendars';
    var $helpers = array('Html','Form','Javascript');
    var $components = array('Libical');

    function beforeFilter()
    {
        parent::beforeFilter();

        $this->checkSession();
        $this->mrClean = new Sanitize();
    }


    function updateDatabase($url){
        $data = $this->Calendar->findByUrl($url);
        $this->Calendar->create($data);
        $new_cal = False;

        if (!$data){
            // never checked this calendar before
            // this is a new calendar
            $this->Calendar->set('url', $url);
            $this->Calendar->set('checked', date('Y-m-d H:i:s'));
            $this->Calendar->save();
            $new_cal = True;
        } else {
            $out = $this->Calendar->query("UPDATE calendars SET checked = NOW() WHERE url = '$url' AND checked < NOW() - interval '10 minutes' RETURNING id");
            if (!count($out)){ //nothing to update
                return;
            }
        }
        $dbcal_id = $this->Calendar->field('id');

        if (!$new_cal){ //calendar already present
            // old calendar, find out its events
            $this->Calendar->Event->enableSoftDeletable('find', false);
            $res = $this->Calendar->Event->find('all',
                array(
                    'conditions' => array('Calendar.id' => $dbcal_id),
                    'fields' => array('Event.uid', 'Event.id')
                )
            );
            $this->Calendar->Event->enableSoftDeletable('find', true);
            $db_uids = Set::extract($res, '{n}.Event.uid');
            $db_ids  = Set::extract($res, '{n}.Event.id');
            
            // (soft) delete all the events
            /*$this->Calendar->Event->deleteAll(array('calendar_id' => $dbcal_id),
                false, true);*/ // this has problems with cake
            $this->Calendar->Event->updateAll(
                array('deleted' => 1, 'deleted_date' => 'NOW()'),
                array('calendar_id' => $dbcal_id, 'deleted' => 0)
            );
        }

        $libical_cal = $this->Libical->get_calendar($url);
        $events = $libical_cal->components['VCALENDAR'][0]->get('VEVENT');

        foreach ($events as $event) {
            $e_out = array();
            $e_out['calendar_id'] = $dbcal_id;
            $e_out['description'] = $event->get_description();
            $e_out['summary'] = $event->get_summary();
            $e_out['start_time'] = date('Y-m-d H:i:s', $event->get_start());
            $e_out['end_time'] = date('Y-m-d H:i:s', $event->get_end());
            $e_out['uid'] = $event->get_uid();

            $this->Calendar->Event->create();

            if (!$new_cal){ // find out if this uid is already present
                $uid_pos = array_search($e_out['uid'], $db_uids);

                if (is_numeric($uid_pos)){
                    $e_id = $db_ids[$uid_pos];
                    
                    $this->Calendar->Event->undelete($e_id);

                    //TODO: update summary, description, ...
                    continue;
                }
            }
                
            $this->Calendar->Event->save($e_out);
        }       
        
    }


    function get() {
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';
        
        $limit = 5;
        $start = 0;

        $urls = array(
            "http://www.fbk.eu/event.ics",
            "http://in.fbk.eu/event.ics"
        );

        // update calendars in DB
        foreach ($urls as $url) {
            $this->updateDatabase($url);
        }

        $params = array(
            'order' => 'start_time DESC',
            'conditions' => array('Calendar.url' => $urls)
        );
        $events_cnt = $this->Calendar->Event->find('count', $params);

        $params['limit'] = $limit;
        $params['page'] = $start/$limit;

        $res = $this->Calendar->Event->find('all', $params);
        $events = Set::extract($res, '{n}.Event');

        /*if(!empty($this->params['form']['limit'])) {
            $limit = $mrClean->paranoid($this->params['form']['limit']);
        }
            
        if(!empty($this->params['form']['start'])) {
            $start = $mrClean->paranoid($this->params['form']['start']);
        }*/
        $out = array();
        $out['totalCount'] = $events_cnt;
        $out['events'] = $events;

        $this->set('json', $out);
    }

}
?>
