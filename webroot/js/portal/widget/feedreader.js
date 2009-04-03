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
  * Ext.ux.fbk.sonet.FeedReader Extension Class
  *
  * @author  Marco Frassoni and Davide Setti
  * @class Ext.ux.fbk.sonet.FeedReader
  * <p>With this widget a user can display a external rss resource</p>
  * <pre><code>
    This is a example of the json
    </code></pre>
*/

FeedReader = function(conf, panel_conf){
    Ext.apply(this, panel_conf);

    feedId = this.getId();

    var nItems = 5;
    if (conf.items){
        nItems = parseInt(conf.items);
    }
    this.autoExpand = conf.autoExpand;

    var store = new Ext.data.Store({
        proxy: new Ext.data.HttpProxy({
            url: 'wrappers/getrss'
        }),
        reader: new Ext.data.JsonReader({
            root: 'items',
            totalProperty: 'totalCount'
        }, [{
            name: 'title'
        }, {
            name: 'url'
        }, {
            name: 'description'
        }, {
            name: 'date'
        }]),
        baseParams: {
            limit: nItems
            ,url: conf.url
        }
        ,parent: this
        ,listeners: {
            load: function(store, records, options) {
                var widget = this.parent;

                if (store.reader.jsonData.title)
                    widget.setPortletTitle(store.reader.jsonData.title);
                
                //expand rows if autoExpand is true
                if (widget.autoExpand){
                    widget.expandAll();
                }

                if (store.reader.jsonData.image_url){
                    var id = widget.getId();

                    var width = store.reader.jsonData.image_width;
                    var height = store.reader.jsonData.image_height;

                    var min_height = 30;
                    var max_height = 50;

                    if (height > max_height){
                        width *= max_height/height;
                        height = max_height;
                    } else if (height < min_height) {
                        Ext.getDom(id+'_logo').style.padding = ((min_height - height)/2)+'px 0';
                    }

                    Ext.getDom(id+'_logo').src = store.reader.jsonData.image_url;
                    Ext.getDom(id+'_logo').width = width;
                    Ext.getDom(id+'_logo').height = height;
                }
            }
        }
    });
   
    this.expander = new Ext.grid.RowExpander({
        tpl: new Ext.Template(
            '<p><b>Summary:</b> {description}</p>',
            '<span style="float:right;padding-bottom:3px;padding-right:3px;"><a href="{url}" target="_blank">more...</a></span>',
            '<span style="float:right;padding-bottom:3px;padding-right:3px;"><a href="javascript:Ext.getCmp(\''+feedId+'\').grid.sendTo()">Email to</a> | </span>'
        )
        ,listeners: {
            expand: function(){
                //don't open links in this tab!
                $('#'+ this.parent.getId() +' p a').attr('target', '_blank');
            }
        }
        ,parent: this
     });
    
    this.grid = new Ext.grid.GridPanel({
        autoHeight: true,
        //autoWidth: true,
        cls: 'feedreader-grid',
        viewConfig: {
            forceFit:true,
            scrollOffset:0
        },
        hideHeaders: true,
        bbar: new Ext.PagingToolbar({
            store: store,
            beforePageText: '',
            pageSize: nItems,
            displayInfo: true,
            displayMsg: '{0} - {1} of {2}',
            emptyMsg: 'No news'
        }),
        store: store,
        parent: this,
        cm: new Ext.grid.ColumnModel([
            this.expander,
            {
                id:'title',
                renderer: function(value, p, record) {
                    htmlForNewItems="";
                    if(record.get('date')){
                        /** if current date on client is between 
                         *  date of post minus -365 
                         *  and
                         *  date of post plus 5 (there are some feeds with wrong dates (for example year is 2015 and we are in 2008, need to decide what to do for those feeds)
                         *  (would be better to check the date on server for reasons of timezones and users modifying its time but for now this is not needed) 
                         */
                        var date = Date.parseDate(record.get('date'),'d/m/Y');
                        var startWindowDate = date.add(Date.DAY, -365);
                        var endWindowDate = date.add(Date.DAY, +5);
                        if(new Date().between(startWindowDate,endWindowDate)) {
                            //TODO: add css to this and remove <b>! Maybe an icon! In famfamfam there is a "new" icon!!!
                            //htmlForNewItems="<span class='new-rss-item'>NEW!</span>";
                            p.css = "new-rss-item"
                        }
                    }
                    value = String.format('{0} {1} {2}',
                        record.get('title'),
                        "<span class='rss-item-date'>"+record.get('date')+"</span>",
                        htmlForNewItems
                    );
                    return value;
                }
            }
        ]),
        plugins: this.expander,
        listeners: {
            cellclick:function(grid, rowIndex, columnIndex, e) {
                /* if columnIndex > 0 the click is on the title
                 * if column 0 is hidden, we're in full screen and we want
                 * to disable the expander
                 */
                if (columnIndex && !grid.getColumnModel().isHidden(0)) {
                    grid.parent.expander.toggleRow(rowIndex);
                }
            }
        },
        sendTo: function() {
            var text =  Ext.util.Format.stripTags(this.getSelectionModel().getSelected().data.description.replace(/\\n/g,"<br />"));
            var prefix = "Hi all!\nI think that you may be interested in:\n\n";
            var logparams = '{"source": "feedreader widget", "widget_id": "'+this.parent.portlet_id+'"}';
            new SendToWindow(prefix+text, null, logparams);
        }
    });

    this.expandAll = function() {
        var store = this.grid.store;
        for(var i = store.data.length-1; i>=0; i--)
            this.expander.expandRow(i);
    };

    this.collapseAll = function() {
        var store = this.grid.store;
        for(var i = store.data.length-1; i>=0; i--)
            this.expander.collapseRow(i);
    }
    
    FeedReader.superclass.constructor.call(this, {
        items: [
            {
                html: '<img src="ext/resources/images/default/s.gif" id="'+
                    this.getId()+'_logo" style="margin:auto auto"/>'
            }
            ,this.grid
        ]
        ,listeners:{
            bodyresize: function(panel, panelWidth, panelHeight){ 
                panel.grid.setWidth(panelWidth);
            }
            ,fullscreen: function(t){
                t.grid.getColumnModel().setHidden(0, true);
                t.expandAll();
            }
            ,downsize: function(t){
                t.grid.getColumnModel().setHidden(0, false);
                t.collapseAll();
            }
        }
    });

    store.load({
        params: {
            start: 0
        }
    });
};

Ext.extend(FeedReader, Ext.Panel);
