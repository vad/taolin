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

Ext.ux.fbk.sonet.WizardSettings = Ext.extend(Ext.form.FormPanel, {
    id: 'wizard_settings_form',
    border: false
    ,autoScroll: true
    ,labelAlign: 'top'
    ,bodyStyle:'padding:5px; background:white;'
    ,defaults: {
        // applied to each contained item
        autoWidth: true
        ,msgTarget: 'side'
    }
    ,monitorValid: true
    ,waitMsgTarget: true
    ,url:'users/getusersettings'
    ,onRender:function(){
        Ext.ux.fbk.sonet.WizardSettings.superclass.onRender.apply(this, arguments);

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
                    html: '' 
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
                            {
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
                }/*,{
                    buttons: [{
                        text: 'Save',
                        handler: function(){ 
                            var t = Ext.getCmp('settings_form');
                            t.form.submit({
                                url:'users/setusersettings',
                                success:t.onSuccess,
                                failure:t.onFailure,
                                waitMsg:'Saving data...'
                            });
                        },
                        formBind:true
                    },{
                        text: 'Cancel',
                        handler: function(){
                            Ext.getCmp('settings_form').form.load();
                            expandUserPanel();
                        }
                    }]
                }*/
            ]
        };
        
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Ext.ux.fbk.sonet.WizardSettings.superclass.initComponent.apply(this, arguments);
    }
    ,onFailure:function(form, action){
        Ext.Msg.show({
            title: 'Error!',
            msg: '<center><b>Your data has not been saved!</b><br /><br />Please check your data or submit a feedback to us.</center>',
            width: 400,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
});
