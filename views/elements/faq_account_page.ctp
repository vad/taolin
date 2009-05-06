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

<p class="question">
What is <?php echo $appname?>?
</p>
<p class="answer">
It is an internal web platform whose goal is to increase the collaboration and knowledge sharing inside FBK.
</p>
<p class="question">
Really? I would love to try it. What should I do?
</p>
<p class="answer">
At the moment, <?php echo $appname?> is under testing with a small number of Champions, colleagues who volunteered in order to help us improve the application.
</p>
<p class="question">
Ah ok, then I would really like to be a Champion!
</p>
<p class="answer">
We're glad you do and thanks! ;) <br/>
If you would like to help us in testing the system, provide feedback and give suggestion about new features, please, do send an email to <a href="mailto:<?php echo $contactus; ?>"> <?php echo $contactus;?></a> saying you want to be a Champion! We will reply in few minutes. 
</p>
<p class="question">
Who is working on <?php echo $appname?>?
</p>
<p class="answer">
Happy you asked! The answer is "the Sonet group", you can find info about the Sonet group on the <a href="http://sonet.fbk.eu">project Web page</a>. 
</p>
