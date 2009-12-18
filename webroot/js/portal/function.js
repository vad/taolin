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

/* 
 * Functions used in the js files
 */

/*
 * getInitialConfig retrieves the string representation of a json object, with the following structure
 *  json.config an array of configuration
 */

function setPortalConfiguration(f){
    Ext.Ajax.request({
        url: 'portals/getinitialconfig',
        method: 'GET',
        success: function(result, request){
            var json_decode = Ext.util.JSON.decode(result.responseText);
            window['config'] = json_decode.config;
            window['user'] = json_decode.user;
            if (f) f();
        }
    });
}

function expandUserPanel(){
    Ext.getCmp('user_profile').expand(false);
}

function expandSettingsPanel(){
    Ext.getCmp('west-panel').expand();
    Ext.getCmp('settings').expand(true);
}

function showMainTimeline(){

    var timeline = 'timeline';

    if(Ext.getCmp(timeline).collapsed)
        Ext.getCmp(timeline).expand();
    else
        reloadTimeline();
}

function reloadTimeline(){
    eventManager.fireEvent('newtimelineevent');
}

function openImageChooser(){
    var win_size = getBodySize(9/10);
    
    var chooser = Ext.getCmp('photo-chooser');
    if(!chooser){
        chooser = new PhotoChooser({
                    id:'photo-chooser',
                    url:'photos/getphotos',
                    iconCls: 'picture',
                    width: win_size[0], 
                    height:win_size[1]
                });
    }
    chooser.show(Ext.get('edit-photo-button'));
    showText(false, 'undodelphoto');
}  

function openCommentWindow(model, foreign_key){

    var comments_window = Ext.getCmp('comments_window');

    if(comments_window) // if not exist
        comments_window.close();

    new CommentWindow(model, foreign_key); // Open a new comment window
}

function showText(showtext, element){
    var slideMe = Ext.get(element); 
    if(!slideMe)
        return false;
  
    switch(showtext){  
        //determine the direction of travel  
        case false :  
                //lets check to see if this is visible and if not then its already hidden :)  
                if (slideMe.isVisible()) {  
                    //if we get here then the element is visible  
                    slideMe.slideOut('t', {  
                        easing: 'easeOut',  
                        duration: .5,  
                        remove: false,  
                        useDisplay: true  
                    });  
                }  
            break;  
        case true :  
                //lets check to see if this is visible and if it is then we do nothing :)  
                if (!slideMe.isVisible()) {  
                    //if we get here then the element is visible  
                    slideMe.slideIn('t', {  
                        easing: 'easeOut',  
                        duration: .5  
                    }); 
                }         
            break;  
        default :  
            //the default action is simply to toggle the element  
            slideMe.toggle();  
            break;
    }  
//ends the slider function    
}  

function showUserInfo(reqid, hidePanel, logparams){
    westPanel.showUser(reqid, hidePanel, logparams);
}

function performLogin(){
    Ext.Ajax.request({
        url:'accounts/checkuser',
        method: 'POST',
        params: {
            "username": document.getElementById('campouser').value,
            "password": document.getElementById('campopass').value
        }, 
        success: function(result, request) {
            var jsondata = Ext.util.JSON.decode(result.responseText);
            var contact_email = jsondata.contactus;

            if (jsondata.success) {
                if (jsondata.error.champion)
                    document.login_form.submit();
                else {
                    Ext.Msg.show({
                        title: 'Warning!',
                        msg:  'Currently, taolin is still under development and can be accessed only by a small number of Champions.<br/>If you would like to become a Champion please send us an email at '+contact_email+'<br/>Thanks!',
                        width: 400,
                        icon: Ext.MessageBox.WARNING
                     });
                
                }
            
            }
            else if (!jsondata.success) {
                Ext.Msg.show({
                    title: 'Warning!',
                    msg: '<center>The combination login and password is not correct.<br/>Please try again!</center>',
                    width: 400,
                    icon: Ext.MessageBox.WARNING
                });
            }
        
        },
        failure: function(result, request) {
            var jsondata = Ext.util.JSON.decode(result.responseText);
            var contact_email = jsondata.contactus;

            Ext.Msg.show({
                title: 'Warning!',
                msg: '<center>There is a problem connecting to the server. <br/>Please try again or send an email to '+contact_email+'!</center>',
                width: 400,
                icon: Ext.MessageBox.WARNING
            });
        }
    });
    return false;
}

//control the keycode is 13, i.e. on Windows pressing the "Enter" key is detactable as '13'
//this function is used only to detect when the user click "Enter" in the login form page and she/he is using Windows ... or something like that ;)
function maybePerformLogin(event) {
    if (window.event) event = window.event; // IE-specific
    if (event.keyCode == 13) {
        return performLogin();
    }
}

