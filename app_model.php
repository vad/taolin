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

class AppModel extends Model
{
    function addtotimeline($param, $date_now = null, $type_name, $uid = null, $model_alias = null, $f_key = null, $comment_id = null, $comment_type_name = null){

        // If $date_now is not defined, save this event with current datetime
        if($date_now == null) 
            $date_now = date('Y-m-d H:i:s');

        //Importing TimelinesController
        App::import('Controller','Timelines');
        $controller = new TimelinesController;
        $controller->constructClasses();
        // Invoking addtimeline() method in TimelinesController
        $controller->add($param, $date_now, $type_name, $uid, $model_alias, $f_key, $comment_id, $comment_type_name);

    }

    function filterinvisibles($ids = null){

        if(empty($ids))
            $ids = array($this->id);
        else{
            if(!is_array($ids))
                $ids = array($ids);
        }

        $q = $this->find('all', array(
                'conditions' => array(
                    'id' => $ids,
                    'deleted' => 1
                ),
                'fields' => array(
                    'id', 'deleted'
                ),
                'recursive' => -1
            )
        );

        return Set::extract($q, "{n}.$this->name.id");
    }
}
?>
