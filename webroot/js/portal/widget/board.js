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
  * Ext.ux.fbk.sonet.Board Extension Class
  *
  * @author  Marco Frassoni and Davide Setti
  * @version 1.0
  * @class Ext.ux.fbk.sonet.Board
  * <p>Whit this widget a user can manage notice on the boards</p>
  * <pre><code>
    This is a example of the json
    </code></pre>
*/

/*
  * @constructor 
  * @param {Ext.Panel} panel_conf Configuration options
  * @param {Object} conf Configuration options
  */

Board = function(conf, panel_conf){
    Ext.apply(this, panel_conf);
    
    var limit = conf.items ? conf.items : 3;
    var showExpired = conf.showExpired ? 1 : 0;

    this.currentPage = 1;

    this.maxTextLength = 150;

    this.form = new Ext.form.FormPanel({
        autoHeight: true
        ,bodyStyle:'padding:10px;'
        ,buttonAlign: 'center'
        ,collapsed: true
        ,items: [
        {
            xtype: 'label',
            cls: 'feedback_label',
            text: "Insert here announcement to be published on board",
            anchor: '0 30%'  // anchor width by percentage and height by raw adjustment
        },{
            xtype: 'textarea',
            hideLabel: true,
            cls: 'feedback_text',
            grow: true,
            name: 'text',
            anchor: '0 50%'  // anchor width by percentage and height by raw adjustment
        },{
            xtype:'textfield',
            fieldLabel: 'Email',
            name: 'email',
            vtype:'email',
            maxLength: 50,
            anchor: '100%'
        },{
            xtype:'checkbox',
            fieldLabel: 'Does it expire?',
            name: 'expire',
            value: false,
            labelSeparator: '',
            anchor: '100%',
            listeners: {
                'check': function(cb, checked){
                    /* Another bad hack, DateField is found by the position it occupies in 
                       the array of items of this form */
                    if(!checked)
                        cb.findParentByType().form.items.items['4'].setValue(null);
                    cb.findParentByType().form.items.items['4'].setDisabled(!checked);
                }
            }
        },
        new Ext.form.DateField({
            fieldLabel: 'Expires on',
            name: 'expire_date',
            minValue: new Date(), // Can not expire before today ( today date === new Date() )
            format: 'Y-m-d',
            readOnly: true,
            disabled: true,
            anchor: '100%'
        })
        ],

        buttons: [{
            text: 'Submit',
            handler: function(){
                
                var boardStore = this.view.store;

                this.form.getForm().submit(
                    {
                        url:'boards/add',
                        waitMsg:'Saving Data...',
                        success: function(form,action){
                            var email = form.findField('email').getValue(); 
                            form.reset();
                            form.findField('email').setValue(email);
                            boardStore.load();
                        }
                    }
                );
                 
            },
            scope: this,
            formBind: true
        }]
    });

    this.showAddAdsForm = function(){
        if(this.form.collapsed) {
            Ext.getDom(this.id + '-img-view-form').src = 'js/portal/shared/icons/fam/delete.png';
            Ext.getDom(this.id + '-view-form').style.color = 'red';
            Ext.getDom(this.id + '-view-form').innerHTML = 'Hide insert message form';
            Ext.getDom(this.id + '-img-view-form2').src = 'js/portal/shared/icons/fam/delete.png';
            Ext.getDom(this.id + '-view-form2').style.color = 'red';
            Ext.getDom(this.id + '-view-form2').innerHTML = 'Hide insert message form';
            this.form.form.findField('email').setValue(window.user.email ? window.user.email : '');
            this.form.expand();
        }
        else {
            Ext.getDom(this.id + '-img-view-form').src = 'img/add.png';
            Ext.getDom(this.id + '-view-form').style.color = 'green';
            Ext.getDom(this.id + '-view-form').innerHTML = 'Add new message';
            Ext.getDom(this.id + '-img-view-form2').src = 'img/add.png';
            Ext.getDom(this.id + '-view-form2').style.color = 'green';
            Ext.getDom(this.id + '-view-form2').innerHTML = 'Add new message';
            this.form.collapse();
        }
    };
    
    this.deleteAds = function(ads_id){
        var w_id = this.getId();
        var store = this.view.store;
        Ext.MessageBox.confirm('Confirm', 'Do you really want to do delete this message?', function(btn){
            if(btn == 'yes'){
                Ext.Ajax.request({
                    url : 'boards/deleteads/'+ads_id ,
                    method: 'GET',
                    success: function(result, request){
                        Ext.get('undodelads-'+w_id).update('Message deleted. <a href="javascript:void(0)" onclick="Ext.getCmp(\''+w_id+'\').undoDeleteAds(' + ads_id + ')">Undo</a> or <a href="javascript:showText(false, \'undodelads-'+w_id+'\')">hide this message</a>');
                        showText(true, 'undodelads-'+w_id);
                        store.load();
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
        });
    };

    this.undoDeleteAds = function (ads_id){
        var w_id = this.getId();
        var store = this.view.store;
        Ext.Ajax.request({
            url : 'boards/undodeleteads/'+ads_id ,
            method: 'GET',
            success: function(result, request){
                showText(false, 'undodelads-'+w_id);
                store.load();
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
    };

    this.modifyAds = function (a_id, newvalue){
       if(a_id){
            Ext.Ajax.request({
                url : 'boards/modifyads/',
                params: {'ads_id': a_id, 'value': newvalue},
                method: 'POST',
                success: reloadTimeline,
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
    };
    
    this.startEditAds = function(id){

        var target = Ext.get(this.getId()+'-'+id+'-text');

        var item = this.view.findItemFromChild(target);
        var record = this.view.store.getAt(this.view.indexOf(item));
        var formattedString = record.data.text.replace(/(&#39;)/g,"\'");//.replace(/\n/g,"<br />");
        this.view.initialConfig.plugins[0].startEdit(target, unescape(formattedString));
        this.view.initialConfig.plugins[0].activeRecord = record;
    };

    this.formatText = function(id, expand){

        var target = Ext.get(this.getId()+'-'+id+'-text');
        var target2 = Ext.get(this.getId()+'-'+id+'-colexp');
        var item = this.view.findItemFromChild(target);
        var record = this.view.store.getAt(this.view.indexOf(item));

        if(expand){ 
            target.update(record.data.text.urlize().smilize().replace(/\n/g,"<br />"));
            target2.update('<br /><br /><a href="javascript:void(0)" onclick="Ext.getCmp(\''+this.getId()+'\').formatText('+id+', '+!expand+')">View less</a>');
        } else {
            target.update(this.view.tpl.ellipseText(record.data.text).urlize().smilize().replace(/\n/g,"<br />"));
            gotoWidget(this.portlet_id);
            target2.update('<br /><a href="javascript:void(0)" onclick="Ext.getCmp(\''+this.getId()+'\').formatText('+id+', '+!expand+')">View more</a>');
        }
    }

    this.loadPage = function(nPage){
        this.view.store.load({
            params: {
                start: limit*(nPage-1)
            }
        });
    }

    this.sendTo = function(row, recipient, name, surname ) {
        var text = this.view.store.getAt(row).json.text;
        var prefix = "Hi " + name + "! I\'m writing in response to the announcement you published on taolin board:\n\n";
        var source = '{"source": "board widget", "widget_id": "'+this.portlet_id+'"}';

        if(recipient) 
            new SendToWindow(prefix+text,[[recipient,name + " " + surname]], source);
        else 
            new SendToWindow(prefix+text, null, source);
    };
    
    this.view = new Ext.DataView({
        tpl: new Ext.XTemplate(
        '<div class="nevede-widget">',
            '<tpl for=".">',
                '<div class="user-wrapper" style="background:{[xindex % 2 === 0 ? "white" : "#ECEFF5"]};text-align:left;">',
                /* User owns the message */
                    '<tpl if="this.isOwner(user_id)">',
                        '<span id="'+this.getId()+'-{id}-text" class="x-editable" style="padding-right:15px;">',
                            '{[this.ellipseText(values.text).urlize().smilize().replace(/\n/g,"<br />")]}',
                        '</span>',
                        '<tpl if="(this.maxTextLength < text.length)">',
                            '<span id="'+this.getId()+'-{id}-colexp">',
                                '<br /><a href="javascript:void(0)" onclick="Ext.getCmp(\''+this.getId()+'\').formatText({id}, true)">View more</a>',
                            '</span>',
                        '</tpl>',
                        '<br /><br />',
                        '<span class="board-img">',
                            '<img src="js/portal/shared/icons/fam/pencil.png" onclick="Ext.getCmp(\''+this.getId()+'\').startEditAds({id})" title="Edit this message" />',
                            '<img src="js/portal/shared/icons/fam/cross.png" onclick="Ext.getCmp(\''+this.getId()+'\').deleteAds({id});" title="Delete this message" style="padding: 0 10px;" />',
                            '<tpl if="commentsCount &gt; 0">',
                                '<span onclick="openCommentWindow(\'Board\',{id})">',
                                    '{commentsCount} <img src="js/portal/shared/icons/fam/comment.png" title="View comments" />',
                                '</span>',
                            '</tpl>',
                            '<tpl if="commentsCount &lt;= 0">',
                                '<span onclick="openCommentWindow(\'Board\',{id})">',
                                    '<img src="js/portal/shared/icons/fam/comment_add.png" title="Add a comment">',
                                '</span>',
                            '</tpl>',
                        '</span>',
                        '<span style="color:#888888;font-size:90%;">',
                            'Created on {[Date.parseDate(values.created, "Y-m-d H:i:s").format("F j, Y")]}',
                        '</span><br />',
                       '<tpl if="expire_date!=null">',
                            '<span style="color:#888888;">',
                                'Expires on {[Date.parseDate(values.expire_date, "Y-m-d").format("F j, Y")]}',
                            '</span><br />',
                       '</tpl>',
                    '</tpl>',

                /* User is not the owner of the message */    
                    '<tpl if="!this.isOwner(user_id)">',
                        '<span id="'+this.getId()+'-{id}-text" style="padding-right:15px;">',
                            '{[this.ellipseText(values.text).urlize().smilize().replace(/\n/g,"<br />")]}',
                        '</span>',
                        '<tpl if="(this.maxTextLength < text.length)">',
                            '<span id="'+this.getId()+'-{id}-colexp">',
                                '<br /><a href="javascript:void(0)" onclick="Ext.getCmp(\''+this.getId()+'\').formatText({id}, true)">View more</a>',
                            '</span>',
                        '</tpl>',
                        '<br /><br />',
                        '<span class="board-img">',
                            '<tpl if="email != null && email != \'\'">',
                                '<img src="js/portal/shared/icons/fam/email.png" onclick="Ext.getCmp(\''+this.getId()+'\').sendTo(({[xindex]} - 1), \'{email}\',\'{name}\',\'{surname}\');" title="Contact owner" />',
                            '</tpl>',
                            '<img src="js/portal/shared/icons/fam/user.png" onclick="showUserInfo({user_id}, null, \'' + Ext.util.Format.htmlEncode('{"source": "board widget", "widget_id": "{this.parent_id}"}') + '\')" title="View owner profile" style="padding: 0 10px;" />',
                            '<tpl if="commentsCount &gt; 0">',
                                '<span onclick="openCommentWindow(\'Board\',{id})">',
                                    '{commentsCount} <img src="js/portal/shared/icons/fam/comment.png" title="View comments" />',
                                '</span>',
                            '</tpl>',
                            '<tpl if="commentsCount &lt;= 0">',
                                '<span onclick="openCommentWindow(\'Board\',{id})"><img src="js/portal/shared/icons/fam/comment_add.png" title="Add a comment"></span>',
                            '</tpl>',
                        '</span>',
                        '<span style="color:#888888;font-size:90%;padding-right:15px;">',
                            'Created on {[Date.parseDate(values.created, "Y-m-d H:i:s").format("F j, Y")]} by ',
                        /* span's onclick lead to misfunctionalities of DataView.indexOf(someitem) */
                            '<a style="color:#888888" href="javascript:void(0)" onclick="showUserInfo({user_id}, null, \'' + Ext.util.Format.htmlEncode('{"source": "board widget", "widget_id": "{this.parent_id}"}') + '\')">{name} {surname}</a>',
                            '<tpl if="email != null && email != \'\'">',
                                ' <a style="color:#888888" href="javascript:void(0)" onclick="Ext.getCmp(\''+this.getId()+'\').sendTo(({[xindex]} - 1), \'{email}\',\'{name}\',\'{surname}\');">&lt;{email}&gt;</a>',
                            '</tpl>',
                        '</span><br />',
                        '<tpl if="expire_date!=null">',
                            '<span style="color:#888888;font-size:90%;">',
                                'Expires on {[Date.parseDate(values.expire_date, "Y-m-d").format("F j, Y")]}',
                            '</span><br />',
                        '</tpl>',
                    '</tpl>',
                '</div>',
            '</tpl>',

            /* Paging... */
            '<div style="padding-top:10px;" class="pages">Pages: ',
                '<tpl for="this.pages()">',
                    '<tpl if="this.getPageNumber() != xindex">',
                        '<a href="javascript:void(0)" onclick="Ext.getCmp(\''+this.getId()+'\').loadPage({.+1})" class="page">{.+1}</a>',
                    '</tpl>',
                    '<tpl if="this.getPageNumber() == xindex">',
                        '<span class="page">{.+1}</span>',
                    '</tpl>',
                '</tpl>',
            '</div>',
        '</div>', 
        {
            isOwner: function(u_id){
                return window.user.id === u_id;
            }
            ,pages: function(){
                return range(Math.ceil(this.parent.view.store.reader.jsonData.totalCount/limit));
            }
            ,getPageNumber: function(){
                return this.parent.currentPage;
            }
            ,ellipseText: function(text){
                
                if(text.length > this.maxTextLength){

                    var ellipsedText = Ext.util.Format.ellipsis(text, this.maxTextLength);

                    var lastBlank = ellipsedText.lastIndexOf(" ");
                    var lastNewLine = ellipsedText.lastIndexOf("\n");
                    
                    var checkedValue = Math.max(lastBlank,lastNewLine);

                    if(checkedValue <= this.maxTextLength && checkedValue !== -1) 
                        return Ext.util.Format.ellipsis(text, checkedValue + 3);
                    else 
                        return ellipsedText;
                }

                else return text;

            }
            ,maxTextLength: this.maxTextLength
            ,parent_id: this.portlet_id
            ,parent: this
        }
        ),
	    itemSelector: 'span:first-child',
        emptyText: '<div style="padding:10px;">There are no messages on the board, what about <a href="javascript:void(0)" onclick="Ext.getCmp(\''+this.getId()+'\').showAddAdsForm()">creating a new one</a>?</div><br />',
        loadingText: 'Loading announcements, please wait...',
        plugins: [
            new Ext.DataView.LabelEditor({
                dataIndex: 'text',
                autoSize: 'width',
                /* False because we introduced another listeners for specialkey
                 * that saves edit on "Esc"
                 */
                cancelOnEsc: false,
                ignoreNoChange: true,
                hideEl : true,
                listeners: {
                    'beforecomplete' : function(editor, newvalue, oldvalue) {
                                            // if the value changed, save it!
                                            // Maybe redundant, cause of ignoreNoChange = true in the plugin
                                            if(newvalue != oldvalue)
                                                this.activeRecord.store.parent.modifyAds(editor.activeRecord.data.id, newvalue);
                                        }
                    ,'specialkey' : function(field, key) {
                                        /* If the key pressed is ESC (ESC key code = 27)
                                         * complete the edit of the field
                                         */
                                        if(key.getKey() == Ext.EventObject.ESC){
                                            // Stopping the event fired by Esc key pression, otherwise the asyncuhronous communication will fail
                                            key.stopEvent();
                                            // Stop editing this field
                                            this.completeEdit();
                                        }
                                    }
                }
            })
        ],
	    store: new Ext.data.JsonStore({
            autoLoad: true,
            url: 'boards/getads',
            method: 'POST',
            root: 'boards',
            totalProperty: 'totalCount',
            fields: ['id','user_id','text','email','created','expire_date','name','surname','commentsCount'],
            baseParams: { 
                limit: limit,
                show_expired: showExpired
            },
            listeners:{
                beforeload: {
                    fn:function(store, index){
                        if((!index.params) || (!index.params.start) || (index.params.start) === '0') this.currentPage = 1;
                        else this.currentPage = ((index.params.start/limit)+1);
                        
                    },
                    scope: this
                }
                ,load: function(store, records, options){
                        var boardwidget = $('#'+this.parent.getId()+' .nevede-widget');
                        var imgs = boardwidget.find('.board-img');

                        /* hoverIntent provided some problems with tooltip so we
                         * decided to switch back to hover even if it doesn't
                         * completely work with IE */

                        boardwidget.hover(function(){
                                            imgs.css({visibility: 'visible'});
                                        }, function(){
                                            imgs.css({visibility: 'hidden'});
                        });
                }
            }
            ,parent: this
        })
    });
    
    Board.superclass.constructor.call(this, {
        autoHeight: true,
        autoWidth: true,
        defaults: { autoScroll: true },
        items: [{
            style: 'padding: 5px 5px 0 5px;',
            html: '<div><img id="'+this.getId()+'-img-view-form2" style="margin-right:5px;" width="10px" height="10px" src="img/add.png" /> <span id="'+this.getId()+'-view-form2" class="underlineHover" style="color:green;text-align:left;line-height:150%;font-size:90%;font-family:Verdana;" onclick="Ext.getCmp(\''+this.getId()+'\').showAddAdsForm()">Add new message</span></div>'
        },{
            html: '<div id="undodelads-'+this.getId()+'" class="undodel border_radius_5px" style="padding: 2px 0;margin: 2px 10px;"></div>',
            display: 'none',
            border: false
		},{
            items: this.view
        },{
            style: 'padding:5px;',
            html: '<div style="overflow:hidden;"><span><a href="javascript:void()" onclick="Ext.getCmp(\''+this.getId()+'\').loadPage(Ext.getCmp(\''+this.getId()+'\').currentPage);" style="float:right;cursor:pointer;padding:0 5px;">Reload</a></span><img id="'+this.getId()+'-img-view-form" style="margin-right:5px;" width="10px" height="10px" src="img/add.png" /> <span id="'+this.getId()+'-view-form" class="underlineHover" style="color:green;text-align:left;line-height:150%;font-size:90%;font-family:Verdana;" onclick="Ext.getCmp(\''+this.getId()+'\').showAddAdsForm()">Add new message</span></div>'
        },{
            items: this.form
        }]
    });

};

Ext.extend(Board, Ext.Panel); 
