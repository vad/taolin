<!-- ex: set ts=2 softtabstop=2 shiftwidth=2: -->
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

$url = '/'.$url;
?>

<div id="wrapper">
  <div id="main">
    <div class="block">
      <div class="secondary-navigation">
        <ul><li class="first active"><a href='#top'>Users list</a></li></ul>
        <div class="clear" />
      </div>
      <div class="content">
        <div class="inner">
          <h2 class="title">Users list</h2>
          <table class="table">
            <tr>
              <?php

              //print headers
              $headers = array('Id', 'Name', 'Surname', 'Login', 'Active');
              echo '<th class="first">'.$headers[0].'</th>';
              for ($i = 1; $i < count($headers); $i++){
                echo '<th>'.$headers[$i].'</th>';
              }

              ?>
              <th class="last">Actions</th>
            </tr>

            <?

            foreach ($users as $user){
              $user = $user['User'];
              echo '<tr class="odd">';
              foreach ($user as $field){
                echo "<td>$field</td>";
              }

              //activate/deactivate
              if ($user['active'])
                $a = "<a href='".$this->base."/admin/users/activate/".$user['id']."/0?r=$url'>deactivate</a>";
              else
                $a = "<a href='".$this->base."/admin/users/activate/".$user['id']."?r=$url'>activate</a>";
              echo "<td>$a</td>";

              echo '</tr>';
            }
            ?>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

  <div id="sidebar">
    <div class="block">
      <h3>Help</h3>
      <div class="content">
        <p>In this page you can activate/deactivate users. Other actions will be added, if you need more please submit an Issue on <a href="http://github/vad/taolin/issues">Github</a></p>
      </div>
    </div>
  </div>

