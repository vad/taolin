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

class PhotosController extends AppController {
	var $name = 'Photos';
	var $helpers = array('Html','Form','Javascript');
    var $components = array('Email','PhotoUtil','Thumber');

    function beforeFilter()
    {
        parent::beforeFilter();

        $this->checkSession();
        $this->san = new Sanitize();
    }


    function getphotos(){
        
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';

        $u_id = $_POST['id'];

        if (!$u_id)
            die('Request not valid!!!!');

        $user_id = $this->Session->read('id');
       
        $fields = array('Photo.id', 'Photo.name', 'Photo.filename','Photo.caption',
            'Photo.width','Photo.height',"LENGTH(photo) AS size",
            'Photo.created', 'Photo.modified', 'Photo.is_hidden', 'Photo.default_photo'
        );

        if($u_id == $user_id) {
            $query = array(
                'conditions'=> array('user_id'=>$user_id),
                'fields' => $fields,
                'order' => 'Photo.created DESC',
                'recursive'=>0
            );
        } else {
            $query = array(
                'conditions' => array('user_id' => $u_id, 'is_hidden' => 0),
                'fields' => $fields,
                'order'=>'Photo.created DESC',
                'recursive'=>0
            );
        }

        $photo_ar = $this->Photo->find('all', $query);

        $imagefoldername = $this->Conf->get('Images.people_web_path');

        foreach($photo_ar as $photo){
            $photo['Photo']['size'] = $photo[0]['size'];
            if (($photo['Photo']) && (!$photo['Photo']['hidden'])){ 
                $photo['Photo']['url'] = (Router::url('/')).'img/'.$imagefoldername.$photo['Photo']['filename'];
            } 
            $photos[] = $photo['Photo'];
        }

        if(!$photos) $photos = array();
        $json['photos'] = $photos;
         
        $this->set(compact('json'));
    }


    function setdefaultphoto($p_id){

        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';

        $user_id = $this->Session->read('id');

        $data['0']['id'] = $p_id;
        $data['0']['user_id'] = $user_id;
        $data['0']['default_photo'] = 1;
            
        $filter = array('user_id'=>$user_id, 'default_photo'=>1);
        $actDefaultPhoto = $this->Photo->find($filter,array('Photo.id'),null,null);
        if(isset($actDefaultPhoto['Photo']['id']) && ($actDefaultPhoto['Photo']['id'] != '')){
            $data['1']['id'] = $actDefaultPhoto['Photo']['id'];
            $data['1']['default_photo'] = 0;
        }

        if($data['0']['id']!=$data['1']['id']) {
            $this->Photo->saveAll($data);
            $response['success'] = true;

            $params = $this->Photo->findById($p_id, array('field' =>'Photo.name','Photo.filename','Photo.width','Photo.height','Photo.caption',));

            // Add event to the timeline
            $imagefoldername = $this->Conf->get('Images.people_web_path'); 
            
            $sanitized_desc = $this->san->html(str_replace('\'', '\\\'', $params['Photo']['caption']));
            $this->addtotimeline(array("url" => (Router::url('/')).'img/'.$imagefoldername.$params['Photo']['filename'], "width" => $params['Photo']['width'], "height" => $params['Photo']['height'], "filename" => $params['Photo']['filename'], "caption" => $sanitized_desc, "name" => $params['Photo']['name']));
        }
        else {
            $response['success'] = false;
        }
    
        $this->set('json', $response);
    }


