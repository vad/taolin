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

echo $this->element('admin_header');

?>

<div id="wrapper">
  <div id="main">
    <div class="block">

      <table class="table">
        <tr>
          <th class="first">Id</th>
          <th>Widget name</th>
          <th class="last">Actions</th>
        </tr>
        <? foreach($widgets as $widget): ?>
        <tr>
          <td><? echo $widget['Widget']['id'] ?></td>
          <td><? echo $widget['Widget']['name'] ?></td>
          <td><a href='edit/<? echo $widget['Widget']['id'] ?>'>edit</a></td>
        </tr>
        <? endforeach ?>
      </table>
    </div>
  </div>
</div>
