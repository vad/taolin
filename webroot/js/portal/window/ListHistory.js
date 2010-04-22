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


function openListHistory(cfg, logparams){

    var win = Ext.getCmp('list_history');

    if(win) // if exists
        win.close();

    new ListHistoryWindow(cfg, logparams); // Open a new comment window
}


ListHistoryWindow = function(cfg, logparams) {

    /*
    if (!logparams)
        alert('No logparams!');
    */
    var fm = Ext.util.Format
        ,t = this
        ,helpString = 'Past chats are stored by the chat server and are visible only to you. This feature has been requested by many champions and in fact this feature (chat history) is present in all web chat services (e.g. Google Mail chat). If you have any question about this feature, please contact us at ' + config.contactus;
    
    cfg.prettyUser = Strophe.getBareJidFromJid(cfg.user);

    t.store = new Ext.data.SimpleStore({
      fields: ['with', 'start']
      ,data: cfg.chats
    });
    
    t.view = new Ext.DataView({
        store: t.store
        ,tpl: new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="border_radius_5px">',
                    '<table>',
                        '<tr class="chat_history_list_line">',
                            '<td style="padding-left:10px;">',
                              '<span class="a" onclick="jabber.getChatHistory(\'{with}\', \'{start}\')">{[this.cleardate(values.start)]}</span> (<span class="timeago" title="{[values.start.replace(\'.000000\',\'\')]}">{start}</span>)',
                            '</td>',
                        '</tr>',
                    '</table>',
                '</div>',
            '</tpl>'
            ,{
                compiled: true
                ,cleardate: function(d){
                    var cd = Date.parseDate(d.replace('.000000Z',''), 'Y-m-d\T\H:i:s');
                    cd.setMinutes(cd.getMinutes() - cd.getTimezoneOffset()); // Adjusting timezone

                    return cd.format('F, d Y H:i');
                }
            }
        )
        ,emptyText: '<div style="padding:10px 5px" class="warning-msg border_radius_5px">No chat history with the selected user</div>'
        ,loadingText: 'Loading chat history...'
        ,deferEmptyText: false
        ,itemSelector: '.chat_history_list_line'
        ,height: 300
    });

    var enablePrevious=true,
        enableNext=true;

    if (!cfg.index) {
      enablePrevious = false;
    }
    if (cfg.index+cfg.items >= cfg.count) {
      enableNext = false;
    }


    ListHistoryWindow.superclass.constructor.call(t, {
        title: 'Chats with '+cfg.user
        ,iconCls: 'chat'
        ,id: 'list_history'
        ,autoHeight: true
        ,width: 500
        ,resizable: true
        //,iconCls:'comment-icon'
        ,constrain: true
        ,items: [{
            html: '<div style="padding:5px;float:right;">' +
                    '<span onclick="$(\'#list_history-help\').toggle(400)" class="a sprited help-icon">What is this?</span>' +
                '</div>' + 
                '<div id="list_history-help" class="warning-msg border_radius_5px chat-history-help" style="display:none;">' + helpString + '</div>' + 
                '<div class="chat-history-title">Chats with '+cfg.prettyUser+'</div>'
            ,border: false
        },{
            items: t.view
            ,border: false
            ,autoScroll: true
        }]
        ,buttons: [{
            text:    'Previous'
            ,handler:function(){
                jabber.listHistory(cfg.user, null, cfg.first);
            }
            ,disabled: !enablePrevious
        },{
            text:    'Next'
            ,handler:function(){
                jabber.listHistory(cfg.user, cfg.last);
            }
            ,disabled: !enableNext
        },{
            text:    'Close'
            ,scope:  this
            ,handler:function(){
                this.close();
            }
        }]
        ,listeners: {
          afterrender: function(){
            $('#list_history .timeago').timeago();
          }
        }
    });

    t.show();
}

Ext.extend(ListHistoryWindow, Ext.Window);