Ext.example = function(){  
    var msgCt;    
        
    function createBox(t, s) {    
        return ["<div class=\"msg\">", "<div class=\"x-box-tl\"><div class=\"x-box-tr\"><div class=\"x-box-tc\"></div></div></div>", "<div class=\"x-box-ml\"><div class=\"x-box-mr\"><div class=\"x-box-mc\"><h3>", t, "</h3>", s, "</div></div></div>", "<div class=\"x-box-bl\"><div class=\"x-box-br\"><div class=\"x-box-bc\"></div></div></div>", "</div>"].join("");    
    }    
    
    return {    
    
        msg: function(title, format, pauseTime){   
            if(!pauseTime) pauseTime = 5;

            if (!msgCt) {    
                msgCt = Ext.DomHelper.insertFirst(document.body, {    
                    id: "msg-div"
                }, true);    
            }    
            msgCt.alignTo(document, "t-t", [10,10]);
            var s = String.format.apply(String, Array.prototype.slice.call(arguments, 1));    
            var m = Ext.DomHelper.append(msgCt, {    
                html: createBox(title, s)    
            }, true);    
            m.slideIn("t").pause(pauseTime).ghost("t", {    
                remove: true    
            });    
        }    
    };    
}();


function logWidget(w_id, type, logparams){
    Ext.Ajax.request({
            url : 'widgets/donothing/'+w_id+'/'+type ,
            method: 'GET',
            params: {src: logparams},
            /*success: function(result, request){
                console.log(type);
            },*/
            failure: function(){
                Ext.Msg.show({
                    title: 'Warning!',
                    msg: '<center>Problem found in data transmission</center>',
                    width: 400,
                    icon: Ext.MessageBox.WARNING
                });
            }
    });
}


function removeWidget(w_id){
    Ext.Ajax.request({
            url : 'users_widgets/removewidget/'+w_id,
            method: 'GET',
            success: function(result, request){
                var w_name = Ext.util.JSON.decode(result.responseText)['widget_name'];
                Ext.fly('didyouknow_div').update('<span id="didyouknow_span"><table><tr><td style="padding:0 10px;">Widget '+w_name+' closed. <a href="javascript:void(0)" onclick="undoRemoveWidget('+w_id+')">Undo this action</a> or <a href="javascript:void(0)" onclick="$(\'#didyouknow_div\').hide();" style="font-size:90%;">hide this message</a></td></tr></table></span>');
                $('#didyouknow_div').show();
            },
            failure: function(){
                Ext.Msg.show({
                    title: 'Warning!',
                    msg: '<center>Problem found in data transmission</center>',
                    width: 400,
                    icon: Ext.MessageBox.WARNING
                });
            }
    });
}


function undoRemoveWidget(w_id){
    $('#didyouknow_span').toggle();
    Ext.Ajax.request({
            url : 'users_widgets/undoremovewidget/'+w_id,
            method: 'GET',
            success: function(result, request){
                var conf = Ext.util.JSON.decode(result.responseText)['widget'][0];
                createNewPortlet(conf, true);
            },
            failure: function(){
                Ext.Msg.show({
                    title: 'Warning!',
                    msg: '<center>Problem found in data transmission</center>',
                    width: 400,
                    icon: Ext.MessageBox.WARNING
                });
            }
    });
}

/*
 * This function adds a widget to main viewport
 * Parameters: w_id, widget's id as recorded in the table widgets
 * in our database
 */

function addwidget(w_id, logparams){

    Ext.Ajax.request({
            url : 'users_widgets/addwidget/'+w_id ,
            method: 'GET',
            params: {src: logparams},
            success: function(result, request){
                var conf = Ext.util.JSON.decode(result.responseText)[0];
                createNewPortlet(conf);
                eventManager.fireEvent('newtimelineevent');
                gotoWidget(w_id, false, logparams);
            },
            failure: function(){
                Ext.Msg.show({
                    title: 'Warning!',
                    msg: '<center>Problem found in data transmission</center>',
                    width: 400,
                    icon: Ext.MessageBox.WARNING
                });
            }
    });
}

function movewidgets(str){

    Ext.Ajax.request({
            url : 'users_widgets/movewidgets/'+str ,
            method: 'GET',
            /*success: function(result, request){
                Ext.MessageBox.alert(result.responseText);
                console.log('Transtion done');
            },*/
            failure: function(){
                Ext.Msg.show({
                    title: 'Warning!',
                    msg: '<center>Problem found in data transmission</center>',
                    width: 400,
                    icon: Ext.MessageBox.WARNING
                });
            }
    });
}

