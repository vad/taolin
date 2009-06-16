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

uses('sanitize');

class WorkplacesController extends AppController {
    //var $name = 'Workplaces';
    //var $helpers = array('Html','Form','Javascript');

    function beforeFilter()
    {
        parent::beforeFilter();

        $this->checkSession();
        $this->mrClean = new Sanitize();
    }


    function save() {
		Configure::write('debug', '0');
		$this->layout = 'ajax';

        $form = $this->params['form'];
        $uid = $this->Session->read('id');
        
        $data = array();

        $prev = $this->Workplace->find('first', array(
            'conditions' => array('Workplace.user_id' => $uid),
            'recursive' => 1,
            'fields' => array('Workplace.id')
        ));
        
        if ($prev){ // user already present?
            $data['id'] = $prev['Workplace']['id'];
        }

        $data['building_id'] = $form['building'];
        $data['user_id'] = $uid;
        $data['x'] = $form['x'];
        $data['y'] = $form['y'];
                
        $this->addtotimeline(array('building' => $data['building_id'],'coordx' => $data['x'],'coordy' => $data['y']));

        $this->Workplace->save($data);

        $this->set('json', '');
    }
    
    
    /***************************************************************
     * START Maps widget
    ***************************************************************/
    function image_overlap($background, $forground,$x,$y,$percent) {
        $width = imagesx($forground) * $percent;
        $height = imagesy($forground) * $percent;
        
        // Create a new image with the resize dimensions
        $resize_forground = imagecreatetruecolor($width, $height);
        
        // Copy the original image into the new resized image
        imagecopyresized($resize_forground,$forground,0,0,0,0,$width,$height,imagesx($forground),imagesy($forground));
        imagecolortransparent($resize_forground,imagecolorat($resize_forground,0,0));
        imagecopymerge($background,$resize_forground,$x-($width/2),$y-($height/2),0,0,$width,$height,100);
        return $background;
    }

    function getinbuilding(){
        Configure::write('debug', '0');
        $this->layout = 'ajax';

        $f = $this->params['form'];
        if (!isset($f['buildingId']))
            die('Missing buildingId parameter');
        $building = $f['buildingId'];

        $out = array();
        $res = $this->Workplace->Building->find('all', array(
                'conditions' => array('Building.id' => $building),
                'recursive' => 0
            )
        );
        $out['buildingInfo'] = $res[0]['Building'];

        $res = $this->Workplace->find('all', array(
                'conditions' => array('building_id' => $building)
                ,'fields' => array('Workplace.x', 'Workplace.y',
                    'Workplace.user_id', 'User.name', 'User.surname', 'User.gender', 'User.phone'
                )
            )
        );

        $workplaces = array();
        foreach($res as $wp){
            $workplaces[] = array_merge($wp['Workplace'], $wp['User']);
        }

        $out['workplaces'] = $workplaces;

        $img = imagecreatefrompng("../".$out['buildingInfo']['imagepath']);
        $out['buildingInfo']['width'] = imagesx($img);
        $out['buildingInfo']['height'] = imagesy($img);
        imagedestroy($img);

        //TODO: is this good?
        $this->Session->write('buildingWP', $out);

        if (isset($f['userId']))
            $this->Session->write('buildingUserId', $f['userId']);

        $this->set('json', $out);
    }


    function getmap() {
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        //TODO: make this works
        //TODO: resize the bullet once
        //$this->layout = 'image';
        //header("Pragma: no-cache");
        //header("Cache-Control: no-store, no-cache, max-age=0, must-revalidate");
        $this->layout = 'ajax';
        header('Content-Type: image/png');
        $percent = 1.;

        $buildingWP = $this->Session->read('buildingWP');
        
        $workplaces = $buildingWP['workplaces'];

        $buildingInfo = $buildingWP['buildingInfo'];
        $width = $buildingInfo['right'] - $buildingInfo['left'];
        $height = $buildingInfo['bottom'] - $buildingInfo['top'];

        $fn = "../".$buildingInfo['imagepath'];
        $background = imagecreatefrompng($fn);
        
        if (!imageistruecolor($background)) {
            $imgtc = imagecreatetruecolor(
                $buildingInfo['width'],
                $buildingInfo['height']
            );
            
            imagecopymerge($imgtc, $background, 0, 0, 0, 0, $buildingInfo['width'], $buildingInfo['height'], 100);
            $background = $imgtc;
        }

        foreach($workplaces as $wp) {

            $x = $wp['x'] * $width + $buildingInfo['left'];
            $y = $wp['y'] * $height + $buildingInfo['top'];

            // switch user icon chose on user's gender

            switch($wp['gender']){
                case 1: 
                    $user_image = "../webroot/js/portal/shared/icons/fam/user.png";
                    break;
                case 2:
                    $user_image = "../webroot/js/portal/shared/icons/fam/user_female.png";
                    break;
                default:
                    $user_image = "../webroot/js/portal/shared/icons/fam/user_gray.png";
                    break;
            }
           
            //echo $this->Session->read('buildingUserId').' '.$wp['user_id'];
            if ($this->Session->check('buildingUserId') && ($this->Session->read('buildingUserId') == $wp['user_id'])) {
                $user_image = "../webroot/js/portal/shared/icons/fam/user_green.png";
                $percent = 2.;
            } else {
                $percent = 1.;
            }
            $foreground = imagecreatefrompng($user_image);

            $background = $this->image_overlap($background, $foreground,$x,
                $y,$percent);
        }
        imagepng($background);
        //imagejpeg($foreground);
        imagedestroy($background);
        imagedestroy($foreground);
    }
    
    /***************************************************************
     * END Maps widget
     ***************************************************************/
}

?>
