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

?>
<div id="wrapper">
  <div id="main">
    <div class="block">
      <div class="content">
        <div class="inner">
          <h2 class="title">Settings</h2>
            <form method=POST action="config" class="form">
            <?
            foreach ($configs as $cat => $keys) {
              echo "<h3>$cat</h3>";
              foreach ($keys as $k => $v){ ?>
                <div class="group">
                <label class="label"><? echo $k; ?></label>
                <input class="text_field" name='data[<? echo $cat ?>][<? echo $k?>]' value='<? echo $v; ?>'/>

                </div>
            <?
              }
            }
            ?>
            <div class="submit">
              <input class="button" type="submit" value="Save" />
            </div>
            </form>
        </div>
      </div>
    </div>
  </div>
</div>