/*
 * This function walks through the columns in the viewport 
 * appending to a string (called result) a construct composed by
 * "widget's id" + "-" + "widget's columns" for each widget
 * (separeted by "_" char) 
 */

function setWidgetsPosition(){
    
    pc = Ext.getCmp('portal_central');
    var num_cols = pc.items.getCount();
    var result = '';

    for (var i=0; i<num_cols; i++) {
        var col = pc.items.items[i];
        for(var j=0; j<col.items.getCount(); j++){
            result += col.items.items[j].id +'-' + i + '_';
        }
    }

    movewidgets(result);
}

/*
 * widgets/getwidgetsposition is a CakePhp view defined in views/widgets/getwidgetsposition.ctp related to controlled defined in controllers/widgets_controller.php
 * 
 * widgets/getwidgetsposition returns the string representation of a json object, with the following structure
 *  json.widgets an array of widgets (for the current user), each widget has
 *   users_widgets
 *    col
 *    pos
 *    id
 *    widget_conf
 *    application_conf
 *    string_identifier
 */
function getWidgetsPosition(){
    Ext.Ajax.request({
        url: 'users_widgets/getwidgetsposition',
        method: 'GET',
        success: function(result, request){
            var widgets = Ext.util.JSON.decode(result.responseText).widgets;
           
            var pc = Ext.getCmp('portal_central');
            var num_cols = pc.items.getCount();

            for (var i=0; i<widgets.length; i++) {
                createNewPortlet(widgets[i]);
            }
        }
    });
}


/*
 * Creates a new portlet containing a widget
 * Parameters:
 * conf: widget configuration
 * defined_position: boolean, if true insert the portlet at the position defined in the conf
 */

function createNewPortlet(conf, use_widget_position){
    var pc = Ext.getCmp('portal_central');
    var col, widget;

    var column = conf.col;
    var pos = conf.pos;
    var w_id = conf.id;
    var widget_conf = conf.widget_conf;
    widget_conf['portlet_id'] = w_id;
    var portlet = conf.application_conf;
    var user_params = conf.user_params;
    var string_identifier = conf.string_identifier;
    var widget_id = conf.widget_id;
    var name = conf.name;

    var w_class = Ext.util.JSON.decode(string_identifier);

    portlet.items = new w_class(widget_conf, {portlet_id: w_id});
    portlet.id = w_id;
    portlet.widget_id = widget_id;
    portlet.string_identifier = string_identifier;
    portlet.hideCollapseTool = true;
    portlet.title = name;
    portlet.userParams = user_params; //user's configurable params (name, type, description)
    portlet.widgetConf = widget_conf; //params value
    portlet.lastConf = conf; //all the configuration
    
    if (user_params.length)
        portlet.tools = toolsconf;
    else
        portlet.tools = tools;

    if(column < window.config.num_columns){
        col = pc.items.items[column];
        insert_position = 0;
    }
    else {
        column = (column + pos) % window.config.num_columns;
        col = pc.items.items[column];
        insert_position = col.items.items.length + 1;
    }
        
    if(use_widget_position)
        portlet = col.insert(pos, portlet); // insert the portlet at the defined position
    else
        portlet = col.insert(insert_position, portlet); // insert the portlet at the first place in the column

    col.doLayout();

    /* add a setPortletTitle function to all the widgets */
    widget = portlet.items.first();
    widget.setPortletTitle = function(title) {Ext.getCmp(this.portlet_id).setTitle(title);};
    widget.setPref = function(pref, value, callback) {Ext.getCmp(this.portlet_id).setPref(pref, value, callback);};

    widget.addEvents('fullscreen', 'downsize');
}

/* This function open the window containing the details of the group */

function groupDetails(group_id, group_name, log_params){
 
    var group_win_id = 'group_details_window';
    
    var pc = $('#portal_central');
    var pco = pc.offset();
    var pcw = pc.width();
    var window_width = Math.round(pcw*(19/20))
    var pch = pc.height();
    var window_height = Math.round(pch*(19/20));
    var x = pco.left + (pcw - window_width) / 2.;
    var y = pco.top + (pch - window_height) / 2.;

    var group_window = Ext.getCmp(group_win_id);
    if(group_window && (group_window.title != group_name))
        group_window.close();
    
    group_window = new GroupDetails({ 
        id: group_win_id
        ,url: 'groups/getgroupdetails/'+group_id
        ,iconCls: 'groups'
        ,title: group_name
        ,width:window_width
        ,height:window_height
        ,x: x
        ,y: y
        ,modal: false
        ,logparams:log_params
    });

    group_window.show();
}

