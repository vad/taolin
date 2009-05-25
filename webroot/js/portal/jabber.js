// ex: set ts=2 softtabstop=2 shiftwidth=2: 
var jabber = {
  u_n: '',
  p_w: '',
  con: new JSJaCHttpBindingConnection(),
  roster: [],
  myJid: '',
  nTrials: 0,
  maxTrials: 1,
  keepOffline:false,
  init: function(presence, status, type){
    //oDbg = new JSJaCConsoleLogger(2);
    // Try to resume a session
      this.status = {presence:presence, status:status, type:type};
    try {
      this.con = new JSJaCHttpBindingConnection();//{'oDbg': oDbg});
      setupCon(this.con);
      if (this.con.resume()) {}
    } 
    catch (e) {} // reading cookie failed - never mind
  },
  
  quit: function(){
    if (this.con && this.con.connected()) {
        this.keepOffline = true;
        this.con.disconnect();
    }
  },
  
  /**
   * Registers handlers for XMPP stanzas
   * @param {JSJaCHttpBindingConnection} con
   */
  setupCon: function(con){
    con.registerHandler('message', jabber.handle.message);
    con.registerHandler('presence', jabber.handle.presence);
    con.registerHandler('onconnect', jabber.handle.connected);
    con.registerHandler('ondisconnect', jabber.handle.disconnected);
    con.registerHandler('failure', jabber.handle.failure);
    con.registerIQGet('query', NS_VERSION, jabber.handle.iqVersion);
    con.registerIQGet('query', NS_TIME, jabber.handle.iqTime);
    con.registerIQSet('query', NS_ROSTER, jabber.handle.iqRosterSet);
    con.registerHandler('iq', 'query', NS_ROSTER, jabber.handle.iqRoster);
    con.registerHandler('iq', jabber.handle.iq);
  },
  
  doLogin: function(username, password){
  
    try {
      // setup args for contructor
      oArgs = new Object();
      oArgs.httpbase = '/http-bind/';
      oArgs.timerval = 2000;
      
      if (typeof(oDbg) != 'undefined') 
        oArgs.oDbg = oDbg;
      
      this.con = new JSJaCHttpBindingConnection(oArgs);
      
      jabber.setupCon(this.con);
      
      // setup args for connect method
      oArgs = new Object();
      oArgs.domain = window.config.jabber_domain;
      oArgs.server = window.config.jabber_server;
      oArgs.username = username;
      oArgs.pass = password;
      oArgs.register = false;
      //oArgs.authtype = 'nonsasl';
      this.u_n = username;
      this.p_w = password;
      this.myJid = oArgs.username + oArgs.domain;
      
      this.con.connect(oArgs);
    } 
    catch (e) {
      alert(e.toString());
    }
    finally {
      return false;
    }
  },
  send:function(packet) {
    try {
      this.con.send(packet);
    } catch(e) {
      Ext.MessageBox.alert('Error sending packet', e.message);
    }
  },
  /**
   * Sends a message
   * @param {JSJaCJID} user
   * @param {String} msg
   */
  sendMsg: function(user, msg){
    var aMsg = new JSJaCMessage();
    aMsg.setTo(new JSJaCJID(user.toString()));
    aMsg.setBody(msg);
    this.send(aMsg);
    return true;
  },
  
  getRoster: function(){
    var roster = new JSJaCIQ();
    roster.setIQ(null, 'get', 'roster_1');
    roster.setQuery(NS_ROSTER);
    this.send(roster);
  },
  addRosterItem: function(buddy){
    var iq = new JSJaCIQ();
    iq.setFrom(jabber.myJid);
    iq.setType('set');
    iq.setID('roster_set');
    var query = iq.setQuery(NS_ROSTER);
    var group = iq.buildNode('group', {}, buddy.group);
    var item = iq.buildNode('item', {
      jid: buddy.jid,
      name: buddy.name
    });
    item.appendChild(group);
    query.appendChild(item);
    this.con.send(iq);
  },
  addBuddy: function(buddy){
    this.addRosterItem(buddy);
    this.subscribe(buddy.jid);
    return buddy.jid;
  },

  getRegFields: function(to){
    var iq = new JSJaCIQ();
    iq.setTo(to);
    iq.setType('get');
    iq.setID('reg_get');
    iq.setQuery(NS_REGISTER);
    this.send(iq);
  },

  register: function(to, fields) {
    //this.unregister(to); // Unregister old account if possible
    var iq = new JSJaCIQ();
    iq.setTo(to);
    iq.setType('set');
    iq.setID('reg');
    var query = iq.setQuery(NS_REGISTER);
    for (field in fields) {
      query.appendChild(
        iq.buildNode(field, {}, fields[field])
      );
    }
    this.send(iq);
  },
  
  unregister: function(to) {
    var iq = new JSJaCIQ();
    iq.setTo(to);
    iq.setType('set');
    iq.setID('unreg');
    var query = iq.setQuery(NS_REGISTER);
    query.appendChild(iq.buildNode('remove', {}, ''));
    this.send(iq);
  },

  setPresence: function(show, status, type) {
    jabber.status = {presence:show, status:status, type:type};
                   
    var presence = new JSJaCPresence();
    presence.setShow(show);
    presence.setStatus(status);
    presence.setType(type);
    this.send(presence);

    //save status in the west panel
    if(westPanel.showedUser.id === window.thisId){
        setChatStatus(status.htmlEnc().smilize().urlize());
    }
  },

  subscribe: function(jid){
    this.__subscription(jid, 'subscribe');
  },
  
  unsubscribe: function(jid){
    this.__subscription(jid, 'unsubscribe');
  },
  
  allowSubscription: function(jid){
    this.__subscription(jid, 'subscribed');
  },
  
  denySubscription: function(buddy){
    this.__subscription(jid, 'unsubscribed');
  },
  
  /**
   * Sends a subscription packet of a specified type
   * @param {JSJaCJID} buddy
   * @param {String} subType
   */
  __subscription: function(jid, subType){
    var presence = new JSJaCPacket('presence');
    presence.setTo(jid);
    presence.setType(subType);
    this.send(presence);
    return false;
  },
  
  isConnected: function(){
    return this.con.connected();
  },
  handle: {
    iq: function(iq){
      if (iq.getType() != 'result') {
        var roster = new JSJaCIQ();
        roster.setIQ(null, 'result', iq.getID());
        roster.setQuery(NS_ROSTER);
        this.send(roster);
        //console.log("Reply test: " + iq.reply().xml());
      }
      if (iq.getID() == 'reg') {        
        var status = Ext.getCmp('status').getValue();
        var presence = Ext.getCmp('presence').getValue();
        jabber.setPresence(presence, status);
      }
    },
    
    message: function(aJSJaCPacket){

        // set current timestamp
        var x;
        var timestamp;
        for (var i=0; i<aJSJaCPacket.getNode().getElementsByTagName('x').length; i++)
            if (aJSJaCPacket.getNode().getElementsByTagName('x').item(i).getAttribute('xmlns') == 'jabber:x:delay') {
                x = aJSJaCPacket.getNode().getElementsByTagName('x').item(i);
                break;
        }

        if (x) {
            var stamp = x.getAttribute('stamp');
            timestamp = new Date(Date.UTC(stamp.substring(0,4),stamp.substring(4,6)-1,stamp.substring(6,8),stamp.substring(9,11),stamp.substring(12,14),stamp.substring(15,17)));
        } else
            timestamp = new Date();

        
        // add message to the chat window
      jabberui.addMsg(aJSJaCPacket.getFromJID().removeResource(), aJSJaCPacket.getBody(), timestamp);
    },
    
    presence: function(aJSJaCPacket){
      var from = new JSJaCJID(aJSJaCPacket.getFrom());
      from.setResource(new String());
      var presence = aJSJaCPacket.getShow();
      
      var type = '';
      if (aJSJaCPacket.getType()) {
        type = aJSJaCPacket.getType();
      }
      var status = '';
      if (aJSJaCPacket.getStatus()) {
        status = aJSJaCPacket.getStatus();
      }      
      //console.log(from + presence + status + type);
      roster.setPresence(from, presence, status, type);
      
    },

    connected: function(){
      Ext.getCmp('buddylist').items.first().view.emptyText = 'Nobody';
      jabber.getRoster();
      
      jabber.setPresence(jabber.status.presence, jabber.status.status, jabber.status.type);
    },
    
    disconnected: function(){
      roster.clear();

      if (jabber.keepOffline){
        Ext.getCmp('buddylist').items.first().view.emptyText = 'You are offline. Click <a href="javascript:resetJabberConnection()">here</a> to connect.';
        return;
      }
      
      Ext.getCmp('buddylist').items.first().view.emptyText = 'There has been problems connecting to the server. Click <a href="javascript:resetJabberConnection()">here</a> to try again. Possible problems: (1) If you are visiting taolin in more than one tab, please close all but one tab. (2) You changed your password recently, please logout and login again with the new password.';
      
      if (jabber.nTrials++ < jabber.maxTrials){
        jabberui.init(jabber.status.presence, jabber.status.status, jabber.status.type);
      }
    },
    
    failure: function(aJSJaCPacket){
      alert("Failure: " + aJSJaCPacket.xml());
    },
    
    iqVersion: function(iq){
      this.send(iq.reply(
        [iq.buildNode('name', 'yakalope test'),
         iq.buildNode('version', JSJaC.Version),
         iq.buildNode('os', navigator.userAgent)]));
      return true;
    },
    
    iqTime: function(iq){
      var now = new Date();
      this.send(iq.reply(
        [iq.buildNode('display', now.toLocaleString()),
         iq.buildNode('utc', now.jabberDate()),
         iq.buildNode('tz',
           now.toLocaleString().substring(now.toLocaleString().lastIndexOf(' ') + 1))]));
      return true;
    },

    iqRoster: function(iq){
      //console.log('iqRoster');
      var q = iq.getQuery();
      roster.clear(); //i hope the new roster replaces the old one...
      $(q).find('item').each(function(){
        var t = $(this);
        var b = new Buddy(t.attr('jid'), t.attr('subscription'),
          t.attr('name'), t.find('group').text());
        roster.roster.push(b);
      });

      roster.flushPresence();
    },
    
    iqRosterSet: function(iq){
      jabber.handle.iqRoster(iq);
    }
  }
};

/**
 * Buddy type
 * @param {String} jid
 * @param {String} subscription Must be "none", "to", "from", "both"
 * @param {String} name Nickname
 * @param {String} group
 * @param {String} presence
 * @param {String} status
 * @param {String} type
 */
var Buddy = function(jid, subscription, name, group, presence, status, type){
  this.jid = new JSJaCJID(jid);
  this.subscription = subscription;
  this.name = name;
  this.group = group;
  this.presence = presence;
  this.status = status;
  this.type = type;

  for (var el in this) {
    if (typeof(this[el]) == 'undefined') 
      this[el] = '';
  }
};
/**
 * Compares self to another Buddy object
 * @param {Buddy} buddy
 */
Buddy.prototype.compareTo = function (buddy) {
  return this.jid.toString() == buddy.jid.toString();
};
/**
 * Updates buddy attributes without overwriting presence data
 * @param {Buddy} buddy
 */
Buddy.prototype.update = function (buddy) {
  this.jid = buddy.jid;
  this.subscription = buddy.subscription;
  this.name = buddy.name;
  this.group = buddy.group;
};

