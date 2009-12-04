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

class TimelinesController extends AppController {
    var $name = 'Timelines';
    var $helpers = array('Html','Form');
    var $uses = array('Photo','ReadableTimeline','Template','Timeline');
    var $components = array('Comment');
    var $cacheName = "cake_controller_timelines_last-timeline-events";
    // used in gettemplates for "Davide commented Marco's message
    // in the board"-like events
    var $shortTemplates = array(
        "Board" => "{{ user | userify timelineid }}'s message in the board widget",
        "Timeline" => "{{ user | userify timelineid }}'s event"
    );

    function beforeFilter()
    {
        parent::beforeFilter();

        $this->checkSession();
    }
    
    
    /* 
     * add an event to timelines table
     * Params:  
     * @param: parameters to be displayed in the timeline 
     * @date: date of the event, format datetime, 
     *        format 'YYYY-MM-DD HH:MM:SS'
     * @type_name: foreign key on types table, containing template to render those parameters
     * @uid: id of the user who perform the action
     * @model_alias: Model alias (for commenting purposes) that binds the timeline's event with the corresponding database table
     * @foreign_id: foreign key to the aforementioned database table
     * @comment_id: foreign key to Comment database table
     * @comment_type_name: template name (to be used for the "comment" event)
     */
    function add($param, $date, $type_name, $uid, $model_alias, $foreign_id, $comment_id = null, $comment_type_name = null){
        
        // Encoding parameters into json
        // (if it's an array, otherwise assume it's already encoded)
        if(!empty($param) && ($param != null) && is_array($param))
            $param = json_encode($param);

        $type = $this->Timeline->Template->find('first', array(
            'conditions' => array(
                'Template.name' => $type_name
            ),
            'fields' => array(
                'Template.id'
            ),
            'recursive' => 0
        ));
        $tltype = $type['Template']['id'];

        if(isset($comment_type_name)){
            $comment_type = $this->Timeline->Template->find('first', array(
                'conditions' => array(
                    'Template.name' => $comment_type_name
                ),
                'fields' => array(
                    'Template.id'
                ),
                'recursive' => 0
            ));
            $comment_tltype = $comment_type['Template']['id'];
        }
        else
            $comment_tltype = null;
            
        $data['param'] = $param;
        $data['date'] = $date;
        $data['user_id'] = $uid;
        $data['template_id'] = $tltype;
        $data['model_alias'] = $model_alias;
        $data['foreign_id'] = $foreign_id;
        $data['comment_id'] = $comment_id;
        $data['comment_template_id'] = $comment_tltype;
        $data['deleted'] = 0; // Need this to add Event's object (otherwise will fail)

        $this->Timeline->create($data);
        $this->Timeline->save();

        # clear cache
        clearCache($this->cacheName, '', '');
    }

