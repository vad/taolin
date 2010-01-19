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

/* PAGINATION */
var pagination = 
    '<tpl if="!(this.isFirstPage() && this.isLastPage())">'+
        '<div class="timeline-pagination">'+
            '<div class="left-div" style="visibility:<tpl if="this.isFirstPage()">hidden</tpl>">'+
                '<span class="pagination-item" onclick="{this.parent.id:getCmp}.paginateTimeline(0)"><span class="sprited double-prev"></span>Newest</span>'+
                '<span class="pagination-item" onclick="{this.parent.id:getCmp}.paginateTimeline(1)"><span class="sprited prev"></span>Newer</span>'+
            '</div>'+
            '<div class="right-div" style="visibility:<tpl if="this.isLastPage()">hidden</tpl>">'+
                '<span class="pagination-item" onclick="{this.parent.id:getCmp}.paginateTimeline(2)">Older<span class="sprited next" /></span></span>'+
                '<span class="pagination-item" onclick="{this.parent.id:getCmp}.paginateTimeline(3)">Oldest<span class="sprited double-next" /></span></span>'+
            '</div>'+
        '</div>'+
    '</tpl>';
/* END OF PAGINATION */

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
                html: '<div id="undodelevent-'+this.id+'" class="warning-msg" style="visibility: hidden; margin-right:20px !important;"></div>',
                display: 'none',
                autoHeight: true,
                border: false
            }]
        };

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Timeline.superclass.initComponent.apply(this, arguments);
    }
    ,onRender: function(){
        var timelineTemplate = new Ext.XTemplate( 
            '<div>',
                pagination,
                '<tpl for=".">',
                    '<div class="timeline-wrapper">',
                        '<tpl if="this.checkEventDate(date, xindex)">',
                            '<div style="padding:5px;margin:5px;border-bottom:1px solid #aaa;"><span style="padding: 0 5px;"><b>{date:naturalDate(false)}</b></span></div>',
                        '</tpl>',
                        '<tpl if="!(this.lastEventOfDay)">',
                            '<hr class="large" />',
                        '</tpl>',
                        '<tpl if="isOwner(user_id)">',
                            '<span><img src="js/portal/shared/icons/fam/cross.png" onclick="{this.parent.id:getCmp}.deleteTimelineEvent({id});" title="Delete this event" width="10px" height="10px" style="float:right;padding: 3px 3px 0 0;cursor:pointer;" /></span>',
                        '</tpl>',
                        '<span style="color:#888888;font-size:90%;text-align:right;margin-left:5px;">',
                            '<tpl if="(icon != null)">',
                                '<img src="{icon}" class="size16x16" /> ',
                            '</tpl>',
                            '{date:naturalDate(true)}',
                        '</span><br />',
                        '<table>',
                            '<tr>',
                                '<tpl if="(user_id==null)&&(user_photo==null || user_photo == \'\')">',
                                    '<td>',
                                        '<span style="padding:0 2px"></span>',
                                    '</td>',
                                '</tpl>',
                                // else
                                '<tpl if="!((user_id==null)&&(user_photo==null || user_photo == \'\'))">',
                                    '<td valign=top>',
                                        '<div style="text-align:center;width:50px; <tpl if="deleted!=1">cursor:pointer" onclick="showUserInfo({user_id}, null, \'' + Ext.util.Format.htmlEncode('{"source": "timeline", "timeline_id": "{id}"}') + '\')</tpl>">',
                                            '<tpl if="(user_photo==null || user_photo == \'\')">',
                                                '<img style="padding:2px 0;" width="40" height="50" src="img/nophoto.png" />',
                                            '</tpl>',
                                            // else
                                            '<tpl if="(user_photo!=null && user_photo != \'\')">',
                                                '<img style="padding:2px 0" src="{[window.config.img_path]}t40x40/{user_photo:photoExtToJpg}" />',
                                            '</tpl>',
                                        '</div>',
                                    '</td>',
                                '</tpl>',
                                '<td>',
                                    '{event:urlize} ',
                                '</td>',
                            '</tr>',
                        '</table>',

                        /* COMMENTS */
                        '<tpl if="commentsCount &gt; 0">',
                            '<span class="timeline-comments" onclick="openCommentWindow(\'{model_alias}\',{foreign_id})">',
                                '<span>{commentsCount:plural("comment")}</span>',
                                '<span class="sprited comment-icon" title="View {commentsCount:plural("comment")}" />',
                            '</span>',
                        '</tpl>',
                        '<tpl if="commentsCount &lt;= 0">',
                            '<span class="timeline-comments" onclick="openCommentWindow(\'{model_alias}\',{foreign_id})">',
                                '<span>Add a comment</span>',
                                '<span class="sprited comment-add" title="Add a comment" />',
                            '</span>',
                        '</tpl>',
                        /* END OF COMMENTS */

                    '</div>',
                '</tpl>',
                '<br />',
                pagination,
                '<br />',
            '</div>'
            ,{
                parent: this
                ,compiled: true
                ,disableFormats: false
                ,processedDate: null // Current date being processed (belonging to the currently processed event)
                ,lastEventOfDay: false // Last event of day
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
            }
        );

        var store = new Ext.data.JsonStore({
            url: 'timelines/gettimeline',
            root: 'timeline',
            fields: ['id','user_id','event','name','surname','login','user_photo','icon',{name: 'date', type: 'date', dateFormat: 'Y-m-d H:i:s'},'model_alias','foreign_id','commentsCount', 'deleted']
            ,baseParams: {
                limit: this.limit
                ,u_id: this.userId
                ,start: 0
            }
            ,autoLoad: this.autoLoad
        });

        var dv = new Ext.DataView({
            tpl: timelineTemplate,
            emptyText: '<div style="padding:10px 5px;font-size:100%"><div class="warning-msg">There are no events in timeline.</div></div>', 
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
                    Ext.get("undodelevent-"+parentId).update('Event deleted. <a href="javascript:void(0)" onclick="Ext.getCmp(\''+parentId+'\').undoDeleteTimelineEvent(' + e_id + ')">Undo</a> | <a href="javascript:showText(false, \'undodelevent-'+parentId+'\')">Hide</a>');
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
