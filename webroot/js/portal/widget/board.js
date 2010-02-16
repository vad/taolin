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
    
    var limit = get(conf, 'items', 3)
        ,showExpired = conf.showExpired ? 1 : 0
        ,fm = Ext.util.Format;

    this.currentPage = 1;

    this.maxTextLength = 150;

    this.eventManager = eventManager;
    this.logSource = {source: "board widget", widget_id: this.portlet_id};

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
            anchor: '100%',
            value: get(window.user, 'email', '')
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
                var w_id = this.getId();

                this.form.getForm().submit(
                    {
                        url:'boards/add',
                        waitMsg:'Saving Data...',
                        success: function(form,action){
                            
                            form.reset(); // Reset form to its default values
                            
                            $('#undodelads-'+w_id)
                                .removeClass('warning-msg')
                                .addClass('confirm-msg')
                                .html('Message created. [<span class="a" onclick="showText(false, \'undodelads-'+w_id+'\')">close</span>]')
                                .show();

                            boardStore.load(); // Reload board's store

                            em.fireEvent('newtimelineevent');
                        }
                    }
                );
                 
            },
            scope: this,
            formBind: true
        }]
    });

    this.deleteAds = function(ads_id){
        var w_id = this.getId();
        var store = this.view.store;
        Ext.MessageBox.confirm('Confirm', 'Do you really want to do delete this message?', function(btn){
            if(btn == 'yes'){
                Ext.Ajax.request({
                    url : 'boards/deleteads/'+ads_id ,
                    method: 'GET',
                    success: function(result, request){
                        $('#undodelads-'+w_id)
                            .removeClass('confirm-msg')
                            .addClass('warning-msg')
                            .html('Message deleted. <span class="a" onclick="Ext.getCmp(\''+w_id+'\').undoDeleteAds(' + ads_id + ')">Undo</span> or <span class="a" onclick="showText(false, \'undodelads-'+w_id+'\')">close this message</span>')
                            .show();
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
                params: {ads_id: a_id, value: newvalue},
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
            target2.update('<span class="a" onclick="Ext.getCmp(\''+this.getId()+'\').formatText('+id+', '+!expand+')">View less</span>');
        } else {
            target.update(fm.ellipseOnBreak(s, this.maxTextLength).urlize().smilize().replace(/\n/g,"<br />"));
            gotoWidget(this.portlet_id);
            target2.update('<span class="a" onclick="Ext.getCmp(\''+this.getId()+'\').formatText('+id+', '+!expand+')">View more</span>');
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
        var prefix = "Hi " + name + "! I\'m writing in response to the announcement you published on the "+config.appname+" board:\n\n";

        if(recipient) 
            new SendToWindow(prefix+text,[[recipient,name + " " + surname]], this.logSource);
        else 
            new SendToWindow(prefix+text, null, this.logSource);
    };

    this.setup = function(){
        var boardwidget = $('#'+this.getId()+' .board-widget');
        /* hoverIntent provided some problems with tooltip so we
         * decided to switch back to hover even if it doesn't
         * completely work with IE */

        boardwidget.hover(function(){
                $(this)
                    .find('.board-img')
                    .css({visibility: 'visible'});
            }, function(){
                $(this)
                    .find('.board-img')
                    .css({visibility: 'hidden'});
        });
    };

    this.view = new Ext.DataView({
        tpl: new Ext.XTemplate(
        '<div class="board-widget">',
            '<tpl for=".">',
                '<div id="{this.boardId}-{id}-wrapper" class="user-wrapper" style="background:{[xindex % 2 === 0 ? "white" : "#ECEFF5"]};text-align:left;">',
                /* User owns the message */
                    '<tpl if="isOwner(user_id)">',
                        '<span id="{this.boardId}-{id}-text" class="text x-editable" style="padding-right:15px;">',
                            '{text:this.formatMsg}',
                        '</span>',
                        '<tpl if="(this.maxTextLength < text.length)">',
                            '<br /><br />',
                            '<span class="expander" id="{this.boardId}-{id}-colexp">',
                                '<span class="a" onclick="{this.boardId:getCmp}.formatText({id}, true)">View more</span>',
                            '</span>',
                        '</tpl>',
                        '<br /><br />',
                        '<span class="board-img">',
                            '<span class="sprited pencil-icon" onclick="{this.boardId:getCmp}.startEditAds({id})" title="Edit this message"></span>',
                            '<span class="sprited delete-icon" onclick="{this.boardId:getCmp}.deleteAds({id});" title="Delete this message"></span>',
                            '<span onclick="openCommentWindow(\'Board\',{id})">',
                                '<tpl if="commentsCount &gt; 0">',
                                    '{commentsCount} <span class="sprited comment-icon" title="View comments"></span>',
                                '</tpl>',
                                '<tpl if="commentsCount == 0">',
                                    '<span class="sprited comment-add" title="Add a comment"></span>',
                                '</tpl>',
                            '</span>',
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
                        '<span id="{this.boardId}-{id}-text" style="padding-right:15px;" class="text">',
                            '{text:this.formatMsg}',
                        '</span>',
                        '<tpl if="(this.maxTextLength < text.length)">',
                            '<br /><br />',
                            '<span class="expander" id="{this.boardId}-{id}-colexp">',
                                '<span class="a" onclick="{this.boardId:getCmp}.formatText({id}, true)">View more</span>',
                            '</span>',
                        '</tpl>',
                        '<br /><br />',
                        '<span class="board-img">',
                            '<tpl if="email != null && email != \'\'">',
                                '<span class="sprited email" onclick="{this.boardId:getCmp}.sendTo(({[xindex]} - 1), \'{email}\',\'{name}\',\'{surname}\');" title="Contact owner"></span>',
                            '</tpl>',
                            '<span class="sprited user-icon" onclick="showUserInfo({user_id}, null, {this.logSource})" title="View owner profile"></span>',
                            '<tpl if="commentsCount &gt; 0">',
                                '<span onclick="openCommentWindow(\'Board\',{id})">',
                                    '{commentsCount}<span class="sprited comment-icon" title="View comments"></span>',
                                '</span>',
                            '</tpl>',
                            '<tpl if="commentsCount &lt;= 0">',
                                '<span onclick="openCommentWindow(\'Board\',{id})">',
                                    '<span class="sprited comment-add" title="Add a comment"></span>',
                                '</span>',
                            '</tpl>',
                        '</span>',
                        '<span style="color:#888888;font-size:90%;padding-right:15px;">',
                            'Created on {[Date.parseDate(values.created, "Y-m-d H:i:s").format("F j, Y")]} by ',
                        /* span's onclick lead to misfunctionalities of DataView.indexOf(someitem) */
                            '<span class="a" onclick="showUserInfo({user_id}, null, {this.logSource})" style="color:#888888">{name} {surname}</span>',
                            '<tpl if="email != null && email != \'\'">',
                                ' <span class="a" onclick="{this.boardId:getCmp}.sendTo(({[xindex]} - 1), \'{email}\',\'{name}\',\'{surname}\');" style="color:#888888">&lt;{email}&gt;</span>',
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
                        '<span class="a" onclick="{this.boardId:getCmp}.loadPage({.+1})">{.+1}</span>',
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
            ,logSource: fm.htmlEncode(Ext.util.JSON.encode(this.logSource))
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
	    itemSelector: '.text',
        emptyText: '<div style="warning-msg" style="margin:0 20px">There are no messages on the board</div>',
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
                    beforecomplete : function(editor, newvalue, oldvalue) {
                                            // if the value changed, save it! Maybe this is redundant, cause of ignoreNoChange = true in the plugin
                                            p = this.view.store.parent;

                                            if(newvalue != oldvalue)
                                                p.modifyAds(editor.activeRecord.data.id, newvalue);

                                        }
                    ,specialkey : function(field, key) {
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
                    this.parent.setup();

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
            style: 'margin: 5px 5px 0 5px;'
            ,html: '<div style="overflow:hidden;"><span style="margin-right:5px;" class="sprited add-icon menu-item l18"></span><span class="u-hover board-menu show-hide" style="color:green;">Add new message</span></div>'
            ,cls: 'menu'
        },{
            html: '<div id="undodelads-'+this.getId()+'" class="warning-msg border_radius_5px" style="padding: 2px 0;margin: 2px 10px; display: none;"></div>',
            display: 'none',
            border: false
		},{
            items: this.view
        },{
            style: 'padding:5px;',
            html: '<div style="overflow:hidden;"><span class="board-menu a reload">Reload</span><span style="margin-right:5px;" class="sprited menu-item add-icon l18"></span><span class="u-hover board-menu show-hide" style="color:green;">Add new message</span></div>'
            ,cls: 'menu'
        },{
            items: this.form
        }]
        ,listeners: {
            afterlayout: function(){

                var b = this;
                var p_id = this.getId();

                $('#'+p_id)
                    .find('.show-hide')
                        .click(
                            function() {
                                var menus = $('#'+p_id)
                                    .find('.menu-item')
                                        .toggleClass('add-icon')
                                        .toggleClass('delete-icon')
                                    .end();
                                if(b.form.collapsed){
                                    menus
                                        .find('.show-hide')
                                            .html('Hide insert message form')
                                            .css('color', 'red');
                                    b.form.expand();
                                } else {
                                    menus
                                        .find('.show-hide')
                                            .html('Add new message')
                                            .css('color', 'green');
                                   b.form.collapse();
                                }
                            }
                        )
                    .end()
                    .find('.reload')
                        .bind('click.reload',
                            function() {
                                b.loadPage(b.currentPage);
                            }
                        );

                this.setup.defer(500, this);
            }
        }
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
