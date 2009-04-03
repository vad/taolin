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


SendToWindow = function(text, recipients, logparams) {

    this.recipients = recipients;
    this.store = new Ext.data.JsonStore({
        url: 'users/listchampions',
        fields: ['email', 'name'],
        listeners:{
            load: {
                fn: function(store, records, options){
                    if (!this.recipients) return;

                    var emails = new Array();

                    for (var i=this.recipients.length; i-->0; ) {
                        emails.push(this.recipients[i][0]);
                    }
                    var filter = '^(?!(('+ emails.join(')|(')+ ')))';

                    store.filter('email', new RegExp(filter));
                },
                scope: this
                
            }
        }
    });
    SendStore = this.store;

    if (!recipients) recipients = new Array();
    this.storeSelected = new Ext.data.SimpleStore({
        fields: ['email', 'name'],
        data: recipients
    });
    
    this.store.load();


    SendToWindow.superclass.constructor.call(this, {
        width:615,
        //height:600,
        title: 'Send mail window',
        autoScroll:true,
        cls:'sendto-window',
        iconCls:'feedback',
        resizable:false,
        autoShow:true,
        items: [
            {
                xtype: 'label',
                html: "<p>Select one or even more <b>recipients</b> for this message. If you wish, the message can be edited in the textarea below before being submitted</p>",
                cls: 'widgets-window-intro'
            },{
                xtype: 'label',
                html: "<b>Filter by name or surname:</b>",
                cls: 'widgets-window-intro',
                style: 'padding: 0 5px;'
            },{
                xtype: 'textfield',
                width: 100,
                listeners: {
                    'render': {
                        fn:function(){
                            this.getEl().on('keyup', function(){
                                    this.ownerCt.store.filter('name', this.getValue(), true);
                            }, this, 
                            {
                                buffer:300
                            });
                        }
                    }
                }
            },{
                xtype:"itemselector",
                name:"itemselector",
                fieldLabel:"ItemSelector",
                fromStore:this.store,
                toStore:this.storeSelected,
                msWidth:290,
                msHeight:150,
                valueField:"email",
                displayField:"name",
                imagePath:"js/portal/usr/Multiselect",
                //switchToFrom:true,
                toLegend:"Selected",
                fromLegend:"Available",
                listeners: {
                    change:function(c){
                        c.toMultiselect.clearInvalid();
                    }
                }
                /*,toTBar:[{
                    text:"Clear",
                    handler:function(){
                        var i=formItemSelector.getForm().findField("itemselector");
                        i.reset.call(i);
                    }
                }]*/
            },{
                xtype:'textarea'
                ,value:text
                ,width:600
                ,height:200
            },{
                buttons: [{
                        text:'Send'
                        ,handler:function(){
                            if (!this.items.items[3].getValue()){
                                this.items.items[3].toMultiselect.markInvalid('Select one or more recipients');
                                Ext.Msg.show({
                                    title: 'Recipients',
                                    msg:  'Please, select one or more recipients',
                                    width: 400,
                                    icon: Ext.MessageBox.INFO
                                });
                                return;
                            }
                            
                            var recipients = this.items.items[3].getValue();
                            var text = this.items.items[4].getValue();

                            /* In order to add cc or bcc recipients, add more parameters while
                             * invoking this function. For example
                             * (recipients, text, cc-recipients, bcc-recipients, logparams) or even
                             * (recipients, text, null, bcc-recipients, logparams) 
                             */

                            SendMail(recipients, text, null, null, logparams);
                            
                            this.close();
                        }
                        ,scope:this
                    },{
                        text:'Close',
					    handler: function(){ this.close(); },
					    scope: this
                }]
            }
        ]
    });

    this.show();
}

Ext.extend(SendToWindow, Ext.Window);
