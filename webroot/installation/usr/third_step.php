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
  <script>
    $(document).ready(function(){
      $("form").submit(function(){
          
          var host = $("input#ldaphost").val();
          var port = $("input#ldapport").val();
          var dn = $("input#ldapdn").val();
          var domain = $("input#ldapdomain").val();

          var dataString = 'host='+ host + '&port=' + port + '&dn=' + dn + '$domain=' + domain;

          $ajax({
            url: 'installation/usr/testldapconnection.php'
            ,type: 'POST'
            ,data: dataString
            ,success: function(){
              alert(msg);
            }
            ,error: function(){
              alert('Error');
            }
          });
      })
    })
  </script>
<?php

function third_step_main(){

  ?>
    <h2 class="title">Step 3: Configure taolin settings</h2>
  <?

  //site_settings();
  ldap_settings_form();
}

function ldap_settings_form(){

?>
  <div class="inner">
    <!--<form action="install.php?step=3" method="POST" class="form">-->
    <form action="" method="POST" class="form" id="testLdapConnection">
      <h3>Ldap configuration</h3>
      <div class="group">

        <label class="label" for="post_title">host</label>
        <input type="text" class="text_field" name="ldap[host]" id="ldaphost" />

        <label class="label" for="post_title">port</label>
        <input type="text" class="text_field" name="ldap[port]" id="ldapport" />

        <label class="label" for="post_title">dn</label>
        <input type="text" class="text_field" name="ldap[dn]" id="ldapdn" />

        <label class="label" for="post_title">domain</label>
        <input type="text" class="text_field" name="ldap[domain]" id="ldapdomain" />
      </div>

      <div class="group navform" style="padding-top:20px">
        <input type="submit" class="button" value="Test Ldap connection" />
      </div>
    </form>
  </div>
<?
}

function third_step_help(){
  ?>
    <h4><b>Step 3: Configure taolin settings</b></h4>
    <p>Configure this installation of taolin editing this settings.</p>
  <?
}
?>
