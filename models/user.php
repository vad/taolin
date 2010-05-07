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
class User extends AppModel
{
    var $name = 'User';
    var $actsAs = array('SoftDeletable'); 
    var $hasMany = array('Photo','Board','Timeline', 'UsersWidget');
    var $hasOne = array('Workplace');
    var $belongsTo = 'Background';
    var $hasAndBelongsToMany = array('Group');

    var $validate = array(
        'login'  => VALID_NOT_EMPTY,
        'email' => 'email',
        'mod_email' => 'email',
        'personal_page' => 'url',
        'mod_personal_page' => 'url',
    );

    function search_matching($s, $start, $limit){
        $tables = array('users' =>
            array('id', 'name', 'surname', 'login', 'active')
        );

        $ds = ConnectionManager::getDataSource('default');
        $all_fields = array();
        foreach($tables AS $table => $fields){
            $dbo_fields = $ds->fields($this, $table, $fields);
            $sql_fields = implode(', ', $dbo_fields);

            $all_fields[] = $sql_fields;
        }
            
        $s_all_fields = implode(', ', $all_fields);
        $ret['users'] = $this->query("SELECT $s_all_fields FROM users WHERE deleted = 0 AND tsv @@ plainto_tsquery('english', '$s') LIMIT $limit OFFSET $start");
        $ret['count'] = $this->query("SELECT COUNT(*) FROM users WHERE deleted = 0 AND tsv @@ plainto_tsquery('english', '$s')");

        return ($ret);
    }

    
    //get email address of the user with id = $u_id
    //if the address is null, create it from login@$domain
    function getemail($u_id, $domain){
        $user = $this->find('first', array(
            'conditions' => array(
                'User.id' => $u_id
            ), 
            'fields' => array(
                'User.login',
                'COALESCE(mod_email, email) AS "User__email"'
            )
        ));

        if ($user['User']['email']){
            $sender = $user['User']['email'];
        } else {
            $addtomail = '@'.$domain;
            $sender = $user['User']['login'].$addtomail;
        }
        
        return $sender;
    }

    function getuniqueidentifierstring($u_id){
        $query = "SELECT unique_identifier_string FROM identities WHERE user_id = $u_id";
        
        $res = $this->query($query);
        $author_id = $res[0][0]['unique_identifier_string'];
 
        return $author_id;
    }
}

?>
