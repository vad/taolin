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
    ,waitMsgTarget: true
    ,url:'users/getusersettings'

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
                        ,'<div><center>'
                            ,'<div>'
                                ,'<tpl if="photo != null">'
                                    ,'<img class="ante" src="'+window.config.img_path+'t240x240/{photo}" />'
                                ,'</tpl>'
                                ,'<tpl if="photo == null">'
                                    ,'<img class="ante" src="img/nophoto.png" height="240" />'
                                ,'</tpl>'
                            ,'</div>'
                            ,'<div>'
                                ,'<div class="user_param_wrapper" style="padding:10px; font-size: 120%; font-weight: bold;">'
                                    ,'{name} {surname}'
                                ,'</div>'
                                ,'<div class="edit_div" style="font-size:120%;width: 11em;">'
                                    ,'<div onclick="openImageChooser();">'
                                        ,'<img src="js/portal/shared/icons/fam/image_edit.png" />'
                                        ,'<span onmouseover="this.style.textDecoration=\'underline\'; this.style.cursor=\'default\'" onmouseout="this.style.textDecoration=\'none\'">Edit your photos</span>'
                                    ,'</div>'
                                    ,'<div onclick="(new Ext.ux.fbk.sonet.MapWindow({logparams: \'' + Ext.util.Format.htmlEncode('{"source": "user profile", "user_id":""}') + '\'})).show()" style="padding:1px 0;">'
                                       ,'<img src="js/portal/shared/icons/fam/map_edit.png" />'
                                       ,'<span onmouseover="this.style.textDecoration=\'underline\'; this.style.cursor=\'default\'" onmouseout="this.style.textDecoration=\'none\'">Edit workplace</span>'
                                    ,'</div>'
                                ,'</div>'  
                            ,'</div>'
                        ,'</center></div>'
                    ,'</div>'
                ,'</tpl>'
            )
            ,store: new Ext.data.SimpleStore({
                fields: [
                    {name: 'name'}, {name: 'surname'}, {name: 'photo'}
                ]
            })
        });
                
        this.form = new Ext.form.FieldSet({
            //title: ' Personal',
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
                    text: 'Please edit your information below, in order to make your profile more complete and to let other people know more about you!'
                    ,xtype: 'label'
                    ,style: 'font-weight: bold; font-size: 120%; display: block; position: relative; margin: 20px 0;'
                }, {
                    fieldLabel: 'Personal Page'
                    ,name: 'personal_page'
                    ,vtype:'url'
                    ,maxLength: 80
                    ,anchor: '98%'
                }, {
                    fieldLabel: 'Home address'
                    ,name: 'home_address'
                    ,maxLength: 180
                    ,anchor: '98%'
                }, {
                    fieldLabel: 'Available for carpooling?'
                    ,name: 'carpooling'
                    ,xtype: 'checkbox'
                    ,anchor: '98%'
                }, {
                    fieldLabel: 'About me <br /><span style="font-weight:normal;font-size:90%;">(Describe yourself, your interests and your work here at FBK)</span>'
                    ,name: 'description'
                    ,xtype: 'textarea'
                    ,grow: true
                    ,anchor: '98%'
               }
            ]
        });

        var config = {
            items: [
                this.view
                ,this.form
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
    ,setUserParams:function(form, action){

        this.userParams = [
            action.result.data.map(function(i){
                if(i.id)    
                    return i.value;
            })
        ];
        
        this.view.store.loadData(this.userParams);
    }
});
