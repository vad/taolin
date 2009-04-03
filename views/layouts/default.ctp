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
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title> 
<?php echo Configure::read('App.name'); ?> 
</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="shortcut icon" href="<?php echo $this->base ?>/img/favicon.ico" type="image/x-icon" />

<link rel='StyleSheet' href='<?php echo $this->base ?>/webroot/ext/resources/css/ext-all.css' />
<link rel='StyleSheet' id="theme" href='<?php echo $this->base ?>/ext-themes/css/xtheme-slate.css' />

<!-- <script type="text/javascript" src='<?php echo $this->base ?>/ext/adapter/ext/ext-base.js'> </script> -->
<script type="text/javascript" src='<?php echo $this->base ?>/js/jquery/jquery-1.3.2.min.js'> </script>
<script type="text/javascript" src='<?php echo $this->base ?>/ext/adapter/jquery/ext-jquery-adapter.js'> </script>

<?php
$isdebugactive = Configure::read('App.jsdebug');
if ($isdebugactive == 1) {
?>
    <!-- <script type="text/javascript" src='<?php echo $this->base ?>/js/ext-all-debug.js'> </script> -->
    <script type="text/javascript" src='<?php echo $this->base ?>/ext/ext-all-debug.js'> </script>
<?php
} else {
?>
    <script type="text/javascript" src='<?php echo $this->base ?>/ext/ext-all.js'> </script>
    <!-- <script type="text/javascript" src='<?php echo $this->base ?>/js/ext-all.pack.js'> </script> -->
<?php
}
?>

<!--[if lt IE 7.]>
<script defer type="text/javascript" src="<?php echo $this->base ?>/js/pngfix.js"></script>
<![endif]-->


</head>

<body>

    <div id="container">
        <div id="content">

<!-- Here's where I want my views to be displayed -->
<?php echo $content_for_layout ?>


        </div>
        
        <!--
        <div id="footer">
            footer

        </div>
        -->
    </div>
    </body>
</html>
