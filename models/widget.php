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
class Widget extends AppModel
{
    var $name = 'Widget';
    var $hasMany = 'UsersWidget';
                                    
    function is_user_already_present($u_id){
        
        $ret = $this->query('SELECT COUNT(*) AS count FROM users_widgets WHERE user_id = '.$u_id);
            
        if ($ret[0][0]['count'] == '0') {
            $this->query('INSERT INTO users_widgets (widget_id,col,pos,tab,user_id) SELECT widget_id,col,pos,tab,'.$u_id.' FROM widgets_skel');
        }
    }
}

?>
