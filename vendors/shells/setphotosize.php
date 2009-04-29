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
class SetPhotoSizeShell extends Shell {
    var $uses = array('Photo');
    
    function main() {
       
        $photo_dir = '/www/desktop/html/images_desktop/';
        
        $filter = array('width'=>NULL,'height'=>NULL);

        $photos = $this->Photo->find('all', array( 'conditions' => $filter, 'fields' => array('id', 'filename'), 'order' => null, 'recursive' => -1, 'group' => null));

        $total = 0;

        foreach($photos as $photo) {

            if($photo['Photo']['filename']){

                $photofile = $photo_dir.$photo['Photo']['filename'];

                list($width, $height) = getimagesize($photofile);
                
                $data['width'] = $width;
                $data['height'] = $height;
                $data['deleted_date'] = null;
                $data['id'] = $photo['Photo']['id'];

                $this->Photo->query('UPDATE photos SET width = '.$width.', height = '.$height.', deleted_date = null WHERE id = '.$photo['Photo']['id']);
                //$this->Photo->save($data, false, array('width','height'));

                $total += 1;
            }
            
        }
  
        $this->hr();
        //Print out total
        $this->out("Total: " . $total . "\n"); 
    }
}
?>
