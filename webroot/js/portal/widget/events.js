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
  * Ext.ux.fbk.sonet.Events Extension Class
  *
  * @author  Marco Frassoni and Davide Setti
  * @version 1.0
  * @class Ext.ux.fbk.sonet.Events
  * <p>This widget show a event lists</p>
  * <pre><code>
    This is a example of the json
    </code></pre>
*/


Events = function(conf, panel_conf){
    Ext.apply(this, panel_conf);
    
    var nItems = 5;
    if (conf.items){
        nItems = parseInt(conf.items);
    }
    this.currentPage = 1;
    
    this.autoExpand = conf.autoExpand;

    this.eventManager = eventManager;

    eventId = this.getId();
    
    var store = new Ext.data.JsonStore({
        url: 'calendars/get'
        ,root: 'events'
        ,totalProperty: 'totalCount'
        ,fields: ['id', 'end_time', 'start_time', 'summary', 'description', 'location', 'uid', 'commentsCount']
        ,parent: this
        ,listeners: {
            load: function(store, records, options) {
                /*if (store.reader.jsonData.title)
                    this.parent.setPortletTitle(store.reader.jsonData.title);*/
                
                //expand rows if autoExpand is true
                if (this.parent.autoExpand)
                    for(i=store.data.length-1; i>=0; i--)
                        this.parent.expander.toggleRow(i);
            }
        }
        ,baseParams: {
            limit: nItems
        }
    });

	this.expander = new Ext.grid.RowExpander({
        tpl: new Ext.XTemplate(
            '<tpl if="((description) && (description !== \'\'))">'
                ,'<div class="description"><p><b>Description:</b> {description}</p></div>'
            ,'</tpl>'
            ,'<tpl if="(!((description) && (description !== \'\')))">'
                ,'<div><p>No description available</p></div>'
            ,'</tpl>'
            ,'<span style="float:right;padding-bottom:3px;padding-right:3px;"><a href="{uid}" target="_blank">more...</a></span>'
            ,'<span style="float:right;padding-bottom:3px;padding-right:3px;"><span class="a" onclick="Ext.getCmp(\''+eventId+'\').sendTo()">Email to</span> | </span>'
        )
        ,listeners: {
            expand: function(){
                //don't open links in this tab!
                $('#'+ this.parent.getId() +' .description a').attr('target', '_blank');
            }
        }
        ,parent: this
	 });
    
    Events.superclass.constructor.call(this, {
        autoHeight: true,
		autoWidth: true,
        cls: 'events-grid',
        stripeRows: true,
        viewConfig: {
            forceFit:true
            ,scrollOffset:0
            ,emptyText: 'No events planned' /* If this is not written and there are no events, check that phpicalendar works! Probably it does not and this is the problem! */
        },
        bbar: new Ext.PagingToolbar({
            store: store,
            beforePageText: '',
            pageSize: nItems,
            displayInfo: true,
            displayMsg: '{0} - {1} of {2}',
            emptyMsg: 'No events'
        }),
        hideHeaders: true,
		store: store,
        cm: new Ext.grid.ColumnModel([
            this.expander,
            {
                id:'title'
                ,renderer: function(value, p, record) {
                    var df = 'M, d H:i';
                    var sd = Date.parseDate(record.get('start_time'), 'Y-m-d H:i:s').dateFormat(df);
                    var ed = Date.parseDate(record.get('end_time'), 'Y-m-d H:i:s').dateFormat(df);
                    value = String.format(
                        '<p style="color:#888">From {0} to {1}</p><b>{2}</b>',
                        sd, ed, record.get('summary')
                    );

                    // comments
                    value += String.format('<div class="comment-icons-text" style="float:right;color:gray;font-size:90%;" onclick="openCommentWindow(\'Event\', {0})">', record.get('id'), "<div>", Ext.util.Format.htmlEncode(record.get('summary')), "<b></b>");
                    if (record.get('commentsCount'))
                        value += record.get('commentsCount') +' <img class="size12x12" style="vertical-align:bottom;" src="js/portal/shared/icons/fam/comment.png"/>';
                    else 
                        value += '<img class="size12x12" style="vertical-align:bottom;" src="js/portal/shared/icons/fam/comment_add.png"/>';

                    value += '</div>';

                    return value;
                }
            }
        ]),
		plugins: this.expander,
        
        listeners: {
            cellclick:function(grid, rowIndex, columnIndex, e) {
                if (columnIndex) {
                    this.expander.toggleRow(rowIndex);
                }
            }
        },
        
        sendTo: function() {
            var description = this.getSelectionModel().getSelected().data.description;
            var clean_desc =  Ext.util.Format.htmlDecode(
                Ext.util.Format.stripTags(
                    description.replace(/\<\/p\>/g,"\n\n")
                )
            );
            var prefix = "Hi all!\nI think that you may be interested in:\n\n";
            var logparams = {
                source: "events widget"
                ,widget_id: this.portlet_id
            };

            new SendToWindow(prefix+clean_desc, null, logparams);
        }
        

    });
    
    store.load();
    
    this.eventManager.on("addcomment", function(model){ 
        if(model && model === 'events')
            store.reload(); 
    }, this);

    this.eventManager.on("removecomment", function(model){ 
        if(model && model === 'events') 
            store.reload(); 
    }, this);
};

Ext.extend(Events, Ext.grid.GridPanel);