    function uploadphoto(){
        Configure::write('debug', 0);     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';
        
        /* $response initialized to false */
        $response['success'] = false;

        /* Directory into which file would be uploaded */
        $dest_dir = $this->Conf->get('Images.people_fs_path');

        $user_id = $this->Session->read('id');

        $allowedMime = array('image/jpeg','image/pjpeg','image/png','image/x-png','image/gif');
        //$maxFileSize = 2097152; //2048Kb == 2Mb
        $maxFileSize = 953250; //930Kb
        $maxFileSizeInKb = round($maxFileSize/1024);
        
        // Directory where not correctly uploaded photos are stored
        $error_dir = $this->Conf->get('Images.error_fs_path');

        $params = $this->params['form'];
        $file_params = $params['file'];

        // escaping SQL commands and HTML tags
        $name = $this->san->escape(strip_tags($params['name']));
        $desc = $this->san->escape(strip_tags($params['caption']));

        if(!empty($this->params)){

            // Source file, php saves it in a temporary directory
            $source = $file_params['tmp_name'];
            
            // Where to save the photo if upload fails!
            $error_photo = $error_dir.$file_params['name'];

            copy($source, $error_photo);

            /* Security checks */
            if(isset($file_params['error']) && ($file_params['error'] == 0) && (!empty($file_params['name'])) && ($file_params['name'] != 'none') && (!empty($file_params['tmp_name'])) && ($file_params['tmp_name'] != 'none') && isset($file_params['type']) && in_array($file_params['type'], $allowedMime) && (strpos($file_params['tmp_name'], '/tmp') === 0) && ($file_params['size'] < $maxFileSize)){

                $fileExt = $this->PhotoUtil->getphotoext($file_params['name']);

                if($fileExt){

                    /* Photo should has a random name, composed by 16 digits randomly chosen */
                    while(1){
                        $randomFileName = $this->PhotoUtil->generaterandomfilename();
                        $dest_file = $randomFileName.$fileExt;
                        if(!file_exists($dest = $dest_dir.$dest_file))
                            break;
                    }

                    /* Move temporary file (source file) to final directory on the server
                       If it works (i.e. move_upload_file returns true) save data on db
                    */
                    if(move_uploaded_file($source, $dest)) {

                        list($width, $height) = getimagesize($dest);

                        $data['0']['user_id'] = $user_id;
                        $data['0']['name'] = $name;
                        $data['0']['filename'] = $dest_file;
                        $data['0']['caption'] = $desc;
                        $data['0']['photo'] = fread(fopen($dest, 'r'),$file_params['size']);
                        $data['0']['width'] = $width;
                        $data['0']['height'] = $height;

                        if(isset($params['is_hidden']) && ($params['is_hidden'] == 'on'))
                            $data['0']['is_hidden'] = 1;
                        else 
                            $data['0']['is_hidden'] = 0;

                        if(isset($params['default_photo']) && ($params['default_photo'] == 'on')){ 
                            $data['0']['default_photo'] = 1;
                            
                            $filter = array('user_id'=>$user_id, 'default_photo'=>1);
                            $actDefaultPhoto = $this->Photo->find($filter,array('Photo.id'),null,null);
                            if(isset($actDefaultPhoto['Photo']['id']) && ($actDefaultPhoto['Photo']['id'] != '')){
                                $data['1']['id'] = $actDefaultPhoto['Photo']['id'];
                                $data['1']['default_photo'] = 0;
                            }
                        }
                        else
                            $data['0']['default_photo'] = 0;

                        $data['0']['is_corporate_photo'] = 0;
                        
                        if($this->Thumber->createthumb($dest_file, $dest_dir, true)){
                            $message ='File '.$name.' has been successfully uploaded!';
                            //Send back photo url in order to set default photo in the FE
                            $response['url'] = $dest_file;
                            $response['success'] = true;
                        } 
                        else 
                            $message = 'Some strange errors happened, probably during images creation';

                        if($response['success']){
                         
                            $this->Photo->saveAll($data);

                            // Uploaded successfully, error_photo could be removed
                            unlink($error_photo);
                            
                            // If the picture is not hidden (hence visible to all other users), add this event to timeline
                            if(!(isset($params['is_hidden']) && ($params['is_hidden'] == 'on'))){ 
                                $sanitized_desc = $this->san->html(str_replace('\'', '\\\'', $desc));
                                $this->addtotimeline(array("url" => (Router::url('/')).'img/'.$imagefoldername.$dest_file, "width" => $width, "height" => $height, "filename" => $dest_file, "caption" => $sanitized_desc, "name" => $name));
                            }
                        }

                    }
                    else 
                        $message = 'Can not save selected file in our server';
                }
                else
                    $message = $file_params['name'].' is not a well formatted file name';
            }
            else 
                $message = 'Please check file type or that your file doesn\'t exceed the maximum size admitted (that is '.$maxFileSizeInKb.'Kb)';
        }
        else 
            $message = 'Problem found in data transmission';
                
        $response['message']= $message;

        // If it failed, send a mail to the email address specified in the config file in order to take care of this problem
        if($response['success'] == false){

            $user = $this->Photo->User->find('first', array(
                'conditions' => array('User.id' => $user_id),
                'fields' => array('User.name', 'User.surname', 'User.login',
                    'COALESCE(mod_email, email) AS User__email'),
                'recursive' => 0
            ));

            if ($user['User']['email']){
                $sender = $user['User']['email'];
            } else {
                $addtomail = $this->Conf->get('Organization.domain');
                $sender = $user['User']['login'].'@'.$addtomail;
            }

            $username = $user['User']['name'].' '.$user['User']['surname'];
            $size = round($file_params['size']/1024);
            $type = $file_params['type'];

            $this->Email->from = $sender;
            $this->Email->to =  $this->Conf->get('Site.admin');
            $appname = $this->Conf->get('Site.name');
            $this->Email->subject = $appname.' notification: error in photo upload';
            $this->Email->send("$username ($sender) couldn't upload a photo (name=$name - size in Kb=$size - type=$type - desc=$desc). This is the text of the message received with the notification of the error: $message\n\n#########################################\n\nSomeone of us wants to get in touch with $username ($sender) either via chat, email or telephone in order to understand what the problem was and how to solve it together!!!");
        }
        
        $this->set('json', $response);
        
    }
       
