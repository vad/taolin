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
        <ul><li class="first active"><a href='#top'>Templates list</a></li></ul>
        <div class="clear" />
      </div>
      <div class="content">
        <div class="inner">
          <h2 class="title">Templates list</h2>
          <table class="table">
            <tr>
              <th style="text-align:center" class="first">Id</th>
              <th>Name</th>
              <th style="text-align:center">Template</th>
              <th style="text-align:center">Icon</th>
              <th style="text-align:center" class="last">Action</th>
            </tr>

            <?
            foreach ($templates as $template){
              $template = $template['Template'];
              echo "<tr>";

              echo "<td>".$template['id']."</td>";
              echo "<td>".$template['name']."</td>";
              echo "<td><code>".$template['temp']."</code></td>";
              echo "<td width='20px' style='text-align: center;'><img src='../".$template['icon']."' class='size16x16' /></td>";
              echo "<td width='30px'style='text-align: center'><a href='".$this->base."/admin/templates/edit/".$template['id']."' >edit</a></td>";

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
      <p>In this page you can modify existing templates. Other actions, as adding new templates, will be added, if you need more please submit an Issue on <a href="http://github/vad/taolin/issues">Github</a></p>
    </div>
  </div>
</div>
