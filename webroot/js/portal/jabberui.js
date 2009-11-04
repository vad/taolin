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

jabberui = function () {
    var openChats;
    
    return {
        openChats: new Array(),
        init: function(presence, status, type){
            jabber.init(presence, status, type);
            if (!jabber.isConnected()) {
                Ext.Ajax.request({ //ajax request configuration  
                    url: 'accounts/getcredits',
                    method: 'GET',
                    failure: function(response, options){
                        //something went wrong.
                        Ext.MessageBox.alert('Warning', 'Failed to contact server...');
                    },
                    success: function(response, options){
                        var credentials = Ext.util.JSON.decode(response.responseText);
                        
                        jabber.doLogin(credentials.user, credentials.password);
                    }
                });
            }

            //set refresh on window's resize
            window.viewport.on('resize', function() {jabberui.refreshChats();});

            //set timer to update window's title if necessary
            this.lastChatWindowTitle = 0;
            this.defaultWindowTitle = document.title;
            var task = {
                run: function(){
                    jabberui.updateWindowTitle();
                },
                interval: 1000 //1 second
            };
            Ext.TaskMgr.start(task);
        },
        createNewChatWindow: function(chatId){
            var chatName = chatId._node+'@'+chatId._domain;
            var chatWindow = Ext.getCmp(chatName);

            if(!searchWidget('BuddyList','string_identifier'))
                addwidget(5);

            if (!chatWindow) {
                var newChat = new ChatWindow({
                    id: chatName,
                    title: '<div class="chat-title user-'+chatId._node+'">'+chatName+'</div>',
                    hidden: false,
                    user: 'me'
                });
                newChat.show(this);
                return newChat;
            } else {
                chatWindow.show();
            }
            return null;
        },
        requestNewBuddy: function(jsjacjid){
            Ext.MessageBox.confirm('Confirm new friend', 'Are you sure you want to add '+jsjacjid+' as a friend?',
                function(approve){
                    if (approve == 'yes') 
                        jabber.addBuddy(new Buddy(jsjacjid._node+'@'+jsjacjid._domain, 'Fbk'));
                });
        },
        addMsg: function(chatId, msg, timestamp){
            var chatWindow = Ext.getCmp(chatId);
            if (chatWindow) {
                chatWindow.addMsg(chatId, msg, timestamp);
                if (chatWindow.hidden)
                    chatWindow.show();
            }
            else {
                var newChatWindow = jabberui.createNewChatWindow(chatId);
                newChatWindow.addMsg(chatId, msg, timestamp);
            }

            if (!document.hasFocus()) {
                beep.play();
            }
        },
        refreshChats: function(){
            var l = this.openChats.length;

            var height = $(window).height();
            var width = $(window).width();

            width -= 20; // prevent scrollbar overflow

            for (var i = 0; i < l; i++) {
                var chat = Ext.getCmp(this.openChats[i]);
                var chatHeight = chat.height;
                if (chat.rendered){
                    chatHeight = chat.getFrameHeight() + chat.getInnerHeight(); 
                }
                chat.setPosition(width - 255*(i+1), height - chatHeight);
            }
        },
        removeChat: function(chatId){
            this.openChats.remove(chatId);
        },
        addChat: function(chatId) {
            if (!(chatId in this.openChats)) {
                this.openChats.push(chatId);
            }
        },
        focusNext: function(key, event){
            var index = this.openChats.indexOf(jabberui.focused);
            // disactivate the current ChatWindow
            Ext.getCmp(jabberui.openChats[index]).setActive();
            
            // get the index of the next ChatWindow
            if (!index) {
                index = this.openChats.length;
            }
            index -= 1;
            
            // set focus and activate the next ChatWindow
            var ncw = Ext.getCmp(jabberui.openChats[index]);
            ncw.focus('', 5);
            ncw.setActive(true);
            event.stopEvent();          
        },
        updateWindowTitle: function(){
            var l = this.openChats.length;
            var changed = false;

            if (this.lastChatWindowTitle >= l){
                this.lastChatWindowTitle = 0;
            } else {
                this.lastChatWindowTitle++;
            }

            for (; this.lastChatWindowTitle < l; this.lastChatWindowTitle++) {
                var chatName = this.openChats[this.lastChatWindowTitle];
                if (Ext.getCmp(chatName).visualBeep) {
                    changed = true;
                    document.title = chatName;
                    break;
                }
            }

            if (!changed) {
                document.title = this.defaultWindowTitle;
            }
        }
    };
}();
