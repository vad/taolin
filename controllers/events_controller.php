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

class EventsController extends AppController {
    var $name = 'Events';

    
    function getcomments(){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';

        $e_id = $this->params['form']['foreign_id'];

        $filter = array('Event.id' => $e_id);
        $event = $this->Event->find('first', array(
            'conditions' => $filter,
            'recursive' => FALSE
        ));
        $this->Event->create($event);

        $comments = $this->Event->getComments(array(
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

        $this->Event->createComment($e_id, $comment);

        $this->set('json', array(
            'success' => TRUE
        ));
    }

    
    
}
?>
