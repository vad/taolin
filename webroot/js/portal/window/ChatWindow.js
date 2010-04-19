/*
 * Chat Window Class
 */

/*
 * Ext JS Library 2.0.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

/**
  * Ext.ux.fbk.sonet.ChatWindow Extension Class
  *
  * @author  Marco Frassoni and Davide Setti and Yakalope
  * @class Ext.ux.fbk.sonet.ChatWindow
  * <p>This window chat </p>
  * <pre><code>
    This is a example of the json
    </code></pre>
*/

ChatWindow = Ext.extend(Ext.Window, {
    
    /* Construction Time Variables */
    
    width: 250,
    height: 250,
    iconCls: "comment-icon",
    //constrain: true,
    border:false,
    collapsible:true,
    draggable:false,
    resizable:false,
    animCollapse:false,
    constrain:true,
    closeAction: 'hide',
    layout:'anchor',
    bodyStyle:'background:#fff;',
    cls:'chat-window',
 
    /* Runtime Variables */
   
    focus: function() {
        /* focus the area where the user write instead of the entire window*/
        jabberui.focused = this.getId();
        Ext.getCmp('msgarea'+this.getId()).focus('', 5);
    },

    sendHandler: function(key,event) {
        var msgArea = this.items.items[1];
        var chatMessage = msgArea.getValue();
        if (chatMessage !== '' && chatMessage !== '\n') {
            this.addMsg(this.user, chatMessage);
            msgArea.setValue('');
            //Send Message to Jabber Connection
            jabber.sendMsg(this.getId(), chatMessage);
            this.composing = false;
        }
        msgArea.focus();
        event.stopEvent();
    },
    initComponent: function() {
        Ext.apply(this, {
            composing: false,
            setComposing: function(status) {
                if ((!status) || (!this.composing)) {
                    this.composing = status;
                    jabber.sendComposing(this.getId(), status);
                }
            },
            items: [{
                id:'msgarea'+this.getId(),
                layout:'fit',
                split:true,
                hideBorders:false,
                border:false,
                xtype:'textarea',
                hideLabel:true,
                maxLength:4000,
                maxLengthText:'The maximum length text for this field is 4000',
                anchor:'100% 25%',
                enableKeyEvents:true,
                listeners: {
                    keyup: {
                        fn: function(t, e) {
                            var kc = e.keyCode;
                            
                            //TODO: write this better
                            // these keys don't trigger any change: if the key pressed was one of them, stop here
                            if ((kc == e.ALT) || (kc == e.CTRL) || (kc == e.SHIFT) || (kc == 15) || (kc == e.UP) || (kc == e.DOWN) || (kc == e.LEFT) || (kc == e.RIGHT) || (kc == e.CAPS_LOCK) || (kc == e.HOME) || (kc == e.END) || (kc === 0) || (kc == e.ENTER))
                                return;
                            
                            this.setComposing(true);
                            t.dTask.delay(3000);
                        }
                        ,scope:this
                    },
                    beforerender: {
                        fn: function(t) {
                            t.dTask = new Ext.util.DelayedTask(
                                this.setComposing, this, [false]
                            );
                        }
                        ,scope:this
                    },
                    focus: function(t) {
                        Ext.getCmp(t.getId().substring(7)).setActive(true);
                    },
                    blur: function(t) {
                        Ext.getCmp(t.getId().substring(7)).setActive();
                    }
                }
            },{
                html:'<span class="a" onclick="jabber.listHistory(\''+this.getId()+'\');">Show chat history</span>'
                ,anchor: '100% 10%'
                ,border: false
                ,style:'padding: 5px 0 0 5px;'
            }],
            keys: [{
                key:13,
                fn:this.sendHandler,
                scope:this
            },{
                key:Ext.EventObject.TAB,
                fn:jabberui.focusNext,
                scope:jabberui
            }
            ]
        });
        ChatWindow.superclass.initComponent.apply(this, arguments);
        //jabberui.addChatToList(this.getId());
    },
    render: function() {
        /*
         * Set up chat object for use in the window
         */
        var id = this.getId()
            ,chatId = 'chat' + id
            ,chat =  {
                update: function(msg, scope) {
                    $(Ext.getDom('chatArea'+id)).find('.messages').append(
                        String.format(
                            '<div class="msg"><b>{0}</b> ({1}): {2}</div>',
                                msg.username, msg.time, msg.msg
                    )).find('.msg:last a').oembed(null, {
                        embedMethod:'append'
                        ,maxWidth: 200
                    }, function(container, oembed) { //callback (scroll down)
                         $.fn.oembed.insertCode(container, 'append', oembed);
                         Ext.getCmp(id).scrollBottom();

                    });
                },
                clear: function(scope) {
                    //TODO: test this function
                    $(Ext.getDom('chatArea'+id))
                        .find('.messages').html('').end()
                        .find('.info').html('');
                }
            };
        
        this.chatArea = new Ext.Component({
            id: 'chatArea'+id
            ,html:'<div class="messages"></div><div class="info" style="color:#777"></div>'
        });
        var panel = new Ext.Panel({
            id:'chatpanel' + this.getId()
            ,items: this.chatArea
            ,anchor:'100% 65%'
            ,autoScroll: true
            ,border: false
        });

        this.chat = chat;
        this.items.insert(0, panel.id, panel);
        
        ChatWindow.superclass.render.apply(this, arguments);
    },
    addMsg:function(userName, msg, timestamp) {
        var chat = Ext.getCmp(this.getId()).chat;

        msg = Ext.util.Format.htmlEncode(msg).urlize().smilize().replace(/\n/g,"<br/>");
        if (userName !== this.user) {
            userName = userName.toString().split('@')[0];
        }
        if (!timestamp) {
            timestamp = new Date();
        }

        var sTime; //string containg formatted time
        //show day and month only if day != today
        if (timestamp.format('jmY') == (new Date()).format('jmY')){
            sTime = timestamp.format('G:i');
        } else {
            sTime = timestamp.format('G:i, M j');
        }

        var lMsg = {
            username: userName,
            time: sTime,
            msg: msg
        };
        chat.update(lMsg, this);
        this.scrollBottom();
        
        // play sounds
        var tm = msg.trim();
        if (/*(soundManager.enabled) &&*/ (tm.split(' ', 1)[0] == '/play')){
            var i = tm.indexOf(' ')
                ,sound = tm.substring(i).trim();
            
            if (sound == 'trombone') {
                play('sad_trombone');
            }
            else if (sound == 'moo') {
                play('cow');
            }
            else if (sound == 'cheer') {
                play('cheer');
            }
            else if (sound == 'fart') {
                play('fartus_tubartus');
            }
        }

        /* now do show signals if the message comes from another user */
        if (userName == this.user) return;

        // check also for document.hasFocus existence: WebKit has not yet implemented it
        if ((!this.isActive) || (typeof document.hasFocus == 'undefined') || (!document.hasFocus())) {
            this.visualBeep = true;
        }
    },
    scrollBottom: function(){
        var panel = Ext.getCmp('chatpanel'+this.getId());
        panel.body.scroll('down', 5000, true); 
    },
    listeners: {
        beforehide: function(t) {
            jabberui.removeChat(t.getId());
            jabberui.refreshChats();
        },
        beforeshow: function(t){
            jabberui.addChat(t.getId());
            jabberui.refreshChats();
        },
        collapse: function(panel){
            jabberui.refreshChats();
        },
        expand: function(panel){
            jabberui.refreshChats();
        },
        activate: function(t){
            t.isActive = true;
            t.visualBeep = false;
        },
        deactivate: function(t){
            t.isActive = false;
        }
    }
 });
 
 Ext.reg('chatwindow', ChatWindow);
