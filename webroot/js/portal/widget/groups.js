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
  * Ext.ux.fbk.sonet.GroupsPortlet Extension Class
  *
  * @author  Marco Frassoni and Davide Setti
  * @version 1.0
  * @class Ext.ux.fbk.sonet.GroupsPortlet
  * <p>This class extend the portlet to show the information about the group where the user work</p>
  * <pre><code>
    This is a example of the json
    </code></pre>
*/

GroupsPortlet = function(){
    var usersStore = new Ext.data.JsonStore({
        url: 'accounts/getgroups',
        root: '',
        fields: ['name']
    });

    usersStore.load();
    var resultTpl = new Ext.XTemplate( 
        '<tpl for=".">',
        '<div class="user-item">{name}</div>',
        '</tpl>'
    );

    UsersPortlet.superclass.constructor.call(this, {
        autoHeight: true,
        defaults: { autoScroll: true },
        items: new Ext.DataView({
            tpl: resultTpl,
            store: usersStore,
            itemSelector: 'div.user-item',
            overClass: 'searchusermouseoverbg',
            singleSelect: true
        })

        /*,
        bbar: new Ext.PagingToolbar({
            store: randomUsersStore,
            pageSize: 5,
            displayInfo: false,
            displayMsg: 'Users {0} - {1} of {2}',
            emptyMsg: 'No users'
        })*/
    });
};

Ext.extend(GroupsPortlet, Ext.Panel); 
