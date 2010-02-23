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

/**
  * Ext.ux.fbk.sonet.UserPhotos
  *
  * @author  Marco Frassoni and Davide Setti
  * @class Ext.ux.fbk.sonet.UserPhotos
  * #@extends Ext.Panel
  * Shows a user's photos
  *
  */
Ext.namespace( 'Ext.ux.fbk.sonet' );

Ext.ux.fbk.sonet.UserPhotos = Ext.extend(Ext.Panel, {
    title: 'Photos',
    autoHeight: true,
    initComponent: function(){
        Ext.apply(this, this.initialConfig);

        this.store = new Ext.data.JsonStore({
            proxy : new Ext.data.HttpProxy({
                method: 'GET',
                url: 'photos/getphotos'
            }),
            root: 'photos',
            fields: ['id', 'name', 'filename', 'user_id', 'caption', 'width', 'height', 'url', 'is_hidden','default_photo',{name: 'created', type: 'date', dateFormat: 'Y-m-d H:i:s'}, 'commentsCount'],
            listeners:{
                load: function(store, records, option){
                    this.parent.setTitle(
                        this.parent.prevTitle+' ('+this.totalLength+')'
                    );
                }
            }
            ,parent: this
        });
       
        Ext.StoreMgr.add('wp-photos-tab-store', this.store);
        Ext.ux.fbk.sonet.UserPhotos.superclass.initComponent.apply(this, arguments);
                 
        //save title to use it later (on load)
        this.prevTitle = this.title;
    },
    onRender: function(){
        var tpl = new Ext.XTemplate( 
            '{[this.resetPreviousPhotoVisibility()]}',
            '<tpl for=".">',
                '<tpl if="this.showHeader(values.is_hidden)">',
                    '<tpl if="this.previousPhotoVisibility === 0">',
                        '<div class="user-photos-header" style="padding-top: 15px;">',
                            'Public photos',
                        '</div>',
                        '<div style="overflow-y: hidden;">',
                    '</tpl>',
                    '<tpl if="this.previousPhotoVisibility == 1">',
                        '</div>',
                        '<div class="user-photos-header" style="padding-top: 50px;">',
                            'Your private photos',
                        '</div>',
                        '<div style="overflow-y: hidden;">',
                    '</tpl>',
                '</tpl>',
                '<div style="padding:10px;" class="thumb-wrap">',
                    '<div class="thumb">',
                        /* The <span> element without any content has to be placed there to vertically align images in the middle on IE */
                        '<span></span><img class="ante" style="padding:5px;cursor:pointer;" src="{[config.img_path]}t140x140/{filename:photoExtToJpg}" />',
                    '</div>',
                    '<div style="float:right;font-size:90%;color:gray;cursor:pointer;">',
                        '<span onclick="openCommentWindow(\'Photo\',{id},{source:\'UserPhotos\',id:{id}})">',
                            '<tpl if="commentsCount">',
                                '{commentsCount} <span class="sprited comment-icon" title="View comments"></span>',
                            '</tpl>',
                            '<tpl if="!commentsCount">',
                                '<span class="sprited comment-add" title="Add a comment"></span>',
                            '</tpl>',
                        '</span>',
                    '</div>',
                    '<span><b>{name}</b></span><br />',
                    '<span style="padding-bottom:5px;color:gray;font-size:90%;">{created:naturalDate(false)}</span><br />',
                 '</div>',
            '</tpl>',
            '</div>',
            {
                compiled:true
                /* Keeps track of the visibility of the previous photo
                 * Need this function to show the correct header
                 */
                ,previousPhotoVisibility: null
                // Reset that value
                ,resetPreviousPhotoVisibility: function(){
                    this.previousPhotoVisibility = null;
                    return '';
                }
                // To show or not to show (the header "Public photos" / "Private photos")? This is the question
                ,showHeader: function(is_private){
                    if((is_private == 0 && this.previousPhotoVisibility == null) || (is_private == 1 && this.previousPhotoVisibility == 0)){
                        this.previousPhotoVisibility = is_private;
                        return true;
                    }
                    else 
                        return false;
                }
            }
        );

        var dv = new Ext.DataView({
            tpl: tpl,
            emptyText: '<div style="padding:10px 5px;" class="warning-message border_radius_5px">No photos for this user</div>', 
            store: this.store,
            loadingText: 'Please wait while loading...',
            itemSelector: 'div.thumb',
            listeners: {
                click: {
                    fn: function(dv, index){
                                     
                         /*
                          * Implementing a photogallery. The body of the Ext.Msg element is pure html, thus
                          * it will be created an <img> element with the desired properties such as the min-height
                          * (necessary to center the Ext.Msg element in the window)
                          */
                        
                        var fm = Ext.util.Format
                            ,store = dv.store
                            ,record = store.getAt(index);

                        var photo = {
                            id : record.get('id')
                            ,url: record.get('url')
                            ,caption: record.get('caption') 
                            ,filename: fm.photoExtToJpg(record.get('filename'))
                            ,imgWidth: parseInt(record.get('width'), 10)
                            ,imgHeight: parseInt(record.get('height'), 10)
                            ,commentsCount: record.get('commentsCount')
                        };

                        var winBody = photoWindowTemplate.apply(photo)
                            ,winWidth = 530
                            ,winTitle = fm.ellipsis(record.get('name'), 50)
                            ,winButtons = {no: "Close"};

                        if(store.getAt(index - 1) != null)
                            winButtons['ok'] = "Prev";

                        if(store.getAt(index + 1) != null)
                            winButtons['yes'] = "Next";

                        var img_window = Ext.Msg.show({  
                            width: winWidth, 
                            title: winTitle,  
                            msg: winBody,  
                            buttons: winButtons,
                            closable: false,
                            iconCls: 'picture',
                            /* HACK
                             * Gallery based on recalling the following function and changing indexes 
                             */
                            fn:function(btn){
                                // In this hack, 'ok' button stands for 'prev'
                                if(btn == 'ok'){
                                    dv.initialConfig.listeners.click.fn(dv, index-1);
                                }
                                // In this hack, 'no' button stands for 'next'
                                else if(btn == 'yes'){
                                    dv.initialConfig.listeners.click.fn(dv, index+1);
                                }  
                            }   
                        });

                        $('#photo-'+photo['id']).load(function(){
                            img_window.getDialog().center();
                        });

                    },
                    scope:this
                }
            },
            deferEmptyText:false
        });

        this.add(dv);
    
        eventManager.on("userphotochange", function(){
            if(this.store.lastOptions.params.u_id == window.user.id)
                this.store.reload(); 
        }, this);

        eventManager.on("addcomment", function(model){ 
            if(model && model === 'photos') 
                this.store.reload(); 
        }, this);

        eventManager.on("removecomment", function(model){ 
            if(model && model === 'photos') 
                this.store.reload(); 
        }, this);
        
        Ext.ux.fbk.sonet.UserPublications.superclass.onRender.apply(
            this, arguments
        );

    }
});
Ext.reg('userphotos', Ext.ux.fbk.sonet.UserPhotos);
