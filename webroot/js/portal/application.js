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
    

Ext.BLANK_IMAGE_URL = 'ext/resources/images/default/s.gif';

Ext.onReady(function(){

    Ext.QuickTips.init();
    
    /* 
     * qtip intercepts tooltip
     */
    
    var qtip = Ext.QuickTips.getQuickTip();
    qtip.interceptTitles = true;
  
    /*
     * Themes for Taolin gui
     */
    
    var themeData = new Ext.data.SimpleStore({
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
	        ['Silver Cherry','ext-themes/css/xtheme-silverCherry.css']/*,
            ['Vista', 'ext-themes/css/xtheme-vista.css'],
            ['Aero', 'ext-themes/css/xtheme-aero.css']*/
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

    
    var numColumns = 3;
        var columns = new Array();
    for(var i=0; i< numColumns; i++){
        columns.push({
                columnWidth:1/numColumns,
                style:'padding:20px 10px 20px 10px'
            });
    }
   
    // preparing text for Did you know messages
    var aDyk = ['Did you know that you can <span class="add_widgets right-element" style="float:none;position:relative;padding:0;"><a href="javascript:openAddWidgetsModalWindow()">Add widgets</a></span>? <span class="add_widgets right-element" style="float:none;position:relative;padding:0;"><a href="javascript:void(0)" onclick="openAddWidgetsModalWindow()">Add widgets</a></span>.',
        'Did you know that you can <a href="javascript:expandSettingsPanel()">Edit your profile</a>? <a href="javascript:expandSettingsPanel()">Edit your profile</a>.',
        'Did you know that you can expand fullscreen widgets clicking on <img width=20px height=1px src="ext/resources/images/default/s.gif" class="x-tool x-tool-maximize" style="vertical-align:bottom;float:none;cursor:default;"/>? ',
        'Did you know that you can configure a widget clicking on <img width=20px height=1px src="ext/resources/images/default/s.gif" class="x-tool x-tool-gear" style="vertical-align:bottom;float:none;cursor:default;"/>? ',
        'Did you know that you can minimize your widget clicking on <img width=20px height=1px src="ext/resources/images/default/s.gif" class="x-tool x-tool-toggle" style="vertical-align:bottom;float:none;cursor:default;"/>? ',
        'Did you know that you can remove a widget clicking on <img width=20px height=1px src="ext/resources/images/default/s.gif" class="x-tool x-tool-close" style="vertical-align:bottom;float:none;cursor:default;"/>? ',
        'Did you know that you can move widgets dragging the title bar?',
        'Did you know that you can edit your photos and add a new one? <a href="javascript:void(0)" onclick="openImageChooser()">Edit your photo</a>.',
        'Did you know that you can set taolin as your homepage? Read <a href="./pages/make_homepage_help" target="_blank">the instructions</a>!',
        'Did you know that you can view other people photos gallery by clicking on one of their photos?',
        'Did you know that there is a <a href="./pages/privacy_policy" target="_blank">privacy policy</a> about how your data are used? <a href="./pages/privacy_policy" target="_blank">Read the privacy policy</a>!',
        'Did you know that you can edit your workplace and view other\'s on a  map? <a href="javascript:void(0)" onclick="(new Ext.ux.fbk.sonet.MapWindow({logparams: \'' + Ext.util.Format.htmlEncode('{"source": "did you know", "user_id":""}') + '\'})).show()">Edit!</a>',
        'Did you know that you can suggest a colleague of yours as new champion on her/his profile?',
    ];
    var dyk = aDyk[Math.floor(Math.random()*aDyk.length)]; // pick a random string out of aDyk

    /* 
     * HTML shown in the northern part of the viewport.
     * It contains:
     * - FBK logo
     * - logout menu
     * - "Did you know?" questions
     */
    var clear_html = 
        '<div id="logout_div" class="right-element">'
            + '<span id="exttheme" style="float:left;padding-right:5px;"></span> | '
            + '<span id="logged_as_username"></span> '
            + '(<a href="javascript:void(0)" onclick="expandSettingsPanel()">edit profile</a>) | '
            + '<span class="add_widgets"><a href="javascript:void(0)" onclick="openAddWidgetsModalWindow()">Add widgets</a></span> | '
            + '<a href="./pages/make_homepage_help" title="1. Drag the FBK home icon in the web address bat and drop it onto the house icon in the tool bar for the browser<br/>2. Select <i>Yes</i> from the popup window and you are done!" target="_blank">Make it your homepage!</a> | '
            + '<img src="js/portal/shared/icons/fam/new.png"/> <a href="./pages/privacy_policy" class="new-item" target="_blank">Privacy policy</a> | '
            + '<a href="./pages/help" target="_blank">Help</a> | '
            //+ ,'<!-- <?php echo $html->link(\'Help link (with helper, target?)\',\'/help\') ?> |-->'
            //+ '<img src="js/portal/shared/icons/fam/magnifier.png" style="cursor:pointer" onclick="$(\'#searchwidget_div\').toggle()" /> | '
            + '<a href="./accounts/logout" onclick="jabber.quit()">Logout</a>'
        + '</div>'
        + '<div class="left-element">'
            + '<img src="img/reflectedDesktopLogo.png" qtip="taolin logo" />'
        + '</div>'
        + '<div id="didyouknow_div"><span id="didyouknow_span"><table><tr><td style="padding:0 10px;'+(Math.random() > 0.3?'display:none;':'')+'">'+dyk+' <a href="javascript:void(0)" onclick="$(\'#didyouknow_span\').toggle();" style="margin-left:10px;font-size:xx-small;">[Hide this message]</a></td></tr></table></span></div>';

    // Menus can be prebuilt and passed by reference
    var dateMenu = new Ext.menu.DateMenu({
        handler : function(dp, date){
            Ext.example.msg('Date Selected', 'You chose {0}.', date.format('M j, Y'));
        }
    });

    var colorMenu = new Ext.menu.ColorMenu({
        handler : function(cm, color){
            Ext.example.msg('Color Selected', 'You chose {0}.', color);
        }
    });

    var menuMain = new Ext.menu.Menu({
        id: 'menuMain',
        items: [
            {
                text: 'I like Ext',
                checked: true,       // when checked has a boolean value, it is assumed to be a CheckItem
                checkHandler: onItemCheck
            },
            {
                text: 'Ext for jQuery',
                checked: true,
                checkHandler: onItemCheck
            },
            {
                text: 'I donated!',
                checked:false,
                checkHandler: onItemCheck
            }, '-', {
                text: 'Radio Options',
                menu: {        // <-- submenu by nested config object
                    items: [
                        // stick any markup in a menu
                        '<b class="menu-title">Choose a Theme</b>',
                        {
                            text: 'Aero Glass',
                            checked: true,
                            group: 'theme',
                            checkHandler: onItemCheck
                        }, {
                            text: 'Vista Black',
                            checked: false,
                            group: 'theme',
                            checkHandler: onItemCheck
                        }, {
                            text: 'Gray Theme',
                            checked: false,
                            group: 'theme',
                            checkHandler: onItemCheck
                        }, {
                            text: 'Default Theme',
                            checked: false,
                            group: 'theme',
                            checkHandler: onItemCheck
                        }
                    ]
                }
            },{
                text: 'Choose a Date',
                iconCls: 'calendar',
                menu: dateMenu // <-- submenu by reference
            },{
                text: 'Choose a Color',
                menu: colorMenu // <-- submenu by reference
            }
        ]
    });

    // functions to display feedback
    function onButtonClick(btn){
        Ext.example.msg('Button Click','You clicked the "{0}" button.', btn.text);
    };

    function onItemClick(item){
        Ext.example.msg('Menu Click', 'You clicked the "{0}" menu item.', item.text);
    };

    function onItemCheck(item, checked){
        Ext.example.msg('Item Check', 'You {1} the "{0}" menu item.', item.text, checked ? 'checked' : 'unchecked');
    };

    function onItemToggle(item, pressed){
        Ext.example.msg('Button Toggled', 'Button "{0}" was toggled to {1}.', item.text, pressed);
    };

    var menuTools = new Ext.menu.Menu({
         id: 'menu-test',
         items: [{
                text: 'Maps',
                iconCls: 'bmenu',
                handler: onItemClick
            },{
                text: 'Search',
                iconCls: 'bmenu'
                /*,handler:addOrBounceWidget(51,'widget_id','{"source":"menu"}') */
            },{
                text:'Edit profile'
            },{
                text:'Timeline'
            },{
                text:'add widgets'
            },{
                text:'Read the privacy policy'
            },{
                text:'Help'
            },{
                text:'Send feedback'
            },{
                text:'Contact us'
            },{
                text:'Schedule a meeting with Nevede'
            },{
                text:'Set as homepage'
            }
        ]  
    });

    /* Retrieves portal configuration as:
     * - img path
     * - contact email
     * - jabber server and domain
     */
    getInitialConfig();

    window.viewport = new Ext.Viewport({
        layout:'border',
        items:[{
            region:'north',
            id: 'north-panel',
            border: false,
            height: 80,
            items:[
                new Ext.Toolbar({
                    items:[{
                        text:'Tools'
                        ,menu: menuTools
                    },{
                        text:'Utilities'
                        ,menu: menuMain
                    }]
                })
            ,{
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
            /* Here we define three different column for our portal. If you change the number of
             * the column please check the database for any inconsistency
             */
            items: columns
        }, westPanel]
    });   

    /* These functions are invoked when the page is loaded.
     * getWidgetsPosition retrieves user's widgets and their position
     * showUserInfo(null, true) fill western-panel
     */

    getWidgetsPosition();
    showUserInfo(null, true);

    // render comboThere
    comboTheme.render(Ext.get('exttheme'));
    
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

    /* this one should be under an if (if the current user has the field "already checked last privacy policy" to false, then do this */
    //openWizardModalWindow();
    
    setTimeout(function(){
        Ext.get('loading').remove();
        Ext.get('loading-mask').fadeOut({remove:true});
    }, 2000);

});

soundManager.onload = function(){
    beep = soundManager.createSound('beep', 'sound/38868__M_RED__clock_tic.mp3');
};
