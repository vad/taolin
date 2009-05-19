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

// defining global value 

define("DB_CONFIG_FILE", "../../config/database.php");
define("INSTALL_REPORT_FILE", "../../config/INSTALLED.txt");

// including files

require_once('usr/install_fun.php');
require_once('usr/first_step.php');
require_once('usr/second_step.php');
require_once('usr/third_step.php');
require_once('usr/fourth_step.php');

if (isset($_GET['step']))
  $step = $_GET['step'];
else
  $step = 0;

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Installation</title>
  <link rel="stylesheet" href="../css/admin/base.css" type="text/css" media="screen" />
  <link rel="stylesheet" id="current-theme" href="../css/admin/themes/kathleene/style.css" type="text/css" media="screen" />
  <style type="text/css">
    #flashMessage {
      margin:10px 20px 0 20px;
    }
  </style>


  <script type="text/javascript" charset="utf-8" src="../js/jquery/jquery-1.3.2.min.js"></script> 
  <script type="text/javascript" charset="utf-8" src="../js/admin/jquery.scrollTo.js"></script>   
  <script type="text/javascript" charset="utf-8" src="../js/admin/jquery.localscroll.js"></script>
  <script type="text/javascript" charset="utf-8">
    // <![CDATA[
    var Theme = {
      activate: function(name) {
        window.location.hash = 'themes/' + name
        Theme.loadCurrent();
      },
      
      loadCurrent: function() {
        var hash = window.location.hash;
        if (hash.length > 0) {
          matches = hash.match(/^#themes\/([a-z0-9\-_]+)$/);
          if (matches && matches.length > 1) {
            $('#current-theme').attr('href', 'css/themes/' + matches[1] + '/style.css');
          } else {
            alert('theme not valid');
          }
        }
      }
    }            
    
    $(document).ready(function() {
      Theme.loadCurrent();
      $.localScroll();      
      $('.table :checkbox.toggle').each(function(i, toggle) {
        $(toggle).change(function(e) {
          $(toggle).parents('table:first').find(':checkbox:not(.toggle)').each(function(j, checkbox) {
            checkbox.checked = !checkbox.checked;            
          })          
        });1
      });
    });
    // ]]>    
  </script> 
</head>
<body>
  <div id="container">
    <div id="header">
      <h1 style="color:white">Taolin, Open Source Enterprise 2.0 web desktop</h1>
      <div id="user-navigation">
        <ul>
          <li><a href="http://taolin.fbk.eu" target="_blank" >Taolin website</a></li>
          <li><a href="http://github.com/vad/taolin/issues" target="_blank" >Taolin issues</a></li>
        </ul>
        <div class="clear"></div>
      </div>      
      <div id="main-navigation">
        <ul>
          <li class="active first"><a href="javascript:void(0)">Installation wizard</a></li>
        </ul>
        <div class="clear"></div>
      </div>
    </div>    
    <div id="wrapper">
      <div id="sidebar">
        <div class="block notice">
          <div class="content">
          <?php
            if(!file_exists(INSTALL_REPORT_FILE))
              wizard_step_helper($step);
            else
              echo "<h2 class='title'>Taolin already installed</h2><div class='inner'><p>By proceeding with this wizard the installation previously made will be erased and all your data saved in the database will be lost.</p><p>If you want to go further, please delete <span class='hightlight'>".INSTALL_REPORT_FILE."</span> file from your filesystem</p></div>";
          ?>
          </div>
        </div>
        <div class="block">
          <?php
            print_wizard_help();
          ?>
        </div>
      </div>
      <div id="main">
        <div class="block" id="block-text">
          <div class="secondary-navigation">
            <ul>
              <li class="<? if($step == 0) echo "active" ?> first"><a href="javascript:void(0)">Step 1</a></li>
              <li class="<? if($step == 1) echo "active" ?>"><a href="javascript:void(0)">Step 2</a></li>
              <li class="<? if($step == 2) echo "active" ?>"><a href="javascript:void(0)">Step 3</a></li>
              <li class="<? if($step == 3) echo "active" ?>"><a href="javascript:void(0)">Step 4</a></li>
            </ul>
            <div class="clear"></div>
          </div>          
        </div>          
        <div class="flash" style="padding-bottom:20px;">
          <div id="flashMessage" style="display:none;">
          </div>
          <div class="clear"></div>
        </div>
        <div class="block" id="block-forms">
          <div class="content">
          <!-- Switch through the different steps -->
          <?php 
            if(!file_exists(INSTALL_REPORT_FILE))
              wizard_body($step);
            else
              echo "<h2 class='title'>Taolin already installed</h2><div class='inner'><p>By proceeding with this wizard the installation previously made will be erased and all your data saved in the database will be lost.</p><p>If you want to go further, please delete <span class='hightlight'>".INSTALL_REPORT_FILE."</span> file from your filesystem.</p><p>Then <a href='install.php'>start again</a> with this wizard!</p></div>";
           ?> 
          </div>
        </div>
        <div id="footer">
          <div class="block">
            <p><a href="http://taolin.fbk.eu" target="_blank">Taolin</a>, open source Enterprise 2.0 web desktop. &copy; 2009 <a href="http://taolin.fbk.eu" target="_blank">SoNet</a>.</p>
          </div>      
        </div>
      </div>
      <div class="clear"></div>      
    </div>    
  </div>
</body>
</html>
