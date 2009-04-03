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
$appname = Configure::read('App.name');
$appurl = Configure::read('App.url');
?>

<a name="top"></a>

<div class="questions-list">
<ul>
    <li class="faq-question-link" id="faq-question-homepage">
        <a href="#top">
        How can I make <?php echo $appname?> my homepage (the default Web page loaded by the browser at startup)?
	    </a>
    </li>
</ul>
</div>

<div class="faq-aq-desktop">
    <p>
	Here are some simple <b>guidelines</b> about how to set yourself up so that every time you open your browser you automatically start with <?php echo $appname?> 
    </p>

	<hr/>
	<br/><br/>

	<p>
	THE <b>EASIEST WAY</b> is: 
	<ol>
	<li>Drag the FBK home icon in this panel and drop it onto the house icon in the tool bar for the browser</li>
	<li>Select <i>Yes</i> from the popup window and you are done!</li>
	</ol>
	</p>

	<br/><br/>
	<hr/>
	<br/><br/>

    <p>
	If you have problem with the previous way, try the following ones!
	<br/>

	Select your browser from the list below and follow the step by step instructions:
	<br/>
	<ul>
		<li><a href="#1"> Microsoft Internet Explorer 6.x (Windows)</a></li>
		<li><a href="#2"> Microsoft Internet Explorer 7.x (Windows)</a></li>
		<li><a href="#3"> Mozilla Firefox</a></li>
		<!-- <li><a href="#4"> Microsoft Internet Explorer 4.x / 5.x (Windows)</a></li>
		<li><a href="#5"> Netscape Navigator 6.x</a></li>
		<li><a href="#6"> Netscape Navigator 7.x</a></li> -->
		<li><a href="#7"> Opera</a></li>
		<!-- <li><a href="#8"> AOL</a></li> -->
		<li><a href="#9"> Safari</a></li>
	</ul>
	<br><br><br><br>
     	<p>
	<a name=1></a>
	<B>Microsoft Internet Explorer 6.x (Windows)</B>
		<p>To make <?php echo $appname?> your home page, follow these simple steps: <br>
			<big><blockquote> 
			<br>1.	Go to 'Tools' on the standard toolbar above the screen. Click on 'Tools' to see a pull-down menu.
			<br>2.	Click on "Internet Options".
			<br>3.	Click the 'General' tab
			<br>4.	Type or paste <?php echo $appurl ?> into the address box.
			<br>5.	Click 'OK' and <?php echo $appname?> will be your home page.
			</blockquote></big>
		<p> 
<object width="425" height="344"><param name="movie" value="http://www.youtube.com/v/WkWY81ybrLE&hl=en&fs=1"></param><param name="allowFullScreen" value="true"></param><embed src="http://www.youtube.com/v/WkWY81ybrLE&hl=en&fs=1" type="application/x-shockwave-flash" allowfullscreen="true" width="425" height="344"></embed></object>
		</p>
	</p>

	<br>
	<p><a name=2></a>
	<b> Microsoft Internet Explorer 7.x (Windows)</b>
		<p>To make <?php echo $appname?> your home page, follow these simple steps: <br>
			<big><blockquote> 
			<br>1.	Go to 'Tools' - linked with a 'cog' icon at the right hand end of the bottom row of tool bars. Click on 'Tools' to see a pull-down menu.
			<br>2.	Click on "Internet Option".
			<br>3.	Click the 'General' tab
			<br>4.	Type or paste <?php echo $appurl ?> into the address box.
			<br>5.	Click 'OK' and <?php echo $appname?> will be your home page. 
			</blockquote></big>
		<p> 
<object width="425" height="344"><param name="movie" value="http://www.youtube.com/v/e83VlAT1d5w&hl=en&fs=1"></param><param name="allowFullScreen" value="true"></param><embed src="http://www.youtube.com/v/e83VlAT1d5w&hl=en&fs=1" type="application/x-shockwave-flash" allowfullscreen="true" width="425" height="344"></embed></object>
		</p>
	</p>
	
	<br>
	<p><a name=3></a>
	<B>Mozilla Firefox</B>
		<p>To make <?php echo $appname?> your home page, follow these simple steps: <br>
			<big><blockquote> 
			<br>1.	Go to the 'Tools' menu on the standard toolbar above the screen, choose 'Options' 
			<br>2.	Click on the 'General' tab 
			<br>3.	In the area called "Home Page", type or paste <?php echo $appurl ?> into the Location box
			<br>4.	Click 'OK' and <?php echo $appname?> will be your home page.
			</blockquote></big>
		<p> 
