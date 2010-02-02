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
  * Ext.ux.fbk.sonet.SearchUsers Extension Class
  *
  * @author  Marco Frassoni and Davide Setti
  * @version 1.0
  * @class Ext.ux.fbk.sonet.SearchUsers
  * @constructor
  */

/*
  * <p>With this widget a user can search another user</p>
  * <pre><code>
    This is an example of the json
    </code></pre>
*/

var resultTpl = new Ext.XTemplate( 
    '<tpl for=".">',
        '<div class="user-wrapper">',
        '<tpl if="((login) && (jabber.u_n !== login) && (active === \'1\'))">',
            '<h3><span style="float:right;" class="a" onclick=\'jabberui.createNewChatWindow(new JSJaCJID("{login}@fbk.eu"))\'>Chat with {name}</span></h3>',
        '</tpl>',
        '<div class="user-{login} user-item">',
            '{name} {surname} ',
        '</div>',
        '</div>',
    '</tpl>'
);

SearchUsers = Ext.extend(Ext.Panel, {
    /** 
     * @cgf {String} title The title of the Ext.Panel Default to null
     */
    title: null
    /**
     * @cfg {Boolean} hideToolbar This parameter should be set to true in order to hide the toolbar
     * containing an Ext.ux.form.SearchField instance for performing queries. Default to false
     */
    ,hideToolbar: false
    /** 
     * @cgf {String} logparams Parameters to be logged (for research purposes). Default to null
     */
    ,logparams: null
    /** 
     * @private
     */
    ,paramName: 'query'
    /**
     * @private
     */
    ,initComponent: function(){
            
       // If logparams is not defined (i.e. is null) define it!
        if(!this.logparams) 
            this.logparams = {source:"search user widget", widget_id: this.portlet_id};

       this.store = new Ext.data.JsonStore({
            url: 'users/searchusers/',
            method: 'POST',
            root: 'users',
            totalProperty: 'totalCount',
            fields: ['id','name','surname','login','active'],
            baseParams: {
                limit:5,
                src: Ext.util.JSON.encode(this.logparams)
            },
            listeners: {
                beforeload: function() {
                    this.parent.view.emptyText = '<div style="padding:10px 5px 10px 5px;"><b>No colleagues found!</b><br/><br/>Search by name, phone, unit but also interests, skills added by colleagues in their descriptions.</div>'
                }
                ,load: function(store, records, options) {
                    if(store.totalLength == 1)
                        showUserInfo(records[0].json.id, null, this.parent.logparams);
                }
            }
            ,parent: this
        });

        this.view = new Ext.DataView({
            tpl: resultTpl,
            emptyText: '<div style="padding:10px 5px 10px 5px;">Search by name, phone, unit but also interests, skills added by colleagues in their descriptions.</div>', 
            deferEmptyText: false,
            store: this.store,
            itemSelector: 'div.user-wrapper',
            overClass: 'searchusermouseoverbg',
            parent: this,
            listeners: {
                click: function(dv, index, node, e) {

                    var id = dv.store.getAt(index).get('id');
                    showUserInfo(id, null, dv.parent.logparams);
                }
            }
        });

        var config = {
            autoHeight: true
            ,defaults: { 
                autoScroll: true 
            }

            ,items: this.view
            ,bbar: new Ext.PagingToolbar({
                store: this.store,
                beforePageText: '',
                pageSize: 5,
                displayInfo: true,
                displayMsg: '{0} - {1} of {2}',
                emptyMsg: 'No colleague'
            })
            // If hideToolbar is true tbar is set to null
            // Otherwise it contains an Ext.ux.form.SearchField instance to perform queries
            ,tbar: this.hideToolbar ? null : 
                        [
                            '<span qtip="Search your colleagues by name, surname, phone number or group\'s name">Search: </span>', ' ', ' ',
                            new Ext.ux.form.SearchField({
                                name: 'data[Search]',
                                store: this.store,
                                width: 180
                            })
                        ]
        };

        // apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        SearchUsers.superclass.initComponent.apply(this, arguments);

    }

    /**
     * @private
     */
    ,constructor: function(config){
         config = config || {};
         config.listeners = config.listeners || {};
         Ext.applyIf(config.listeners, {
         //add listeners config here
         });
             
         SearchUsers.superclass.constructor.call(this, config);
    }
});

Ext.reg('searchusers', SearchUsers);