    function setattribute(){
		uses('Sanitize');
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';
        
        $p_id = $this->params['form']['p_id'];
        $p_type = $this->params['form']['name'];
        $p_value = $this->params['form']['value'];

        if(isset($p_id) && isset($p_type) && isset($p_value)){
          
            if($p_value != null && $p_value!='null')
                $new_value = $this->san->escape(strip_tags($p_value));

            $data['id'] = $p_id;
            $data[$p_type] = $new_value;

            $this->Photo->save($data);

            $response['success'] = true;    
        }
        else $response['success'] = false;

        $this->set('json', $response);
    } 
 
    function deletephoto($p_id){

        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';

        $user_id = $this->Session->read('id');

        $filter = array('Photo.id'=>$p_id);
        $photo = $this->Photo->find($filter,array('Photo.user_id'),null,null);

        if(isset($photo['Photo']['user_id']) && ($photo['Photo']['user_id'] == $user_id)){
            $this->Photo->delete($p_id);
            $response['success'] = true;
        }
        else {
            $response['success'] = false;
        }
    
        $this->set('json', $response);
    }   
    
    function undodeletephoto($p_id){

        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';

        $user_id = $this->Session->read('id');

        $filter = array('Photo.id'=>$p_id);

        $this->Photo->enableSoftDeletable('find', false);
        $photo = $this->Photo->find($filter,array('Photo.user_id'),null,null);
        $this->Photo->enableSoftDeletable('find', true);

        if(isset($photo['Photo']['user_id']) && ($photo['Photo']['user_id'] == $user_id)){
            $this->Photo->undelete($p_id);
            $response['success'] = true;
        }
        else {
            $response['success'] = false;
        }
    
        $this->set('json', $response);
    }   
    
    function getphotofromuserlogin($u_login, $u_width, $u_height){
        
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';
        
        $login = $this->san->paranoid($u_login);

        $this->Photo->User->recursive = 0;
        $fields = array('User.id');
        $user = $this->Photo->User->findByLogin($login, $fields);
        
        $this->getphotofromuserid($user['User']['id'], $u_width, $u_height);
    }

    function getphotofromuserid($u_id, $u_width, $u_height){
        
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';
        
        $id = $this->san->paranoid($u_id);
        $width = $this->san->paranoid($u_width);
        $height = $this->san->paranoid($u_height);

        $resphoto = $this->Photo->getdefault($id, array('filename'));

        if (!empty($resphoto['Photo'])){
        
            /* Since all the photos are saved in .jpg extension, replace the
             * original file extension with .jpg
             */
            $photo_name = substr_replace($resphoto['Photo']['filename'], '.jpg', strrpos($resphoto['Photo']['filename'], '.'));

            $photo_fs_dir = $this->Conf->get('Images.people_fs_path');

            // building final photo web path
            $photo = imagecreatefromjpeg($photo_fs_dir.'t'.$width.'x'.$height.'/'.$photo_name);

            header('Content-Type: image/jpeg');

            imagejpeg($photo);
            imagedestroy($photo);
        }
        else {

            $photo = imagecreatefromgif("../webroot/ext/resources/images/default/s.gif");
            
            header('Content-Type: image/gif');

            imagegif($photo);
            imagedestroy($photo);

        }
    }
}
?>
