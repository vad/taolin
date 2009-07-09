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
class PhotoThumberShell extends Shell {
    var $uses = array('Photo');
    
    function main() {

        $total = 0;

        App::import('Component','Conf');
        $this->Conf =& new ConfComponent(null);
        $this->Conf->startup($this->Controller);

        // Importing components to be used
        App::import('Component','Thumber');
        $this->Thumber = new ThumberComponent(null);
        
        App::import('Component','PhotoUtil');
        $this->Thumber->PhotoUtil = new PhotoUtilComponent(null);
        
        $dest_dir = $this->Conf->get('Images.people_fs_path');

        //Get widget screenshots
        $photos = $this->Photo->find('all',array( 
                    'fields'=>array(
                        'id','filename'
                    ),
                    'recursive'=> -1)
                );

        foreach($photos as $photo) {
            if($this->Thumber->createthumb($photo['Photo']['filename'], $dest_dir, true))
               $total += 1;
        }

        //Print out total
        if($total > 0)
            $this->out("Created $total thumb");
    }
}
?>

