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

Ext.namespace('Ext.ux.fbk.sonet');

Ext.ux.fbk.sonet.WizardSettings = Ext.extend(Ext.form.FormPanel, {
    cls: 'settings'
    ,border: false
    ,autoScroll: true
    ,defaults: {
        // applied to each contained item
        autoWidth: true
        ,msgTarget: 'side'
    }
    ,monitorValid: true
    ,labelAlign: 'top'
    ,waitMsgTarget: false
    ,onRender:function(){
        Ext.ux.fbk.sonet.WizardSettings.superclass.onRender.apply(this, arguments);

        this.form.load({
            url: 'users/getusersettings/'
            ,text: "Loading..."
            ,success: this.setUserParams
            ,timeout: 60
            ,scope: this
        });
    }
    ,initComponent: function() {

        //this.userParams = {};

        this.view = new Ext.DataView({
            autoHeight: true
            ,multiSelect: false
            ,emptyText: 'Ouch... Something wrong happened here! Please report this error to '+window.config.contactus
            ,loadingText: 'Loading your personal information'
            ,itemSelector: 'user-params-wrapper'
            ,tpl: new Ext.XTemplate(
                '<tpl for=".">'
                    ,'<div class="user-params-wrapper" width="auto">'
                        ,'<div style="text-align:center">'
                            ,'<span style="width: 50%;">'
                                ,'<tpl if="photo != null">'
                                    ,'<img class="ante" src="'+window.config.img_path+'t240x240/{photo}" style="vertical-align:top;" />'
                                ,'</tpl>'
                                ,'<tpl if="photo == null">'
                                    ,'<img class="ante" src="img/nophoto.png" style="vertical-align:top;" height="240;" />'
                                ,'</tpl>'
                            ,'</span>'
                            ,'<div style="display: inline">'
                                ,'<span style="padding:10px; font-size: 120%; font-weight: bold;">'
                                    ,'{name} {surname}'
                                ,'</span>'
                            ,'</div>'
                        ,'</div>'
                        ,'<div style="font-size:120%; font-weight: bold; display: block; padding: 30px 0;">'
                            ,'Please edit your information below, in order to make your profile more complete and to let other people know more about you! The more information you provide, the easier it will be for your colleagues find useful information!<br />Fields marked with (*) are mandatory'
                        ,'</div>'
                    ,'</div>'
                ,'</tpl>'
            )
            ,store: new Ext.data.SimpleStore({
                fields: [
                    {name: 'name'}, {name: 'surname'}, {name: 'photo'}, null, {name: 'groups_description'}
                ]
            })
        });
                
        this.wiz_form = new Ext.form.FieldSet({
            collapsible:false
            ,autoHeight: true
            ,autoWidth: true
            ,border:false
            ,defaultType: 'textfield'
            ,style:'padding:5px 0 0 5px'
            ,layoutConfig: {
                // layout-specific configs go here
                labelSeparator: ''
            }
            ,items: [{
                fieldLabel: 'Describe yourself with few keywords (*) <br /><span style="font-weight:normal;font-size:90%;">(Such as "Interaction design, nanotechnology, history of Germanic people, religion, media, javascript")</span>'
                ,name: 'description'
                ,allowBlank: false
                ,xtype: 'textarea'
                ,grow: true
                ,anchor: '98%'
            }, {
                fieldLabel: 'Personal Page <br /><span style="font-weight:normal;font-size:90%;">(Such as your external blog or your FBK web page)</span>'
                ,name: 'personal_page'
                ,vtype:'url'
                ,maxLength: 80
                ,anchor: '98%'
            }, {
                fieldLabel: 'Are you available for carpooling? <br /><span style="font-weight:normal;font-size:90%;">(If you don\'t know what carpooling means, maybe you would like to take a look <a href="http://en.wikipedia.org/wiki/Carpool" target="_blank" title="What does carpool stand for?">here</a>)</span>'
                ,name: 'carpooling'
                ,xtype: 'checkbox'
                ,anchor: '98%'
            }, {
                fieldLabel: 'Home address <br /><span style="font-weight:normal;font-size:90%;">(if you indicate that you are available for carpooling, please insert your home location.)</span>'
                ,name: 'home_address'
                ,maxLength: 180
                ,anchor: '98%'
            }]
        });

        var config = {
            url:'users/setusersettings'
            ,method: 'POST'
            ,items: [
                this.view
                ,this.wiz_form
           ]
        };
        
    Ext.apply(this, Ext.apply(this.initialConfig, config));

        Ext.ux.fbk.sonet.WizardSettings.superclass.initComponent.apply(this, arguments);
    }
    /*,onSuccess:function(form, action){
        console.log('Success');
    }*/
    ,onFailure:function(form, action){
        Ext.Msg.show({
            title: 'Error!',
            msg: '<center><b>Your data has not been saved!</b><br /><br />Please check your data or submit a feedback to us.</center>',
            width: 400,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
    ,setUserParams:function(form, action){
        // userParams are used by the DataView
        this.userParams = [
            action.result.data.map(function(i){
                if(i.id)    
                    return i.value;
            })
        ];
        
        this.view.store.loadData(this.userParams);
    }
});
