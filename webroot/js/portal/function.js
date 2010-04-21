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
 * Functions used in js files
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
            config = json_decode.config;
            user = json_decode.user;
            if (f) f();
        }
    });
}

function expandUserPanel(){
    Ext.getCmp('user_profile').expand(false);
}

function expandUserEditProfilePanel(){
    Ext.getCmp('edit_profile').expand(true);
}

function expandSettingsPanel(){
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

function changeExtTheme(t){

    var pref = 'ext-themes/css/xtheme-';
    var default_theme = 'tp';
    var theme;

    if(t != '' && t != 'blue')
        theme = pref + t + '.css';
    else
        theme = '';

    if(t != default_theme)
        Ext.util.CSS.removeStyleSheet('theme-sprite');
        
    Ext.util.CSS.swapStyleSheet('theme', theme);
}

function changeBg(bg){
    if(typeof bg != 'undefined' && bg != ''){
        config.background = bg;
        $('.desktop .x-column-layout-ct').css('background','transparent url('+bg+') repeat scroll 50% 50%');
    }
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
            username: $('#campouser').val(),
            password: $('#campopass').val()
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
        params: {src: Ext.util.JSON.encode(logparams)},
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
            $("#didyouknow_span tr")
                .html(
                    $('<td>')
                        .css('padding','0 10px')
                        .html('Widget '+w_name+' has been removed. <b><span class="a" onclick="undoRemoveWidget('+w_id+')">Undo this action</span></b> or <span class="a" onclick="$(\'#didyouknow_div\').hide();" style="font-size:90%;">close this message</span>'
                        )
                );
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
    $('#didyouknow_div').hide();
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
        params: {src: Ext.util.JSON.encode(logparams)},
        success: function(result, request){
            var conf = Ext.util.JSON.decode(result.responseText)[0];
            createNewPortlet(conf);
            eventManager.fireEvent('newtimelineevent');
            gotoWidget(conf.id, false, logparams);
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
    
    var pc = Ext.getCmp('portal_central')
        ,num_cols = pc.items.getCount()
        ,result = '';

    for (var i=0; i<num_cols; i++) {
        var col = pc.items.items[i].items;
        for(var j=0; j<col.getCount(); j++){
            result += col.items[j].id +'-' + i + '_';
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
            Ext.get('loading').remove();
            Ext.get('loading-mask').fadeOut({remove:true});

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
    var pc = Ext.getCmp('portal_central'),
        col,
        widget,
        column = conf.col,
        pos = conf.pos,
        w_id = conf.id,
        widget_conf = conf.widget_conf,
        portlet = conf.application_conf,
        user_params = conf.user_params,
        string_identifier = conf.string_identifier,
        widget_id = conf.widget_id,
        name = conf.name,
        w_class = Ext.util.JSON.decode(string_identifier);

    widget_conf.portlet_id = w_id;

    Ext.apply(portlet, {
        items: new w_class(widget_conf, {portlet_id: w_id})
        ,id: w_id
        ,widget_id: widget_id
        ,string_identifier: string_identifier
        ,hideCollapseTool: true
        ,title: name
        ,userParams: user_params //user's configurable params (name, type, description)
        ,widgetConf: widget_conf //params value
        ,lastConf: conf //all the configuration
    });
    
    if (user_params.length)
        portlet.tools = toolsconf;
    else
        portlet.tools = tools;

    if(column < config.num_columns){
        col = pc.items.items[column];
        insert_position = 0;
    }
    else {
        column = (column + pos) % config.num_columns;
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
    Ext.apply(widget, {
        setPortletTitle: function(title) {
            Ext.getCmp(this.portlet_id).setTitle(title);
        }
        ,setPref: function(pref, value, callback) {
            Ext.getCmp(this.portlet_id).setPref(pref, value, callback);
        }
    });

    widget.addEvents('fullscreen', 'downsize', 'collapse', 'expand');
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
                SendMail(config.contactus, 'Champion suggestion for '+config.appname, user.login + ' suggested us ' + name + ' ' + surname + ' (login: ' + login + ', mail: ' + email + ') as a champion for taolin!\n\nMessage leaved by the user: ' + text, null, null, logparams);
                Ext.example.msg('Suggestion done!','You suggested ' + name + ' as a champion for taolin');
            }
        }
    });
}


/*
 * very efficient, but only if hash keys has not regex metacharacters in
*/
/*
function multiReplace (str, hash) {
    var keys = [], key;
    for (key in hash) {
        keys.push(key);
    }
    return str.replace(new RegExp(keys.join('|'), 'g'), function ($0) {
        return hash[$0];
    });
}
*/

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
var hSmile = {
    ':-?\\)': hi+'smiley.png'+fi,
    ':-?P': hi+'smiley-razz.png'+fi,
    ':-?D': hi+'smiley-lol.png'+fi,
    ':-?\\[': hi+'smiley-red.png'+fi,
    ':-?\\(': hi+'smiley-sad.png'+fi,
    ':\'-?\\(': hi+'smiley-cry.png'+fi,
    '\\;-?\\(': hi+'smiley-cry.png'+fi,
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
    // this removes every htmlEncode! WARNING!
    /*
        var ta = document.createElement("textarea");
        ta.innerHTML = this.replace(/</g,"&lt;").replace(/>/g,"&gt;");
        return ta.value.multiReplace(hSmile);
    */

    return this.multiReplace(hSmile);
};

/**
 * Calculates the brightness of the RGB color in string.
 * Input string should be in format #XXXXXX or XXXXXX.
 * @return {Integer} Brightness value in range [0:255]
 * @member String
 * @addon
 */
String.prototype.getBrightness = function () {
    var s = this
        ,r,g,b
        ,ir,ig,ib;

    s = Ext.util.Format.trim(s);
    if (s[0] == '#') s = s.substring(1);

    var rgb = new Array();
    for (var i=0; i < s.length; i+=2) {
        rgb.push(parseInt(s.substring(i, i+2), 16));
    }

    //w3c:
    //((Red value X 299) + (Green value X 587) + (Blue value X 114)) / 1000
    return (rgb[0]*299 + rgb[1]*587 + rgb[2]*114)/1000;
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
            showUserInfo(result.responseText, null, {source: "chat"});
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

function SendMail(recipients, subject, text, ccrecipients, bccrecipients, logparams){
    Ext.Ajax.request({
        url : 'users/sendmail'
        ,method:'POST'
        ,params: {to:recipients, subject: subject, text:text, cc:ccrecipients, bcc:bccrecipients, src:Ext.util.JSON.encode(logparams)}
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

/***************************************************************************
 * CHAT FUNCTIONS
 * To not be considered if the chat is not present (e.g. in the demo version)
 *
 ***************************************************************************/

//TODO: move this into jabber.js
function resetJabberConnection(){
    jabber.nTrials = 0;
    jabber.handle.disconnected();

    Ext.getCmp(Ext.getCmp('buddylist').portlet_id).updateWidget();
//    return false;
}

function setChatStatus(chatStatus){
    
    var chat_status = (chatStatus) ? '<span class="deco-text">' + chatStatus + '</span><br />' : ''; 
    $('#user-status').html(chat_status);
}

function findChatStatus(req, login){
    var chat_status = ''
        ,j = jabber
        ,r = roster
        ,online = r.online
        ,fm = Ext.util.Format;

    if (r) {
        if(req){
            login += '@'+config.jabber_domain;
            for(var i=0;i < online.length; i++){
                if((r && online[i].jid === login) && (online[i].status != '')) {
                    setChatStatus(online[i].fancyStatus);
                }
            }
        } else { // my status
            if((j.status) && (j.status != null) && (j.status != '')){
                setChatStatus(fm.htmlEncode(j.status.status).smilize().urlize());
            }
        }
    } else {
        setChatStatus('');
    }
} 

/**************************************************************************
 *
 * END CHAT FUNCTIONS
 *
 **************************************************************************/
var photoWindowTemplate = new Ext.XTemplate(
    '<img id="photo-{id}" class="ante no-hover" style="min-height:70px;margin:auto auto;display:block;" src="{[config.img_path]}t480x480/{filename}" /><br />',
    /* COMMENTS */
    '<span class="timeline-comments" onclick="openCommentWindow(\'Photo\',{id}, {source:\'photoWindow\',id:{id}})">',
        '<tpl if="commentsCount &gt; 0">',
            '<span>{commentsCount:plural("comment")}</span>',
            '<span class="sprited comment-icon" title="View {commentsCount:plural("comment")}"></span>',
        '</tpl>',
        '<tpl if="!commentsCount">',
            '<span>Add a comment</span>',
            '<span class="sprited comment-add" title="Add a comment"></span>',
        '</tpl>',
    '</span>',
    /* END OF COMMENTS */
    '<tpl if="caption">',
        '<br />',
        '<div style="padding:5px 0 0 5px;font-family:Arial;">{[values.caption.replace(/\\n/g,"<br />").urlize().smilize()]}</div>',
    '</tpl>'
    ,{
        compiled:true
    }
);


function showPhotoWindow(photo){
    photo.filename = Ext.util.Format.photoExtToJpg(photo.filename);
    
    var winTitle = Ext.util.Format.ellipsis(photo['name'], 50);

    var img_window = Ext.Msg.show({ 
        width: 530, 
        title: winTitle,  
        msg: photoWindowTemplate.apply(photo),
        buttons: {no: "Close"},
        closable: true,
        iconCls: 'picture'
    });

    /* Todo: add this listeners only once!!! */
    $('#photo-'+photo['id']).load(function(){
        img_window.getDialog().center();
    });
}
   
function showPicture(p_id, u_id){

    if(typeof u_id == 'undefined')
        u_id = user.id

    if(p_id){
        Ext.Ajax.request({
            url:'photos/getphotos',
            method: 'GET',
            params: {
                u_id: u_id,
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

    var widgetimg = 'style="padding:5px;" src="img/image_error.png"'
        ,winwidth = 280;

    if(screenshot){
        var s = Ext.util.Format.imageThumbPath(screenshot, 300, 300);
        widgetimg = 'class="ante no-hover" style="min-height:70px;" src="'+s+'"';
        winwidth = 440; 
    }

    var wintitle = 'Add widget ' + widgetname + '?'
        ,winbody = '<div><img ' + widgetimg + ' /></div><br /><span style="font-size:120%">' + widgetdescription + '<br /><br />Add this widget?<br /></span>';

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
                method: 'GET',
                success: function(result, request){
                    var widget = Ext.util.JSON.decode(result.responseText)['widget'];
                    previewWidget(widget.id, widget.name, widget.description, widget.screenshot, logparams);
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

$.extend(Ext.util.Format, {
    pronoun: function(gender, type) { 
        var p;

        /* type == 1 subjective pronoun
           type == 2 objective pronoun
           default possessive pronoun */

        switch(type) {
            case 1:
                p = (gender == '1') ? 'he' : 'she';
                break;
            case 2:
                p = (gender == '1') ? 'him' : 'her';
                break;
            default:
                p = (gender == '1') ? 'his' : 'her';
            }
            
            return p;
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

            //tag_cloud += '<li style="display:inline !important;vertical-align: baseline !important;padding: 0 5px;margin: 0;"><span class="a" style="font-size:'+Math.floor(font_size)+'px;line-height: 1;" onclick="console.log(\''+key+'\')" title="'+key+' tagged '+count+' times">'+key+'</span><wbr></li>';
            
            tag_cloud += '<li style="display:inline !important;vertical-align: baseline !important;padding: 0 5px;margin: 0;"><span class="a" style="font-size:'+Math.floor(font_size)+'px;line-height: 1;">'+key+'</span><wbr></li>';


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
    ,imageThumbPath: function(img, width, height){
        var s = img.lastIndexOf("/")
            ,path = this.substr(img, 0, s)
            ,filename = this.substr(img, s + 1, img.length - s);
        
        return String.format('{0}/t{1}x{2}/{3}', path, width, height, filename); 
    }
    ,naturalDate: function(originalDate, printHours){
        
        // Formatting Date object in order to compare it
        formattedDate = originalDate.toDateString();

        var today = new Date(),
            yesterday = (new Date());
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
            else
                return 'Today';
        }
        else if(formattedDate == yesterday.toDateString())
            return printHours ? 'Yesterday at ' + originalDate.format('H:i') : 'Yesterday';
        else{
            var format;
            if(today.getYear() == originalDate.getYear())
                format = printHours ? 'F, d \\a\\t H:i' : 'F, d'; 
            else
                format = printHours ? 'F, d Y \\a\\t H:i' : 'F, d Y';
            
            return originalDate.format(format);
        }
    }
    ,ellipseOnBreak: function(text, max){
        if (text.length <= max)
            return text;
        
        var ellipsedText = this.ellipsis(text, max)
            ,lastBlank = ellipsedText.lastIndexOf(" ")
            ,lastNewLine = ellipsedText.lastIndexOf("\n")
            ,checkedValue = Math.max(lastBlank,lastNewLine);

        if(checkedValue <= max && checkedValue !== -1) 
            return this.ellipsis(text, checkedValue + 3);
        return ellipsedText;
    }
});

    
// Returns true if the owner of the timeline's event is the user
function isOwner(u_id){
    return user.id === u_id;
}

// get o[key] if set, val otherwise
function get(o, key, val) {
    return (key in o ? o[key] : val);
};

function play(s) {
    return $('#jplayer').jPlayer('setFile', 'sound/'+s+'.mp3', 'sound/'+s+'.ogg').jPlayer('play');
}
