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


function openChatHistory(cfg, logparams){

    var win = Ext.getCmp('chat_history');

    if(win) // if exists
        win.close();

    new ChatHistoryWindow(cfg, logparams); // Open a new comment window
}


ChatHistoryWindow = function(cfg, logparams) {

    /*
    if (!logparams)
        alert('No logparams!');
    */

    //TODO: CHANGE IT!
    if (!logparams)
        logparams = null;

    var fm = Ext.util.Format
        ,t = this
        ,helpString = 'Past chats are stored by the chat server and are visible only to you. This feature has been requested by many champions and in fact this feature (chat history) is present in all web chat services (e.g. Google Mail chat). If you have any question about this feature, please contact us at ' + config.contactus;

    cfg.prettyUser = Strophe.getBareJidFromJid(cfg.user);
    cfg.prettyDate = Date.parseDate(cfg.start.replace('.000000Z', ''), 'Y-d-m\T\H:i:s').format('m/d/y');

    t.store = new Ext.data.SimpleStore({
      fields: ['with', 'secs', 'text']
      ,data: cfg.chats
    });
    
    t.view = new Ext.DataView({
        store: t.store
        ,tpl: new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="border_radius_5px">',
                    '<table>',
                        '<tr class="chat_history_chat_line">',
                            '<td><div style="padding:0 5px;">',
                                '<span class="deco-text">{[this.cleartime(values.secs)]}</span>',
                                '<span style="padding:0 5px;font-weight:bold;">{[values.with == \'from\' ? this.from : this.me]}</span>{[values.text.urlize().smilize()]}',
                            '</div></td>',
                        '</tr>',
                    '</table>',
                '</div>',
            '</tpl>'
            ,{
                compiled: true
                ,me: jabber.myJid
                ,from: cfg.prettyUser
                ,start: cfg.start
                ,cleartime: function(secs){
                    var ct = Date.parseDate(this.start.replace('.000000Z',''), 'Y-m-d\T\H:i:s');
                    ct.setSeconds(ct.getSeconds() + secs);
                    return ct.format('H:i');
                }
            }
        )
        ,emptyText: '<div style="padding:10px 5px" class="warning-msg border_radius_5px">Error</div>'
        ,loadingText: 'Loading chat history...' 
        ,itemSelector: '.chat_history_chat_line'
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


    ChatHistoryWindow.superclass.constructor.call(t, {
        title: 'Chats with '+cfg.prettyUser
        ,id: 'chat_history'
        ,autoHeight: true
        ,width: 500
        ,resizable: true
        ,iconCls:'comment-icon'
        ,constrain: true
        ,items: [{
            html: '<div style="padding:5px;float:right;">' +
                        '<span onclick="$(\'#chat_history-help\').toggle(400)" class="a sprited help-icon">What is this?</span>' +
                  '</div>' + 
                  '<div id="chat_history-help" class="warning-msg border_radius_5px chat-history-help">' + helpString + '</div>' + 
                  '<div class="chat-history-title">Chat with '+cfg.prettyUser+' on '+cfg.prettyDate+'</div>'
            ,border: false
        },{
            items: t.view
            ,border: false
            ,autoScroll: true
        }]
        ,buttons: [{
            text:    'Previous'
            ,handler:function(){
                jabber.chatHistory(cfg.user, null, cfg.first);
            }
            ,disabled: !enablePrevious
        },{
            text:    'Next'
            ,handler:function(){
                jabber.chatHistory(cfg.user, cfg.last);
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
            $('#chat_history .timeago').timeago();
          }
        }
    });

    t.show();
}

Ext.extend(ChatHistoryWindow, Ext.Window);
