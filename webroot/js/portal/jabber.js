// ex: set ts=2 softtabstop=2 shiftwidth=2: 
var jabber = {
  u_n: '',
  p_w: '',
  con: new JSJaCHttpBindingConnection(),
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
    con.registerHandler('message', this.handle.message);
    con.registerHandler('presence', this.handle.presence);
    con.registerHandler('onconnect', this.handle.connected);
    con.registerHandler('ondisconnect', this.handle.disconnected);
    con.registerIQGet('query', NS_TIME, this.handle.iqTime);
    con.registerIQSet('query', NS_ROSTER, this.handle.iqRosterSet);
    con.registerHandler('iq', 'query', NS_ROSTER, this.handle.iqRoster);
    con.registerHandler('iq', this.handle.iq);
  },
  
  doLogin: function(username, password){
    try {
      // setup args for contructor
      var oArgs = {
        httpbase: '/http-bind/'
        ,timerval: 2000
      }
      
      if (typeof(oDbg) != 'undefined') 
        oArgs.oDbg = oDbg;
      
      this.con = new JSJaCHttpBindingConnection(oArgs);
      
      this.setupCon(this.con);
      
      // setup args for connect method
      oArgs = {
        domain: config.jabber_domain
        ,server: config.jabber_server
        ,username: username
        ,pass: password
        ,register: false
        ,resource: Math.ceil(Math.random()*Math.pow(10,10))
      };
      //oArgs.authtype = 'nonsasl';
      Ext.apply(this, {
        u_n: username
        ,p_w: password
        ,myJid: oArgs.username + oArgs.domain
        ,resource: oArgs.resource
      });
      
      this.con.connect(oArgs);
    } 
    catch (e) {
      console.log(e.toString());
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
  setPresence: function(show, status, type) {
    this.status = {presence:show, status:status, type:type};
                   
    var presence = new JSJaCPresence();
    presence.setShow(show);
    presence.setStatus(status);
    presence.setType(type);
    this.send(presence);

    //save status in the west panel
    if(westPanel.showedUser && westPanel.showedUser.id === user.id){
      setChatStatus(status.htmlEnc().smilize().urlize());
    }
  },

  isConnected: function(){
    return this.con.connected();
  },
  handle: {
    iq: function(iq){
      var j = jabber;
      if (iq.getType() != 'result') {
        var roster = new JSJaCIQ();
        roster.setIQ(null, 'result', iq.getID());
        roster.setQuery(NS_ROSTER);
        j.send(roster);
        //console.log("Reply test: " + iq.reply().xml());
      }
      if (iq.getID() == 'reg') {        
        var status = Ext.getCmp('status').getValue()
          ,presence = Ext.getCmp('presence').getValue();
        j.setPresence(presence, status);
      }
    },
    
    message: function(aJSJaCPacket){
      // set current timestamp
      var x
        ,timestamp
        ,node = aJSJaCPacket.getNode();
      
      if (!aJSJaCPacket.getBody()) return; //if there's not a message, exit

      $(node).find('x').each(function(){
        x = $(this);
        if (x.attr('xmlns') == 'jabber:x:delay'){
          return false;
        }
      });
    
      if (x) {
        var stamp = x.attr('stamp');
        timestamp = new Date(Date.UTC(stamp.substring(0,4),stamp.substring(4,6)-1,
          stamp.substring(6,8), stamp.substring(9,11), stamp.substring(12,14),
          stamp.substring(15,17)
        ));
      } else
        timestamp = new Date();

      // add message to the chat window
      jabberui.addMsg(aJSJaCPacket.getFromJID().removeResource(), aJSJaCPacket.getBody(), timestamp);
    },
    
    presence: function(aJSJaCPacket){
      var from = new JSJaCJID(aJSJaCPacket.getFrom());

      if ((from.getNode() === jabber.u_n) && (from.getResource() !== jabber.resource) && (aJSJaCPacket.getType() === 'unavailable')) {
        // if a disconnection message comes from another resource of this user, discard this message.
        // This check prevents that the users seems to be offline 30s after page refresh
        return false;
      }

      from.setResource(new String());
      
      var presence = aJSJaCPacket.getShow()
        ,type = ''
        ,status = '',
        tmp;

      if (tmp = aJSJaCPacket.getType()) {
        type = tmp;
      }
      if (tmp = aJSJaCPacket.getStatus()) {
        status = tmp;
      }      

      roster.setPresence(from, presence, status, type);
    },

    connected: function(){
      var j = jabber;
      j.getRoster.defer(500,j);
      
      j.setPresence(j.status.presence, j.status.status, j.status.type);
    },
    
    disconnected: function(){
      var j = jabber;
      roster.clear();

      if (j.keepOffline){
        Ext.getCmp('buddylist').gridPanel.view.emptyText = 'You are offline. Click <span class="a" onclick="resetJabberConnection()"><b>here</b></span> to connect.';
        return;
      }
      
            Ext.getCmp('buddylist').gridPanel.view.emptyText = 'Nobody online or there has been problems connecting to the server.<br/><br/>Click <span class="a" onclick="resetJabberConnection()"><b>here</b></span> to try again. If you changed your password recently, please logout and login again with the new password.';
      
      if (j.nTrials++ < j.maxTrials){
        var status = j.status;
        jabberui.init(status.presence, status.status, status.type);
      }
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
      var q = iq.getQuery()
        ,r = roster;
    
      console.log(new Date(), 'new roster', q);
      //TODO: disable Buddylist refresh while inserting
      r.clear(); //i hope the new roster replaces the old one...
      $(q).find('item').each(function(){
        var t = $(this)
          ,b = new Buddy(t.attr('jid'), t.attr('subscription'),
            t.attr('name'), t.find('group').text());
        r.roster.push(b);
      });

      r.flushPresence();
    },
    
    iqRosterSet: function(iq){
      this.iqRoster(iq);
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
  Ext.apply(this, {
    jid: new JSJaCJID(jid)
    ,subscription: subscription
    ,name: name
    ,group: group
    ,presence: presence
    ,status: status
    ,type: type
  });

  for (var el in ['presence','status','type']) {
    if (typeof(this[el]) == 'undefined') 
      this[el] = '';
  }


  /**
   * Compares self to another Buddy object
   * @param {Buddy} buddy
   */
  this.compareTo = function (buddy) {
    return this.jid.toString() === buddy.jid.toString();
  };


  /**
   * Updates buddy attributes without overwriting presence data
   * @param {Buddy} buddy
   */
  this.update = function (buddy) {
    Ext.copyTo(this, buddy, 'jid,subscription,name,group');
  };
};

