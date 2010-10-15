<?php // ex: set ts=2 softtabstop=2 shiftwidth=2: ?>
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


function first_step_main(){
    
  ?>
    <h2 class="title">Step 1: Configure your database</h2>
  <?

  if(!file_exists(DB_CONFIG_FILE))
    db_configuration_form();
  else
    db_configuration_form(DB_CONFIG_FILE);
    //print_database_config(DB_CONFIG_FILE);
  
}


function db_configuration_form($db_ini=null){

  $db = db_initial_value($db_ini);

?>
  <div class="inner">
    <p class="first">
      Please check <a href="http://book.cakephp.org/view/40/Database-Configuration" target="_blank">CakePhp Cookbook</a> for an exhaustive explanation of how to configure correctly your database connection.</p>
    <p>You could change this settings anytime by editing file <span class="hightlight"><i>database.php</i></span> placed under <span class="hightlight"><i>config/</i></span> directory.</p>
    <form action="install.php?step=1" method="POST" class="form">
      <h3>Database configuration</h3>
      <div class="group">
        <label class="label" for="post_title">login</label>
        <input type="text" class="text_field" name="db[login]" value="<? echo $db['login'] ?>" />
        <span class="description">The username for the account</span>

        <label class="label" for="post_title">password</label>
        <input type="password" class="text_field" name="db[password]" value="<? echo $db['password'] ?>" />
        <span class="description">The password for the account</span>

        <label class="label" for="post_title">database</label>
        <input type="text" class="text_field" name="db[database]" value="<? echo $db['database'] ?>" />
        <span class="description">The name of the database</span>

        <label class="label" for="post_title">host</label>
        <input type="text" class="text_field" name="db[host]" value="<? echo $db['host'] ?>" />
        <span class="description">The database server’s hostname (or IP address)</span>

        <label class="label" for="post_title">port</label>
        <input type="text" class="text_field" name="db[port]" value="<? echo $db['port'] ?>" />
        <span class="description">(Optional) The TCP port or Unix socket used to connect to the server</span>

        <label class="label" for="post_title">persistent</label>
        <input type="text" class="text_field" name="db[persistent]" value="<? echo $db['persistent'] ?>" />
        <span class="description">True to use a persistent connection to the database. Otherwise false</span>
        
        <label class="label" for="post_title">encoding</label>
        <input type="text" class="text_field" name="db[encoding]" value="<? echo $db['encoding'] ?>" />
      </div>
      
      <h3>Import demo data in taolin</h3>
      <p>Check this button to populate your database with demonstrative data (be carefully to choose 'Dummy' as authentication type while configuring your Taolin settings in the next steps!!!)<br />
      Importing these data you will set up the demonstrative version of Taolin.</p>
      <p>User credential required to log in will be <i>platone</i> (both as username and password)</p>
      <div class="group">
          <input type="checkbox" name="import_demo_data" id="checkbox_1" class="checkbox" value="0" /> <label for="checkbox_1" class="label" style="display: inline !important;">Import demo data</label>
      </div>

      <div class="group navform" style="padding-top:20px">
        <input type="submit" class="button" value="Save" />
      </div>
    </form>
  </div>
<?
}


function print_database_config($fileName){

  $lines = file($fileName);

  notice_message("File <i>config/database.php</i> already exists. Please delete it before proceeding with this wizard", 'warning');

  ?>
    <div class="inner">
      <h3>Warning!</h3>
      <p>Database configuration file <i>config/database.php</i> found. Is taolin already installed in this location? Proceeding with the installation will delete an existant database losing all the data contained.</p><br />
      <h3>Proceeding with Taolin installation</h3>
      <p>Before proceeding with the installation process you should delete the database configuration file since it would be regenerated with the configuration settings entered. Then you can continue with this wizard.</p>
      <form method="POST" class="form" action="install.php" >
        <div class="group navform" style="padding-top:20px">
          <input type="submit" class="button" value="Go to step 1 >>" />  
        </div>
      </form>
    </div>
  <?php

}


function first_step_help(){
  ?>
    <h4><b>Step 1: Configure your database</b></h4>
    <p>Fill the form with your database connection settings. This will be the database used for installing and running Taolin.<br /><br />More information and examples about how to configure properly database connection available at the <a href="http://book.cakephp.org/view/40/Database-Configuration" target="_blank">CakePhp Cookbook</a></p>
  <?
}

?>
