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
        var config = {
        };
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        this.store = new Ext.data.JsonStore({
            url: 'photos/getphotos',
            root: 'photos',
            method: 'POST',
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
        //this.store.load({params: {id: westPanel.showedUser.id}});

        var tpl = new Ext.ux.fbk.sonet.XTemplate( 
            '{[this.resetPreviousPhotoVisibility()]}',
            '<tpl for=".">',
                '<tpl if="this.showHeader(values.is_hidden)">',
                    '<tpl if="this.previousPhotoVisibility == 0">',
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
                        '<span></span><img class="ante" style="padding:5px;cursor:pointer;" src="{[window.config.img_path]}t140x140/{[this.photoExtToJpg(values.filename)]}" />',
                    '</div>',
                    '<div style="float:right;font-size:90%;color:gray;cursor:pointer;">',
                        '<tpl if="commentsCount &gt; 0">',
                            '<span class="underlineHover" onclick="openCommentWindow(\'Photo\',{id})">',
                                '{commentsCount} <img style="vertical-align:bottom;" class="size12x12" src="js/portal/shared/icons/fam/comment.png" title="View comments" />',
                            '</span>',
                        '</tpl>',
                        '<tpl if="commentsCount &lt;= 0">',
                            '<span class="underlineHover" onclick="openCommentWindow(\'Photo\',{id})">',
                                '<img style="vertical-align:bottom;" class="size12x12" src="js/portal/shared/icons/fam/comment_add.png" title="Add a comment">',
                            '</span>',
                        '</tpl>',
                    '</div>',
                    '<span><b>{name}</b></span><br />',
                    '<span style="padding-bottom:5px;color:gray;font-size:90%;">{[this.formatDate(values.created, false)]}</span><br />',
                 '</div>',
            '</tpl>',
            '</div>',
            {
                /* Keeps track of the visibility of the previous photo
                 * Need this function to show the correct header
                 */
                previousPhotoVisibility: null
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

        tpl.compile();

        var dv = new Ext.DataView({
            tpl: tpl,
            emptyText: '<div style="padding:10px 5px;font-size:100%"><div class="warning-message"><b>No photos for this user</b></div></div>', 
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
                        
                        var photo = new Array();

                        photo['id'] = dv.store.getAt(index).get('id');
                        photo["url"] = dv.store.getAt(index).get('url');
                        photo["caption"] = dv.store.getAt(index).get('caption'); 

                        var orig_filename = dv.store.getAt(index).get('filename');
                        photo["filename"] = Ext.util.Format.substr(orig_filename, 0, orig_filename.lastIndexOf("."));

                        photo["imgWidth"] = parseInt(dv.store.getAt(index).get('width'));
                        photo["imgHeight"] = parseInt(dv.store.getAt(index).get('height'));
                        photo['commentsCount'] = dv.store.getAt(index).get('commentsCount');

                        var imageValues = preparePhoto(photo);
                        var winBody = imageValues["winBody"];
                        var winWidth = imageValues["winWidth"];
                        var winTitle = Ext.util.Format.ellipsis(dv.store.getAt(index).get('name'), 50);

                        var winButtons = {no: "Close"};

                        if(dv.store.getAt(index - 1) != null)
                            winButtons['ok'] = "Prev";

                        if(dv.store.getAt(index + 1) != null)
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

                        $('#'+photo['filename']).load(function(){
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
        
        Ext.ux.fbk.sonet.UserPublications.superclass.onRender.apply(
            this, arguments
        );

    }
});
Ext.reg('userphotos', Ext.ux.fbk.sonet.UserPhotos);
