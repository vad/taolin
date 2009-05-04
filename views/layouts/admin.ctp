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
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<title>Taolin admin backend</title>
  <link rel="stylesheet" href="<? echo $this->base ?>/css/admin/base.css" type="text/css" media="screen" />
  <link rel="stylesheet" id="current-theme" href="<? echo $this->base ?>/css/admin/themes/orange/style.css" type="text/css" media="screen" />
  <script type="text/javascript" charset="utf-8" src="<? echo $this->base ?>/js/jquery/jquery-1.3.2.min.js"></script> 
  <script type="text/javascript" charset="utf-8" src="<? echo $this->base ?>/js/admin/jquery.scrollTo.js"></script>   
  <script type="text/javascript" charset="utf-8" src="<? echo $this->base ?>/js/admin/jquery.localscroll.js"></script>
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
        });
      });
    });
    // ]]>    
  </script> 
</head>
<body>
  <div id="container">
    <!-- Views are diplayed here -->
    <?php echo $content_for_layout ?>

  </div>
</body>
</html>
