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
<?php
    $appname = $conf->get('Site.name');
    $contactus = $conf->get('Site.admin');
?>

<div>

<h1>This is the last step of our welcome wizard!</h1>

<p class="policy">
The wizard is almost over and you are ready to start using <?php echo $appname?>. Just click on the 'Finish' button below to start.
</p>

<p class="policy">
If you are the administrator and you want to customize this page, simply edit the file privacy_policy.ctp in the directory views/pages/
<br/>
You can read the manual of Taolin at <a href="http://taolin.fbk.eu" target="blank">taolin.fbk.eu</a>
</p>

<p class="policy">
If you are a user of the system you might tell the system administrators to customize this page. You can contact the system administrators at <?php echo $contactus?> 
</p>

</div>
