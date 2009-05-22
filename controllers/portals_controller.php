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
<?php

class PortalsController extends AppController {

    var $name = 'Portal';
    var $helpers = array('Html','Javascript');


    function beforeFilter()
    {
        parent::beforeFilter();

        $this->checkSession();
    }


    function getinitialconfig(){

        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';
        
        $u_id = $this->Session->read('id');

        $response['config']['addtomail'] = $this->Conf->get('Organization.domain');
        $response['config']['appname'] = $this->Conf->get('Site.name');
        $response['config']['contactus'] = $this->Conf->get('Site.admin');
        $response['config']['defaultgroupname'] = $this->Conf->get('Organization.group_name');
        $response['config']['img_path'] = $this->Conf->get('Images.people_web_path');
        $response['config']['jabber_server'] = $this->Conf->get('Jabber.server');
        $response['config']['jabber_domain'] = $this->Conf->get('Jabber.domain');
        $response['config']['logo'] = $this->Conf->get('Site.logo_url');

        $response['success'] = true;
        
        $this->set('json', $response);
        
    }


    function index(){
        $this->pageTitle = $this->Conf->get('Site.name');
        $this->set('isdebugactive', $this->Conf->get('Site.jsdebug'));
        $this->set('screen_title', $this->Conf->get('Site.name'));
    }


    function admin(){
        $this->layout = 'admin';
    }
    
    
    function admin_config(){
        $this->layout = 'admin';

        if (!empty($this->data)){
            //save
            foreach ($this->data as $cat => $configs){
                foreach ($configs as $k => $v){
                    $this->Conf->set($cat.'.'.$k, $v);
                }
            }
            $this->Session->setFlash('Settings saved',
                'admin_flash_message_success');
            $this->redirect('/admin/portals/config');
        } else {
            // show all the settings in the DB configs table
            $cats = $this->Conf->listCat();
            $allKeys = array();
            foreach ($cats as $cat){
                $cat_keys = $this->Conf->listValue($cat);
                $allKeys[$cat] = $cat_keys;
            }
            $this->set('configs', $allKeys);
        }
    }
    
    
    function admin_configPopulate(){
        $this->layout = 'admin';

        $config = array(
            'Site.name' => 'taolin',
            'Site.url' => 'http://taolin.fbk.eu', //used in views/pages/make_homepage_help.ctp
            'Site.admin' => 'admin@example.com', //email address used in photos controller
            'Site.jsdebug' => '1', //used in views/portal/index.ctp
            'Organization.domain' => 'example.com',
            'Organization.group_name' => 'Group',
            'Images.people_fs_path' => 'YOUR_PATH/user_images', //folder must be img/user_images, update only the absolute path
            'Images.error_fs_path' => 'ANOTHER_PATH/images_upload_error/', //folder must be img/user_images, update only the absolute path, for FBK is /www/desktop/html/images_desktop/
            'Images.people_web_path' => 'user_images/',
            'Images.webcam_fs_path' => 'ONE_PATH/webcam/',
            'Organization.publications' => '0', //1 for TRUE, 0 for FALSE; used only when you have a server to show publications
            'Auth.method' => 'Dummy', //Choose between Dummy or Ldap
            'Jabber.server' => 'jabber.example.com',
            'Jabber.domain' => 'example.com',
            'Site.logo_url' => 'img/logo.png',
            'Site.favicon' => 'local/img/favicon.ico' // local path to favicon (optional)
        );
        foreach ($config as $k => $v) {
            if ($this->Conf->get($k, null) === null)
                $this->Conf->set($k, $v, null, True, True);
        }
    }
}
?>
