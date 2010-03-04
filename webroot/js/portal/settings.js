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
    ,listeners:{
        actioncomplete:function(t, action){ // BAD HACK! (this should be to prevent an ExtJS 3 bug)
            $('#settings .x-panel-btns').css('width', '');
        }
    }
    ,monitorValid: true
    ,waitMsgTarget: true
    ,method:'POST'
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
            items: new Ext.form.FieldSet({
                layoutConfig: {
                    // layout-specific configs go here
                    labelSeparator: ''
                },
                collapsible:false,
                autoHeight:true,
                autoWidth:true,
                border:false,
                defaultType:'textfield',
                style:'padding:5px 0 0 5px',
                items: [
                    {
                        xtype: 'numberfield',
                        fieldLabel: 'Number of columns',
                        name: 'number_of_columns',
                        //typeAhead: true,
                        forceSelection: true,
                        //selectOnFocus:true,
                        maxValue: 4,
                        minValue: 1,
                        anchor: '95%',
                        editable: false,
                        allowDecimals: false
                    }
                ]
            }),
            buttons: [{
                    text: 'Save',
                    handler: function(){
                        if(this.form.isDirty()){
                            Ext.Msg.show({
                                title:'Save Changes?',
                                msg: 'This operation will reload the page. Do you want to continue?',
                                buttons: Ext.Msg.YESNO,
                                fn: function(buttonId) {
                                    if (buttonId == "yes") {
                                        this.form.submit({
                                            url:'users/setusersettings',
                                            success:this.onSuccess,
                                            failure:this.onFailure,
                                            waitMsg:'Saving data...'
                                        });
                                    }
                                },
                                icon: Ext.MessageBox.QUESTION
                                ,scope: this
                            });
                        }
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
                }
            ]
            ,buttonAlign: 'left'
        };
        
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Ext.ux.fbk.sonet.Settings.superclass.initComponent.apply(this, arguments);
    }
    ,onSuccess:function(form, action){
        /*Ext.example.msg('Edit Settings', 'Your data has been saved');
        form.load();
        */

        //reload the portal
        window.location.reload(false);
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
