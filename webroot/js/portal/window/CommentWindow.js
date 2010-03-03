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


function openCommentWindow(model, foreign_key, logparams){

    var comments_window = Ext.getCmp('comments_window');

    if(comments_window) // if not exist
        comments_window.close();

    new CommentWindow(model, foreign_key, logparams); // Open a new comment window
}


CommentWindow = function(model_alias, foreign_id, logparams) {

    if (!logparams)
        alert('No logparams!');
    var fm = Ext.util.Format
        ,t = this;
    t.model = fm.lowercase(model_alias) + 's';  // Format model's name in order to use it in the ajax request (e.g.: 'Board' -> 'boards')
    t.f_id = foreign_id;

    t.store = new Ext.data.JsonStore({
        url: t.model + '/getcomments/' + t.f_id
        ,root: 'comments'
        ,baseParams: {src:Ext.util.JSON.encode(logparams)}
        ,fields: ['id','user_id','body', {name: 'created', type: 'date', dateFormat: 'Y-m-d H:i:s'}, 'user_name', 'user_surname']
        ,autoLoad: true
        ,listeners:{
            load: {
                fn: function(store, records, options){
                    var data = store.reader.jsonData
                        ,details = data.details
                        //this is not about comments, but commented event!
                        ,aDate = data.created.split(" ")[0].split('-')
                        ,created = fm.date(
                            // IE doesn't like '2000-02-01'-like date (it requires 'February 01, 2000')
                            new Date(aDate[0], aDate[1] - 1, aDate[2]),
                            'd F, Y'
                        );

                    /* If this is the first time that the window is loaded
                     * then create the commented event's html
                     */ 
                    if ( !$("#commented-event").html().length ) 
                        $("#commented-event")
                            .empty()
                            .append(
                                $('<div>')
                                .css({
                                    'margin-bottom': '3px',
                                    'font-size': '90%',
                                    'font-variant': 'small-caps'
                                })
                                .text(created)
                            )
                            .append(
                                $('<div>')
                                .html(details.smilize().urlize())
                            )
                            .css({
                                background:'#ECEFF5',
                                margin:'auto auto',
                                padding:'10px 5px'
                            }); // Styling

                    // Center the window
                    this.center();

                    // check if the window is out of the browser view
                    var pos = this.getPosition(true);
                    this.setPosition(pos[0], pos[1] > 0 ? pos[1] : 0);
                }
                ,scope: this
            }
        }
    });

    var uiLogSource = '{source: \'comment\', id: {id}}';
    t.view = new Ext.DataView({
        store: this.store
        ,tpl: new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="comment border_radius_5px">',
                    '<table>',
                        '<tr>',
                            '<td valign=top>',
                                '<div class="a" style="text-align:center;width:40px;padding-left:2px;" onclick="showUserInfo({user_id}, null, '+ uiLogSource +')">',
                                    '<img style="padding:2px 0" src="photos/getphotofromuserid/{user_id}/40/40" title="View user\'s profile"/>',
                                '</div>',
                            '</td>',
                            '<td style="padding-left:10px;">',
                                '<span class="a" onclick="showUserInfo({user_id}, null, '+ uiLogSource +')"><b>{user_name} {user_surname}</b></span> {[values.body.urlize().smilize()]}',
                                '<div class="date" style="padding-top:5px;">{created:naturalDate(true)}</div>',
                            '</td>',
                            '<tpl if="isOwner(user_id)">',
                                '<td style="right:10px; position: absolute;">',
                                    '<span class="a" onclick="{this.parentId:getCmp}.deleteComment({id})"><img class="size12x12" src="js/portal/shared/icons/fam/cross.png" /></span>',
                                '</td>',
                            '</tpl>',
                        '</tr>',
                    '</table>',
                '</div>',
            '</tpl>'
            ,{
                compiled: true
                ,parentId: 'comments_window'
            }
        )
        ,emptyText: '<div style="padding:10px 5px" class="warning-msg border_radius_5px">No comment yet! Be the first to comment!</div>'
        ,loadingText: 'Loading comments...' 
	    ,itemSelector: 'div.comment'
        ,height: 300
    });

    t.form = new Ext.form.FormPanel({
        autoWidth: true
        ,autoHeight: true
        ,buttonAlign: 'center'
        ,style: 'padding: 10px 20px'
        ,labelAlign: 'top'
        ,border: false
        ,frame: false
        ,cls: 'form_settings'
        ,layoutConfig: {
            // layout-specific configs go here
            labelSeparator: ''
        }
        ,items: [{
            xtype: 'textarea'
            ,id: 'comment_field'
            ,fieldLabel: 'Add your comment'
            ,grow: true
            ,growMin: 25 
            ,growMax: 200
            ,name: 'comment'
            ,anchor: '100%'
        }],
        buttons: [{
            text: 'Comment'
            ,handler: function(){
                var store = this.view.store
                    ,model = this.model;

                this.form.getForm().submit(
                    {
                        url: model + '/addcomment',
                        waitMsg:'Adding comment...',
                        params:{
                            foreign_id: this.f_id
                        },
                        success: function(form,action){
                            form.reset(); // Cleaning form
                            store.reload();
                            eventManager.fireEvent("addcomment", model);
                        }
                    }
                );
                 
            }
            ,scope: this
            ,formBind: true
        },{
            text: 'Close'
            ,handler: function(){
                this.close();
            }
            ,scope: this
        }]
    });
                
    t.deleteComment = function(c_id){
        var model = this.model
            ,store = this.view.store;
        Ext.MessageBox.confirm('Confirm', 'Do you really want to do delete this comment?', function(btn){
            if(btn == 'yes'){
                Ext.Ajax.request({
                    url : model+'/delcomment/'+c_id ,
                    method: 'GET',
                    success: function(result, request){
                            eventManager.fireEvent("removecomment", model);
                            store.reload();
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
    }

    CommentWindow.superclass.constructor.call(t, {
        title: 'Comments'
        ,id: 'comments_window'
        ,autoHeight: true
        ,width: 500
        ,resizable: true
        ,iconCls:'comment-icon'
        ,constrain: true
        ,defaultButton: 'comment_field'
        ,items: [{
            html: '<div id="commented-event"></div>'
        },{
            items: t.view
            ,border: false
            ,autoScroll: true
        },{
            items: t.form
            ,border: false
        }]
    });

    t.show();
}

Ext.extend(CommentWindow, Ext.Window);
