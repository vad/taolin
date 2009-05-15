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


function print_wizard_help(){

  ?>

  <h3>Installation wizard help</h3>
  <div class="content">
    <p>This wizard will guide you through the Taolin installation process. Visit <a href="http://taolin.fbk.eu" target="_blank">Taolin Wiki</a> for help on this wizard. For any troubleshoot please submit an Issue on <a href="http://github/vad/taolin/issues" target="_blank">Github</a></p> 
  </div>

  <?php
}


function wizard_body($step){

  step_switcher($step);

}


function wizard_step_helper($step){

  switch($step){
    case 0: 
      first_step_help();
      break;
    case 1:
      second_step_help();
      break;
    case 2:
      third_step_help();
      break;
    default:
      echo 'Wrong path, ya?';
  }

}


function step_switcher($step){

  switch($step){
    case 0:
    ?>
      <h2 class="title">Step 1: Database configuration</h2>
    <?
      first_step_main();
      break;
    case 1:
    ?>
      <h2 class="title">Step 2: Creating database structure</h2>
    <?
      second_step_main();
      break;
    case 2:
    ?>
      <h2 class="title">Step 3: Site administrator</h2>
    <?
      third_step_main();
      break;
    default:
      die("<div class='flash'><div class='message error'><p><b>ERROR! Follow the right path!</b></p></div></div>");
  }

}


function database_connection($host, $dbname, $user, $password){

    $db = pg_connect("host=$host port=5432 dbname=$dbname user=$user password=$password");
    
    if(!$db){
    
      notice_message("<b>ERROR! Can not connect to the database <i>$dbname</i> on host <i>$host</i></b>", "error");
      
      echo '<h3>What can you do now?</h3><ul style="padding-left:20px"><li>You can <a href="install.php">go back to step 1</a> and configure your database properly</li><li>If the error persists, check your database or submit an issue to Taolin on github.</li></ul></div>';

      return null;

    }

    return $db;
}


function execute_sql_script($db, $sql_file) {

  $statements = file_get_contents($sql_file);
  $statements = explode('-- #### --', $statements);

  foreach ($statements as $statement) {

    $comments = explode('--', $statement);
    echo "<p>processing: <b>".$comments[2]."</b>";
    echo "<br />executing query to the database ... ";
    $result = pg_query($db, $statement);
    if(!$result) {

      $error = pg_last_error($db);
      if($error != ''){
        echo "<b><span style='color:red'>FAILED</span></b><br /></p>";
        echo "<div class='flash'><div class='message error'><p><b>$error</b></p></div></div>";
        die('</div>');
      }
    }
    else
      echo "<b><span style='color:green'>SUCCESS</span></b><br /></p>";
  }
}


/* Prints out a notice message.
 * message: string, message to be printed  
 * type: string, could be 'notice', 'warning', 'error'
 */

function notice_message($message, $type = 'notice'){

  if($message != ''){
    ?>
      <script>
        $('#flashMessage').addClass('message <? echo $type ?>').append("<p><? echo $message ?></p>").show();
      </script>
    <?
  }
}

?>
