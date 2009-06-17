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

class FeedbacksController extends AppController {
    var $name = 'Feedbacks';
    var $helpers = array('Html','Form','Javascript');


    function beforeFilter()
    {
        parent::beforeFilter();

        $this->checkSession();
        $this->san = new Sanitize();
    }


    function add() {
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';
        
        if (!empty($this->params['form']['text'])){
            // a quanto pare qui l'escape viene fatto automaticamente dalla $this->save()
            $data['text'] = $this->params['form']['text'];
            $data['user_id'] = $this->Session->read('id');
            $this->Feedback->save($data);
            $response['success'] = true;
            $this->addtotimeline();
            
        } else {
            $response['success'] = false;
            $response['errors']['text'] = 'Write a message, please';
        }
        $this->set('json', $response);
    }

    function getuserfeedbacks($n=5){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';
        $this->recursive = -1;

        $u_id = $this->Session->read('id');

        $feedbacks = $this->Feedback->find('all', array('conditions' => array('user_id' => $u_id), 'fields' => array('text', 'created'),'limit' => $n, 'order' => 'Feedback.created DESC'));

        foreach($feedbacks as $feedback){
            $response['feedbacks'][] = $feedback['Feedback'];
        }

        $response['success'] = true;
        
        $this->set('json', $response);

    }

}
?>
