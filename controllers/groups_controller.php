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

class GroupsController extends AppController {

    var $name = 'Groups';
    var $uses = array('Group','User');
    
    var $helpers = array('Html','Javascript');
    
    function beforeFilter()
    {
        parent::beforeFilter();

        $this->checkSession();
    }

    /* This function obtains detils
     *  
     * $g_id = group's id
    */

    function getgroupdetails($g_id=-1) {
        
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';
    
        if($g_id != -1){
            $resgroup = $this->Group->find('id = '.$g_id, array('id', 'name', 'description_en', 'description_it', 'url'));

            $this->User->bindModel(array('hasOne' => array('GroupsUser')));
            $this->User->bindModel(array('hasMany' => array('Photo' => array('conditions'=>array('Photo.default_photo'=>1), 'fields'=>array('Photo.filename', 'Photo.is_hidden')))));
            $resusers = $this->User->find('all', array(
                                'fields' => array('User.id', 'User.name', 'User.surname', 'User.login'),
                                        'conditions'=> array('GroupsUser.group_id'=>$g_id),
                                        'order' => array('User.surname','User.name')
                        ), null, 1);
    
            $response['group'][] = $resgroup['Group'];

            foreach($resusers as $key => $user){
                foreach($user as $key2 => $userdet){
                    if($key2 == 'Photo') {
                        $user['User']['filename'] = $userdet['0']['filename'];
                        $user['User']['is_hidden'] = $userdet['0']['is_hidden'];
                    }
                    else if($key2 == 'Group') {
                        foreach($userdet as $key3 => $usergroup) {
                            $tmpgroup = $this->Group->find('id = '.$usergroup['id'], array('id', 'name', 'description_en', 'description_it', 'url'));
                            $user['User']['groups'][] = $tmpgroup['Group'];
                        }
                    }
                }
                $response['users'][] = $user['User'];   
            }
       
            $response['success'] = true;

        }
        else $response['success'] = false;

        $this->set('json', $response);

    }

}

?>
