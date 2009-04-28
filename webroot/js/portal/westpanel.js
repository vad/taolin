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

westPanel = new Ext.Panel({
    region:'west',
    id:'west-panel',
    title:'Manager Panel',
    split:true,
    width: 220,
    minSize: 220,
    maxSize: 400,
    /* This panel should not be closed, only collapsed */
    tools: toolsnotclose,
    hideCollapseTool:true,
    collapsible: true,
    margins:'5 0 5 5',
    cmargins:'5 5 5 5',
    layout:'accordion',
    layoutConfig:{
        hideCollapseTool:true,
        titleCollapse:true,
        activeOnTop: false
    },
    items: [{
        xtype:'timeline'
        /* Be careful if you want to change this id. It is used several times
         * to access to the timeline and to its methods (in Timeline.js or in 
         * reloadTimeline() into functions.js)
         */
        ,id: 'timeline'
    },{
        xtype:'userprofile'
        ,id: 'user_profile'
    },{
        title:'Edit your profile',
        border:false,
        autoScroll:true,
        iconCls:'settings',
        frame:true,
        id:'settings',
        layout: 'fit',
        collapsible:true,
        hideCollapseTool:true,
        tools: toolsnotclose,
        listeners: {
            /* When this accordion panel collapse it expands automatically
             * the other panel
             *
             * not in use
             */
            /*collapse: expandUserPanel,*/
            render: function(t){
                t.add(new Ext.ux.fbk.sonet.Settings());
            }
        }
    }]

    /**
      * @param {String} login requested user's login
      */
    ,showPublik: function(login){
        var tab = Ext.getCmp('wp-publik-tab');

        tab.store.load({params: {login: login}});
    }
    
    /**
      * @param {Integer} id requested user's id
      *
      */
    ,showPhotos: function(id){
        var tab = Ext.getCmp('wp-photos-tab');

        tab.store.load({params: {id: id}});
    }
    
    /** showUser function
     * show selected user's profile
     * @param {Integer} reqid requested user's id
     * @param {bool} hidePanel if true the user profile panel has not to be shown
     * @param {String} source for logging porpouse, it records the place where the requests started
     */
    ,showUser: function(reqid, hidePanel, logparams){

        if (!reqid) reqid = '';
        if (!hidePanel) {
            hidePanel = false;
        }
        
        Ext.Ajax.request({
            url : 'users/getinfo/'+reqid,
            method: 'GET',
            params: {src: logparams},
            success: function ( result, request ) {
                /*
                 * Whenever this function shows user info it shall expand both
                 * western panel and accordion panel containing 'user_image' div
                 */
                westPanel.expand();
                if(!hidePanel) expandUserPanel();
                var jsondata = Ext.util.JSON.decode(result.responseText);
                westPanel.showedUser = jsondata.user;
                var user_text = '';

                if(reqid==='') { //this call always gives access to this user data
                    Ext.get("logged_as_username").update(
                        '<a href="javascript:void(0)" onclick="showUserInfo(null, null, \'' + Ext.util.Format.htmlEncode('{"source": "logout_div"}') + '\')" qtip="Click here to view your profile">'+jsondata.user.login+'</a>'
                    );
                    window.thisId = jsondata.user.id;
                    window.thisLogin = jsondata.user.login;
                    if(jsondata.user.email) 
                        window.thisEmail = jsondata.user.email;
                }
                
                westPanel.showPublik(jsondata.user.login);
                westPanel.showPhotos(jsondata.user.id);

                //save in a retrievable place if this photo is user's photo
                //and then show tools
                westPanel.showTools = ((!reqid) || (reqid == window.thisId));
                showText(((!reqid) || (reqid == window.thisId)), 'edit-div');

                if (('photo' in jsondata.user) && (jsondata.user.photo)){
                    Ext.get("user_photo").dom.src = jsondata.user.photo;
                } else {
                    Ext.get("user_photo").dom.src = 'img/nophoto.png';
                }
                
                var mod_description = jsondata.user.mod_description;
                // call the methods urlize and smilize only if the object is not null
                if(mod_description) {
                    mod_description=mod_description.urlize().smilize();
                    //replaces \n with <br /> for visualization in html
                    mod_description=Ext.util.Format.htmlDecode(mod_description.replace(/(\n)/g,'<br />'));
                }

                var tpl = new Ext.XTemplate(
                    '<div class="user-profile" style="text-align:left;margin:5px;line-height:150%;font-size:100%;">',
                    '<br/><p><b><span style="font-size:130%;font-family: Verdana;">{name} {surname}</span>',
                    '<tpl if="((this.reqid === \'\') || (this.reqid == window.thisId))">',
                        '<span style="padding-left:10px;"><a href="javascript:expandSettingsPanel()">Edit</a></span>',
                    '</tpl>',
                    '</b><br/>',
                    '<span id="user-status"></span>',
                    /* check if the user is "chattable" */
                    '<tpl if="((this.reqid !== \'\') && (login) && (jabber.u_n !== login) && (active === \'1\'))">',
                        '<br /><div class="user-item user-{login}"><a href="javascript:void(0)" onclick=\'jabberui.createNewChatWindow(new JSJaCJID("{login}@fbk.eu"))\'>Chat with {name} {surname}</a></div>',
                    '</tpl></p>',
                    /* if s/he is not a champion, suggest as a champion! */
                    '<tpl if="((this.reqid !== \'\') && (active !== \'1\'))">',
                        '<br /><div style="text-align:left;margin:5px;font-family: Verdana;">{name} is not a champion. You can <a href="javascript:void(0)" onclick="suggestAsChampion(\'{name}\', \'{surname}\', \'{login}\', \'{email}\', \'{this.sourceSuggestAs}\')">suggest {name} to SoNet team as a new champion!</a></div>',
                    '</tpl></p>',
                    '<br /><b>Login:</b> ',
                    '<span> {[values.login ? values.login : "unavailable"]} </span>',
                    '<tpl if="email">',
                            '<br /><b>E-mail:</b><span onclick="new SendToWindow(\'\', \[\[\'{email}\', \'{name} {surname}\'\]\], \'{this.sourceSendMail}\')"> <img style="vertical-align:bottom;" title="Click here to email user" src="js/portal/shared/icons/fam/email.png" /> <a href="javascript:void(0)">{email}</a></span>',
                    '</tpl>',
                    '<tpl if="((phone) && (phone != \'0\'))">',
                        '<br /><b>Phone:</b><span> {phone}</span>',
                    '</tpl>',
                    '<tpl if="((phone2) && (phone2 != \'0\'))">',
                        '<br /><b>Phone 2:</b><span> {phone2}</span>',
                    '</tpl>',
                    '<tpl if="((personal_page) && (personal_page != \'null\'))">',
                        '<br /><b>Home page:</b> <span><a href="{personal_page}" target="_blank">{[values.personal_page.substr(0,7)==="http://" ? values.personal_page.substr(7) : values.personal_page]}</a></span>',
                    '</tpl>',
                    '<tpl if="building_id">',
                        '<br /><b>Workplace:</b> <span><a href="javascript:void(0)" onclick="(new Ext.ux.fbk.sonet.MapWindow(\{buildingId:{building_id}, logparams:\'' + Ext.util.Format.htmlEncode('{"source": "user profile", "user_id": "{id}"}') + '\'\})).show()">where\'s {[this.getPronoun(values.gender)]} office?</a></span>',
                    '</tpl>',
                    '<tpl if="date_of_birth">',
                        '<br /><b>Date of birth:</b><span> {[Date.parseDate(values.date_of_birth, "Y-m-d").format("F, d")]}</span>',
                    '</tpl>',
                    '<tpl if="home_address">',
                        '<br /><br /><b>Lives in:</b><span> {home_address}</span>',
                    '</tpl>',
                    '<tpl if="carpooling">',
                        '<br /><img style="vertical-align:bottom;" src="js/portal/shared/icons/fam/car.png" /> <b>Available for carpooling!</b>',
                    '</tpl>',

                    /*********************************************
                     * START Group description
                     *********************************************/
                    '<tpl if="groups_description">',
                        '<br /><br /><b>{defaultgroupname}</b>',
                        '<br />',
                        '<span>',
                            '<ul style="padding: 5px 0 0 20px">', 
                            '<tpl for="groups">',
                                '<li style="list-style-type:disc;">',
                                    '<a href="javascript:void(0)" onclick="groupDetails(\'{id}\', \'{name}\',\'{this.sourceGroupWindow}\')">{[values.description_en ? (values.description_en + \" - \") : (values.description_it ? (values.description_it + \" - \") : \"\")]}{name}</a>',
                                '</li>',
                            '</tpl>',
                            '</ul>',
                        '</span>',
                    '</tpl>',
                    /*********************************************
                     * END Group description
                     *********************************************/
                    
                    /*********************************************
                     * START Tag cloud
                     *********************************************/

                    // Currently not working!
                    //'{[this.tagCloud(values.tags)]}',

                    /*********************************************
                     * END Tag cloud
                     *********************************************/
                    
                    /**********************************************
                     * START Social Networking
                     *********************************************/
                    '<tpl if="(linkedin) || (twitter) || (facebook)">', // if one of the social network's field is present...
                        '<br /><b>Social networking on...</b><br />',
                        '<span>',
                            '<ul style="padding: 5px 0 0 20px;">', 
                                '<tpl if="linkedin">',
                                    '<li style="list-style-type:disc;">',
                                        '<img src="http://www.google.com/s2/favicons?domain=www.linkedin.com" style="vertical-align: middle; padding-right: 5px;" /><a href="{linkedin}" target="_blank">Linkedin</a>',
                                    '</li>',
                                '</tpl>',
                                '<tpl if="twitter">',
                                    '<li style="list-style-type:disc;">',
                                        '<img src="http://www.google.com/s2/favicons?domain=twitter.com" style="vertical-align: middle; padding-right: 5px;" /><a href="{twitter}" target="_blank">Twitter</a>',
                                    '</li>',
                                '</tpl>',
                                '<tpl if="facebook">',
                                    '<li style="list-style-type:disc;">',
                                        '<img src="http://www.google.com/s2/favicons?domain=www.facebook.com" style="vertical-align: middle; padding-right: 5px;" /><a href="{facebook}" target="_blank">Facebook</a>',
                                    '</li>',
                                '</tpl>',
                            '</ul>',
                        '</span>',
                    '</tpl>',
                    /**********************************************
                     * END Social Networking
                     *********************************************/
                    '<tpl if="mod_description">',
                        '<br /><b>About me:</b><span> {this.mod_description}</span>',
                    '</tpl>',
                    '</div>'
                    ,{
                        reqid: reqid 
                        ,mod_description: mod_description
                        ,sourceGroupWindow: Ext.util.Format.htmlEncode(
                            '{\"source\": \"user profile\", \"user_id\": \"'+westPanel.showedUser.id+'\"}'
                        )
                        ,sourceSendMail: Ext.util.Format.htmlEncode(
                            '{\"source\": \"user profile\", \"user_id\": \"'+westPanel.showedUser.id+'\"}'
                        )
                        ,sourceSuggestAs: Ext.util.Format.htmlEncode(
                            '{\"source\": \"suggest as champion\", \"user_id\": \"'+westPanel.showedUser.id+'\"}'
                        )
                        ,getPronoun: function(gender) {
                            //gender = 2 => female
                            if(gender == '1') { //male
                                return 'his';
                            } else {
                                return 'her';
                            }
                        }
                        ,tagCloud: function(tags){

                            if(!tags) 
                                return '';

                            var min_font_size = 12;
                            var max_font_size = 22;

                            var max_count;
                            var min_count;
                            
                            var count;
                            var font_size;
                            var tag_cloud = '<br /><div><ul><img style="vertical-align:bottom;" src="js/portal/shared/icons/fam/tag_blue.png" /><b>Tag cloud</b><br />';
 
                            // Defining minimum and maximum count value
                            for(var i in tags){
                                if((tags[i].length < min_count) || (min_count == null))
                                    min_count = tags[i].length;
                                else if((tags[i].length > max_count) || (max_count == null))
                                    max_count = tags[i].length;
                            }

                            var spread = max_count - min_count;
                            if(spread == 0) 
                                spread = 1;
                           
                            for(var key in tags){
                                
                                count = tags[key].length;
                                font_size = min_font_size + (count - min_count) * ((max_font_size - min_font_size) / spread); 

                                tag_cloud += '<li style="display:inline !important;vertical-align: baseline !important;padding: 0 5px;margin: 0;"><a href="javascript:void(0)" style="font-size:'+Math.floor(font_size)+'px;line-height: 1;" onclick="console.log(\''+key+'\')" title="'+key+' tagged '+count+' times">'+key+'</a><wbr></li>';

                            }

                            return tag_cloud + '</ul></div>';
                        }
                    }
                    );
                    tpl.overwrite(Ext.get('user_text'), jsondata.user);
                
                    if(jsondata.user.login)
                        findChatStatus(reqid, jsondata.user.login);
                }
           });
    }

});