    /* 
     * gettimeline function retrieves events out of readable_timelines table
     */
    function gettimeline(){
        //Configure::write('debug', '2');     //turn debugging off; debugging breaks ajax
        if (array_key_exists('debug', $this->params['url']))
            Configure::write('debug', '2');
        else
            Configure::write('debug', '0');
        $this->layout = 'ajax';

        App::import('Vendor','h2o/h2o');
        App::import('Vendor','filters');

        $limit_default = 15;
        $start_default = 0;

        $u_id = $this->params['form']['u_id'];

        if (array_key_exists('limit', $this->params['form']))
            $limit = $this->params['form']['limit'];
        else
            $limit = $limit_default;

        if (array_key_exists('start', $this->params['form']))
            $start = $this->params['form']['start'];
        else
            $start = $start_default;
        

        if (array_key_exists('nocache', $this->params['url']))
            $cache = FALSE;
        else
            $cache = TRUE;

        if($u_id != null){
            $conditions = array('user_id' => $u_id, 'date <= \''.date('Y-m-d H:i:s').'\'');
        }
        else
            $conditions = 'date <= \''.date('Y-m-d H:i:s').'\'';

        $cache_expires = '+5 minutes'; 
        #cache only the first page
        if (($start == $start_default) && ($limit == $limit_default) && ($u_id == null) && $cache) {

            $mainTimelineAndDefaultValues = True;
            $cache_data = cache($this->cacheName, null, $cache_expires); #retrieve values
            
        } else {
            $cache_data = "";
            $mainTimelineAndDefaultValues = False;
        }
            
        if (empty($cache_data)) {
            $this->ReadableTimeline->recursive = 0;

            $readabletimeline = $this->ReadableTimeline->find('all',
                array('conditions' => $conditions,
                    'fields' => array('id','user_id','name','surname','deleted','login','gender','param','date','temp','icon','model_alias','foreign_id','commentsCount', 'comment_id', 'comment_template_id'),
                    'limit' => $limit,
                    'recursive' => -1,
                    'page' => $start/$limit + 1
                )
            );

            $events = Set::extract($readabletimeline, '{n}.ReadableTimeline');

            # now we check if timeline events are related to deleted Model/foreign_key

            # group by model alias
            $grouped_events = array();
            foreach ($events as &$event) {
                $ma = $event['model_alias'];
                if (!$ma) continue;

                if (!array_key_exists($ma, $grouped_events))
                    $grouped_events[$ma] = array();

                $grouped_events[$ma][] = $event;
            }

            foreach ($grouped_events as $model_name => $records) {
                App::import("Model", $model_name);

                # explode: plugin.model_alias
                $tmp = explode('.', $model_name);
                $model_name = $tmp[count($tmp)-1];
                
                $model = new $model_name();
                $model->create();
                
                $ids = Set::extract($records, '{n}.foreign_id');

                $model->enableSoftDeletable('find', false);

                $deleted = $model->filterinvisibles($ids);

                foreach ($events as $key => &$event) {
                    if (($event['model_alias'] == $model_name) && in_array($event['foreign_id'], $deleted))
                        unset($events[$key]);
                }
            }

            /*
             * find comments events
             * they are two events in one:
             *   "Davide commented 'Marco uploaded a photo'"
             */
            foreach ($events as &$event) { 

                if (!$event['comment_id']) continue;

                $out = $this->Template->findById($event['comment_template_id']); 
                $short_template = $out['Template']['short_temp'];

                $commented_event = array();
                $commented_event['temp'] = $short_template;
                $commented_event['param'] = $event['param'];

                // find user's data for the commented event
                $model_name = $event['model_alias'];
                App::import("Model", $model_name);

                # explode: plugin.model_alias
                $tmp = explode('.', $model_name);
                $model_name = $tmp[count($tmp)-1];
                
                $model = new $model_name();
                $model->create();

                $res = $model->findById($event['foreign_id']);
                $commented_user = $res['User'];
                $commented_event['name'] = $commented_user['name'];
                $commented_event['surname'] = $commented_user['surname'];
                $commented_event['user_id'] = $commented_user['id'];
                $commented_event['gender'] = $commented_user['gender'];
                $commented_event['deleted'] = $commented_user['deleted'];
                $commented_event['commenter_id'] = $event['user_id'];

                $event['subevent'] = $this->prepareevent($commented_event);
            }


            # retrieve users' photos 
            $users = Set::extract($events, '{n}.user_id');
            $users_photo = $this->Photo->find('all',
                array(
                    'conditions' => array(
                        'user_id' => $users,
                        'default_photo' => 1,
                        'is_hidden' => 0
                    ),
                    'fields' => array('User.id', 'Photo.filename'),
                    'recursive' => 0
                )
            );

            foreach ($users_photo as $photo) {
                $hash_photos[$photo['User']['id']] = $photo['Photo']['filename'];
            }

            $results = a();
            foreach($events as &$event){
                $event['user_photo'] = $hash_photos[$event['user_id']];
                $event['event'] = $this->prepareevent($event);

                if ($event['subevent'])
                    $event['event'] .= $event['subevent'];

                
                if (empty($event['model_alias'])) {
                    $event['model_alias'] = 'Timeline';
                    $event['foreign_id'] = $event['id'];
                }

                unset($event['param'], $event['temp']); // no need to send this parameter, hence unset it
                $results[] = $event; #copy to this new array because of a cake bug (array indexes created by Set::extract are strings instead of integers...)
            }

            $response['timeline'] = $results;
            
            $response['total'] = $this->ReadableTimeline->find('count', array('conditions' => $conditions));
            $response['success'] = true;

            if ($mainTimelineAndDefaultValues) # save only if this is the main timeline and with default values
                cache($this->cacheName, serialize($response), $cache_expires);

        } else {
            $response = unserialize($cache_data);
        }

        $this->set('json', $response);
    }

