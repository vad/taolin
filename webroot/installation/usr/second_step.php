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

function second_step_main(){

  $sql_scripts_path = "../../install/";
  $sql_scripts = array("taolin.struct.sql", "taolin.struct.post.sql");

  echo "<div class='inner'>";
  echo "<p>Processing SQL scripts in order to create database structure. Once finished, click on the link placed at the bottom of the page to go to the next step.</p>";
  
  $db_config = $_POST;

  $db = database_connection($db_config['host'], $db_config['database'], $db_config['login'], $db_config['password']);

  if($db){
    foreach($sql_scripts as $sql_script){
      echo "<h3>Processing file $sql_script</h3>";
      execute_sql_script($db, $sql_scripts_path.$sql_script);
    }
  
    ?>
        <hr />
        <div id='second-step-bottom'>
          <h2>Execution result</h2>
          <div class='flash'>
            <div class='message notice'><p><b>Database structure created</b></p></div>
          </div>
          <div class='inner'>
            <p>Database structure has been created. To continue with this wizard, click on the button below and browse to the next step.</p>
            <form method="POST" class="form" action="install.php?step=2" >
              <div class="group navform" style="padding-top:20px">
                <input type="submit" class="button" value="Next step" />  
              </div>
            </form>
          </div>
        </div>
      </div> 
    <?
  }
}


function second_step_help(){
  ?>
    <h4><b>Step 2: Creating database structure</b></h4>
    <p>Processing SQL scripts in order to create database structure. Once finished, click on the link placed at the <a href="#second-step-bottom">bottom of the page</a> to go to the next step.</p>
  <?
}
?>
