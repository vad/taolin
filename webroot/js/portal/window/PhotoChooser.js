/**
 * This file is part of taolin project (http://taolin.fbk.eu)
 * Copyright (C) 2008, 2009 FBK Foundation, (http://www.fbk.eu)
 * Authors: SoNet Group (see AUTHORS.txt)
 *
 * This file is a modified version of a file of Ext JS Library 2.2.1
 * (see copyright below).
 * According to the Ext JS Library 2.2.1 license (see
 * http://extjs.com/license ), Ext JS Library 2.2.1 is double licensed.
 * Within the license we could choose among, we release our modified
 * version under GPLv3.0.
 *
 * Taolin is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * In order to obtain further information on GNU General Public License
 * see <http://www.gnu.org/licenses/>.
 *
 */

/*
 * Ext JS Library 2.2.1
 * Copyright(c) 2006-2009, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

PhotoChooser = function(config){
	this.config = config;
};

PhotoChooser.prototype = {
    // cache data by image name for easy lookup
    lookup : {}
    
	,show : function(el, callback){

		if(!this.win){

			this.initTemplates();

			this.store = new Ext.data.JsonStore({
			    url: this.config.url,
			    root: 'photos',
                method: 'POST',
                baseParams: {id: window.user.id},
			    fields: [
			        'id', 'name', 'filename', 'caption', 'is_hidden','default_photo',
			        {name:'size', type: 'float'},
                    {name:'created'},
                    {name: 'modified'}
			    ],
			    listeners: {
			    	'load': {fn:function(){ this.view.select(0); }, scope:this, single:false}
			    }
			});

			this.store.load();

			var formatSize = function(data){
		        if(data.size < 1024) {
		            return data.size + " bytes";
		        } else {
		            return (Math.round(((data.size*10) / 1024))/10) + " KB";
		        }
		    };
			
			var formatData = function(data){
		    	data.shortName = data.name ? data.name.ellipse(18) : data.filename.ellipse(18);
                data.usedName = data.name ? data.name : data.filename;
		    	data.sizeString = formatSize(data);
                data.description = data.caption ? data.caption.replace(/\\n/g,"<br />") : '<i>This photo still needs to be descripted</i>';
                data.formattedDescription = data.caption ? data.caption.replace(/\\n/g,"<br />").urlize().smilize() : '<i>This photo still needs to be descripted</i>';
                data.visibility = (data.is_hidden==0) ? 'Public' : 'Private';
                data.defaultPhoto = data.default_photo;
                data.dateCreatedString = Date.parseDate(data.created, "Y-m-d H:i:s").format("F j, Y");
                data.dateModifiedString = data.modified ? Date.parseDate(data.modified, "Y-m-d H:i:s").format("F j, Y") : '<i>Never modified</i>';
		    	this.lookup[data.filename] = data;
		    	return data;
		    };
			
		    this.view = new Ext.DataView({
				tpl: this.thumbTemplate,
				singleSelect: true,
                //overClass:'x-view-over',
                overClass: 'searchusermouseoverbg',
				itemSelector: 'div.thumb-wrap',
				emptyText : '<div style="padding:10px;">No pictures match the specified filter</div>',
				store: this.store,
				listeners: {
					'selectionchange': {fn:this.showDetails, scope:this, buffer:100},
					'dblclick'       : {fn:this.doCallback, scope:this},
					'loadexception'  : {fn:this.onLoadException, scope:this},
					'beforeselect'   : {fn:function(view, node, sel){
				        return view.store.getRange().length > 0;
				    }, scope: this}
				},
				prepareData: formatData.createDelegate(this)
			});

            this.setDefaultPhoto = function(p_id, filename){
                if(p_id){
                    Ext.Ajax.request({
                        url : 'photos/setdefaultphoto/'+p_id ,
                        method: 'GET',
                        success: function(result, request){
                            Ext.example.msg('Success','Your default photo has been changed!');
                            Ext.getCmp('photo-chooser').store.load();
                            eventManager.fireEvent('newtimelineevent');
                            if(filename && Ext.get('user_photo')) {
                                filename_to_jpg = Ext.util.Format.substr(filename, 0, filename.lastIndexOf(".")) + ".jpg";
                                Ext.get('user_photo').dom.src = window.config.img_path + "t140x140/" + filename_to_jpg;
                            }
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
            };
		    
            this.undoDeletePhoto = function(p_id){
               if(p_id){
                    Ext.Ajax.request({
                        url : 'photos/undodeletephoto/'+p_id ,
                        method: 'GET',
                        success: function(result, request){
                            Ext.getCmp('photo-chooser').store.load();

                            // The store in the west-panel is loaded only if it exists
                            var store = Ext.StoreMgr.lookup('wp-photos-tab-store');
                            if(westPanel.showedUser && (westPanel.showedUser.id === window.user.id) && store)
                                store.load({params: {id: window.user.id}});

                            /* Hide div containing the "Undo delete" message */
                            showText(false, 'undodelphoto');
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
            };
            
            this.renameField = function(photo_id, fname, fvalue){
       
                Ext.Msg.show({
                    msg: '<br />Rename as:<br />',
                    iconCls: 'settings',
                    title: 'Editing...',
                    value: fvalue,
                    width: 200,
                    maxWidth: 500,
                    buttons: Ext.MessageBox.OKCANCEL,
                    multiline: true,
                    fn: function(btn, text){
                            if(btn == 'ok' && text != null && text != "" && text != fvalue) {
                                //var value = text.replace(/\'/g,"\\\'");
                                Ext.Ajax.request({
                                    url : 'photos/setattribute/',
                                    params: {'p_id': photo_id, 'name': fname, 'value': text},
                                    method: 'POST',
                                    success: function(result, request){
                                        Ext.getCmp('photo-chooser').store.load();
                                        // The store in the west-panel is loaded only if it exists
                                        var store = Ext.StoreMgr.lookup('wp-photos-tab-store');
                                        if((request.params.name === 'name' || request.params.name === 'caption') && (westPanel.showedUser.id == window.user.id) && store)
                                            store.load({params: {id: window.user.id}});
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
               });
            };  

            this.setPhotoVisibility = function(photo_id, value, is_default){
        
                Ext.Ajax.request({
                    url : 'photos/setattribute/',
                    params: {'p_id': photo_id, 'name': 'is_hidden', 'value': value},
                    method: 'POST',
                    success: function(result, request){
                        Ext.getCmp('photo-chooser').store.load();
                    },
                    failure: function(){
                        Ext.Msg.show({
                            title: 'Warning!',
                            msg: '<center>Data transmission problem</center>',
                            width: 400,
                            icon: Ext.MessageBox.WARNING
                        });
                    }
                });
            };

			var cfg = {
		    	title: 'Photos manager',
		    	layout: 'border', 
				minWidth: 500,
				minHeight: 300,
				modal: true,
				closeAction: 'hide',
				border: true,
				items:[{
					region:'center',
		            autoScroll: true,
					items: [{
						html: '<div id="undodelphoto" class="undodel"></div>',
                        border: false
					},{
                        items: this.view,
                        border: false
                    }],
	                tbar:[{
        	        	    text: 'Filter:'
                   	    },{
                    		xtype: 'textfield',
	                    	id: 'filter',
            	        	selectOnFocus: true,
                        	width: 100,
                    		listeners: {
                    			'render': {fn:function(){
					                        	Ext.getCmp('filter').getEl().on('keyup', function(){
                                                            						    		this.filter();
                                                        						    	}, this, {buffer:500});
                                        	}, scope:this}
	                	    }
             	        }, ' ', '-', {
                	        text: 'Sort By:'
    	                },{
        	        	    id: 'sortSelect',
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
        				        data : [['name', 'Name'],['size', 'File Size'],['created','Creation date'],['modified', 'Last Modified']]
		        		    }),
				    	    listeners: {
					        	'select': {fn:this.sortImages, scope:this}
        				    }
		        	    }]    
				    },{
					    id: 'img-detail-panel',
    					region: 'east',
	    				split: true,
		    	        autoScroll: true,
			    		width: 300
                }],
				buttons: [{
					text: 'Set default photo',
					handler: function(){ 
                                var selNode = this.view.getSelectedNodes();
		                        if(selNode && selNode.length > 0){ 
                                    var data = this.lookup[selNode['0'].id]; 
                                    if(data.is_hidden === '0'){
                                        if(data.defaultPhoto === '0') this.setDefaultPhoto(data.id, data.url);
                                    }
                                    else Ext.Msg.show({
                                            title: 'Warning!!!', 
                                            msg: 'This is photo is private, thus it can not be selected as default photo!', 
                                            width: 400,
                                            icon: Ext.MessageBox.WARNING
                                        });
                                }
                                else Ext.Msg.show({
                                        title: 'Warning!!!', 
                                        msg: 'Please select a photo before trying to set it as the default one', 
                                        width: 400,
                                        icon: Ext.MessageBox.WARNING
                                    });
                },
					scope: this
				},{
					text: 'Delete this photo',
					handler: function(){ 
                                var selNode = this.view.getSelectedNodes();
		                        if(selNode && selNode.length > 0){ 
                                    var data = this.lookup[selNode['0'].id];
                                    var photo_manager = this;
                                    if(data.defaultPhoto === '0')
                                        Ext.MessageBox.confirm('Confirm', 'Are you sure you want to do delete photo ' + data.shortName + '?', function(btn){
                                            if(btn == 'yes')
                                                photo_manager.deletePhoto(data.id);
                                        });
                                    else
                                        Ext.MessageBox.confirm('Warning', 'This is your default photo. If you delete it, other users will not be able to see your profile picture until you select a new one. <b>Proceed anyway?</b>', function(btn){
                                            if(btn == 'yes')
                                                photo_manager.deletePhoto(data.id);
                                        });
                               }
                               else Ext.Msg.show({
                                        title: 'Warning!!!',
                                        msg: 'Please select a photo before trying to delete it',
                                        width: 400,
                                        icon: Ext.MessageBox.WARNING
                                    });
                    },
					scope: this
				},{
					id: 'upload-btn',
					text: 'Upload a photo',
					handler: function(){ this.openPhotoUpload(); },
					scope: this
				},{
					id: 'ok-btn',
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
            this.win.setDefaultPhoto = this.setDefaultPhoto;
            this.win.setPhotoVisibility = this.setPhotoVisibility;
            this.win.renameField = this.renameField;
            this.win.undoDeletePhoto = this.undoDeletePhoto;
        }
		this.reset();
	    this.win.show(el, callback);
		this.callback = callback;
		this.animateTarget = el;
	}
	
	,initTemplates : function(){
		this.thumbTemplate = new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="thumb-wrap" id="{filename}">',
                    /* The <span> element without any content has to be placed there to vertically align images in the middle on IE */
				    '<div class="thumb"><span></span>',
                        '<img class="ante" style="padding:5px;" src="{[window.config.img_path]}t140x140/{[this.photoExtToJpg(values.filename)]}"></img>',
                    '</div>',
	    			'<span style="padding:5px;"><b>{shortName}</b></span>',
                '</div>',
			'</tpl>', {
                // Substitution of photo's filename extension to .jpg (since all the thumb are saved as .jpg)
                photoExtToJpg: function(screenshot){
                    return Ext.util.Format.substr(screenshot, 0, screenshot.lastIndexOf(".")) + '.jpg'; 
                }
            }
		);
		this.thumbTemplate.compile();
		
		this.detailsTemplate = new Ext.XTemplate(
			'<div class="details">',
				'<tpl for=".">',
					'<center><div style="padding:5px;"><img class="ante" src="{[window.config.img_path]}t240x240/{[this.photoExtToJpg(values.filename)]}"></center>',
                    '<div class="details-info">',
					'<br /><b>Image Name: </b>',
					'<span style="padding-right:40px">{usedName}</span><span style="float: right; position: absolute; right: 20px;"><a href="javascript:void(0)" onclick="Ext.getCmp(\'photo-chooser\').renameField({id}, \'name\', \'{usedName}\')">edit</a></span><br /><br />',
					'<b>Size: </b>',
					'<span>{sizeString}</span><br /><br />',
                    '<b>Created on: </b>',
					'<span>{dateCreatedString}</span><br />',
					'<b>Last Modified: </b>',
					'<span>{dateModifiedString}</span><br /><br />',
					'<b>Visibility: </b>',
					'<span>{visibility}</span>',//<input type="checkbox" name="is_hidden" default="{is_hidden}" /><br />',
                    '<tpl if="(is_hidden == \'1\')">',
                        '<span style="float: right; position: absolute; right: 20px;"><a href="javascript:void(0)" onclick="Ext.getCmp(\'photo-chooser\').setPhotoVisibility({id}, 0, {defaultPhoto})" title="Setting this photo as public will let other users">set public</a></span><br /><br />',
                    '</tpl>',
                    '<tpl if="(is_hidden == \'0\')">',
                        '<span style="float: right; position: absolute; right: 20px;"><a href="javascript:void(0)" onclick="Ext.getCmp(\'photo-chooser\').setPhotoVisibility({id}, 1, {defaultPhoto})" title="Setting this photo as private will hide it to other users, even if this is already set as your default photo!">set private</a></span><br /><br />',
                    '</tpl>',
					'<tpl if="(defaultPhoto == \'1\')">',
                        '<span><b>This is your default photo</b></span><br /><br />',
                    '</tpl>',
                    '<tpl if="(defaultPhoto == \'0\')">',
                        '<span><a href="javascript:void(0)" onclick="Ext.getCmp(\'photo-chooser\').setDefaultPhoto(\'{id}\', \'{filename}\')">Set this as your default photo</a></span><br /><br />',
                    '</tpl>',
					'<b>Description: </b><span style="float: right; position: absolute; right: 20px;"><a href="javascript:void(0)" onclick="Ext.getCmp(\'photo-chooser\').renameField({id}, \'caption\', \'{[values.caption ? (values.description).replace(/\'/g,"\\\'") : ""]}\')">edit</a></span><br />',
					'<span>{formattedDescription}</span>',
                    '</div>',
				'</tpl>',
			'</div>', {
                // Substitution of photo's filename extension to .jpg (since all the thumb are saved as .jpg)
                photoExtToJpg: function(screenshot){
                    return Ext.util.Format.substr(screenshot, 0, screenshot.lastIndexOf(".")) + '.jpg'; 
                }
            }
		);
		this.detailsTemplate.compile();
	}
	
	,showDetails : function(){
	    var selNode = this.view.getSelectedNodes();
	    var detailEl = Ext.getCmp('img-detail-panel').body;
		if(selNode && selNode.length > 0){
			selNode = selNode[0];
			//Ext.getCmp('ok-btn').enable();
		    var data = this.lookup[selNode.id];
            detailEl.hide();
            this.detailsTemplate.overwrite(detailEl, data);
            detailEl.slideIn('l', {stopFx:true,duration:.2});
            //Ext.get(data.filename).dom.style.background="#DDE4FF";
		}else{
		    //Ext.getCmp('ok-btn').disable();
		    detailEl.update('');
		}
	}
	
	,filter : function(){
		var filter = Ext.getCmp('filter');
		this.view.store.filter('usedName', filter.getValue(), true);
		this.view.select(0);
	}
	
	,sortImages : function(){
		var v = Ext.getCmp('sortSelect').getValue();
    	this.view.store.sort(v, v == 'usedName' ? 'asc' : 'desc');
    	this.view.select(0);
    }

    ,reset : function(){
		if(this.win.rendered){
			Ext.getCmp('filter').reset();
			this.view.getEl().dom.scrollTop = 0;
            showText(false, 'undodelphoto');
		}
	    this.view.store.clearFilter();
		this.view.select(0);
	}
	
	,onLoadException : function(v,o){
	    this.view.getEl().update('<div style="padding:10px;">Error loading images.</div>'); 
	}

    ,deletePhoto: function(p_id){

        if(p_id){
            Ext.Ajax.request({
                url : 'photos/deletephoto/'+p_id ,
                method: 'GET',
                success: function(result, request){
                    // Reload PhotoChooser store and even the store in the west-panel
                    Ext.getCmp('photo-chooser').store.load();

                    // The store in the west-panel is loaded only if it exists
                    var store = Ext.StoreMgr.lookup('wp-photos-tab-store');
                    if(westPanel.showedUser && (westPanel.showedUser.id === window.user.id) && store)
                        store.load({params: {id: window.user.id}});

                    Ext.get("undodelphoto").update('You have deleted a photo. <a href="javascript:void(0)" onclick="Ext.getCmp(\'photo-chooser\').undoDeletePhoto(' + p_id + ')">Undo</a> or <a href="javascript:showText(false, \'undodelphoto\')">hide this message</a>');
                    
                    // Hide div containing the "Undo delete" message
                    showText(true, 'undodelphoto');
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

    ,openPhotoUpload: function(){
     
        var photoupload = new Ext.Window({
                id: 'upload-window',
                title: 'Upload a photo',
                iconCls: 'upload-picture',
                width: 600,
                modal: true,
                //autoHeight: true,
                items: new PhotoUpload()
        });
        photoupload.show();
    }
};

String.prototype.ellipse = function(maxLength){
    if(this.length > maxLength){
        return this.substr(0, maxLength-3) + '...';
    }
    return this;
};
