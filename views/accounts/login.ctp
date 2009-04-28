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
<link rel='StyleSheet' href='<?php echo $this->base ?>/css/accounts/custom.css' />

<script type="text/javascript">
function init() {
    document.login_form.campouser.focus();
}
window.onload = init;
</script>
<?php
$appname = Configure::read('App.name');
?>

<div>
 <img src="<?php echo Configure::read('App.logo.url'); ?>" alt="logo" />
</div>
<br/>
<div class="login-column">
<p> Welcome in <?php echo $appname?>!</p>
<p>
If you are a Champion, please enter your FBK username and password in the form below.
</p>
<p>
If you are not a Champion, please read the rest of the page.
</p>

<?php echo $javascript->link('portal/function.js'); ?>
<?php //echo $javascript->link('portal/login.js'); ?>
          <div style="width: 300px;" id="login_form" class=
          "x-panel x-form-label-left">
            <div class="x-panel-tl">
              <div class="x-panel-tr">
                <div class="x-panel-tc">
                  <div style="-moz-user-select: none;" id=
                  "ext-gen17" class=
                  "x-panel-header x-unselectable">
                    <span id="ext-gen38" class=
                    "x-panel-header-text">Login</span>
                  </div>
                </div>
              </div>
            </div>

            <div id="ext-gen18" class="x-panel-bwrap">
              <div class="x-panel-ml">
                <div class="x-panel-mr">
                  <div class="x-panel-mc">
                    <form style=
                    "padding: 20px 0px 0px; width: 288px; height: 57px;"
                    class="x-panel-body x-form" method="post" id=
                    "ext-gen16" name="login_form" action="accounts/checkuser">
                      <div class="x-form-item" tabindex="-1">
                        <label for="campouser" style=
                        "width: 100px;" class=
                        "x-form-item-label">Username:</label>

                        <div class="x-form-element" id=
                        "x-form-el-campouser" style=
                        "padding-left: 105px;">
                          <input class=
                          "x-form-text x-form-field x-form-focus"
                          size="20" autocomplete="on" id=
                          "campouser" name="username" type=
                          "text" onkeypress="return maybePerformLogin(event)"/>
                        </div>

                        <div class="x-form-clear-left"></div>
                      </div>

                      <div class="x-form-item" tabindex="-1">
                        <label for="campopass" style=
                        "width: 100px;" class=
                        "x-form-item-label">Password:</label>

                        <div class="x-form-element" id=
                        "x-form-el-campopass" style=
                        "padding-left: 105px;">
                          <input class="x-form-text x-form-field"
                          size="20" autocomplete="on" id=
                          "campopass" name="password" type=
                          "password" onkeypress="return maybePerformLogin(event)"/>
                        </div>

                        <div class="x-form-clear-left"></div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div class="x-panel-bl">
                <div class="x-panel-br">
                  <div class="x-panel-bc">
                    <div id="ext-gen19" class="x-panel-footer">
                      <div class="x-panel-btns-ct">
                        <div class=
                        "x-panel-btns x-panel-btns-center">
                          <em unselectable=
                          "on"><button id="ext-gen23"
                          class="x-btn-text" type=
                          "button" onclick="performLogin()"><em unselectable=
                          "on">Login</em></button></em>

                          <div class="x-clear"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
</div>
</div>

<div class="faq">
<?php echo $this->renderElement('faq_account_page'); ?>
</div>

