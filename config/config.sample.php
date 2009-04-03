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
$config = array(
    'App.name' => 'taolin',
    'App.url' => 'http://taolin.fbk.eu', //used in views/pages/make_homepage_help.ctp
    'App.contactus' => 'admin@example.com', //email address used in photos controller
    'App.addtomail' => '@example.com',
    'App.defaultgroupname' => 'Group',
    'App.imagefolder' => 'YOUR_PATH/user_images', //folder must be img/user_images, update only the absolute path
    'App.webcamfolder' => 'ONE_PATH/webcam/',
    'App.imagefoldererror' => 'ANOTHER_PATH/images_upload_error/', //folder must be img/user_images, update only the absolute path, for FBK is /www/desktop/html/images_desktop/
    'App.imagefoldername' => 'user_images/',
    'App.publications' => '1', //1 for TRUE, 0 for FALSE; used only when you have a server to show publications
    'App.auth' => 'Dummy', //Choose between Dummy or Ldap
    'App.jsdebug' => '1', //used in views/portal/index.ctp
    'App.jabber.server' => 'jabber.example.com',
    'App.jabber.domain' => 'example.com'
);
?>
