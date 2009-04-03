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
            fields: ['id', 'name', 'filename', 'caption', 'width',
                'height', 'url', 'is_hidden','default_photo', 'created'],
            listeners:{
                load: function(){
                    this.parent.setTitle(
                        this.parent.prevTitle+' ('+this.totalLength+')'
                    );
                }
            }
            ,parent: this
        });
        
        Ext.ux.fbk.sonet.UserPhotos.superclass.initComponent.apply(this, arguments);
                 
        //save title to use it later (on load)
        this.prevTitle = this.title;
    },
    onRender: function(){
        //this.store.load({params: {id: westPanel.showedUser.id}});

        var tpl = new Ext.XTemplate( 
            '<div style="font-size:100%">',
                '<tpl for=".">',
                    '<div style="padding:10px;" class="thumb-wrap">',
                        /* The <span> element without any content has to be placed there to vertically align images in the middle on IE */
                        '<div class="thumb"><span></span>',
                            '<img class="ante" style="padding:5px;cursor:pointer;" src="img/'+window.config.imgpath+'t140x140/{[this.photoExtToJpg(values.filename)]}" />',
                        '</div>',
                        '<span style="padding-bottom:5px;"><b>{name}</b></span><br />',
                     '</div>',
                '</tpl>',
            '</div>', {
                // Substitution of photo's filename extension to .jpg (since all the thumb are saved as .jpg)
                photoExtToJpg: function(screenshot){
                    return Ext.util.Format.substr(screenshot, 0, screenshot.lastIndexOf(".")) + '.jpg'; 
                }
            }

        );
        tpl.compile();

        var dv = new Ext.DataView({
            tpl: tpl,
            emptyText: '<div style="padding:10px 5px;font-size:100%"><div class="warning-message"><b>No photos for this user</b></div></div>', 
            store: this.store,
            loadingText: 'Please wait while loading...',
            itemSelector: 'div.thumb-wrap',
            listeners: {
                click: {
                    fn: function(dv, index){
                                     
                         /*
                          * Implementing a photogallery. The body of the Ext.Msg element is pure html, thus
                          * it will be created an <img> element with the desired properties such as the min-height
                          * (necessary to center the Ext.Msg element in the window)
                          */
                         var winTitle = Ext.util.Format.ellipsis(dv.store.getAt(index).get('name'), 50);
                         
                         var imgWidth = parseInt(dv.store.getAt(index).get('width'));
                         var imgHeight = parseInt(dv.store.getAt(index).get('height'));

                         var imageValues = showImageParam(imgWidth, imgHeight, dv.store.getAt(index).get('url'), dv.store.getAt(index).get('filename'), dv.store.getAt(index).get('caption'));
                         var winBody = imageValues["winBody"];
                         var winWidth = imageValues["winWidth"];
                         
                         var winButtons = {no: "Close"};

                         if(dv.store.getAt(index - 1) != null)
                             winButtons['ok'] = "Prev";

                         if(dv.store.getAt(index + 1) != null)
                             winButtons['yes'] = "Next";

                         Ext.Msg.show({  
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


                    },
                    scope:this
                }
            },
            deferEmptyText:false
        });

        this.add(dv);
        
        Ext.ux.fbk.sonet.UserPublications.superclass.onRender.apply(
            this, arguments
        );

    }
});
Ext.reg('userphotos', Ext.ux.fbk.sonet.UserPhotos);
