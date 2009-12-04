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


CommentWindow = function(model_alias, foreign_id) {

    this.model = Ext.util.Format.lowercase(model_alias) + 's';
    this.f_id = foreign_id;

    this.store = new Ext.data.JsonStore({
        url: this.model + '/getcomments/' + this.f_id
        ,root: 'comments'
        ,method: 'GET'
        ,fields: ['id','user_id','body', {name: 'created', type: 'date', dateFormat: 'Y-m-d H:i:s'}, 'user_name', 'user_surname']
        ,autoLoad: true
        ,listeners:{
            load: {
                fn: function(){
                    this.center();
                    var details = this.store.reader.jsonData.details;
                    $("#commented-event").css({'background':'#ECEFF5','margin':'auto auto','padding':'10px 5px'}); // Styling
                    $("#commented-event").html(details);
                }
                ,scope: this
            }
        }
    });

    this.view = new Ext.DataView({
        store: this.store
        ,tpl: new Ext.ux.fbk.sonet.XTemplate(
            '<tpl for=".">',
                '<div class="comment border_radius_5px">',
                    '<table>',
                        '<tr>',
                            '<td valign=top>',
                                '<div style="text-align:center;width:40px;cursor:pointer;padding-left:2px;" onclick="showUserInfo({user_id}, null, \'' + Ext.util.Format.htmlEncode('{"source": "comment", "id": "{id}"}') + '\')">',
                                    '<img style="padding:2px 0" src="photos/getphotofromuserid/{user_id}/40/40" title="View user\'s profile"/>',
                                '</div>',
                            '</td>',
                            '<td style="padding-left:10px;">',
                                '<a class="underlineHover" href="javascript:void(0)" onclick="showUserInfo({user_id}, null, \'' + Ext.util.Format.htmlEncode('{"source": "comment", "id": "{id}"}') + '\')"><b>{user_name} {user_surname}</b></a> {[values.body.urlize().smilize()]}',
                                '<div style="color:gray;padding-top:5px;font-size:90%;">{[this.formatDate(values.created, true)]}</div>',
                            '</td>',
                            /*'<tpl if="this.isOwner(user_id)">',
                                '<td style="right:10px; width:12px; position: absolute;">',
                                    '<img class="size12x12" src="js/portal/shared/icons/fam/cross.png" />',
                                '</td>',
                            '</tpl>',*/
                        '</tr>',
                    '</table>',
                '</div>',
            '</tpl>'
        )
        ,emptyText: '<div style="padding:10px 5px;font-size:100%"><b><div class="warning-message">No comment yet! Be the first to comment!</b></div></div>'
	    ,itemSelector: 'div.comment'
        ,height: 300
        ,autoScroll: true
    });

    this.form = new Ext.form.FormPanel({
        autoWidth: true
        ,autoHeight: true
        ,buttonAlign: 'center'
        ,style: 'padding: 10px 20px'
        ,labelAlign: 'top'
        ,border: false
        ,frame: false
        ,items: [{
            xtype: 'textarea'
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
                
                var store = this.view.store;
                var model = this.model;

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

    CommentWindow.superclass.constructor.call(this, {
        title: 'Comments'
        ,id: 'comments_window'
        ,autoHeight: true
        ,width: 500
        ,resizable: true
        ,iconCls:'chatwindowicon'
        ,constrain: true
        ,items: [{
            html: '<div id="commented-event"></div>'
        },{
            items: this.view
            ,border: false
            ,autoScroll: true
        },{
            items: this.form
            ,border: false
        }]
    });

    this.show();
}

Ext.extend(CommentWindow, Ext.Window);
