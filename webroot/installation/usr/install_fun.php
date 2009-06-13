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
    <p>
      This wizard will guide you through the Taolin installation process. You can visit the <a href="http://taolin.fbk.eu" target="_blank">Taolin Wiki</a> if you need help with this installation wizard.
    </p>
    <p>
      For any troubleshoot please submit an issue on <a href="http://github/vad/taolin/issues" target="_blank">Github</a>
    </p>
  </div>

  <?php
}


function wizard_body($step){

  step_switcher($step);

}


function wizard_step_helper($step){

  switch($step){
    case 0: 
      first_step_help();break;
    case 1:
      second_step_help();break;
    case 2:
      third_step_help();break;
    case 3:
      fourth_step_help();break;
    default:
      ?>
        <h4><b>Nothing to see here, sorry!</b></h4>
          <div class="inner">
            <p>If you want to install taolin maybe you should start from the <a href="install.php">first step</a></p>
          </div>
      <?
  }

}


function step_switcher($step){

  switch($step){
    case 0:
      first_step_main();break;
    case 1:
      second_step_main();break;
    case 2:
      third_step_main();break;
    case 3:
      fourth_step_main();break;
    default:
      notice_message("<b>ERROR! Follow the right path! Please start from <a href='install.php'>the first step</a> of this wizard</b>", "error");
      die();
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

/* Perform a database connection. If the connection fails return null.
 *
 * host: database host
 * dbname: database name
 * user: user with grant for the database
 * password: password for the specified user
 */

function database_connection($host, $dbname, $dbport, $user, $password){

    $db = pg_connect("host=$host port=$dbport dbname=$dbname user=$user password=$password");
    
    if(!$db) return null;

    return $db;
}


/* Executes an SQL script file outputting operations performed
 *
 * db: connection to the database, obtained via pg_connect or similar...  
 * sql_file: the path of a well formatted SQL script file
 */

function execute_sql_script($db, $sql_file) {

  // load SQL script file and save all the content in a variable
  $statements = file_get_contents($sql_file);

  // Explode file content separating pieces of text contained between '-- #'
  $statements = preg_split("/(^|\n)-- #/", $statements, -1, PREG_SPLIT_NO_EMPTY);

  echo "<pre>";

  // iterate through the statements
  foreach ($statements as $statement) {

    list($comment, $query) = preg_split("/\n/", $statement, 2, PREG_SPLIT_NO_EMPTY);

    echo "<p>processing: <b>".trim($comment)."</b><br />";

    // output current action and then the result as well
    echo "executing query to the database ... ";

    $result = pg_query($db, $query);

    if(!$result) {

      $error = pg_last_error($db);

      if($error != ''){
        
        echo "<b><span style='color:red'>FAILED</span></b><br /></p></pre>";
        echo '</div><br />';
        echo "<div class='flash'><div class='message error'><p><b>$error</b></p></div></div>";
        echo "<div><h4>Please get back to the <a href='install.php'>previous step</a> and check either your database settings or user's grants on the configured database.</h4></div>";
        echo '</div>';
        die();

      }

    }
    else{

      echo "<b><span style='color:green'>SUCCESS</span></b><br /></p>";

    }
  }

  // close <pre> tag opened before
  echo "</pre>";
}


?>
