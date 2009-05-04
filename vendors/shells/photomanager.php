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
class PhotoManagerShell extends Shell {
    var $uses = array('Photo');
    
    function main() {

        // Importing components to be used
           
        App::import('Component','PhotoUtil');
        $this->PhotoUtil = new PhotoUtilComponent(null); 

        App::import('Component','Thumber');
        $this->Thumber = new ThumberComponent(null);
        
        App::import('Component','Email');
        $this->Email = new EmailComponent(null);
        
        App::import('Component','PhotoUtil');
        $this->Thumber->PhotoUtil = new PhotoUtilComponent(null);
       
        $app_url = Configure:read('App.url');

        $dest_dir = Configure::read('App.imagefolder.fs_path');

        //Get photos added in the last day
        $today = date('Y-m-d H:i:s');
        $day_ago = date('Y-m-d H:i:s', strtotime('-1 day'));
        $photos = $this->Photo->find('all', array(
                    'conditions'=>array(
                        'created >= \''.$day_ago.'\''
                    ), 
                    'fields'=>array(
                        'created','id','filename','name','photo','user_id'

                    ),
                    'recursive'=> -1,
                    'order' => 'created')
                );

        $result = "### Uploaded and created photo daily report.\n### Upload and creation from $day_ago to $today\n\n";

        $uploaded = 0;
        $newphoto = 0;
        $total = 0;

        foreach($photos as $photo) {

            // if filename esists and it is sets, report the uploaded photo
            if($photo['Photo']['filename']){
                $result .= "New uploaded picture on: ".$photo['Photo']['created']."\n";
                $result .= "Name: ".$photo['Photo']['name'].", belonging to user with id: ".$photo['Photo']['user_id']."\n";
                $result .= "URL: ".$app_url."img/fbk/people/".$photo['Photo']['filename']."\n\n";
                $uploaded += 1;
            }
            // otherwise, create the new photo!
            else{

                while(1){
                    $filename = $this->PhotoUtil->generaterandomfilename().'.jpg';
                    $dest_file = $dest_dir.$filename;
                    if(!file_exists($dest_file)) break;
                }

                $img_file = new File($dest_file, true);
                $img_file->write($photo['Photo']['photo']);
                $img_file->close();

                if(file_exists($dest_file)){

                    if($this->Thumber->createthumb($filename, null, true)){

                        $result .= "Created a new picture for user with id: ".$photo['Photo']['user_id']."\n";
                        $result .= "URL: ".$app_url."img/fbk/people/".$filename."\n\n";

                        $data['id'] = $photo['Photo']['id'];
                        $data['user_id'] = $photo['Photo']['user_id'];
                        $data['filename'] = $filename;
                        list($data['width'], $data['height']) = getimagesize($dest_file);

                        $this->Photo->save($data);
                        
                        $newphoto += 1;
                    }
                    else
                        $result .= "ERROR: CAN NOT THUMB THE DESIRED IMAGE (photo id: ".$photo['Photo']['id'].")\n\n";
                }
                else
                    $result .= "ERROR: CAN NOT CREATE THE DESIRED IMAGE (photo id: ".$photo['Photo']['id'].")\n\n";
                
            }
        }

        $total = $uploaded + $newphoto;

        //Print out total
        if($total > 0){

            $result .= "### Created photos: " . $newphoto . "\n"; 
            $result .= "### Uploaded photos: " . $uploaded . "\n"; 
            $result .= "### Total photos: " . $total;
            
            $mail_to = Configure::read('App.contactus');
            
            $this->Email->from = $mail_to;
            $this->Email->to = $mail_to;
            $this->Email->subject = 'Pictures uploaded in the last day';
            $this->Email->send($result);
        }
    }
}
?>
