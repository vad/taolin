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

$url = '/'.$this->params['url']['url'];
?>

<div id="wrapper">
  <div id="main">
    <div class="block">
      <div class="secondary-navigation">
        <ul><li class="first active"><a href='#top'>Widgets list</a></li></ul>
        <ul><li><a href="<? echo $this->base.DS."admin/widgets/add" ?>">Create a new widget</a></li></ul>
        <div class="clear" />
      </div>
      <div class="content">
        <div class="inner">
          <h2 class="title">Widgets list</h2>

          <table class="table">
            <tr>
              <th class="first">Id</th>
              <th>Widget name</th>
              <th>Count</th>
              <th class="last">Actions</th>
            </tr>
            <? foreach($widgets as $widget):
              $widget = $widget['Widget'];
            ?>
            <tr>
              <td><? echo $widget['id'] ?></td>
              <td><? echo $widget['name'] ?></td>
              <td><? echo $widget['count'] ?></td>
              <td><a href='<? echo $this->base.'/admin/widgets/edit/'.$widget['id'] ?>'>edit</a> | 

              <?
                //activate/deactivate
                $act = "<a href='$this->base/admin/widgets/activate/".$widget['id'];
                if ($widget['enabled'])
                  $act .= "/0?r=$url'>deactivate</a>";
                else
                  $act .= "?r=$url'>activate</a>";
                
                echo $act;
              ?>
              
              </td>
            </tr>
            <? endforeach ?>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
