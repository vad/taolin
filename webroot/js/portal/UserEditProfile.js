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

Ext.ux.fbk.sonet.UserEditProfile = Ext.extend(Ext.form.FormPanel, {
    cls: 'form_settings'
    ,id: 'user_edit_profile'
    ,border: false
    ,autoScroll: true
    ,labelAlign: 'top'
    // To prevent sprited images to be shown in the background
    ,defaults: {
        // applied to each contained item
        autoWidth: true
        ,msgTarget: 'side'
    }
    ,listeners:{
        afterlayout:function(t, layout){
            var ta = this.form.findField('description');
            ta.autoSize.defer(500, ta);
        }
    }
    ,monitorValid: true
    ,waitMsgTarget: true
    ,method:'POST'
    ,onRender:function(){
        Ext.ux.fbk.sonet.UserEditProfile.superclass.onRender.apply(this, arguments);

        this.form.load();
    }
    ,initComponent: function() {
        var config = {
            trackResetOnLoad: true,
            url: 'users/getuserprofile/',
            text: "Loading...",
            timeout: 60,
            scope: this,
            items: [
                {
                    html: '<div id="edit-div" class="edit_div border_radius_5px">' +
                            '<div onclick="showUserInfo(null, null, {source: \'edit profile\'});" style="padding:1px 0;">' +
                                '<span class="user_info sprited u-hover l18">View your profile</span>' +
                            '</div>' +
                            '<div onclick="openImageChooser();" style="padding:1px 0;">' +
                                '<span class="sprited image-edit u-hover l18">Edit your photos</span>' +
                            '</div>' +
                            '<div id="edit_workplace" onclick="(new Ext.ux.fbk.sonet.MapWindow({logparams: {source: \'edit profile\', user_id:\'\'}})).show()" style="padding:1px 0;">' +
                                '<span class="sprited map-edit u-hover l18">Edit workplace</span>' +
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
                                editable: false,
                                anchor: '95%'
                            }), {
                                fieldLabel: 'Email',
                                name: 'email',
                                vtype:'email',
                                maxLength: 50,
                                anchor: '95%'
                            }, {
                                fieldLabel: 'Internal Phone <br /><span style="font-weight:normal;font-size:90%;">(0461/314xxx)</span>',
                                name: 'phone',
                                maxLength: 3,
                                anchor: '95%'
                            }, {
                                fieldLabel: 'Secondary internal phone <br /><span style="font-weight:normal;font-size:90%;">(0461/314xxx)</span>',
                                name: 'phone2',
                                maxLength: 3,
                                anchor: '95%'
                            }, {
                                fieldLabel: 'Personal Page',
                                name: 'personal_page',
                                vtype:'url',
                                allowBlank: true,
                                maxLength: 80,
                                anchor: '95%'
                            }, {
                                fieldLabel: 'Home address',
                                name: 'home_address',
                                maxLength: 180,
                                anchor: '95%'
                            }, {
                                fieldLabel: 'Available for carpooling?',
                                name: 'carpooling',
                                xtype: 'checkbox',
                                anchor: '95%'
                            }, {
                                fieldLabel: 'About me <br /><span style="font-weight:normal;font-size:90%;">(Describe yourself, your interests and your work here at '+window.config.orgname+')</span>',
                                name: 'description',
                                xtype: 'textarea',
                                grow: true,
                                deferHeight: true,
                                anchor: '95%'
                            }, {
                                fieldLabel: '<img src="http://www.google.com/s2/favicons?domain=www.linkedin.com" class="size16x16" style="vertical-align: middle" /> Linkedin public-profile<br /><span style="font-weight:normal;font-size:90%;">Example: set it to <i>nickname</i> if your linkedin public profile url is <i>http://www.linkedin.com/in/nickname</i></span>'
                                ,name: 'linkedin'
                                ,maxLength: 50
                                ,anchor: '95%'
                                ,maskRe: /[a-zA-Z0-9]/
                            }, {
                                fieldLabel: '<img src="http://www.google.com/s2/favicons?domain=www.twitter.com" class="size16x16" style="vertical-align: middle" /> Twitter username'
                                ,name: 'twitter'
                                ,maxLength: 50
                                ,anchor: '95%'
                                ,maskRe: /[a-zA-Z0-9_]/
                            }, {
                                fieldLabel: '<img src="http://www.google.com/s2/favicons?domain=facebook.com" class="size16x16" style="vertical-align: middle" /> Facebook profile Web address<br /><span style="font-weight:normal;font-size:90%;">If you have a facebook username, enter http://www.facebook.com/ followed by your username (eg: <i>http://www.facebook.com/foousername</i>). Otherwise, once logged into Facebook, click the <i>Profile</i> button and then copy here the Web address of the resulting page</span>'
                                ,name: 'facebook'
                                ,vtype: 'url'
                                ,maxLength: 120
                                ,anchor: '95%'
                            }]
                    })
                    ,buttons: [{
                        text: 'Save',
                        handler: function(){
                            if(this.form.isDirty()){
                                this.form.submit({
                                    url:'users/setuserprofile',
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
                    ,buttonAlign: 'center'
                }
            ]
        };
        
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Ext.ux.fbk.sonet.UserEditProfile.superclass.initComponent.apply(this, arguments);
    }
    ,onSuccess:function(form, action){
        Ext.example.msg('Edit Profile', 'Your data has been saved');
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
