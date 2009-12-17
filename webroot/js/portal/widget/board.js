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
    
    var limit = get(conf, 'items', 3);
    var showExpired = conf.showExpired ? 1 : 0;

    this.currentPage = 1;

    this.maxTextLength = 150;

    this.eventManager = eventManager;
    this.logSource = '{"source": "board widget", "widget_id": "'+this.portlet_id+'"}';
    var fm = Ext.util.Format;

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
                var em = this.eventManager;

                this.form.getForm().submit(
                    {
                        url:'boards/add',
                        waitMsg:'Saving Data...',
                        success: function(form,action){
                            var email = form.findField('email').getValue(); 
                            form.reset();
                            form.findField('email').setValue(email);
                            boardStore.load();
                            em.fireEvent('newtimelineevent');
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
            this.form.form.findField('email').setValue(get(window.user, 'email', ''));
            this.form.expand();
        }
        else {
            var id = this.id, icon = 'img/add.png', text = 'Add new message',
                color = 'green';

            Ext.getDom(id + '-img-view-form').src = icon;
            Ext.getDom(id + '-view-form').style.color = color;
            Ext.getDom(id + '-view-form').innerHTML = text;
            Ext.getDom(id + '-img-view-form2').src = icon;
            Ext.getDom(id + '-view-form2').style.color = color;
            Ext.getDom(id + '-view-form2').innerHTML = text;
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
            var board = this;

            Ext.Ajax.request({
                url : 'boards/modifyads/',
                params: {'ads_id': a_id, 'value': newvalue},
                method: 'POST',
                success: function(){
                    eventManager.fireEvent('newtimelineevent');
                    
                    if(board.maxTextLength < newvalue.length)
                        board.formatText(a_id, true);
                    else
                        board.formatText(a_id, false);
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
    };
    
    this.startEditAds = function(id){

        var l_e = this.view.initialConfig.plugins[0];
        var t_id = this.getId()+'-'+id+'-text';
        var target = Ext.get(t_id);
        var record = this.view.store.getById(id);
        var formattedString = record.data.text.replace(/(&#39;)/g,"\'");//.replace(/\n/g,"<br />");

        // Adjust editor size
        this.formatText(id, true);

        width = $('#'+t_id).width() + 20;
        height = $('#'+t_id).height() + 20;

        l_e.setSize(width, height);

        // Start edit
        l_e.startEdit(target, unescape(formattedString));
        l_e.activeRecord = record;
    };

    this.formatText = function(id, expand){

        var record = this.view.store.getById(id);

        var target = Ext.get(this.getId()+'-'+id+'-text');
        var target2 = Ext.get(this.getId()+'-'+id+'-colexp');

        var s = record.data.text;

        if(!target2)
            return true; 
        else if(s.length <= this.maxTextLength){
            target2.update('');
            return true;
        }

        if(expand){ 
            target.update(s.urlize().smilize().replace(/\n/g,"<br />"));
            target2.update('<a href="javascript:void(0)" onclick="Ext.getCmp(\''+this.getId()+'\').formatText('+id+', '+!expand+')">View less</a>');
        } else {
            target.update(fm.ellipseOnBreak(s, this.maxTextLength).urlize().smilize().replace(/\n/g,"<br />"));
            gotoWidget(this.portlet_id);
            target2.update('<a href="javascript:void(0)" onclick="Ext.getCmp(\''+this.getId()+'\').formatText('+id+', '+!expand+')">View more</a>');
        }
        return true;
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
        var prefix = "Hi " + name + "! I\'m writing in response to the announcement you published on the "+window.config.appname+" board:\n\n";

        if(recipient) 
            new SendToWindow(prefix+text,[[recipient,name + " " + surname]], this.logSource);
        else 
            new SendToWindow(prefix+text, null, this.logSource);
    };
    
    this.view = new Ext.DataView({
        tpl: new Ext.XTemplate(
        '<div class="board-widget">',
            '<tpl for=".">',
                '<div id="{this.boardId}-{id}-wrapper" class="user-wrapper" style="background:{[xindex % 2 === 0 ? "white" : "#ECEFF5"]};text-align:left;">',
                /* User owns the message */
                    '<tpl if="isOwner(user_id)">',
                        '<span id="{this.boardId}-{id}-text" class="x-editable" style="padding-right:15px;">',
                            '{text:this.formatMsg}',
                        '</span>',
                        '<tpl if="(this.maxTextLength < text.length)">',
                            '<br /><br />',
                            '<span class="expander" id="{this.boardId}-{id}-colexp">',
                                '<a href="javascript:void(0)" onclick="{this.boardId:getCmp}.formatText({id}, true)">View more</a>',
                            '</span>',
                        '</tpl>',
                        '<br /><br />',
                        '<span class="board-img">',
                            '<img src="js/portal/shared/icons/fam/pencil.png" onclick="{this.boardId:getCmp}.startEditAds({id})" title="Edit this message" />',
                            '<img src="js/portal/shared/icons/fam/cross.png" onclick="{this.boardId:getCmp}.deleteAds({id});" title="Delete this message" style="padding: 0 10px;" />',
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
                            'Created on {[Date.parseDate(values.created, "Y-m-d H:i:s").format("F j, Y")]} by me',
                            '<br />',
                            '<tpl if="expire_date!=null">',
                                'Expires on {[Date.parseDate(values.expire_date, "Y-m-d").format("F j, Y")]}',
                            '</tpl>',
                        '</span><br />',
                    '</tpl>',

                /* User is not the owner of the message */    
                    '<tpl if="!isOwner(user_id)">',
                        '<span id="{this.boardId}-{id}-text" style="padding-right:15px;">',
                            '{text:this.formatMsg}',
                        '</span>',
                        '<tpl if="(this.maxTextLength < text.length)">',
                            '<br /><br />',
                            '<span class="expander" id="{this.boardId}-{id}-colexp">',
                                '<a href="javascript:void(0)" onclick="{this.boardId:getCmp}.formatText({id}, true)">View more</a>',
                            '</span>',
                        '</tpl>',
                        '<br /><br />',
                        '<span class="board-img">',
                            '<tpl if="email != null && email != \'\'">',
                                '<img src="js/portal/shared/icons/fam/email.png" onclick="{this.boardId:getCmp}.sendTo(({[xindex]} - 1), \'{email}\',\'{name}\',\'{surname}\');" title="Contact owner" />',
                            '</tpl>',
                            '<img src="js/portal/shared/icons/fam/user.png" onclick="showUserInfo({user_id}, null, \'{this.logSource}\')" title="View owner profile" style="padding: 0 10px;" />',
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
                            '<a style="color:#888888" href="javascript:void(0)" onclick="showUserInfo({user_id}, null, \'{this.logSource}\')">{name} {surname}</a>',
                            '<tpl if="email != null && email != \'\'">',
                                ' <a style="color:#888888" href="javascript:void(0)" onclick="{this.boardId:getCmp}.sendTo(({[xindex]} - 1), \'{email}\',\'{name}\',\'{surname}\');">&lt;{email}&gt;</a>',
                            '</tpl>',
                            '<br />',
                            '<tpl if="expire_date!=null">',
                                'Expires on {[Date.parseDate(values.expire_date, "Y-m-d").format("F j, Y")]}',
                            '</tpl>',
                        '</span><br />',
                    '</tpl>',
                '</div>',
            '</tpl>',

            /* Paging... */
            '<div style="padding-top:10px;" class="pages h-center">Pages: ',
                '<tpl for="this.pages()">',
                    '<tpl if="this.getPageNumber() != (values+1)">',
                        '<a href="javascript:void(0)" onclick="{this.boardId:getCmp}.loadPage({.+1})" class="page">{.+1}</a>',
                    '</tpl>',
                    '<tpl if="this.getPageNumber() == (values+1)">',
                        '<span class="page">{.+1}</span>',
                    '</tpl>',
                '</tpl>',
            '</div>',
        '</div>', 
        {
            compiled:true
            ,maxTextLength: this.maxTextLength
            ,logSource: fm.htmlEncode(this.logSource)
            ,pages: function(){
                var min = Math.max(0,this.getPageNumber()-5);
                var max = Math.min(min+10, Math.ceil(this.parent.view.store.reader.jsonData.totalCount/limit));

                return range(min, max);
            }
            ,getPageNumber: function(){
                return this.parent.currentPage;
            }
            ,parent_id: this.portlet_id
            ,parent: this
            ,formatMsg: function(s) {
                return fm.ellipseOnBreak(s, this.maxTextLength).urlize().smilize().replace(/\n/g,"<br />");
            }
            ,boardId: this.getId()
        }
        ),
	    itemSelector: 'span:first-child',
        emptyText: '<div style="padding:10px;">There are no messages on the board, what about <a href="javascript:void(0)" onclick="Ext.getCmp(\''+this.getId()+'\').showAddAdsForm()">creating a new one</a>?</div><br />',
        loadingText: 'Loading announcements, please wait...',
        plugins: [
            new Ext.DataView.LabelEditor({
                dataIndex: 'text',
                /* False because we introduced another listeners for specialkey
                 * that saves edit on "Esc"
                 */
                cancelOnEsc: false,
                ignoreNoChange: true,
                hideEl : true,
                listeners: {
                    'beforecomplete' : function(editor, newvalue, oldvalue) {
                                            // if the value changed, save it! Maybe this is redundant, cause of ignoreNoChange = true in the plugin
                                            p = this.view.store.parent;

                                            if(newvalue != oldvalue)
                                                p.modifyAds(editor.activeRecord.data.id, newvalue);

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
                        var boardwidget = $('#'+this.parent.getId()+' .board-widget');
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
            html: '<div><img id="'+this.getId()+'-img-view-form2" style="margin-right:5px;" width="10px" height="10px" src="img/add.png" /> <span id="'+this.getId()+'-view-form2" class="u-hover board-menu" style="color:green;" onclick="Ext.getCmp(\''+this.getId()+'\').showAddAdsForm()">Add new message</span></div>'
        },{
            html: '<div id="undodelads-'+this.getId()+'" class="undodel border_radius_5px" style="padding: 2px 0;margin: 2px 10px;"></div>',
            display: 'none',
            border: false
		},{
            items: this.view
        },{
            style: 'padding:5px;',
            html: '<div style="overflow:hidden;"><span class="u-hover board-menu"><a href="javascript:void()" onclick="Ext.getCmp(\''+this.getId()+'\').loadPage(Ext.getCmp(\''+this.getId()+'\').currentPage);" style="float:right;cursor:pointer;padding:0 5px;">Reload</a></span><img id="'+this.getId()+'-img-view-form" style="margin-right:5px;" width="10px" height="10px" src="img/add.png" /> <span id="'+this.getId()+'-view-form" class="u-hover board-menu" style="color:green;" onclick="Ext.getCmp(\''+this.getId()+'\').showAddAdsForm()">Add new message</span></div>'
        },{
            items: this.form
        }]
    });

    this.eventManager.on("addcomment", function(model){ 
        if(model && model === 'boards') 
            this.view.store.reload(); 
    }, this);

    this.eventManager.on("removecomment", function(model){ 
        if(model && model === 'boards') 
            this.view.store.reload(); 
    }, this);
};

Ext.extend(Board, Ext.Panel); 
