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

  $base = $this->base;
  $items = array('Admin' => 'admin'
    ,'Backgrounds' => 'admin/backgrounds'
    ,'Configuration' => 'admin/portals/config'
    ,'Timeline' => 'admin/templates'
    ,'Users' => 'admin/users'
    ,'Widgets' => 'admin/widgets'
  );
?>
<div id="header">
  <h1><a href="<? echo $this->base ?>/admin/"><? echo $conf->get('Site.name') ?> administration site</a></h1>
  <div id="user-navigation">
    <ul>
      <li><a href="<? echo $conf->get('Site.url') ?>">Back to <? echo $conf->get('Site.name') ?></a></li>
    </ul>
    <div class="clear"></div>
  </div>
  <div id="main-navigation">
    <ul>
<?
  $maybe_first = 'first';
  foreach ($items as $name => $url){
    $maybe_active = '';
    if (trim($this->params['url']['url'], '/') == $url)
      $maybe_active = 'active';
    echo "<li class='$maybe_first $maybe_active'><a href='$base/$url'>$name</a>";
    $maybe_first = '';
  }
?>
    </ul>
    <div class="clear"></div>
  </div>
</div>
