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
  * Ext.ux.fbk.sonet.MetaSearch Extension Class
  *
  * @author  Marco Frassoni and Davide Setti
  * @version 1.0
  * @class Ext.ux.fbk.sonet.MetaSearch
  * @constructor
  * @param {Ext.Panel} panel_conf Configuration options
  * @param {Object} conf Configuration options
**/

/*
  * <p>With this widget a user can search another user</p>
  * <pre><code>
    This is a example of the json
    </code></pre>
*/
Ext.namespace( 'Ext.ux.fbk.sonet' );

Ext.ux.fbk.sonet.MetaSearch = Ext.extend(Ext.Panel, {
    autoHeight: true,
    defaults: { 
        autoScroll: true 
    },
    initComponent: function(){
        this.searchfield = new Ext.app.SearchField({
            id: this.getId()+'-searchfield',
            name: 'data[Search]'
            ,parent: this
            ,setPanelTitle: function(records, options, success){

                var tab = this.parent.ownerCt;

                if(success){
                    if(tab.title != tab.prevTitle)
                        tab.setTitle(tab.prevTitle);
                    tab.setTitle(tab.title + ' (' + this.totalLength + ')');
                }
            }

            ,onTrigger1Click : function(){
                var tabSup = this.parent.items.first();
                var tabPanels = tabSup.items.items;

                if(this.hasSearch){
                    for(var x in tabPanels){
                        if(tabPanels[x].items){
                            this.store = tabPanels[x].items.first().view.store;
                            this.el.dom.value = '';
                            var o = {start: 0};
                            this.store.baseParams = this.store.baseParams || {};
                            this.store.baseParams[tabPanels[x].items.first().paramName] = '';
                            this.store.reload({params:o});
                            tabPanels[x].setTitle(tabPanels[x].prevTitle);
                            this.triggers[0].hide();
                            this.hasSearch = false;
                        }
                    }
                }
            }

            ,onTrigger2Click: function(){

                var v = this.getRawValue();
                if(v.length < 1){
                    this.onTrigger1Click();
                    return;
                }
        
                var tabSup = this.parent.items.first();
                var tabPanels = tabSup.items.items;
        
                for(var x in tabPanels){
                    if(tabPanels[x].items){
                        this.store = tabPanels[x].items.first().view.store;
        
                        var o = {start: 0};
                        this.store.baseParams = this.store.baseParams || {};
                        this.store.baseParams[tabPanels[x].items.first().paramName] = v;
                        this.store.reload({params:o, callback:this.setPanelTitle});
                        if(!tabPanels[x].prevTitle) tabPanels[x].prevTitle = tabPanels[x].title;
                        this.hasSearch = true;
                        this.triggers[0].show();
                        this.fireEvent('enter', this, v);
                    }
                }
                this.parent.doLayout();
            }
        });

        var tabs = [];
        
        for(var k in this.initialConfig){
            console.log(this.initialConfig[k]);
        }
        this.engines = this.initialConfig['engines'];
        for (var sek in this.engines){ //sek = search engine key
            var se = this.engines[sek];
            
            var xtype = se.xtype || 'search'+sek;
            var title = se.title;
            
            delete se['xtype'];
            delete se['title'];

            var item = Ext.apply({
                xtype: xtype,
                hideToolbar: true,
                logparams: '{"source":"meta search widget"}'
            }, se);
            
            tabs.push({
                title: title,
                autoHeight: true,
                items: item 
            });
        }
        console.log(tabs);

        var config = {
            items: [
                new Ext.TabPanel({
                    border: false,
                    parent: this,
                    tabWidth:115,
                    enableTabScroll:true,
                    autoWidth: true,
                    autoHeight: true,
                    activeTab: 0,
                    layoutOnTabChange:true,
                    plain:true,
                    deferredRender: false,
                    style:'padding-top:2px',
                    frame:false,
                    defaults: {
                        autoScroll:true
                    },
                    items: tabs,
                    /*[
                    },/*{
                        title: 'Publik'
                        ,autoHeight: true
                        ,items:{
                            xtype:'searchpublik'
                            ,hideToolbar: true
                            ,logparams: '{"source":"meta search widget"}'
                        }
                    },{
                        title: 'FBK Wiki'
                        ,autoHeight: true
                        ,items:{
                            xtype:'searchwiki'
                            ,hideToolbar: true
                            ,wikiUrl: 'https://desktop.fbk.eu/wiki/it'
                            ,dirtyUrl: true
                            ,wikiDescription: 'FBK internal wiki'
                            ,parent: this
                        }
                    },{
                        title: 'Wikipedia'
                        ,autoHeight: true
                        ,items:{
                            xtype:'searchwiki'
                            ,hideToolbar: true
                            ,wikiUrl: 'http://en.wikipedia.org/wiki/'
                            ,apiUrl: 'http://en.wikipedia.org/w/api.php'
                            ,parent: this
                        }
                    }]*/
                })
            ],
            tbar: [
                '<span qtip="Search">Search: </span>', ' ', ' ',this.searchfield
            ]
        };

        Ext.apply(this, Ext.apply(this.initialConfig, config));
        
        Ext.ux.fbk.sonet.MetaSearch.superclass.initComponent.apply(this, arguments);
    } // eo initComponent
});

