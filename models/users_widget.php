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
class UsersWidget extends AppModel
{
    var $name = 'UsersWidget';
    var $belongsTo = array('User','Widget');
    var $actsAs = array('SoftDeletable'); 
    
    function getwidgetsposition($u_id, $uw_id=''){
        $conditions = array();
        if ($uw_id)
            $conditions['UsersWidget.id'] = $uw_id;
            
        $conditions['UsersWidget.user_id'] = $u_id;

        $ret = $this->find('all', array(
            'fields' => array(
                'UsersWidget.id', 'UsersWidget.widget_id', 'UsersWidget.col',
                'UsersWidget.pos', 'UsersWidget.tab', 'UsersWidget.application_conf',
                'UsersWidget.widget_conf', 'Widget.string_identifier',
                'Widget.name', 'Widget.user_params', 'Widget.application_conf',
                'Widget.widget_conf'
            ),
            'conditions' => $conditions,
            'order' => array('col', 'pos'),
            'recursive' => 1
        ));
        return $ret;
    }
    
    function movewidgets($w_id, $u_id, $col, $pos){
        $own = $this->find('count', array(
            'conditions' => array('UsersWidget.id' => $w_id, 'user_id' => $u_id),
            'recursive' => 0
        ));

        if ($own) { // this user owns this UsersWidget
            $this->id = $w_id;
            $a['col'] = $col;
            $a['pos'] = $pos;
            $this->save($a);
        }
    }
}

?>
