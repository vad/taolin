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
