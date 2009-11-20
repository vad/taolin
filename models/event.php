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
class Event extends AppModel
{
    var $name = 'Event';
    var $belongsTo = 'Calendar';
    var $actsAs = array('SoftDeletable', 'Commentable.Commentable');

    function afterSave($created){
        
        if($created) // if the event is created, NOT merely updated!
            $this->addtotimeline(
                    array(
                        'summary' => $this->data['Event']['summary'],
                        'url' => $this->data['Event']['uid'],
                        'start_time' => $this->data['Event']['start_time'],
                        'end_time' => $this->data['Event']['end_time']
                    ),
                    null, 'timelineevent-newevent', null, 'Event', $this->id);
        

        parent::afterSave($created);
    }

}
?>
