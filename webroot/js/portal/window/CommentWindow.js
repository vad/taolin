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
        url: this.model + '/getcomments'
        ,root: 'comments'
        ,method: 'POST'
        ,fields: ['id','user_id','body', {name: 'created', type: 'date', dateFormat: 'Y-m-d H:i:s'}, 'name', 'surname']
        ,baseParams: {
            foreign_id: this.f_id
        }
        ,autoLoad: true
        ,listeners:{
            'load': {
                fn: function(){
                    this.center();
                }
                ,scope: this
            }
        }
    });

    this.view = new Ext.DataView({
        store: this.store
        ,tpl: new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="comment border_radius_5px">',
                    '<table>',
                        '<tr>',
                            '<td valign=top>',
                                '<div style="text-align:center;width:50px;cursor:pointer;" onclick="showUserInfo({user_id}, null, \'' + Ext.util.Format.htmlEncode('{"source": "comment", "id": "{id}"}') + '\')">',
                                    '<img style="padding:2px 0" src="photos/getphotofromuserid/{user_id}/40/40" title="View user\'s profile"/>',
                                '</div>',
                            '</td>',
                            '<td>',
                                '<a class="underlineHover" href="javascript:void(0)" onclick="showUserInfo({user_id}, null, \'' + Ext.util.Format.htmlEncode('{"source": "comment", "id": "{id}"}') + '\')"><b>{name} {surname}</b></a> {[values.body.urlize().smilize()]} ',
                                '<div style="color:gray;padding-top: 3px;">{date}</div>',
                            '</td>',
                        '</tr>',
                    '</table>',
                '</div>',
            '</tpl>'
        )
        ,emptyText: '<div style="padding:10px 5px;font-size:100%"><b><div class="warning-message">No comments!</b></div></div>'
	    ,itemSelector: 'div.comment'
        ,height: 300
        ,autoScroll: true
        ,style: 'padding-top: 10px'
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
            text: 'Submit'
            ,handler: function(){
                
                var store = this.view.store;
                var model = this.model;

                this.form.getForm().submit(
                    {
                        url: model + '/addcomment',
                        waitMsg:'Saving Data...',
                        params:{
                            foreign_id: this.f_id
                        },
                        success: function(form,action){
                            form.reset(); // Cleaning form
                            store.reload();
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