function suggestAsChampion(name, surname, login, email, logparams){

    Ext.Msg.show({  
        title: 'Suggest a champion',  
        msg: 'Please add a message below to be sent with your suggestions: \n',  
        icon: Ext.MessageBox.QUESTION,  
        maxWidth: 300,  
        buttons: Ext.MessageBox.OKCANCEL,  
        multiline: true,  
        fn: function(btn, text){
            if(btn === 'ok') {
                SendMail(window.config.contactus, window.user.login + ' suggested us ' + name + ' ' + surname + ' (login: ' + login + ', mail: ' + email + ') as a champion for taolin!\n\nMessage leaved by the user: ' + text, null, null, logparams);
                Ext.example.msg('Suggestion done!','You suggested ' + name + ' as a champion for taolin');
            }
        }
    });
}


/*
 * very efficient, but only if hash keys has not regex metacharacters in
*/
function multiReplace (str, hash) {
    var keys = [], key;
    for (key in hash) {
        keys.push(key);
    }
    return str.replace(new RegExp(keys.join('|'), 'g'), function ($0) {
        return hash[$0];
    });
}

/**
 * Multiple replaces regexes. Not very efficent.
 * @param {Object} hash Replaces the hash keys (as a regex) with its values
 * @member String
 * @addon
 */
String.prototype.multiReplace = function ( hash ) {
    var str = this, key;
    for ( key in hash ) {
        str = str.replace( new RegExp( key, 'g' ), hash[ key ] );
    }
    return str;
};

/* smilize */
var hi = "<img class='size16x16' src='img/icons/fugue/";
var fi = "'>";
hSmile = {
    ':-?\\)': hi+'smiley.png'+fi,
    ':-?P': hi+'smiley-razz.png'+fi,
    ':-?D': hi+'smiley-lol.png'+fi,
    ':-?\\[': hi+'smiley-red.png'+fi,
    ':-?\\(': hi+'smiley-sad.png'+fi,
    ':\'-?\\(': hi+'smiley-cry.png'+fi,
    ':-?\\o': hi+'smiley-surprise.png'+fi,
    ':-?\\|': hi+'smiley-neutral.png'+fi,
    ':-?S': hi+'smiley-confuse.png'+fi,
    'x-?D': hi+'smiley-evil.png'+fi,
    '\\;-?\\)': hi+'smiley-wink.png'+fi
};

/**
 * Replaces text smiles with HTML images
 * @member String
 * @addon
 */
String.prototype.smilize = function () {
    var s = this;
    var ta = document.createElement("textarea");
    ta.innerHTML = s.replace(/</g,"&lt;").replace(/>/g,"&gt;");
    //$(ta).remove();

    return ta.value.multiReplace(hSmile);
};

/**
 * Calculates the brightness of the RGB color in string.
 * Input string should be in format #XXXXXX or XXXXXX.
 * @return {Integer} Brightness value in range [0:255]
 * @member String
 * @addon
 */
String.prototype.getBrightness = function () {
    var s = this;
    var r,g,b;
    var ir,ig,ib;

    s = Ext.util.Format.trim(s);
    if (s[0] == '#') s = s.substring(1);

    r = s.substring(0, 2);
    ir = parseInt('0x'+r);
    g = s.substring(2, 4);
    ig = parseInt('0x'+g);
    b = s.substring(4, 6);
    ib = parseInt('0x'+b);

    //w3c:
    //((Red value X 299) + (Green value X 587) + (Blue value X 114)) / 1000
    var brightness = (ir*299 + ig*587 + ib*114)/1000;

    return brightness;
};

/**
 * define map() function if not already defined (like in IE7)
 */
if (!Array.map){
    Array.prototype.map = function(fn, thisObj) {
        var scope = thisObj || window;
        var a = [];
        for ( var i=0, j=this.length; i < j; ++i ) {
            a.push(fn.call(scope, this[i], i, this));
        }
        return a;
    };
}

function getIdFromJidNode(jidnode){
    Ext.Ajax.request({
        url : 'users/getidfromjidnode/'+jidnode ,
        method: 'GET',
        success: function ( result, request ) {
            showUserInfo(result.responseText, null, '{"source": "chat"}');
        }
    });
}

/**
 * Replaces "http://.." text with <a href=http://..>http://...</a>
 * @member String
 * @addon
 */
