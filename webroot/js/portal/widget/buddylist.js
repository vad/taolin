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

/**
  * Ext.ux.fbk.sonet.BuddyList Extension Class
  *
  * @author  Davide Setti
  * @version 1.0
  * @class Ext.ux.fbk.sonet.BuddyList
  * <p>This widget show the user connected to the jabber server</p>
*/

var roster = {
  // Online buddies
  online: [],
  // temporary store (save here presence&status until roster's load)
  store: [],
  // Full roster
  roster: [],
  update: function (buddy) {
    for (var i=0, x; x = this.roster[i++];) {
      if (x.compareTo(buddy)) {
        x.update(buddy);
        return;
      }
    }
    this.roster.push(buddy);    
  },
  flushPresence: function() {
    //TODO: change this. Once buddies are readed, drop them from store 
    for(var i=0, il=this.store.length; i<il; i++) {
        var b = this.store[i];
        this.setPresence(b.jid, b.presence, b.status, b.type);
    }
    rosterStore.load();
  },

  setPresence: function (jid, presence, status, type) {
    if ((type !== 'unavailable') && (!this.roster.length)){
        var b = new Buddy(jid.toString(), '', '', '', presence, status, type);
        this.store.push(b);
        return;
    }

    // this is a dirty way to put ME inside the buddylist
    // the problem is that ME is not sent in the roster, but only as presence/status
    if (jid.toString() == jabber.con.jid){
        try {
            for (var i=0, x; x = this.roster[i++];) {
                if (x.jid.toString() == jid.toString())
                    throw "JidAlreadyPresentException";
            }
            for (var i=0, x; x = this.online[i++];) {
                if (x.jid.toString() == jid.toString())
                    throw "JidAlreadyPresentException";
            }
            // if we're here, Me is not present in roster.roster or roster.online
            var b = new Buddy(jid.toString(), '', '', 'Me', presence, status, type);
            this.roster.push(b);
        } catch (e) {}
    }

    // If the buddy comes online, move them to 'online'
    if (type != 'unavailable') {
      for (var i=0, x; x = this.roster[i++];) {
        if (x.jid.toString() == jid.toString()) {
          this.online.push(x);
          this.roster.remove(x);
          break;
        }
      }
    }

    var sCssClass = 'user-' + (jid.toString().split('@'))[0];
    // IE wants DIV, FF div... and the others? It's better to try to get both instead of using Ext.isIE
    var rule = 'BODY .'+ sCssClass; 
    var cssClass = Ext.util.CSS.getRule(rule, true); // for IE
    if (!cssClass) // for FF
        cssClass = Ext.util.CSS.getRule('body .'+ sCssClass, true);

    if (!cssClass) { // if no cssClass has been found, create it
        var s = rule +" {\n}";
        Ext.util.CSS.createStyleSheet(s, rule);

        // now we need to get the class, so we can change its style
        cssClass = Ext.util.CSS.getRule(rule, true); // for IE
        if (!cssClass) // for FF
            cssClass = Ext.util.CSS.getRule('body .'+ sCssClass, true);
    }
    
    var sBulletPresence;
    if (type == 'unavailable')
        sBulletPresence = 'unavailable';
    else
        sBulletPresence = presence;

    var sStyleBg = 'url(js/portal/shared/icons/fam/'+ hBullets[sBulletPresence] +') left no-repeat';
    cssClass.style.background = sStyleBg;

    for (var i=0, il=this.online.length; i<il; i++) {
      if (this.online[i].jid.toString() == jid.toString()) {
        this.online[i].presence = presence;
        this.online[i].status = status.htmlEnc();
        this.online[i].fancyStatus = status.htmlEnc().smilize().urlize();
        this.online[i].type = type;
        
        // If the buddy goes offline, remove from online list
        if (type == 'unavailable') {
         var buddy = this.online[i];
         this.online.remove(this.online[i]);
         this.roster.push(buddy);
        }
        break;
      }
    }
    rosterStore.load();
  },
  clear: function () {
    this.online = [];
    this.roster = [];
    rosterStore.load();
  }
};