    /* 
     * Format timeline event applying parameters to template
     */
    function prepareevent($event){

        $parameters = $event['param'];

        // Only if parameters are not void or null
        if($parameters && ($parameters != null)){
            // Decode parameters from json into an array
            $eventparam = json_decode($parameters, TRUE);
        }
        
        if($event['user_id'] != null){
            if($event['gender']==1) $adjective = 'his'; 
            else if($event['gender']==2) $adjective = 'her';
            else $adjective = 'her/his';

            if (!array_key_exists('user', $eventparam))
                $eventparam['user'] = array();

            $eventparam['user']['id'] = $event['user_id'];
            $eventparam['user']['name'] = $event['name'];
            $eventparam['user']['surname'] = $event['surname'];
            $eventparam['user']['login'] = $event['login'];
            $eventparam['user']['adj'] = $adjective;
            $eventparam['user']['deleted'] = $event['deleted'];

            if(array_key_exists('commenter_id', $event))
                $eventparam['user']['commenter_id'] = $event['commenter_id'];
        }
        
        $eventparam['timelineid'] = $event['id'];
        $eventparam['sitename'] = $this->Conf->get('Site.name');

        return h2o($event['temp'], array('autoescape' => false))->render($eventparam);
    }


    /*
     * Delete timeline event
     */
    function deleteevent($e_id = -1){
        
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';

        $user_id = $this->Session->read('id');

        $filter = array('Timeline.id'=>$e_id);
        $timeline = $this->Timeline->find($filter,array('Timeline.user_id'),null,null);

        if(isset($timeline['Timeline']['user_id']) && ($timeline['Timeline']['user_id'] == $user_id)){
            $this->Timeline->delete($e_id);
            $response['success'] = true;
        }
        else {
            $response['success'] = false;
        }
    
        $this->set('json', $response);

        # clear cache
        clearCache($this->cacheName, '', '');
    }           


    /*
     * Undelete timeline event
     */
    function undodeleteevent($e_id){

        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';

        $user_id = $this->Session->read('id');

        $filter = array('Timeline.id'=>$e_id);

        $this->Timeline->enableSoftDeletable('find', false);
        $timeline = $this->Timeline->find($filter,array('Timeline.user_id'),null,null);
        $this->Timeline->enableSoftDeletable('find', true);

        if(isset($timeline['Timeline']['user_id']) && ($timeline['Timeline']['user_id'] == $user_id)){
            $this->Timeline->undelete($e_id);
            $response['success'] = true;
        }
        else {
            $response['success'] = false;
        }
    
        $this->set('json', $response);

        # clear cache
        clearCache($this->cacheName, '', '');
    }   


    function addcomment(){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';

        $user_id = $this->Session->read('id');

        $event = $this->Template->Timeline->find('first', array(
                'conditions' => array(
                    'Timeline.id' => $this->params['form']['foreign_id'],
                ),
                'fields' => array(
                    'Timeline.param', 'Template.name'
                ),
                'recursive' => 0
        ));

        $tpl_params = $event['Timeline']['param'];
        $comment_type_name = $event['Template']['name'];

        $this->Comment->addComment($this->Timeline, $this->params, $user_id, $tpl_params, $comment_type_name);

        $this->set('json', array(
            'success' => TRUE
        ));

        # clear cache
        clearCache($this->cacheName, '', '');
    }

    
    function getcomments($id){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';

        $comments = Set::extract(
            $this->Comment->getComments($this->Timeline, $id),
            '{n}.Comment'
        );
        
        $this->set('json', array(
            'success' => TRUE,
            'comments' => $comments)
        );
    }

}
?>
