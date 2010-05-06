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
<style type="text/css">
#loading-mask{
    position:absolute;
    left:0;
    top:0;
    width:100%;
    height:100%;
    z-index:20000;
    background-color:white;
}
#loading{
    position:absolute;
    left:45%;
    top:40%;
    padding:2px;
    z-index:20001;
    height:auto;
}
#loading a {
    color:#225588;
}
#loading .loading-indicator{
    background:white;
    color:#444;
    font:bold 13px tahoma,arial,helvetica;
    padding:10px;
    margin:0;
    height:auto;
}
#loading-msg {
    font: normal 10px arial,tahoma,sans-serif;
}
</style>

<div id="loading-mask" style=""></div>
<div id="loading">
    <div class="loading-indicator"><img src="img/extanim32.gif" width="32" height="32" style="margin-right:8px;float:left;vertical-align:top;"/>
        <?= "$title_for_layout ".$conf->get('Site.version') ?> 
        <br />
        <span id="loading-msg">Loading styles and images...</span>
    </div>
</div>

<?php
if ($isdebugactive >= 1) {
    echo $html->css('/css/portal/portal.css');
    echo $html->css('/css/portal/menu.css');
    echo $html->css('/css/portal/widget-sprite.css');
    echo $html->css('/css/portal/custom.css');
    echo $html->css('/css/portal/file-upload.css');
    echo $html->css('/css/portal/colorpicker.css');
    echo $html->css('/css/portal/Ext.ux.IconCombo.css');
    echo $html->css('/js/portal/usr/Multiselect/Multiselect.css');

    // WIZARD WINDOW
    echo $html->css('/css/portal/Ext.ux.Wizard.css');

    echo $html->scriptBlock("document.getElementById('loading-msg').innerHTML = 'Loading Core API...'", array(
        'safe' => false
    ));

    ## flush the buffers
    flush();

    echo $html->script(array(
        'portal/override.js',
        'jquery/jquery.imagetool.js',
        'jquery/jquery.highlight-3.yui.js',
        'jquery/jquery-ui-1.7.2.custom.min.js',
        'jquery/jquery.timeago.js',
        'jquery/jquery.oembed.js',
        'jquery/jplayer/jquery.jplayer.min.js',

        'portal/usr/FileUploadField.js',

        'portal/tools.js',

        'portal/function.js',
        'portal/application.js',

        'portal/usr/RowExpander.js',
        'portal/usr/Portal.js',
        'portal/usr/PortalColumn.js',
        'portal/usr/colorpicker.js',
        'portal/usr/colorpickerfield.js',
        'portal/usr/Portlet.js',
        'portal/usr/SearchField.js',
        'portal/usr/Ext.ux.IconCombo.js',
        'portal/usr/Ext.DataView.LabelEditor.js',
        'portal/usr/Multiselect/DDView.js',
        'portal/usr/Multiselect/Multiselect.js',

        'portal/usr/Ext.ux.fbk.sonet.EventManager.js',
        /* WIZARD WINDOW */

        'portal/usr/Ext.ux.WizardHeader.js',
        'portal/usr/Ext.ux.BasicWizard.js',
        'portal/usr/Ext.ux.SlickCardLayout.js',

        /* END WIZARD WINDOW */
        'portal/wizard_settings.js',

        'portal/widget/htmlincluder.js',
        'portal/widget/users.js',
        'portal/widget/events.js',
        'portal/widget/searchusers.js',
        'portal/widget/searchwiki.js',
        'portal/widget/searchpublik.js',
        'portal/widget/feedback.js',
        'portal/widget/feedreader.js',
        'portal/widget/groups.js',
        'portal/widget/iframer.js',
        'portal/widget/note.js',
        'portal/widget/google.js',
        'portal/widget/math.js',
        'portal/widget/nevede.js',
        'portal/widget/board.js',
        'portal/widget/metasearch.js',
        'portal/widget/webcamcanteen.js',
        'portal/widget/meteotrentino.js',

        '/fbk/js/gestint.js',
        '/fbk/js/childrenevent.js',

        'strophejs/strophe.js',
        'portal/jabber.js',
        'portal/jabberui.js',

        'portal/widget/buddylist.js',

        'portal/Timeline.js',
        'portal/UserPublications.js',
        'portal/UserPhotos.js',
        'portal/UserProfile.js',
        'portal/UserEditProfile.js',
        'portal/settings.js',
        'portal/westpanel.js',

        'portal/window/AddWidgetsWindow.js',
        'portal/window/ChatWindow.js',
        'portal/window/CommentWindow.js',
        'portal/window/GroupDetails.js',
        'portal/window/MapWindow.js',
        'portal/window/PhotoChooser.js',
        'portal/window/PhotoUploader.js',
        'portal/window/SendToWindow.js',
        'portal/window/FirstLogin.js',
        'portal/window/ListHistory.js',
        'portal/window/ChatHistory.js'
    ));

} else {
    echo $html->css('/css/portal/application-all.css');

    echo $html->scriptBlock("document.getElementById('loading-msg').innerHTML = 'Loading Core API...'", array(
        'safe' => false
    ));

    ## flush the buffers
    flush();
    echo $html->script('application-all.js');
}

echo $html->script('http://www.google.com/jsapi?key=ABQIAAAAtll_c0IGkNAlp32iILQBxRTd0VjkC_00ZWjQD0rjYXEbT9OQ-RTUuv3bkIlJukEgAnOkNwab-7NEew');

echo $html->scriptBlock("document.getElementById('loading-msg').innerHTML = 'Initializing...'", array(
    'safe' => false
));
?>

<div id="jplayer"></div>