<object width="425" height="344"><param name="movie" value="http://www.youtube.com/v/UjOAzg1rGpE&hl=en&fs=1"></param><param name="allowFullScreen" value="true"></param><embed src="http://www.youtube.com/v/UjOAzg1rGpE&hl=en&fs=1" type="application/x-shockwave-flash" allowfullscreen="true" width="425" height="344"></embed></object>
		</p>
	</p>

<!--	
	<p><a name=4></a><B>Microsoft Internet Explorer 4.x / 5.x (Windows)</B><p>To make <?php echo $appname?> your home page, follow these simple steps: <br><big><blockquote> <br>1.	Go to 'View' on the standard toolbar above the screen. Click on 'View' to see a pull-down menu. <br>2.	Click on ‘Internet Options’. <br>3.	Click the 'General' tab <br>4.	Type or paste http://www.Scoop.co.nz into the address box. <br>5.	Click 'OK' and Scoop will be your home page.</blockquote></big><p><a name=5></a><B>Netscape Navigator 6.x</B><p>To make <?php echo $appname?> your home page, follow these simple steps: <br><big><blockquote> <br>1.	Go to the 'Edit' menu on the standard toolbar above the screen, choose 'Preferences' <br>2.	Click on the 'Navigator' tab <br>3.	Under 'Navigator' starts with, select Home page <br>4.	Type or paste http://www.Scoop.co.nz into the address box. <br>5.	Click 'OK' and Scoop will be your home page.</blockquote></big> <p><a name=6></a><B>Netscape Navigator 7.x</B><p>To make <?php echo $appname?> your home page, follow these simple steps: <br><big><blockquote> <br>1.	Go to the 'Edit' menu on the standard toolbar above the screen, choose 'Preferences' <br>2.	Click on the 'Navigator' tab <br>3.	Under ‘Display on Navigator Startup’, select Home page <br>4.	Type or paste http://www.Scoop.co.nz into the address box. <br>5.	Click 'OK' and Scoop will be your home page.</blockquote></big> 
-->

	<br>
	<p><a name=7></a>
	<B>Opera</B>
		<p>To make <?php echo $appname?> your home page, follow these simple steps: <br>
			<big><blockquote> 
			<br>1.	Go to 'Tools' on the standard toolbar above the screen. Click on 'Tools' to see a pulldown menu. 
			<br>2.	Click on Preferences.' 
			<br>3.	Click the 'General' tab 
			<br>4.	Type or paste <?php echo $appurl ?> into the Home page box.
			<br>5.	Click 'OK' and <?php echo $appname?> will be your home page.
			</blockquote></big>
		<p> 

		</p>
	</p>

<!--
	<p><a name=8></a><B>AOL</B><p>To make <?php echo $appname?> your home page, follow these simple steps: <br><big><blockquote> <br>1.	At the top of your AOL window, click on ‘My AOL’ & select ‘Preferences’. (Older versions, click on ‘Members’ & select ‘Preferences’).<br>2.	Click on the "WWW" icon.<br>3.	Under 'Home Page', next to address, type or paste http://www.Scoop.co.nz.<br>4.	Click 'OK' and Scoop will be your home page.</blockquote></big>
-->

	<br>
	<p><a name=9></a>
	<B>Safari</B>
		<p>To make <?php echo $appname?> your home page, follow these simple steps: <br>
			<big><blockquote> 
			<br>1.	Go to 'Safari' on the standard toolbar above the screen. Click on 'Safari' to see a pulldown menu. 
			<br>2.	Click on Preferences.
			<br>3.	Choose "General"’ from the icons across the top of the popup window
			<br>4.	Type or paste <?php echo $appurl ?> into the Home page box.
			<br>5.	Click 'OK' and <?php echo $appname?> will be your home page.
			</blockquote></big>
		<p> 
	</p>

    </p>
</div>
