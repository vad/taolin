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
class DemoAclInitShell extends Shell {
    
    function main() {
        
        // Importing components to be used
           
        App::import('Component','Acl');
        $this->Acl =& new AclComponent(null);
        $controller = null;
        $this->Acl->startup($controller);

        $acos = array(
            0 => array(
                'alias' => 'admin'
            ),
            1 => array(
                'alias' => 'site',
                'parent_id' => 1
            )
        );

        $aros = array(
            0 => array(
                'alias' => 'users'
            ),
            1 => array(
                'parent_id' => 1,
                'alias' => 'admins'
            ),
            2 => array(
                'alias' => 'admin',
                'parent_id' => 2,
                'model' => 'User',
                'foreign_key' => 901,
            ),
            3 => array(
                'alias' => 'aristotele',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 903,
            ),
            4 => array(
                'alias' => 'socrate',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 905,
            ),
            5 => array(
                'alias' => 'cicerone',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 906,
            ),
            6 => array(
                'alias' => 'lucrezio',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 907,
            ),
            7 => array(
                'alias' => 'seneca',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 908,
            ),
            8 => array(
                'alias' => 'platone',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 909,
            ),
            9 => array(
                'alias' => 'sallustio',
                'parent_id' => 1,
                'model' => 'User',
                'foreign_key' => 910,
            ),
        );

        foreach ($acos as $aco){
            // Create a new aco
            $this->Acl->Aco->create();
            // Save data
            $this->Acl->Aco->save($aco);
        }

        foreach ($aros as $aro){
            // Create a new aro
            $this->Acl->Aro->create();
            // Save data
            $this->Acl->Aro->save($aro);
        }

        $this->Acl->allow('admins', 'admin');
        $this->Acl->allow('users', 'site');
        
    }
}

?>

