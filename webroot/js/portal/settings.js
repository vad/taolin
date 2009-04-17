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
    cls: 'settings'
    ,border: false
    ,autoScroll: true
    ,labelAlign: 'top'
    // To prevent sprited images to be shown in the background
    ,bodyStyle:'background: white;'
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

        this.form.load({
            url: 'users/getusersettings/',
            text: "Loading...",
            timeout: 60,
            scope: this
        });
    }
    ,initComponent: function() {
        var config = {
            items: [
                {
                    html: '<div id="edit-div" class="edit_div" style="text-align:left;margin:15px;line-height:100%;font-family: Verdana;">' +
                            '<div onclick="showUserInfo(null, null, \'' + Ext.util.Format.htmlEncode('{"source": "edit profile"}') + '\');" style="padding:1px 0;">' +
                                '<img src="js/portal/shared/icons/fam/user_comment.png" style="padding-right: 10px;" />' +
                                '<span onmouseover="this.style.textDecoration=\'underline\'; this.style.cursor=\'default\'" onmouseout="this.style.textDecoration=\'none\'">View your profile</span>' +
                            '</div>' +
                            '<div onclick="openImageChooser();" style="padding:1px 0;">' +
                                '<img src="js/portal/shared/icons/fam/image_edit.png" style="padding-right: 10px;" />' +
                                '<span onmouseover="this.style.textDecoration=\'underline\'; this.style.cursor=\'default\'" onmouseout="this.style.textDecoration=\'none\'">Edit your photos</span>' +
                            '</div>' +
                            '<div id="edit_workplace" onclick="(new Ext.ux.fbk.sonet.MapWindow({logparams: \'' + Ext.util.Format.htmlEncode('{"source": "edit profile", "user_id":""}') + '\'})).show()" style="padding:1px 0;">' +
                                '<img src="js/portal/shared/icons/fam/map_edit.png" style="padding-right: 10px;" />' +
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
                           }
                        ]
                    })
                },{
                    buttons: [{
                        text: 'Save',
                        handler: function(){ 
                            this.form.submit({
                                url:'users/setusersettings',
                                success:this.onSuccess,
                                failure:this.onFailure,
                                waitMsg:'Saving data...'
                            });
                        }
                        ,formBind:true
                        ,scope: this
                    },{
                        text: 'Cancel',
                        handler: function(){
                            this.form.load();
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
