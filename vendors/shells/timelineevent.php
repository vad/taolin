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
<?
class TimelineEventShell extends Shell {
    var $uses = array('Timeline','User');
    
    function main() {
        
        $birthFilter = array('COALESCE(User.mod_date_of_birth, User.date_of_birth)::text LIKE \'%'.date('m-d').'\' AND User.deleted = 0');
        $newusersFilter = array('User.created::text LIKE \''.date('Y-m-d').'%\' AND User.deleted = 0');

        $birthdays = $this->User->find('all', array( 'conditions' => $birthFilter, 'fields' => array('User.id', 'User.login'), 'order' => null, 'recursive' => 0));
        $newusers = $this->User->find('all', array( 'conditions' => $newusersFilter, 'fields' => array('User.id', 'User.login'), 'order' => null, 'recursive' => 0));

        $counter = 0;
        
        foreach($newusers as $newuser){
            $data[$counter]['user_id'] = $newuser['User']['id'];
            $data[$counter]['login'] = $newuser['User']['login'];
            $data[$counter]['template_id'] = 10;
            $data[$counter]['date'] = date('Y-m-d').' 08:00:00';
            $counter++;
        }

        foreach($birthdays as $birthday){
            $data[$counter]['user_id'] = $birthday['User']['id'];
            $data[$counter]['login'] = $birthday['User']['login'];
            $data[$counter]['template_id'] = 9;
            $data[$counter]['date'] = date('Y-m-d').' 08:30:00';
            $counter++;
        }
        
        if($counter > 0)
            $this->Timeline->saveAll($data);
    }
}
?>
