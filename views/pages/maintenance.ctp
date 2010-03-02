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
    
    $appname = $conf->get('Site.name');
    $contactus = $conf->get('Site.admin');
?>
<link rel='StyleSheet' href='<?php echo $this->base ?>/css/accounts/custom.css' />

<div style="margin: 100px auto;">
    <div style="text-align:center;">
       <h2><?php echo $appname ?> is currently down for maintenance! We'll be back soon!</h2>
       <br />
        <div>For any questions feel free to send us an e-mail to <b><?php echo $contactus ?></b></div>
    </div>
</div

