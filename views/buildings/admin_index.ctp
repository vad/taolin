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

?>

<div id="wrapper">
  <div id="main">
    <div class="block">
      <div class="secondary-navigation">
        <ul><li class="first active"><a href='#top'>Buildings list</a></li></ul>
        <ul><li><a href="<? echo $this->base.DS."admin/buildings/add" ?>">Add new</a></li></ul>
        <div class="clear" />
      </div>
      <div class="content">
        <div class="inner">
          <h2 class="title">Buildings list</h2>
          <table class="table">
            <tr>
              <th style="text-align:center" class="first">Id</th>
              <th>Name</th>
              <th style="text-align:center">Imagepath</th>
              <th style="text-align:center" class="last">Action</th>
            </tr>

            <?
            foreach ($buildings as $building){
              $building = $building['Building'];
              echo "<tr>";

              echo "<td>".$building['id']."</td>";
              echo "<td>".$building['name']."</td>";
              echo "<td>".$building['imagepath']."</td>";
              echo "<td width='30px'style='text-align: center'><a href='".$this->base.DS."admin/buildings/edit/".$building['id']."' >edit</a></td>";

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
      <p>In this page you can add new buildings or modify existing ones. If you need more functionalities please submit an Issue on <a href="http://github/vad/taolin/issues">Github</a></p>
    </div>
  </div>
</div>
