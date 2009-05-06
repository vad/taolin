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

class WebcamsController extends AppController {
    var $name = 'Webcams';
    var $helpers = array('Html','Form','Javascript');
    var $uses = null;
    
    function beforeFilter()
    {
        parent::beforeFilter();

        $this->checkSession();
        $this->san = new Sanitize();
    }


    function getseconds($hours) {
        $time = explode(':', $hours);
        $secs = (intval($time[0])*3600) + (intval($time[1])*60);
        return $secs;
    }


    function gettime(){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';
        define('TOTALSECS',86400);
        define('FIRSTSHOTSCRIPT','11:55');
        define('LASTSHOTSCRIPT','14:03');
        define('SERVICEMESSAGE','Service available from 12 to 14 on working days');
        $totalshots=256;
        $intervalshots = 30;
        
        $sec4firstshot = 0; 
        
        $first = $this->getseconds(FIRSTSHOTSCRIPT);
        $last = $this->getseconds(LASTSHOTSCRIPT);
        $today = getdate();
        $duration = $totalshots * $intervalshots;
        
        $elapsedsecs = (($today['hours']*60)*60)+($today['minutes']*60)+($today['seconds']);
        
        if ($elapsedsecs <= $first) {
            $sec4firstshot = ($first - $elapsedsecs);
        }

        if (($elapsedsecs > $first) && ($elapsedsecs <= $last)) {
            $sec4firstshot = 0;
            $duration = $last - $elapsedsecs;
        }

        if ($elapsedsecs > $last) {
            $sec4firstshot = TOTALSECS - $elapsedsecs + $first;
        }
        
        $info['sec4firstshot'] = $sec4firstshot;
        $info['duration'] = $duration;
        $info['interval'] = $intervalshots;
        $info['servicemessage'] = SERVICEMESSAGE;
        $response['webcam'] = $info;
        $this->set('json', $response);
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
