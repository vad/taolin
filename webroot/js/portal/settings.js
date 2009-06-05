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

Ext.namespace( 'Ext.ux.fbk.sonet' );

Ext.ux.fbk.sonet.Settings = Ext.extend(Ext.form.FormPanel, {
    cls: 'form_settings'
    ,border: false
    ,autoScroll: true
    ,labelAlign: 'top'
    // To prevent sprited images to be shown in the background
    ,defaults: {
        // applied to each contained item
        autoWidth: true
        ,msgTarget: 'side'
    }
    ,monitorValid: true
    ,waitMsgTarget: true
    ,url:'users/getusersettings'
    ,onRender:function(){
        Ext.ux.fbk.sonet.Settings.superclass.onRender.apply(this, arguments);

        this.form.load();
    }
    ,initComponent: function() {
        var config = {
            trackResetOnLoad: true,
            url: 'users/getusersettings/',
            text: "Loading...",
            timeout: 60,
            scope: this,
            items: [
                {
                    html: '<div id="edit-div" class="edit_div">' +
                            '<div onclick="showUserInfo(null, null, \'' + Ext.util.Format.htmlEncode('{"source": "edit profile"}') + '\');" style="padding:1px 0;">' +
                                '<img src="js/portal/shared/icons/fam/user_comment.png" class="size16x16"/>' +
                                '<span onmouseover="this.style.textDecoration=\'underline\'; this.style.cursor=\'default\'" onmouseout="this.style.textDecoration=\'none\'">View your profile</span>' +
                            '</div>' +
                            '<div onclick="openImageChooser();" style="padding:1px 0;">' +
                                '<img src="js/portal/shared/icons/fam/image_edit.png" class="size16x16" />' +
                                '<span onmouseover="this.style.textDecoration=\'underline\'; this.style.cursor=\'default\'" onmouseout="this.style.textDecoration=\'none\'">Edit your photos</span>' +
                            '</div>' +
                            '<div id="edit_workplace" onclick="(new Ext.ux.fbk.sonet.MapWindow({logparams: \'' + Ext.util.Format.htmlEncode('{"source": "edit profile", "user_id":""}') + '\'})).show()" style="padding:1px 0;">' +
                                '<img src="js/portal/shared/icons/fam/map_edit.png" class="size16x16"/>' +
                                '<span onmouseover="this.style.textDecoration=\'underline\'; this.style.cursor=\'default\'" onmouseout="this.style.textDecoration=\'none\'">Edit workplace</span>' +
                            '</div>' +
                        '</div>' 
                }, {
                    items: new Ext.form.FieldSet({
                        //title: ' Personal',
                        layoutConfig: {
                            // layout-specific configs go here
                            labelSeparator: ''
                        },
                        collapsible:false,
                        autoHeight: true,
                        autoWidth: true,
                        border:false,
                        defaultType: 'textfield',
                        style:'padding:5px 0 0 5px',
                        items: [
                            new Ext.form.DateField({
                                fieldLabel: 'Date of Birth',
                                name: 'date_of_birth',
                                format: 'Y-m-d',
                                readOnly: true,
                                anchor: '100%'
                            }), {
                                fieldLabel: 'Email',
                                name: 'email',
                                vtype:'email',
                                maxLength: 50,
                                anchor: '100%'
                            }, {
                                fieldLabel: 'Internal Phone <br /><span style="font-weight:normal;font-size:90%;">(0461/314xxx)</span>',
                                name: 'phone',
                                maxLength: 3,
                                anchor: '100%'
                            }, {
                                fieldLabel: 'Secondary internal phone <br /><span style="font-weight:normal;font-size:90%;">(0461/314xxx)</span>',
                                name: 'phone2',
                                maxLength: 3,
                                anchor: '100%'
                            }, {
                                fieldLabel: 'Personal Page',
                                name: 'personal_page',
                                vtype:'url',
                                maxLength: 80,
                                anchor: '100%'
                            }, {
                                fieldLabel: 'Home address',
                                name: 'home_address',
                                maxLength: 180,
                                anchor: '100%'
                            }, {
                                fieldLabel: 'Available for carpooling?',
                                name: 'carpooling',
                                xtype: 'checkbox',
                                anchor: '100%'
                            }, {
                                fieldLabel: 'About me <br /><span style="font-weight:normal;font-size:90%;">(Describe yourself, your interests and your work here at FBK)</span>',
                                name: 'description',
                                xtype: 'textarea',
                                grow: true,
                                anchor: '100%'
                            }, {
                                fieldLabel: '<img src="http://www.google.com/s2/favicons?domain=www.linkedin.com" class="size16x16" style="vertical-align: middle" /> Linkedin public-profile<br /><span style="font-weight:normal;font-size:90%;">Example: set it to <i>nickname</i> if your linkedin public profile url is <i>http://www.linkedin.com/in/nickname</i></span>'
                                ,name: 'linkedin'
                                ,maxLength: 50
                                ,anchor: '100%'
                            }, {
                                fieldLabel: '<img src="http://www.google.com/s2/favicons?domain=twitter.com" class="size16x16" style="vertical-align: middle" /> Twitter username'
                                ,name: 'twitter'
                                ,maxLength: 50
                                ,anchor: '100%'
                            }, {
                                fieldLabel: '<img src="http://www.google.com/s2/favicons?domain=www.facebook.com" class="size16x16" style="vertical-align: middle" /> Facebook profile Web address<br /><span style="font-weight:normal;font-size:90%;">Once logged into Facebook, click the <i>Profile</i> button and then copy here the Web address of the resulting page</span>'
                                ,name: 'facebook'
                                ,vtype: 'url'
                                ,maxLength: 120
                                ,anchor: '100%'
                            }]
                    })
                },{
                    buttons: [{
                        text: 'Save',
                        handler: function(){
                            if(this.form.isDirty()){
                                this.form.submit({
                                    url:'users/setusersettings',
                                    success:this.onSuccess,
                                    failure:this.onFailure,
                                    waitMsg:'Saving data...'
                                });
                            }
                            else
                                expandUserPanel();
                        }
                        ,formBind:true
                        ,scope: this
                    },{
                        text: 'Cancel',
                        handler: function(){
                            this.form.reset();
                            expandUserPanel();
                        }
                        ,scope: this
                    }]
                }
            ]
        };
        
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Ext.ux.fbk.sonet.Settings.superclass.initComponent.apply(this, arguments);
    }
    ,onSuccess:function(form, action){
        Ext.example.msg('Settings', 'Your data has been saved');
        form.load();
        showUserInfo();
    },
    onFailure:function(form, action){
        Ext.Msg.show({
                title: 'Error!',
                msg: '<center><b>Your data has not been saved!</b><br /><br />Please check your data or submit a feedback to us.</center>',
                width: 400,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
                });
    }
});
