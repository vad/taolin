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
          <div style="margin-bottom:20px">
            <form class="form" action="<? echo $this->base ?>/admin/users" method="GET">
              <input name="q" class="text_field" style="width: 200px" />
              <input type="submit" class="button" value="Search" />
            </form>
          </div>
          <table class="table">
            <tr>
              <th class="first">Id</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Login</th>
              <th class="last">Actions</th>
            </tr>

            <?
            foreach ($users as $user){
              $user = $user['User'];
              echo '<tr class="'.(($user['active'])?"active":"notActive").'">';

              echo "<td>".$user['id']."</td>";
              echo "<td>".$user['name']."</td>";
              echo "<td>".$user['surname']."</td>";
              echo "<td>".$user['login']."</td>";

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
          <div class="actions-bar">
            <div class="pagination">
              <?php 
                echo $paginator->prev('« Previous', array('tag' => 'span', 'class' => 'prev_page'),
                  null, array('tag' => 'a', 'class' => 'disabled prev_page'));
              
                echo $paginator->numbers(array('separator' => ''));
                echo $paginator->next('Next »', array('tag' => 'span', 'class' => 'next_page'),
                  null, array('tag' => 'a', 'class' => 'disabled next_page'));
              ?>
            </div>
            <div class="clear" />
          </div>
        </div>
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

