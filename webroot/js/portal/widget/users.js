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
  * Ext.ux.fbk.sonet.UsersPortlet Extension Class
  *
  * @author  Marco Frassoni and Davide Setti
  * @version 1.0
  * @class Ext.ux.fbk.sonet.UsersPortlet
  * <p>The portlet with the user information</p>
  * <pre><code>
    This is a example of the json
    </code></pre>
*/


UsersPortlet = function(json){
    var store = new Ext.data.JsonStore({
        url: json.url+'/5/'+json.showPhoto,
        root: '',
        fields: ['id', 'name', 'surname', 'login']
    });

    store.load();
    var resultTpl = new Ext.XTemplate( 
        '<tpl for=".">',
            '<div class="user-wrapper">',
                '<div class="user-item user-{login}">',
                    '{name} {surname}',
                '</div>',
            '</div>',
        '</tpl>'
    );

    UsersPortlet.superclass.constructor.call(this, {
        autoHeight: true,
        defaults: { autoScroll: true },
        items: new Ext.DataView({
            tpl: resultTpl,
            store: store,
            itemSelector: 'div.user-wrapper',
            overClass: 'searchusermouseoverbg',
            singleSelect: true,
            parent: this,
            listeners: {
                click: function(dv, index, node, e) {
                    var id = dv.store.getAt(index).get('id');
                    showUserInfo(id, null,'{"source": "user widget", "widget_id": "' + this.parent.ownerCt.id + '"}');
                }
            }
        })
    });
};

Ext.extend(UsersPortlet, Ext.Panel); 
