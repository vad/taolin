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
    var $components = array('Acl', 'Conf');

    function addComment(&$Model, $params, $user_id, $tpl_params = array(), $comment_type_name = null, $model_alias = null){
        $mrClean = new Sanitize();
        $notification_data = a();
        
        $foreign_id = $params['form']['foreign_id'];
        $text = $mrClean->html($params['form']['comment']);

        $comment = array('Comment' => array(
            'body' => $text,
            'name' => $user_id,
            'email' => 'abc@example.com'
        ));

        $out = $Model->createComment($foreign_id, $comment);
        $comment_id = $Model->Comment->id;

        if(!$model_alias)
            $model_alias = $Model->alias;
        
        // Retrieve ids belonging to users that have be notified (eg each users that commented this object before)
        $comments = Set::extract(
            $this->getComments($Model, $foreign_id, TRUE),
            '{n}.Comment.name'
        );

        // Remove duplicated values
        $tbn = array_unique($comments);
      
        // Retrieve owner of the commented object
        $owner = $Model->read('user_id', $foreign_id);
        $owner_id =$owner[$model_alias]['user_id'];

        // owner should be notified as well
        if(!in_array($owner_id, $tbn))
            array_push($tbn, $owner_id);

        $users = array_diff($tbn, array($user_id));

        if( !empty($users) ){
            
            $this->setupUserModel();
            $commenter = $this->user->read(array('name', 'surname'), $user_id);
            $owner = $this->user->read(array('name', 'surname'), $owner_id);
            $subject = $this->Conf->get('Site.name')." comment notification";
            $domain = $this->Conf->get('Organization.domain');

            foreach($users as $c_id){

                // check whether the user is can be notified or not
                $active = $this->Acl->check(
                    array('model' => 'User', 'foreign_key' => $c_id),
                    'site'
                );
                $nfb = $this->user->read('notification', $c_id);
                if($active && $nfb['User']['notification']){

                    if($c_id == $owner_id)
                        $is_owner = true;
                    else 
                        $is_owner = false;
                    
                   
                    array_push($notification_data, array(
                            'from' => 'noreply@'.$domain,
                            'to' => $this->user->getemail($c_id, $this->Conf->get('Organization.domain')),
                            'subject' => $subject,
                            'own' => $is_owner,
                            'owner' => $owner['User'],
                            'commenter' => $commenter['User']
                        )
                    );
                }
            }
        }

        $Model->addtotimeline($tpl_params, null, 'comment', $user_id, $model_alias, $foreign_id, $comment_id, $comment_type_name);
        
        # clear cache
        clearCache($this->cacheName, '', '');

        return $notification_data;
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
            $this->user->recursive = -1;
        }
    }



    // Retrieve comments for a single data with id = $foreign_id
    // TODO: move this into the behaviour!
    // $dirty=TRUE means that this functions must not do postprocessing
    function getComments(&$Model, $foreign_id, $dirty=FALSE){
        $filter = array($Model->alias.'.id' => $foreign_id);
        pr($filter);
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
            $user = $this->User->find('first', array(
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