String.prototype.urlize = function() {
    return this.replace(/(https?:\/\/[a-zA-Z0-9\-\/\~\_\.\?\&\=\#\+\:\%\;\!\,]+)/g, '<a target="_blank" href="$1">$1</a>');
}

/*
 * bullets used by chat presence in users widgets
 */
hBullets = {
    'unavailable': 'bullet_black.png',
    'away': 'bullet_orange.png',
    'dnd': 'bullet_delete.png',
    '': 'bullet_green.png'
}

/*
 * a bool to know if window has focus
 */

/*
window.hasFocus = true;

window.onblur = function() {
    window.hasFocus = false;
}

window.onfocus = function() {
    window.hasFocus = true;
}
*/

// check if onMouseOut is true (it's raised if mouse is over an internal element too)
function mouseLeaves (element, evt) {
    if (typeof evt.toElement != 'undefined' && typeof element.contains != 'undefined') {
        return !element.contains(evt.toElement);
    }
    else if (typeof evt.relatedTarget != 'undefined' && evt.relatedTarget) {
        return !contains(element, evt.relatedTarget);
    }
}

function contains (container, containee) {
    while (containee) {
        if (container == containee) {
            return true;
        }
        if (containee.toString() == '[object XULElement]')
            return false;

        containee = containee.parentNode;
    }
    return false;
}

/* Function used to send mail to one (or more) recipients
 * recipients: mail address of the recipients
 * text: things written in the mail body
 * ccrecipients: list of email's that should receive a copy of the email.
 *  - the recipient will be able to see this list
 * bccrecipients: List of email's that should receive a copy of the email.
 *  - the recipient will NOT be able to see this list
 */

function SendMail(recipients, text, ccrecipients, bccrecipients, logparams){
    Ext.Ajax.request({
        url : 'users/sendmail'
        ,method:'POST'
        ,params: {to:recipients, text:text, cc:ccrecipients, bcc:bccrecipients, src:logparams}
        ,success: function(){
            Ext.example.msg('Your mail has been sent!', Ext.util.Format.ellipsis(text, 150));
        }
        ,failure: function(){
            Ext.Msg.show({
                title: 'Warning!',
                msg: '<center>Problem found sending your email! Please report us using feedback provider</center>',
                width: 400,
                icon: Ext.MessageBox.WARNING
            });
        }
    });
}

function range(/*[start,] stop[, step]*/) {
    //http://blog.outofhanwell.com/2006/03/29/javascript-range-function/
    if (!arguments.length) {
        return [];
    }

    var min, max, step;
    if (arguments.length == 1) {
        min = 0;
        max = arguments[0]-1;
        step = 1;
    }
    else {
        /* default step to 1 if it's zero or undefined */
        min = arguments[0];
        max = arguments[1]-1;
        step = arguments[2] || 1;
    }

    /* convert negative steps to positive and reverse min/max */
    if (step < 0 && min >= max) {
        step *= -1;

        var tmp = min;
        min = max;
        max = tmp;

        min += ((max-min) % step);
    }

    var a = [];
    for (var i = min; i <= max; i += step) {
        a.push(i);
    }
    return a;
}

//don't bother me if i've no console.*
/*if (!window.console){
    console = {};
    aAttr = ['log', 'time', 'timeEnd'];
    var attr;
    for (attr in aAttr){
        console[attr] = function(s){};
    }
}*/

/***************************************************************************
 * CHAT FUNCTIONS
 * To not be considered if the chat is not present (e.g. in the demo version)
 *
 ***************************************************************************/

//TODO: move this into jabber.js
function resetJabberConnection(){
    jabber.nTrials = 0;
    jabber.handle.disconnected();
//    return false;
}

function setChatStatus(chatStatus){
    
    var chat_status = (chatStatus !== '' && chatStatus !== null) ? '<b>Chat status:</b> <span class="deco-text">' + chatStatus + '</span><br />' : ''; 
    Ext.get('user-status').update(chat_status);
}

function findChatStatus(req, login){

    var chat_status = '';

    if((req != null) && (req != "") && (roster) && (roster != null)){
        for(var i=0;i < roster.online.length; i++){
            if((roster && roster.online[i].jid._node === login) && (roster.online[i].status != '')) {
                setChatStatus(roster.online[i].fancyStatus);
            }
        }
    }
    else if(req == null || req == ''){
        if((jabber.status) && (jabber.status != null) && (jabber.status != '')){
            setChatStatus(jabber.status.status.htmlEnc().smilize().urlize());
        }
    }
    else{
        setChatStatus('');
    }
} 

/**************************************************************************
 *
 * END CHAT FUNCTIONS
 *
 **************************************************************************/

function preparePhoto(photo){

    var winBody = '<img id="photo-'+photo['id']+'" class="ante no-hover" style="min-height:70px;margin:auto auto;display:block;" src="'+window.config.img_path+'t480x480/'+photo['filename']+'"></img>';

    var cc = photo['commentsCount'];

    if(cc > 0)
        winBody += '<span style="padding-top:15px" class="timeline-comments" onclick="openCommentWindow(\'Photo\', '+photo['id']+')"><span>'+Ext.util.Format.plural(cc, 'comment')+'</span> <img src="js/portal/shared/icons/fam/comment.png" title="View comments"></span>';
    else
        winBody += '<span style="padding-top:15px" class="timeline-comments" onclick="openCommentWindow(\'Photo\', '+photo['id']+')"><span>Add a comment</span> <img src="js/portal/shared/icons/fam/comment.png" title="Add a comment"></span>';

    winBody += photo['caption'] ? '<br /><div style="padding:5px 0 0 5px;font-family:Arial;">' + photo['caption'].replace(/\\n/g,"<br />").urlize().smilize() + '</div>' : '';

    var res = {"winWidth" : 530, "winBody": winBody };

    return res;
}

function showPhotoWindow(photo){

    photo['filename'] = Ext.util.Format.photoExtToJpg(photo['filename']);
    
    var res = preparePhoto(photo);
    var winTitle = Ext.util.Format.ellipsis(photo['name'], 50);

    var img_window = Ext.Msg.show({ 
        width: res["winWidth"], 
        title: winTitle,  
        msg: res["winBody"],  
        buttons: {no: "Close"},
        closable: true,
        iconCls: 'picture'
    });

    /* Todo: add this listeners only once!!! */
    $('#photo-'+photo['id']).load(function(){
        img_window.getDialog().center();
    });
}
   
function showPicture(p_id){

    if(p_id){
        Ext.Ajax.request({
            url:'photos/getphotos',
            method: 'POST',
            params: {
                u_id: window.user.id,
                p_id: p_id
            }, 
            success: function(result, request) {
                var jsondata = Ext.util.JSON.decode(result.responseText);
                showPhotoWindow(jsondata.photos[0]);
            },
            failure: function(){
                Ext.Msg.show({
                    title: 'Warning!',
                    msg: '<center>Problem found in data transmission</center>',
                    width: 400,
                    icon: Ext.MessageBox.WARNING
                });
            }
        });
    }
}
        
function previewWidget(widgetid, widgetname, widgetdescription, screenshot, logparams){

    var widgetimg = 'style="padding:5px;" src="img/image_error.png"';
    var winwidth = 280;

    if(screenshot){
        widgetimg = 'class="ante no-hover" style="min-height:70px;" src="img/widget/t300x300/'+screenshot+'"';
        winwidth = 440; 
    }

    var wintitle = 'Add widget ' + widgetname + '?';
    var winbody = '<div><img ' + widgetimg + ' /></div><br /><span style="font-size:120%">' + widgetdescription + '<br /><br />Add this widget?<br /></span>';

    Ext.Msg.show({  
        title: wintitle,  
        msg: winbody,  
        icon: Ext.MessageBox.QUESTION,  
        width: winwidth, 
        minHeight: 240,
        buttons: Ext.MessageBox.OKCANCEL,  
        fn: function(btn){
            if(btn == 'ok'){ 
                addwidget(widgetid, logparams);
            }else if(btn != 'cancel'){
                Ext.example.msg('Some strange error happened here...');  
            }  
        }   
    });

}

function gotoWidget(id, bounce, logparams) {

    var central_body = $('#portal_central .x-panel-body:first');
    var ttop = $('#'+id).offset().top - central_body.offset().top;
    ttop -= 20; //an offset between the widget and the top of the portal

    //non-animated scroll
    /*
    if (ttop){
        ttop += central_body.scrollTop();
        central_body.scrollTop(ttop);
    }
    */

    //animated scroll
    central_body.animate({scrollTop: '+='+ ttop +'px'},
        'normal', 'linear', function(){
            if(bounce) $('#'+id).effect("shake");
        }
    );

    var type = bounce ? 'shake' : 'goto';
    // Ext.getCmp(this.id).updateWidget();
    logWidget(id, type, logparams)
}
            
function addOrBounceWidget(identifier, type, logparams){

    if (identifier != '' && identifier != null) {

        if(!type) type = 'widget_id';
   
        var portal_central = Ext.getCmp('portal_central');

        for (var i=0, col; col=portal_central.items.items[i++];) {
            for (var j=0, p; p=col.items.items[j++];) {
                if (identifier == p[type]){
                    gotoWidget(p.id, true, logparams);
                    return;
                } 
            }
        }
        if(type=='widget_id') type = 'id';
        if(type=='id' || type =='string_identifier'){
            Ext.Ajax.request({
                url : 'widgets/getwidgetby/',
                params: {'type': type, 'value': identifier},
                method: 'POST',
                success: function(result, request){
                    var jsondata = Ext.util.JSON.decode(result.responseText);
                    previewWidget(jsondata[0].id, jsondata[0].name, jsondata[0].description, jsondata[0].screenshot, logparams);
                }
            });
        }
    }
}

function searchWidget(identifier, type){
        
    if(!type)
        type = 'widget_id';
    
    var portal_central = Ext.getCmp('portal_central');

    for (var i=0, col; col=portal_central.items.items[i++];) {
        for (var j=0, p; p=col.items.items[j++];) {
            if (identifier == p[type]){
                return true;
            } 
        }
    }

    return false;
}

/*
 * returns an array that contains body size, scaled to the given ratio
 * 
 * return: Array where 0 and 1 are width and height
 */
function getBodySize(ratio){
    var body = $("body");
    
    return [body.width(), body.height()].map(function(x){return Math.round(x*ratio)});    
}

function showFirstLoginWizard(){
    var win_size = getBodySize(9/10);
    Ext.Ajax.request({
        url: 'users/getprivacypolicyacceptance',
        success: function(result, request){
            var jsondata = Ext.util.JSON.decode(result.responseText);
            if(!jsondata.user.privacy_policy_acceptance)
                openFirstLoginWizard();
        }
        ,failure: function(){
            openFirstLoginWizard();
        }
    });
}

function openFirstLoginWizard(){
    var win_size = getBodySize(9/10);
    var win = new Ext.Window({
        id: 'wizard',
        layout:'fit'
        ,width: win_size[0]
        ,modal: true
        ,shadow: 'frame'
        ,constrain: true
        ,height: win_size[1]
        ,center: true
        ,title: 'Wizard window'
        ,closable: false
        ,items: {
            xtype: 'basicwizard'
            ,id: 'first_login_wizard'
            ,backBtnText: 'Previous'
            ,endBtnText: 'Finish'
            ,listeners: {
                'beforenav': function(dir, index){
                    
                    if ((dir == 1) && (!('next' in this) || (this.next == 0))){ // moving from card 0 to 1
                        var cb = Ext.getCmp('privacy_policy_agreement_checkbox');
                        
                        if (!cb.checked) {
                            alert("In order to proceed you have to accept the privacy policy. If you find any problem with it, please contact Human Resources. Otherwise please check the checkbox below near 'I read and accept the provacy policy' and then click the 'Continue' button. Thanks!");
                            return false;
                        }
                    }   
                    else if ((dir == 1) && (this.next == 1)){ // moving from card 1 to 2

                        var wizard_form = this.getCard(1).items.first().getForm();
                        
                        if(!wizard_form.isValid()){ // if validation of form fields fails
                            alert('Before going on with the wizard, please complete this page in its mandatory fields and checking for any inconstency');
                            return false;
                        }

                    }

                }
                ,'beforefinish': function(){

                    var wizard_form = this.getCard(1).items.first().getForm();

                    if(wizard_form){ 
                       
                        wizard_form.submit({ // submitting form 
                            success: function(){
                                eventManager.fireEvent('newtimelineevent');
                                showUserInfo(null, true); // reload user info
                                Ext.getCmp('settings').items.first().form.load(); // reload user settings
                            }
                            ,scope: this
                        });

                    }
                    
                    // User ends the initial wizard. Save this in the db
                    Ext.Ajax.request({
                        url: 'users/setprivacypolicyacceptance',
                        params: {accepted: '1'},
                        method: 'POST',
                        success: function(){
                            this.ownerCt.close(); // close wizard window
                        }
                        ,failure: function(){
                            this.ownerCt.close(); // close wizard window
                        }
                        ,scope: this
                    });
               
                }
            }
            ,onEsc: Ext.emptyFn
            ,animate: false
            ,headerConfig: {
                titleText: 'First login wizard'
                ,titleImg: 'img/wizard-wand.jpg'
            }
            ,items: [{
                index: 0
                ,trailText: 'Privacy policy'
                ,items: [
                    {
                        autoLoad: './pages/privacy_policy'
                        ,style: 'font-size: 120%;border: 1px solid'
                        ,border: false
                        ,height: win_size[1] - 180
                        ,autoScroll:true
                    }
                    ,new Ext.form.FormPanel({
                        border: false,
                        bodyStyle:'padding: 20px 0 0 10px;'
                        ,cls: 'form_settings'
                        ,items: [{
                            id: 'privacy_policy_agreement_checkbox',
                            xtype:'checkbox',
                            hideLabel: true,
                            boxLabel: 'I read and accept the privacy policy',
                            name: 'privacy_policy_agreement',
                            value: false
                        }]
                    })
                ]
            },{ 
                index: 1
                ,trailText: 'Edit your settings!'
                ,items: new Ext.ux.fbk.sonet.WizardSettings()
            },{     
                index: 2
                ,trailText: 'Further information about '+window.config.appname+'!'
                ,items: 
                    {
                        autoLoad: './pages/welcome_wizard_last_step'
                        ,style: 'font-size: 120%;'
                        ,border: false
                    }
            }]
        }
    });                                 
    win.show();
}

$.extend(Ext.util.Format, {
    pronoun: function(gender) {
        //gender = 2 => female
        if(gender == '1') { //male
            return 'his';
        }
        return 'her';
    }
    ,birth: function(d) {
        return Date.parseDate(d, "Y-m-d").format("F, d");
    }
    /*,tagCloud: function(tags){

        if(!tags) 
            return '';

        var min_font_size = 12;
        var max_font_size = 22;

        var max_count;
        var min_count;
        
        var count;
        var font_size;
        var tag_cloud = '<br /><div><ul><img class="inline" src="js/portal/shared/icons/fam/tag_blue.png" /><b>Tag cloud</b><br />';

        // Defining minimum and maximum count value
        for(var i in tags){
            if((tags[i].length < min_count) || (min_count == null))
                min_count = tags[i].length;
            else if((tags[i].length > max_count) || (max_count == null))
                max_count = tags[i].length;
        }

        var spread = max_count - min_count;
        if(spread == 0) 
            spread = 1;
       
        for(var key in tags){
            
            count = tags[key].length;
            font_size = min_font_size + (count - min_count) * ((max_font_size - min_font_size) / spread); 

            //tag_cloud += '<li style="display:inline !important;vertical-align: baseline !important;padding: 0 5px;margin: 0;"><a href="javascript:void(0)" style="font-size:'+Math.floor(font_size)+'px;line-height: 1;" onclick="console.log(\''+key+'\')" title="'+key+' tagged '+count+' times">'+key+'</a><wbr></li>';
            
            tag_cloud += '<li style="display:inline !important;vertical-align: baseline !important;padding: 0 5px;margin: 0;"><a href="javascript:void(0)" style="font-size:'+Math.floor(font_size)+'px;line-height: 1;">'+key+'</a><wbr></li>';


        }

        return tag_cloud + '</ul></div>';
    }*/
    ,removeHttp: function(url){
        return url.substr(0,7)==="http://" ? url.substr(7) : url;
    }
    ,getCmp: function(cmp) {
        return 'Ext.getCmp(\''+cmp+'\')';
    }
    ,urlize: function(s) {
        return s.urlize();
    }
    ,photoExtToJpg: function(f){
        return this.substr(f, 0, f.lastIndexOf(".")) + '.jpg'; 
    }
    ,naturalDate: function(originalDate, printHours){
        
        // Formatting Date object in order to compare it
        formattedDate = originalDate.toDateString();

        var today = new Date(), yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        // Comparing Date
        if(formattedDate == today.toDateString()){
            if(printHours){
                var diff = Math.floor((today.getTime()-originalDate.getTime())/(1000*60));
                if(diff == 0)
                    return "just now"
                else
                    return ((diff < 59) ? this.plural(diff, "minute") : this.plural(Math.floor(diff/60), "hour")) + " ago" ;
            } 
            else return 'Today';
        }
        else if(formattedDate == yesterday.toDateString())
            return printHours ? 'Yesterday at ' + originalDate.format('H:i') : 'Yesterday';
        else{
            if(today.getYear() == originalDate.getYear())
                return printHours ? originalDate.format('F, d \\a\\t H:i') : originalDate.format('F, d');
            else
                return printHours ? originalDate.format('F, d Y \\a\\t H:i') : originalDate.format('F, d Y');
        }
    }
    ,ellipseOnBreak: function(text, max){
        if (text.length <= max) return text;
        
        var ellipsedText = this.ellipsis(text, max);

        var lastBlank = ellipsedText.lastIndexOf(" ");
        var lastNewLine = ellipsedText.lastIndexOf("\n");
        
        var checkedValue = Math.max(lastBlank,lastNewLine);

        if(checkedValue <= max && checkedValue !== -1) 
            return this.ellipsis(text, checkedValue + 3);
        else 
            return ellipsedText;
    }
});

    
// Returns true if the owner of the timeline's event is the user
function isOwner(u_id){
    return window.user.id === u_id;
}

// get o[key] if set, val otherwise
function get(o, key, val) {
    return (key in o ? o[key] : val);
};
