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
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title> 
<?php echo $title_for_layout ?> 
</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<?php

    $favicon = $conf->get('Site.favicon');
    $base = $this->base;
    if ($favicon) {
        echo "<link rel='shortcut icon' href='$base/$favicon' type='image/gif' />";
    }

    if ($isdebugactive >= 1) {
        echo $html->css('/extjs/resources/css/ext-all.css');
    } else {
        echo $html->css('/extjs/resources/css/ext-all.min.css');
    }
    echo $html->css('/ext-themes/css/xtheme-tp-sprite.css', null, array('id' => "theme-sprite"));
    echo $html->css('/ext-themes/css/xtheme-tp.css', null, array('id' => "theme"));

    echo $javascript->link('/js/jquery/jquery-1.4.2.min.js');

    $isdebugactive = $conf->get('Site.jsdebug');
    if ($isdebugactive == 2) {
        echo $javascript->link('/js/jquery/jquery.lint.js');
    }
    echo $javascript->link('/extjs/adapter/jquery/ext-jquery-adapter.js');

    if ($isdebugactive >= 1) {
        echo $javascript->link('/extjs/ext-all-debug.js');
    } else {
        echo $javascript->link('/extjs/ext-all.js');
    }
?>
</head>
<body>
    <div id="container">
        <div id="content">
            <?php echo $content_for_layout ?>
        </div>
    </div>
    </body>
</html>
