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
<meta http-equiv="X-UA-Compatible" content="IE=8" />
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<?php
    
    $favicon = $conf->get('Site.favicon');
    if ($favicon) {
        echo "<link rel='shortcut icon' href='". $this->base .'/'. $favicon ."' type='image/gif' />";
    }

?>
<link rel='StyleSheet' href='<?php echo $this->base ?>/extjs/resources/css/ext-all.css' />
<link rel='StyleSheet' id="theme-sprite" href='<?php echo $this->base ?>/ext-themes/css/xtheme-tp-sprite.css' />
<link rel='StyleSheet' id="theme" href='<?php echo $this->base ?>/ext-themes/css/xtheme-tp.css' />

<script type="text/javascript" src='<?php echo $this->base ?>/js/jquery/jquery-1.4.2.min.js'> </script>
<?
$isdebugactive = $conf->get('Site.jsdebug');
if ($isdebugactive == 2) {
?>
    <script type="text/javascript" src='<?php echo $this->base ?>/js/jquery/jquery.lint.js'> </script>
<?
}
?>
<script type="text/javascript" src='<?php echo $this->base ?>/extjs/adapter/jquery/ext-jquery-adapter.js'> </script>

<?php
if ($isdebugactive >= 1) {
?>
    <script type="text/javascript" src='<?php echo $this->base ?>/extjs/ext-all-debug.js'> </script>
<?php
} else {
?>
    <script type="text/javascript" src='<?php echo $this->base ?>/webroot/extjs/ext-all.js'> </script>
<?php
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
