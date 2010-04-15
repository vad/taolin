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
    ,method:'POST'
    ,onRender:function(){
        Ext.ux.fbk.sonet.Settings.superclass.onRender.apply(this, arguments);
        this.form.load();
    }
    ,initComponent: function() {
        var config = {
            trackResetOnLoad: true,
            autoHeight:true,
            url: 'users/getusersettings/',
            text: "Loading...",
            timeout: 60,
            scope: this,
            buttonAlign: 'center',
            items:[ 
                new Ext.DataView({
                    emptyText: 'No backgrounds!'
                    ,loadingText: 'Loading backgrounds...'
                    ,autoHeight: true
                    ,singleSelect: true
                    ,itemSelector:'div.bg-wrap'
                    ,selectedClass: 'bg-wrap-selected'
                    ,trackOver: true
                    ,store: new Ext.data.JsonStore({
                        url: 'backgrounds/getbg' 
                        ,root: ''
                        ,fields: ['id','name','path']
                        ,autoLoad: true
                        ,listeners:{
                            load:{ 
                                fn: function(store, records, options){
                                    var dv = this.items.first();
                                    dv.select(store.find('path', window.config.background), false, true);
                                }
                                ,scope: this
                            }
                        }
                    })
                    ,tpl: new Ext.XTemplate(
                        '<div style="margin-top:10px;margin-bottom: 20px;"><b>Change {[window.config.appname]} background</b></div>',
                        '<div style="text-align:center;"><tpl for=".">',
                            '<div class="bg-wrap">',
                                /* The <span> element without any content has to be placed there to vertically align images in the middle on IE */
                                '<div><span></span>',
                                    '<img class="ante" style="cursor:pointer" src="{path:imageThumbPath(50, 50)}"></img>',
                                '</div>',
                                '<span>{name}</span>',
                            '</div>',
                        '</tpl></div>',
                        '<div class="x-clear"></div>'
                        ,{
                            compiled: true
                        }
                    )
                    ,listeners: {
                        selectionchange: {
                            fn: function(dv,node){
                                if(node && node.length >= 1) 
                                    this.form.findField('background_id').setValue(dv.getSelectedRecords()[0].id);
                                else
                                    this.form.findField('background_id').setValue(null);
                            }
                            ,scope: this
                        }
                        ,mouseenter: {
                            fn: function(dv, index, node, e){
                                var bg = dv.getRecord(node).get('path');
                                $('.desktop .x-column-layout-ct').css('background','transparent url('+bg+') repeat scroll 50% 50%');
                            }
                            ,scope: this
                        }
                        ,mouseleave: {
                            fn: function(dv, index, node, e){
                                $('.desktop .x-column-layout-ct').css('background','transparent url('+window.config.background+') repeat scroll 50% 50%');
                            }
                            ,scope: this
                        }
                    }       
                })
                ,new Ext.form.FieldSet({
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
                            fieldLabel: 'Number of columns <br /><span style="font-weight:normal;font-size:90%;">Please insert a value between 1 and 4</span>',
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
                        ,{
                            xtype: 'combo',
                            hiddenName: 'theme',
                            fieldLabel: 'Select the theme',
                            store: themes,
                            mode: 'local', 
                            anchor: '95%',
                            triggerAction: 'all', 
                            selectOnFocus:true, 
                            resizable: false, 
                            editable: false,
                            forceSelection: true
                        }
                        ,{
                            xtype:'hidden',
                            name:'background_id',
                            value: user.background_id
                        }
                    ]
                })
                ],
                buttons: [{
                    text: 'Save',
                    handler: function(){
                        if(this.form.isDirty()){
                            if(this.form.findField('number_of_columns').isDirty()){
                                Ext.Msg.show({
                                    title:'Save Changes?',
                                    msg: 'This operation will reload the page. Do you want to continue?',
                                    buttons: Ext.Msg.YESNO,
                                    fn: function(buttonId) {
                                        if (buttonId == "yes") 
                                            this.submit();
                                    },
                                    icon: Ext.MessageBox.QUESTION
                                    ,scope: this
                                });
                            }
                            else
                                this.submit();
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
                }]
        };
        
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Ext.ux.fbk.sonet.Settings.superclass.initComponent.apply(this, arguments);
    }
    ,onSuccess:function(form, action){

        if('reloadpage' in action.result)
            window.location.reload(false);

        if('changetheme' in action.result){
            var theme = form.findField('theme').getValue();
            if(typeof theme != 'undefined')
                changeExtTheme(theme);
        }
        
        if('changebg' in action.result)
            changeBg(action.result.changebg);

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
    ,submit:function(){
        this.form.submit({
            url:'users/setusersettings',
            success:this.onSuccess,
            failure:this.onFailure,
            waitMsg:'Saving data...'
        });
    }
});
