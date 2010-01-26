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

/* Retrieves portal configuration as:
 * - img path
 * - contact email
 * - jabber server and domain
 */
Ext.onReady(function(){
    setPortalConfiguration(application_init);
});

Ext.BLANK_IMAGE_URL = 'extjs/resources/images/default/s.gif';

//Ext.onReady(
function application_init(){

    Ext.QuickTips.init();
    
    /* 
     * qtip intercepts tooltip
     */
    
    var qtip = Ext.QuickTips.getQuickTip();
    qtip.interceptTitles = true;

    eventManager = new Ext.ux.fbk.sonet.EventManager({
        name: "taolin-event-manager"
        ,events: {
            addcomment: true
            ,removecomment: true
            ,newtimelineevent: true
            ,userphotochange: true
        }
        ,listeners:{
            addcomment: function(){
                this.fireEvent('newtimelineevent');
            }
            ,removecomment: function(){
                this.fireEvent('newtimelineevent');
            }
        }
    });

    /*
     * Themes for Taolin gui
     */
    
    /*var themeData = new Ext.data.SimpleStore({
        fields: ['display', 'value'],
        data: [
            ['(Default) Slate', 'ext-themes/css/xtheme-slate.css'],
            ['Slickness', 'ext-themes/css/xtheme-slickness.css'],
            ['Gray', 'ext-themes/css/xtheme-gray.css'],
            ['Blue', ''], 
            ['Galdaka', 'ext-themes/css/xtheme-galdaka.css'],
            ['Purple', 'ext-themes/css/xtheme-purple.css'],
	        ['Indigo','ext-themes/css/xtheme-indigo.css'],
	        ['Midnight','ext-themes/css/xtheme-midnight.css'],
	        ['Silver Cherry','ext-themes/css/xtheme-silverCherry.css']
        ]
      });

    comboTheme = new Ext.form.ComboBox({
        store: themeData,
        displayField:'display',
        typeAhead: true, mode: 'local', 
        triggerAction: 'all', 
        selectOnFocus:true, 
        resizable:false, 
        listWidth: 130, 
        width: 130, 
        editable: false,
        valueField: 'value', 
        value: 'ext-themes/css/xtheme-slate.css',
        lazyRender:true,
        lazyInit:true,
        title: 'Select the theme:'
    }); 
      
    comboTheme.on('select', 
        function(combo){
            Ext.util.CSS.swapStyleSheet('theme', combo.getValue()); 
        }
        , this);
    */
    
    window.config.num_columns = 2;
    var columns = new Array();
    for(var i=0; i< window.config.num_columns; i++){
        columns.push({
                columnWidth:1/window.config.num_columns,
                style:'padding:20px 10px 20px 10px'
        });
    }
   
    // preparing text for Did you know messages
    var aDyk = ['Did you know that you can <span class="right-element" style="float:none;position:relative;padding:0;"><span class="a add_widgets" onclick="openAddWidgetsModalWindow()"><b>Add widgets</b></span></span>? <span class="right-element" style="float:none;position:relative;padding:0;"><span class="a add_widgets" onclick="openAddWidgetsModalWindow()"><b>Add widgets</b></a></span>.',
        'Did you know that you can <span class="a" onclick="expandSettingsPanel()">Edit your profile</span>? <span class="a" onclick="expandSettingsPanel()">Edit your profile</span>.',
        'Did you know that you can expand fullscreen widgets clicking on <img width=20px height=1px src="'+Ext.BLANK_IMAGE_URL+'" class="x-tool x-tool-maximize" style="vertical-align:bottom;float:none;cursor:default;"/>? ',
        'Did you know that you can configure a widget clicking on <img width=20px height=1px src="'+Ext.BLANK_IMAGE_URL+'" class="x-tool x-tool-gear" style="vertical-align:bottom;float:none;cursor:default;"/>? ',
        'Did you know that you can minimize your widget clicking on <img width=20px height=1px src="'+Ext.BLANK_IMAGE_URL+'" class="x-tool x-tool-toggle" style="vertical-align:bottom;float:none;cursor:default;"/>? ',
        'Did you know that you can remove a widget clicking on <img width=20px height=1px src="'+Ext.BLANK_IMAGE_URL+'" class="x-tool x-tool-close" style="vertical-align:bottom;float:none;cursor:default;"/>? ',
        'Did you know that you can move widgets dragging the title bar?',
        'Did you know that you can edit your photos and add a new one? <span class="a" onclick="openImageChooser()">Edit your photo</span>.',
        'Did you know that you can set taolin as your homepage? Read <a href="./pages/make_homepage_help" target="_blank">the instructions</a>!',
        'Did you know that you can view other people photos gallery by clicking on one of their photos?',
        'Did you know that there is a <a href="./pages/privacy_policy" target="_blank">privacy policy</a> about how your data are used? <a href="./pages/privacy_policy" target="_blank">Read the privacy policy</a>!',
        'Did you know that you can edit your workplace and view other\'s on a  map? <span class="a" onclick="(new Ext.ux.fbk.sonet.MapWindow({logparams: {source: \'did you know\', user_id:\'\'}})).show()">Edit!</span>',
        'Did you know that you can suggest a colleague of yours as new champion on her/his profile?'
    ];
    var dyk = aDyk[Math.floor(Math.random()*aDyk.length)]; // pick a random string out of aDyk

    /*
     * Main menu:
     *  use .header class only for top-level menu voices
     */ 

    var main_menu;

    if(!Ext.isIE6 && !Ext.isIE7)
        main_menu =
            '<ul class="dd-menu">' +
                '<li class="header"><span class="a menu-item">Personal profile</span>' +
                    '<ul>' +
                        '<li><span class="a menu-item" onclick="showUserInfo(null, null, &#39;{&quot;source&quot;: &quot;logout_div&quot;}&#39;)"><span class="sprited user-icon">View your profile</span></span></li>' + 
                        '<li><span class="a menu-item" onclick="expandSettingsPanel()"><span class="sprited user-edit">Edit your profile</span></span></li>' + 
                        '<li><span class="a menu-item" onclick="openImageChooser()"><span class="sprited image-edit">Edit your photos</span></span></li>' + 
                        '<li><span class="a menu-item" onclick="new Ext.ux.fbk.sonet.MapWindow().show()"><span class="sprited map-edit">Edit your workplace position</span></span></li>' + 
                     '</ul>' +
                '</li>' + 
                '<li class="header"><span class="a menu-item">Tools</span>' +
                    '<ul>' +
                        '<li><span class="menu-item a add_widgets" onclick="openAddWidgetsModalWindow()">Add widgets</span></li>' +
                        '<li><span class="a menu-item" onclick="addOrBounceWidget(&#39;Ext.ux.fbk.sonet.MetaSearch&#39;,&#39;string_identifier&#39;,&#39;{&quot;source&quot;: &quot;logout_div&quot;}&#39;)"><span class="sprited search">Search</span></span></li>' + 
                        '<li><span class="a menu-item" onclick="new Ext.ux.fbk.sonet.MapWindow().show()">Map of colleagues workplaces</span></li>' + 
                        '<li><span class="a menu-item" onclick="new PhotoUploader()">Photo uploader</a></li>' + 
                        '<li><span class="a menu-item" onclick="new SendToWindow()"><span class="sprited email">Send an email</span></span></li>' + 
                    '</ul>' +
                '</li>' +
                '<li class="header"><a class="menu-item" href="./wiki" target="_blank">FBK Wiki</a></li>' +
                '<li class="header"><span class="a menu-item" onclick="showMainTimeline()">Timeline</span></li>' +
                '<li class="header"><span class="a menu-item">Info</span>' +
                    '<ul>' +
                        '<li><a class="menu-item" href="./pages/help" target="_blank">FAQ - Help</a></li>' +
                        '<li><a class="menu-item" href="./pages/privacy_policy" target="_blank">Privacy policy</a></li>' +
                    '</ul>' +
                '</li>' +
                '<li class="header"><span class="a menu-item">' + window.config.appname + '</span>' +
                    '<ul>' +
                        /* This software is open source released under aGPL. See http://www.fsf.org/licensing/licenses/agpl-3.0.html for more details. According to the license, you must place in every Web page served by Taolin a link where your user can download the source code. So, please, don't remove this link, you can move it in another part of the web page, though. */
                        '<li><a class="menu-item" href="http://github.com/vad/taolin" target="_blank">Download the code</a></li>' +
                        //'<li><a class="menu-item" href="http://github.com/vad/taolin/issues" target="_blank">Report an issue</a></li>' +
                    '</ul>' +
                '</li>' +
                '<li class="header last"><a class="menu-item" href="./accounts/logout" onclick="jabber.quit()">Logout</a></li>' + 
            '</ul>';
    else // Simplified version for old, stupidunsupported browsers
        main_menu = 
            '<ul class="dd-menu">' +
                '<li class="header"><span class="a menu-item" onclick="showUserInfo(null, null, &#39;{&quot;source&quot;: &quot;logout_div&quot;}&#39;)">Personal profile</span></li>' + 
                '<li class="header"><span class="menu-item a add_widgets" onclick="openAddWidgetsModalWindow()">Add widgets</span></li>' +
                '<li class="header"><a class="menu-item" href="./wiki" target="_blank">FBK Wiki</a></li>' +
                '<li class="header"><span class="a menu-item" onclick="showMainTimeline()">Timeline</span></li>' +
                '<li class="header"><a class="menu-item" href="./pages/help" target="_blank">FAQ - Help</a></li>' +
                '<li class="header"><a class="menu-item" href="./pages/privacy_policy" target="_blank">Privacy policy</a></li>' +
                /* This software is open source released under aGPL. See http://www.fsf.org/licensing/licenses/agpl-3.0.html for more details. According to the license, you must place in every Web page served by Taolin a link where your user can download the source code. So, please, don't remove this link, you can move it in another part of the web page, though. */
                '<li class="header"><a class="menu-item" href="http://github.com/vad/taolin" target="_blank">Download the code</a>' +
                '<li class="header last"><a class="menu-item" href="./accounts/logout" onclick="jabber.quit()">Logout</a></li>' + 
            '</ul>';

    /** 
     * HTML shown in the northern part of the viewport.
     * It contains:
     * - FBK logo
     * - logout menu
     * - "Did you know?" questions
     */
    
    var clear_html = 
        '<div id="logout_div" class="right-element">'
            //+ '<span id="exttheme" style="float:left;padding-right:5px;"></span> | '
            + main_menu
        + '</div>'
        + '<div class="left-element">'
            + '<img src="'+window.config.logo+'" qtip="taolin logo" style="padding-left:10px"/>'
        + '</div>'
        + '<div id="didyouknow_div" style="'+(Math.random() > 0.3?'display:none;':'')+'"><span id="didyouknow_span"><table class="border_radius_5px"><tr><td style="padding:0 10px;">'+dyk+' <span class="a" onclick="$(\'#didyouknow_div\').hide();" style="margin-left:10px;font-size:x-small;">[close this message]</span></td></tr></table></span></div>';

    window.viewport = new Ext.Viewport({
        layout:'border',
        items:[{
            region:'north',
            id: 'north-panel',
            border: false,
            height: 50,
            style: 'z-index:1',
            items:[{
                html: clear_html
                ,border: false
            }]
        },{
            xtype:'portal',
            region:'center',
            id:'portal_central',
            margins:'5 5 5 0',
            cls:'desktop',
            bodyStyle: 'padding:0 10px',
            style: 'z-index:0;',
            /* Here we define three different column for our portal. If you change the number of
             * the column please check the database for any inconsistency
             */
            items: columns,
            // Setting desktop background
            listeners:{
                afterlayout: function(){
                    $('.desktop .x-column-layout-ct').css('background','transparent url('+window.config.background+') repeat scroll 50% 50%');
                }
            }
        }, westPanel]
    });   

    /* These functions are invoked when the page is loaded.
     * getWidgetsPosition retrieves user's widgets and their position
     * showUserInfo(null, true) fill western-panel
     */
    getWidgetsPosition();

    // render comboTheme
    /*comboTheme.render(Ext.get('exttheme'));
    */

    /* Check if there's a valid session */
    var task = {
        run: function(){
            Ext.Ajax.request({
                url : 'accounts/issessionup',
                method: 'GET',
                success: function ( result, request ) {
                    var valid = Ext.util.JSON.decode(result.responseText);
                    
                    if (!valid){
                        window.location.reload(false);
                    }
                }
           });
        },
        interval: 300000 //5 minutes
    };
    Ext.TaskMgr.start(task);

    showFirstLoginWizard(); // check if first login wizard should be opened or not
    
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({remove:true});
    }, 2000);

    /** 
     * Menu 
     */
   
    // Styling: add an image (an arrow) at the end of each menu voice that has a sub-menu
    $('.dd-menu .header:has(ul)').each(function(idx, element){
        $(this).find('.a:first').append('<img class="arrow" style="vertical-align:top;" src="js/portal/shared/icons/fam/bullet_arrow_down.png">');
    });

    // Adding hover
    $('.dd-menu .header:has(ul)').hover(
        function(){
            $(this).find('ul').css({visibility: 'visible'});
            $(this).find('img.arrow').attr('src','js/portal/shared/icons/fam/bullet_arrow_up.png');
        },function(){
            $(this).find('ul').css({visibility: 'hidden'});
            $(this).find('img.arrow').attr('src','js/portal/shared/icons/fam/bullet_arrow_down.png');
        }
    );
}

/*
   soundManager.onload = function(){
    //beep = soundManager.createSound('beep', 'sound/38868__M_RED__clock_tic.mp3');
    //trombone = soundManager.createSound('trombone', 'sound/sad_trombone.mp3');
};
*/