var rosterStore = new Ext.data.GroupingStore({
  id: 'rosterStore',
  proxy: new Ext.data.MemoryProxy(roster),
  reader: new Ext.data.JsonReader({
    root: 'online'
    },[
      {name: 'jid'},
      {name: 'subscription'},
      {name: 'name'},
      {name: 'group'},
      {name: 'presence'},
      {name: 'status'},
      {name: 'fancyStatus'}    
  ]),
  sortInfo: {field: 'jid', direction: "ASC"},
  groupField: 'group'
});
rosterStore.on('loadexception', function(proxy, store, response, e) {
    console.log('loadexception: ' + e.message);
});

BuddyList = function(conf, panel_conf) {
    Ext.apply(this, panel_conf);

    BuddyList.superclass.constructor.call(this, {
        id:'buddylist',
        collapsible: true,
        autoHeight: true,
        /*tbar: [{
            text: 'Logout',
            id: 'logout',
            handler: function(){
                jabber.quit()
            },
            scope: this
        }],*/
        listeners: {
            'resize' : {
                fn: function(panel, panelWidth, panelHeight){ 
                    panel.items.first().setWidth(panelWidth);
                }, 
                scope: this
            }
        },
        items: [
            new Ext.grid.GridPanel({
              store: rosterStore,
              autoHeight: true,
              draggable: false,
              hideHeaders: true,
              parent: this,
              columns: [{
                id: 'jid',
                dataIndex: 'jid',
                renderer: function (value, p, record) {
                    var tpl = new Ext.XTemplate(
                        '<table style="width:100%"><tr>'
                            ,'<td style="vertical-align:middle;">'
                                ,'<div class="buddylistjid buddyliststate{presence}" qtip="{status}">{jid}'
                                    ,'<tpl if="presence">'
                                        ,'<span class="buddylistmessage" style="margin-left:10px;">{presence}</span>'
                                    ,'</tpl>'
                                ,'</div>'
                                ,'<tpl if="status">'
                                    ,'<div class="buddylistmessage" qtip="{status}" style="padding-right:2px;">'
                                        ,'{fancyStatus}'
                                    ,'</div>'
                                ,'</tpl>'
                            ,'</td>'
                            ,'<td style="width:40px;text-align:center;">'
                                ,'<img src="photos/getphotofromuserlogin/{[values.jid._node]}/40/40" />'
                            ,'</td>'
                        ,'</tr></table>'
                    );
                    return tpl.applyTemplate(record.data);
                }},
                {dataIndex: 'group', hidden: true},
                {dataIndex: 'presence', hidden: true},
                {dataIndex: 'subscription', hidden: true},
                {dataIndex: 'status', hidden: true},
                {dataIndex: 'fancyStatus', hidden: true}
              ],
              view: new Ext.grid.GroupingView({
                forceFit: true,
                scrollOffset:2,
                showGroupName: false,
                rowSelectorDepth: 12,
                groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Buddies" : "Buddy"]})',
                emptyText: 'Nobody is visible in chat at the moment'
              }),
              cls: 'blist-grid',
              listeners: {
                rowclick: function() {
                    var buddy = this.getSelectionModel().getSelected().data;
                    if(jabber.u_n != buddy.jid._node)
                        jabberui.createNewChatWindow(buddy.jid);
                    getIdFromJidNode(buddy.jid._node);
                },
                resize : {
                    fn: function(panel, panelWidth, panelHeight){ 
                        var presence = Ext.getCmp('presence');
                        var status = Ext.getCmp('status');

                        status.setWidth(panelWidth - (presence.width + 20));
                    }, 
                    scope: this
                }
              },
              tbar: [new Ext.ux.IconCombo({
                  id: 'presence',
                  //name: 'presence',                  
                  width: 100,
                  listWidth: 130,
                  store: new Ext.data.SimpleStore({
                    fields: ['presence', 'readablePresence', 'iconClass'],
                    data: [
                      ['', 'Available', 'buddyliststate']
                      ,['away', 'Away', 'buddyliststateaway']
                      ,['dnd', 'Do not disturb', 'buddyliststatednd']
                      ,['invisible', 'Invisible', 'buddyliststateinvisible']
                      //,['chat', 'Chatty']
                      //,['unavailable', 'Offline']
                    ]
                  }),
                  panel: this,
                  value:conf.presence ? conf.presence : '',
                  displayField: 'readablePresence',
                  valueField: 'presence',
                  iconClsField: 'iconClass',
                  mode: 'local',
                  forceSelection: true,
                  triggerAction: 'all',
                  editable: false,
                  listeners: {
                    render: function (combo) {
                        combo.initFlags();
                        //combo.setValue(combo.store.collect('presence', true)[0]);
                    },
                    select: function (combo) {
                      var status = Ext.getCmp('status').getValue();
                      var presence = combo.getValue();
                      var type;
                      
                      //store in DB
                      this.panel.setPref('presence', presence);
                      
                      //this XEP isn't very linear...
                      if (presence == 'invisible') {
                        presence = '';
                        type = 'invisible';
                      }

                      jabber.setPresence(combo.getValue(), status, type);
                    }
                  }
                }), '&nbsp;',
                new Ext.form.ComboBox({
                  id: 'status'
                  ,emptyText: 'Set status message'
                  ,store: new Ext.data.SimpleStore({
                    fields: ['status']
                    ,data: [[conf.status]] // TODO: Change this in an array
                  })
                  ,displayField: 'status'
                  ,value: conf.status
                  ,panel: this
                  ,mode: 'local'
                  ,width: 145
                  ,queryDelay: 500
                  ,hideLabel: true
                  ,triggerAction: 'all'
                  ,cls:'buddylist-status-field'
                  ,focusClass:'buddylist-status-focus'
                  ,recordType:Ext.data.Record.create(['status'])
                  ,loseFocus: function () {
                     Ext.getCmp('presence').focus();
                     this.fireEvent("blur", this);
                  }
                  //,enableKeyEvents:true
                  // this should go into listeners.keyup, but there are problems in Ext 2.2
                  ,onKeyUp: function (e) { 
                      this.collapse();
                      if (e.getKey() == Ext.EventObject.ENTER) {
                        var status = Ext.getCmp('status');
                        var sPresence = Ext.getCmp('presence').getValue();
                        var sStatus = status.getEl().dom.value;
                        
                        rec = new status.recordType({status: sStatus});
                        Ext.getCmp('status').store.add(rec);
                        
                        //store in DB
                        this.panel.setPref('status', sStatus);
                        eventManager.fireEvent('newtimelineevent');

                        //change jabber status
                        jabber.setPresence(sPresence, sStatus);
                        this.loseFocus();
                      }
                      e.stopEvent();
                  }
                  ,listeners: {
                    blur: function (t) {
                        if(!Ext.isOpera && t.focusClass){ // don't touch in Opera
                            t.el.removeClass(t.focusClass);
                        }
                    }
                    ,select: function (combo, record, index) { //change status from drop down menu
                        var presence = Ext.getCmp('presence').getValue();
                        var status = record.get('status');
                        
                        //store in DB
                        combo.panel.setPref('status', status);
                        eventManager.fireEvent('newtimelineevent');
                                               
                        //change jabber status
                        jabber.setPresence(presence, status);
                    }
                    ,render: function(t){

                        var presence, status, type;
                        var cPresence = Ext.getCmp('presence');
                        
                        if (cPresence.value == 'invisible'){
                            presence = '';
                            type = 'invisible';
                        } else {
                            presence = cPresence.value;
                        }
                        
                        status = t.value ? t.value : '';

                        jabberui.init(presence, status, type);
                    }
                    ,beforedestroy: function(t){
                        jabber.quit();
                    }
                  }
                })]
            })]
    });
};

Ext.extend(BuddyList, Ext.Panel);

//Ext.reg('buddylist', BuddyList);
