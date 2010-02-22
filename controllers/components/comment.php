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

class CommentComponent extends Object {
    var $user = null;
    var $cacheName = TIMELINE_CACHE_FILENAME;

    function addComment(&$Model, $params, $user_id, $tpl_params = array(), $comment_type_name = null, $model_alias = null){
        $mrClean = new Sanitize();
        
        $foreign_id = $params['form']['foreign_id'];
        $text = $mrClean->html($params['form']['comment']);

        $comment = array('Comment' => array(
            'body' => $text,
            'name' => $user_id,
            'email' => 'abc@example.com'
        ));

        pr($Model);

        $out = $Model->createComment($foreign_id, $comment);
        $comment_id = $Model->Comment->id;

        if(!$model_alias)
            $model_alias = $Model->alias;

        $Model->addtotimeline($tpl_params, null, 'comment', $user_id, $model_alias, $foreign_id, $comment_id, $comment_type_name);
        
        # clear cache
        clearCache($this->cacheName, '', '');
    }

    function delComment(&$Model, $c_id, $u_id){
       
        $owner = $Model->Comment->read('name', $c_id);

        if($u_id == $owner['Comment']['name']){
            
            # clear cache
            clearCache($this->cacheName, '', '');

            return $Model->deleteComment($c_id);
        }
        else {
            return false;
        }
    }
    
    function setupUserModel() {
        if ($this->user == null) {
            App::import('Model', 'User');

            $this->user = & new User();
        }
    }



    // Retrieve comments for a single data with id = $foreign_id
    // TODO: move this into the behaviour!
    // $dirty=TRUE means that this functions must not do postprocessing
    function getComments(&$Model, $foreign_id, $dirty=FALSE){
        $filter = array($Model->alias.'.id' => $foreign_id);
        $target = $Model->find('first', array(
            'conditions' => $filter,
            'recursive' => -1
        ));
        // if the target doesn't exist, returns an empty array
        if (!$target) return array();

        $Model->create($target);

        $comments = $Model->getComments(array(
            'options' => array(
                'conditions' => array(
                    'Comment.status' => 'pending'
                ),
                'recursive' => -1
            )
        ));

        if ($dirty) return $comments;

        $this->setupUserModel();

        foreach ($comments as &$comment) {
            $conditions = array('id' => $comment['Comment']['name']);
            $user = $this->user->find('first', array(
                'conditions' => $conditions,
                'fields' => array('User.login', 'User.name', 'User.surname'),
                'recursive' => -1
            ));

            $comment['Comment']['user_login'] = $user['User']['login'];
            $comment['Comment']['user_name'] = $user['User']['name'];
            $comment['Comment']['user_surname'] = $user['User']['surname'];
            $comment['Comment']['user_id'] = $comment['Comment']['name'];
            unset($comment['Comment']['name']);

        }

        return $comments;
    }


    function getCommentCount(&$Model, $foreign_id) {
        $comments = $this->getComments($Model, $foreign_id, TRUE);

        if(!(empty($comments)))
            return count($comments);
        else
            return 0;
    }

}
?>
