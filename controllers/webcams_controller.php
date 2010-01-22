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

class WebcamsController extends AppController {
    var $name = 'Webcams';
    var $helpers = array('Html','Form','Javascript');
    var $uses = null;
    
    function beforeFilter()
    {
        parent::beforeFilter();

        $this->checkSession();
    }


    function diff($d1, $d2) {
        return (intval($d1->format('U')) - intval($d2->format('U')));
    }


    function gettime(){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';
        $sStart = '11:55';
        $sEnd   = '14:03';
        $message = 'Service available from 12 to 14 on working days';
        $interval = 30;
        
        $sec4firstshot = 0;

        $start = date_create("today $sStart");
        $end = date_create("today $sEnd");
        $now = date_create("now");

        $softEnd = clone $end;
        $softEnd->modify("-1 minute");
        $duration = $this->diff($end, $start);

        if ($now > $softEnd) {
            $start = date_create("tomorrow $sStart");
            $end = date_create("tomorrow $sEnd");
            $sec4firstshot = $this->diff($start, $now);
        } else if ($now > $start) {
            $start = $now;
            $sec4firstshot = 0;
            $duration = $this->diff($end, $now);
        } else {
            $sec4firstshot = $this->diff($start, $now);
        }
        
        $info['sec4firstshot'] = $sec4firstshot;
        $info['duration'] = $duration;
        $info['interval'] = $interval;
        $info['servicemessage'] = $message;
        $this->set('json', $info);
    }


    function getsnapshot() {
        Configure::write('debug', '0');
        $this->layout = 'ajax';
        header('Content-Type: image/jpeg');
        
        $webcamfolder = $this->Conf->get('Images.webcam_fs_path');
        define('SNAPSHOT', $webcamfolder.'noise_cantinery.jpg');
        readfile(SNAPSHOT);
    }

}
?>
