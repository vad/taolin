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

function openAddWidgetsModalWindow() {
    var id = 'addwidgetwindow';
    if (Ext.getCmp(id)){
        window.addwidgetwindow.show();
        return;
    }
    var dw = $("body").width();
    var window_width = Math.round(dw*(3/5))
    var dh = $("body").height();
    var window_height = Math.round(dh*(3/5));
    window.addwidgetwindow = new AddWidgetsWindow({id:id, width:window_width, height:window_height});
    window.addwidgetwindow.show();
}


AddWidgetsWindow = function(config){
    this.config = config;
};


AddWidgetsWindow.prototype = {
    // cache data by image name for easy lookup
    lookup : {},
    
    show: function(el){
        if(!this.win){
            
            this.initTemplates();
            
            this.store = new Ext.data.JsonStore({
                url: 'widgets/listwidgets',
                root: 'widgets',
                //method: 'POST',
                baseParams: {id: window.thisId, limit: 50},
                fields: [
                    'id', 'name', 'screenshot', 'description',
                    {name: 'modified', type: 'date', dateFormat: 'Y-m-d H:i:s'}
                ],
                listeners: {
                    'load': {fn:function(){ this.view.select(0); }, scope:this, single:false}
                }
            });


            this.store.load();

            var formatData = function(data){
                data.shortName = data.name;
                data.usedName = data.name;
                //data.sizeString = formatSize(data);
                //data.description = data.caption ? data.caption.replace(/\\n/g,"<br />") : '<i>This photo still needs to be descripted</i>';
                data.visibility = (data.is_hidden==0) ? 'Public' : 'Private';
                data.dateCreatedString = data.created;
                this.lookup[data.screenshot] = data;
                return data;
            };
            
            this.view = new Ext.DataView({
                tpl: this.thumbTemplate,
                singleSelect: true,
                overClass: 'searchusermouseoverbg',
                itemSelector: 'div.thumb-wrap',
                emptyText : '<div style="padding:10px;">No widgets match the specified filter</div>',
                store: this.store,
                listeners: {
                    'click'       : {fn:this.clickAction, scope:this}
                },
                prepareData: formatData.createDelegate(this)
            });
            
            var cfg = {
                title: 'Add new widgets',
                layout: 'border', 
                minWidth: 500,
                minHeight: 300,
                closeAction: 'hide',
                border: true,
                items:[{
                    region: 'center',
                    autoScroll: true,
                    items: this.view,
                    tbar:[{
                        text: 'Filter:'
                    },{
                        xtype: 'textfield',
                        //TODO: change this and PhotoChooser! Do not use univoke ids!
                        id: 'widget_filter',
                        selectOnFocus: true,
                        width: 100,
                        listeners: {
                            'render': {fn:function(){
                                Ext.getCmp('widget_filter').getEl().on('keyup', function(){
                                    this.filter();
                                }, this, {buffer:500});
                            }, scope:this}
                        }
                    }, ' ', '-', {
                        text: 'Sort By:'
                    }, {
                        id: 'widget_sortSelect',
                        xtype: 'combo',
                        typeAhead: true,
                        triggerAction: 'all',
                        width: 100,
                        editable: false,
                        mode: 'local',
                        displayField: 'desc',
                        valueField: 'name',
                        lazyInit: false,
                        value: 'name',
                        store: new Ext.data.SimpleStore({
                            fields: ['name', 'desc'],
                            data : [['modified', 'Last Modified'],['name', 'Name']]
                        }),
                        listeners: {
                            'select': {fn:this.sortWidgets, scope:this}
                        }
                    }]
                }/*,{
                    id: 'widget-detail-panel',
                    region: 'east',
                    split: true,
                    autoScroll: true,
                    width: 250,
                    minWidth: 150,
                    maxWidth: 350
                }*/],
                buttons: [{
                    text: 'Close',
                    handler: function(){ this.win.hide(); },
                    scope: this
                }],
                keys: {
                    key: 27, // Esc key
                    handler: function(){ this.win.hide(); },
                    scope: this
                }
            };
            Ext.apply(cfg, this.config);
            this.win = new Ext.Window(cfg);
            this.win.store = this.store;
            this.win.view = this.view;
        }
        this.reset();
        this.win.show(el);
        this.animateTarget = el;
    },
    
    initTemplates : function(){
        this.thumbTemplate = new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="thumb-wrap">',
                    '<div class="thumb">',
                        '<tpl if="this.isNew(modified)">',
                           '<div id="widget_container">',
                                '<div id="widget_new">',
                                    '<img src="img/new.png" width="50px" height="50px"/>',
                                '</div>',
                           '</div>',
                       '</tpl>',
                        '<tpl if="(screenshot)"><span></span>',
                            '<img class="ante" src="img/widget/t140x140/{screenshot}" />',
                        '</tpl>',
                        '<tpl if="(!screenshot)">',
                            '<img style="padding:5px;" src="img/image_error.png" />',
                        '</tpl>',
                    '</div>',
                    '<span style="font-size:120%">{shortName}</span>',
                '</div>',
            '</tpl>', {
                isNew: function(modified){
                    var compare_date = new Date();
                    compare_date.setDate(compare_date.getDate() - 14);       
                    return modified.getTime() > compare_date;
                }
            }
        );
        this.thumbTemplate.compile();
    },
    
    filter : function(){
        var filter = Ext.getCmp('widget_filter');
        this.view.store.filter('usedName', filter.getValue(), true);
        this.view.select(0);
    },
    
    sortWidgets : function(){
        var v = Ext.getCmp('widget_sortSelect').getValue();
        this.view.store.sort(v, v == 'name' ? 'asc' : 'desc');
        this.view.select(0);
    },
    
    reset : function(){
        if(this.win.rendered){
            Ext.getCmp('widget_filter').reset();
            this.view.getEl().dom.scrollTop = 0;
        }
        this.view.store.clearFilter();
        this.view.select(0);
    },
    
    clickAction : function(dv, index, node, e){
        var logparams = '{"source": "add widget window"}'; 
        previewWidget(dv.store.getAt(index).get('id'), dv.store.getAt(index).get('name'),
            dv.store.getAt(index).get('description'), dv.store.getAt(index).get('screenshot'), logparams
        );
    },
    
    onLoadException : function(v,o){
        this.view.getEl().update('<div style="padding:10px;">Error loading widgets.</div>'); 
    }
};
