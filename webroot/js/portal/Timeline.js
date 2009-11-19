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
  * Ext.ux.fbk.sonet.Timeline
  *
  * @author  Marco Frassoni and Davide Setti
  * @class Ext.ux.fbk.sonet.Timeline
  * #@extends Ext.Window
  * <p>A window that shows a building of a building</p>
  * <pre><code>
    This is a example of the json
    </code></pre>
*/

Timeline = Ext.extend(Ext.Panel, {
    border:false
    ,title:'Timeline'
    ,autoScroll:true
    ,iconCls:'timeline'
    ,frame:true
    ,layout: 'fit'
    ,collapsible:true
    ,hideCollapseTool:true
    ,tools: toolsnotclose
    ,autoLoad: false
    /**
     * @cfg {Number} limit The number of events to be displayed in the timeline. Default to 15
     */
    ,limit: 15
    /**
     * @cfg {Number} userId The id of a Taolin user. If not null in the timeline will be shown
     * only events related to specified user. Default to null.
     */
    ,userId: null

    ,initComponent: function(){
        var config = {
            items: [{
                html: '<div id="undodelevent-'+this.id+'" class="undodel"></div>',
                display: 'none',
                autoHeight: true,
                border: false
            }]
        };

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Timeline.superclass.initComponent.apply(this, arguments);
    }
    ,onRender: function(){

        timelineId = 'timeline';
        timelineTemplate = new Ext.ux.fbk.sonet.XTemplate( 
            '<div>',
                '<tpl>',
                    // Pagination
                    '<div style="margin: 5px auto; text-align: center; padding: 5px 0; color:#ddd;"',
                        '<tpl if="!this.isFirstPage()">',
                            '<span class="timeline-pagination"><img src="img/icons/fugue/control-double-180-small.png" class="size16x16" style="vertical-align:top;"/><a style="padding-right:5px;" href="javascript:void(0)" onclick="Ext.getCmp(\'{[this.parent.id]}\').paginateTimeline(0)">Newest</a></span>',
                            '<span class="timeline-pagination"><img src="img/icons/fugue/control-180-small.png" class="size16x16" style="vertical-align:top;"/><a href="javascript:void(0)" onclick="Ext.getCmp(\'{[this.parent.id]}\').paginateTimeline(1)">Newer</a></span>',
                        '</tpl>',
                        '<tpl if="this.isFirstPage()">',
                            '<img src="img/icons/fugue/control-double-180-small.png" class="size16x16" style="vertical-align:top;"/><span style="padding-right:5px;">Newest</span>',
                            '<img src="img/icons/fugue/control-180-small.png" class="size16x16" style="vertical-align:top;"/><span>Newer</span>',
                        '</tpl>',
                        '<span style="padding: 0 15px">|</span>',
                        '<tpl if="!this.isLastPage()">',
                            '<span class="timeline-pagination"><a href="javascript:void(0)" onclick="Ext.getCmp(\'{[this.parent.id]}\').paginateTimeline(2)">Older</a><img src="img/icons/fugue/control-000-small.png" class="size16x16" style="vertical-align:top;"/></span>',
                            '<span class="timeline-pagination"><a style="padding-left:5px;" href="javascript:void(0)" onclick="Ext.getCmp(\'{[this.parent.id]}\').paginateTimeline(3)">Oldest</a><img src="img/icons/fugue/control-double-000-small.png" class="size16x16" style="vertical-align:top;"/></span>',
                        '</tpl>',
                        '<tpl if="this.isLastPage()">',
                            '<span>Older</span><img src="img/icons/fugue/control-000-small.png" class="size16x16" style="vertical-align:top;"/>',
                            '<span style="padding-left:5px;">Oldest</span><img src="img/icons/fugue/control-double-000-small.png" class="size16x16" style="vertical-align:top;"/>',
                        '</tpl>',
                    '</div>',
                    '<tpl for=".">',
                        '<div class="timeline-wrapper">',
                            '<tpl if="this.checkEventDate(date, xindex)">',
                                '<div style="padding:5px;margin:5px;border-bottom:1px solid #aaa;"><span style="padding: 0 5px;"><b>{[this.formatDate(values.date, false)]}</b></span></div>',
                            '</tpl>',
                            '<tpl if="!(this.lastEventOfDay)">',
                                '<hr class="large" />',
                            '</tpl>',
                            '<tpl if="this.isOwner(user_id)">',
                                '<span><img src="js/portal/shared/icons/fam/cross.png" onclick="Ext.getCmp(\'{[this.parent.id]}\').deleteTimelineEvent({id});" title="Delete this event" width="10px" height="10px" style="float:right;padding: 3px 3px 0 0;cursor:pointer;" /></span>',
                            '</tpl>',
                            '<span style="color:#888888;font-size:90%;text-align:right;margin-left:5px;">',
                                '<tpl if="(icon != null)">',
                                    '<img src="{icon}" class="size16x16" /> ',
                                '</tpl>',
                                '{[this.formatDate(values.date, true)]}',
                            '</span><br />',
                            '<table>',
                                '<tr>',
                                    '<tpl if="(user_photo!=null && user_photo != \'\')">',
                                        '<td valign=top>',
                                            '<div style="text-align:center;width:50px;cursor:pointer;" onclick=\"showUserInfo({user_id}, null, \'' + Ext.util.Format.htmlEncode('{"source": "timeline", "timeline_id": "{id}"}') + '\')\">',
                                                '<img style="padding:2px 0" src="{[window.config.img_path]}t40x40/{[this.photoExtToJpg(values.user_photo)]}" />',
                                            '</div>',
                                        '</td>',
                                    '</tpl>',
                                    '<tpl if="(user_photo==null || user_photo == \'\')">',
                                        '<tpl if="(user_id!=null)">',
                                            '<td valign=top>',
                                                '<div style="text-align:center;width:50px;cursor:pointer;" onclick=\"showUserInfo({user_id}, null, \'' + Ext.util.Format.htmlEncode('{"source": "timeline", "timeline_id": "{id}"}') + '\')\">',
                                                    '<img style="padding:2px 0;" width="40" height="50" src="img/nophoto.png" />',
                                                '</div>',
                                            '</td>',
                                        '</tpl>',
                                        '<tpl if="(user_id==null)">',
                                            '<td>',
                                                '<span style="padding: 0 2px"></span>',
                                            '</td>',
                                        '</tpl>',
                                    '</tpl>',
                                    '<td>',
                                        '{[values.event.urlize()]} ',
                                    '</td>',
                                '</tr>',
                            '</table>',
                            '<tpl if="commentsCount &gt; 0">',
                                '<span class="timeline-comments" onclick="openCommentWindow(\'{model_alias}\',{foreign_id}, $(this).parent().find(\'table\'))"><span class="underlineHover">{[this.formatComments(values.commentsCount)]}</span> <img src="js/portal/shared/icons/fam/comment.png" title="View {[this.formatComments(values.commentsCount)]}"></span>',
                            '</tpl>',
                            '<tpl if="commentsCount &lt;= 0">',
                                '<span class="timeline-comments" onclick="openCommentWindow(\'{model_alias}\',{foreign_id}, $(this).parent().find(\'table\'))"><span class="underlineHover">Add a comment</span> <img src="js/portal/shared/icons/fam/comment_add.png" title="Add a comment"></span>',
                            '</tpl>',
                        '</div>',
                    '</tpl>',
                    '<br/>',
                '</tpl>',
            '</div>',
            {
                parent: this
                ,processedDate: null // Current date being processed (belonging to the currently processed event)
                ,lastEventOfDay: false // Last event of day
                // Set
                ,checkEventDate: function(eventDate, index){

                    if(index==1)
                        this.processedDate = null;

                    var formattedEventDate = eventDate.format('M, d Y');

                    if(formattedEventDate!==this.processedDate){
                        this.processedDate = formattedEventDate;
                        this.lastEventOfDay = true;
                    }
                    else
                        this.lastEventOfDay = false;

                    return this.lastEventOfDay;
                }
                ,isFirstPage: function(){

                    var start = this.parent.view.store.baseParams.start;
                    var limit = this.parent.view.store.baseParams.limit;

                    return start - limit < 0;
                }
                ,isLastPage: function(){

                    var total = this.parent.view.store.totalLength;
                    var start = this.parent.view.store.baseParams.start;
                    var limit = this.parent.view.store.baseParams.limit;

                    return (start + limit) >= total;
                }
                ,formatComments: function(cc){
                    return Ext.util.Format.plural(cc, 'comment');
                }
            }
        );

        var store = new Ext.data.JsonStore({
            url: 'timelines/gettimeline',
            root: 'timeline',
            fields: ['id','user_id','event','name','surname','login','user_photo','icon',{name: 'date', type: 'date', dateFormat: 'Y-m-d H:i:s'},'model_alias','foreign_id','commentsCount']
            ,baseParams: {
                limit: this.limit
                ,u_id: this.userId
                ,start: 0
            }
            ,autoLoad: this.autoLoad
        });

        var dv = new Ext.DataView({
            tpl: timelineTemplate,
            emptyText: '<div style="padding:10px 5px;font-size:100%"><b><div class="warning-message">There are no events in timeline.</b></div></div>', 
            store: store,
            itemSelector: 'div.timeline-wrapper',
            loadingText: 'Loading timeline...',
            deferEmptyText: false
        });

        this.add(dv);
        this.view = dv;

        // Set parent for the XTemplate
        timelineTemplate.parent = this;

        var task = {
            run: function(){
                if (this.view.store && !this.collapsed)
                    this.view.store.load();
            }
            ,interval: 300000 //300 seconds = 5 minutes
            ,scope: this
        };
        Ext.TaskMgr.start(task);

        this.reloadTask = task;
        
        Timeline.superclass.onRender.apply(this, arguments);
    }
    ,isReloadable: function(){
        return !this.hidden;
    }
    ,constructor: function(config){
         config = config || {};
         config.listeners = config.listeners || {};
         Ext.applyIf(config.listeners, {
            //add listeners config here
            render: {
                fn: function(timeline){
                    eventManager.on('newtimelineevent', function(){
                        if (timeline && timeline.isReloadable()){
                            //Load the store
                            timeline.view.store.load();
                            //Reset reloadTask timeout to actual time
                            timeline.reloadTask.taskRunTime = Date.parse(Date());
                        }
                    });
                }
            }
         });
             
         Timeline.superclass.constructor.call(this, config);
    }
    ,deleteTimelineEvent: function(e_id){

        var store = this.view.store;
        var parentId = this.id;

        if(e_id){
            Ext.Ajax.request({
                url : 'timelines/deleteevent/'+e_id ,
                method: 'GET',
                success: function(result, request){
                    Ext.get("undodelevent-"+parentId).update('Event deleted. <a href="javascript:void(0)" "onclick="Ext.getCmp(\''+parentId+'\').undoDeleteTimelineEvent(' + e_id + ')">Undo</a> | <a href="javascript:showText(false, \'undodelevent-'+parentId+'\')">Hide</a>');
                    showText(true, 'undodelevent-'+parentId);
                    store.load();
                },
                failure: function(){
                    Ext.Msg.show({
                        title: 'Warning!',
                        msg: '<center>Problem found in data transmission</center>',
                        width: 400,
                        icon: Ext.MessageBox.WARNING
                    });
                }
            });
        } 
    }
    ,undoDeleteTimelineEvent:function(e_id){

        var store = this.view.store;
        var parentId = this.id;

        if(e_id){
            Ext.Ajax.request({
                url : 'timelines/undodeleteevent/'+e_id ,
                method: 'GET',
                success: function(result, request){
                    showText(false, 'undodelevent-' + parentId);
                    store.load();
                },
                failure: function(){
                    Ext.Msg.show({
                        title: 'Warning!',
                        msg: '<center>Problem found in data transmission</center>',
                        width: 400,
                        icon: Ext.MessageBox.WARNING
                    });
                }
            });
        } 
    }
    ,paginateTimeline: function(pag_case){

        var start = this.view.store.baseParams.start;
        var limit = this.view.store.baseParams.limit;
        var total = this.view.store.totalLength;

        var offset = 0;

        switch(pag_case){
            case 0:
                offset = 0;
                break;
            case 1:
                offset = start - limit;
                break;
            case 2: 
                offset = start + limit;
                break;
            case 3:
                offset = total - limit;
                break;
            default:
                offset = 0;
        }
                
        if(offset < 0)
            offset = 0;

        this.view.store.setBaseParam('start', offset);
        this.view.store.reload();
    }
});

Ext.reg('timeline', Timeline);
