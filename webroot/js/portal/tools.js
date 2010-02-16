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
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Taolin. If not, see <http://www.gnu.org/licenses/>.
 *
 */

/* Creates some portlet tools using built in Ext tool ids
 * This buttons work for closable widgets and elements
 */
tools = [{
        id:'refresh',
        qtip:'Refresh this widget',
        handler :function(e, target, panel){
            panel.updateWidget();
        }
    }, {
        id:'toggle',
        qtip:'Collapse/expand',
        handler :function(e, target, panel){
            var action,
                widget = panel.items.last();

            if (panel.collapsed) {
                action = 'expand';
                widget.doLayout.defer(500, widget);
            } else {
                action = 'collapse';
            }

            Ext.Ajax.request({
                url : 'users_widgets/collapsewidget/'+panel.el.id+'/'+action
                ,method: 'GET'
            });

            // raise collapse/expand event
            widget.fireEvent(action, widget);

            panel.toggleCollapse(true);
        }
    },{
        id:'maximize',
        qtip:'Full screen',
        handler:function(e, target, panel){
            var mp = Ext.getCmp(panel.el.id)
                ,portal_central = Ext.getCmp('portal_central')
                ,found
                ,i
                ,j;

            for (i=0, col; col=portal_central.items.items[i++];) {
                found = false;
                for (j=0, p; p=col.items.items[j++];) {
                    if (mp == p){
                        found = true;
                        col.columnWidth = .99;
                    } else {
                        p.hide();
                    }
                }
                if (!found) col.hide();
                    
            }
            portal_central.doLayout();

            if(mp.collapsed) {
                Ext.Ajax.request({
                    url : 'widgets/collapsewidget/'+mp.el.id+'/expand'
                    ,method: 'GET'
                });
                mp.toggleCollapse(true);
            } 
            // toggle maximize/restore buttons
            mp.tools.maximize.hide();
            mp.tools.close.hide();
            mp.tools.toggle.hide();
            mp.tools.restore.show();

            // raise fullscreen event
            var widget = panel.items.last();
            widget.fireEvent('fullscreen', widget);

            // log action
            logWidget(panel.el.id, 'fullscreen');
        }
    },{
        id:'restore',
        qtip:'Restore to the original size',
        hidden:true,
        handler:function(e, tool, panel){
            var mp = Ext.getCmp(panel.el.id);
            var portal_central = Ext.getCmp('portal_central');

            for (var i=0, col; col=portal_central.items.items[i++];) {
                col.columnWidth = 1 / window.config.num_columns;
                col.show();
                for (var j=0, p; p=col.items.items[j++];) {
                    p.show();
                }
            }
            portal_central.doLayout();

            //toggle maximize/restore buttons
            mp.tools.maximize.show();
            mp.tools.close.show();
            mp.tools.toggle.show();
            mp.tools.restore.hide();

            // raise downsize event
            var widget = panel.items.last();
            widget.fireEvent('downsize', widget);

            //log action
            logWidget(panel.el.id, 'restore');
        }

    },{
        id:'close',
        handler: function(e, target, panel){
                panel.ownerCt.remove(panel, true);
                removeWidget(panel.el.id);
        },
        qtip: "Close this widget"
    }
];

/* Creates some portlet tools using built in Ext tool ids
 * This buttons work for not closable but configurable widgets and elements
 */

toolsconf = tools.slice(); // copy the tools array
toolsconf.unshift({ // insert an element as first
    id: 'gear'
    ,handler: function(e, target, panel){
        panel.showConf();
        logWidget(panel.el.id, 'settings');
    }
    ,qtip: "Configure"
});

/* Creates some portlet tools using built in Ext tool ids
 * This button works for elements that cannot be closed
 */

toolsnotclose = [{
            id:'toggle',
            qtip:'Click here to collapse/expand this widget',
            handler: function(e, target, panel){
                panel.toggleCollapse(true);
            }
        }
];
