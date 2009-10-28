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

class TimelinesController extends AppController {
    var $name = 'Timelines';
    var $helpers = array('Html','Form','Javascript');
    var $uses = array('Photo','ReadableTimeline','Template','Timeline');

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
     * @f_key: foreign key to the aforementioned database table
     */
    function add($param, $date, $type_name, $uid, $model_alias, $f_key){
        
        // Encoding parameters into json
        if(!empty($param) && ($param != null))
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

        if($uid)
            $data['user_id'] = $uid;
        else
            $data['user_id'] = $this->Session->read('id');

        $data['param'] = $param;
        $data['date'] = $date;
        $data['template_id'] = $tltype;
        $data['model_alias'] = $model_alias;
        $data['foreign_key'] = $f_key;

        $this->Timeline->save($data);
    }

   
    /* 
     * gettimeline function retrieves events out of readable_timelines table
     */
    function gettimeline(){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';
        $this->recursive = 0;

        $u_id = $this->params['form']['u_id'];
        $limit = $this->params['form']['limit'];
        $start = $this->params['form']['start'];

        if (!$limit)
            $limit = 20;

        if (!$start)
            $start = 0;

        $checked_users = array();
        
        if($u_id != null){
            $conditions = array('user_id' => $u_id, 'date <= \''.date('Y-m-d H:i:s').'\'');
        }
        else
            $conditions = 'date <= \''.date('Y-m-d H:i:s').'\'';

        $readabletimeline = $this->ReadableTimeline->find('all', 
            array('conditions' => $conditions,
                'fields' => array('id','user_id','name','surname','login','gender','param','date','temp','icon', 'model_alias', 'foreign_id', 'comments_count'),
                'limit' => $limit, 'recursive' => 0, 'page' => $start/$limit + 1
            )
        );

        $events = Set::extract($readabletimeline, '{n}.ReadableTimeline');

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

        foreach($events as $event){
            $event['user_photo'] = $hash_photos[$event['user_id']];
            $event['event'] = $this->prepareevent($event);
            
            if (empty($event['model_alias'])) {
                $event['model_alias'] = 'Timeline';
                $event['foreign_id'] = $event['id'];
            }

            unset($event['param'], $event['temp']); // no need to send this parameter, hence unset it
            $result[] = $event;
        }

        if(isset($result))
            $response['timeline'] = $result;
        else
            $response['timeline'] = array();
        
        $response['total'] = $this->ReadableTimeline->find('count', array('conditions' => $conditions));
        $response['success'] = true;
        
        $this->set('json', $response);
    }


    /* 
     * Format timeline event applying parameters to template
     */
    function prepareevent($event){

        $template = $event['temp'];
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

            $eventparam['userid'] = $event['user_id'];
            $eventparam['username'] = $event['name'];
            $eventparam['usersurname'] = $event['surname'];
            $eventparam['userlogin'] = $event['login'];
            $eventparam['useradj'] = $adjective;
        }

        foreach($eventparam as $key => $param){
            // Replace each parameter within the template
            $template = str_replace('_'.strtoupper($key).'_', $param, $template);
        }
        $template = str_replace('_TIMELINEID_', $event['id'], $template);
        $template = str_replace('_SITENAME_', $this->Conf->get('Site.name'), $template);

        return $template;
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
    }   


    function addcomment(){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';

        $user_id = $this->Session->read('id');
        
        $e_id = $this->params['form']['foreign_id'];
        $text = $this->params['form']['comment'];

        $comment = array('Comment' => array(
            'body' => $text,
            'name' => $user_id,
            'email' => 'abc@example.com'
        ));

        $this->Timeline->createComment($e_id, $comment);

        $this->set('json', array(
            'success' => TRUE
        ));
    }

    
    function getcomments(){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';

        $e_id = $this->params['form']['foreign_id'];

        $filter = array('Timeline.id' => $e_id);
        $event = $this->Timeline->find('first', array(
            'conditions' => $filter,
            'recursive' => FALSE
        ));
        $this->Timeline->create($event);

        $comments = $this->Timeline->getComments(array(
            'options' => array(
                'conditions' => array(
                    'Comment.status' => 'pending'
                )
            )
        ));
        $comments = Set::extract($comments, '{n}.Comment');
        
        $this->set('json', array(
            'success' => TRUE,
            'comments' => $comments)
        );
    }

}
?>
