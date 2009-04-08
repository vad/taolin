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

GroupDetails = function(config){
	this.config = config;
};

GroupDetails.prototype = {
    // cache data by image name for easy lookup
    lookup : {},
    
	//show : function(el, callback){
    show: function(el){
		if(!this.win){

			this.initTemplates();

            this.storeGroup = new Ext.data.JsonStore({
			    root: 'group',
			    fields: [
			        'id', 'name', 'url', 'description_en', 'description_it'
			    ]
			});

			this.storeUsers = new Ext.data.JsonStore({
			    root: 'users',
			    fields: [
			        'id', 'name', 'surname', 'login', 'filename', 'is_hidden','groups'
			    ],
			    listeners: {
			    	'load': {fn:function(){ this.viewUsers.select(0); }, scope:this, single:false}
			    }
			});
			
            this.load();

			var formatDataUser = function(data){
		    	data.shortName = data.name + ' ' + data.surname;
                data.photo = data.filename ? ((data.is_hidden == 0) ? data.filename : '../img/nophoto.png') : '../img/nophoto.png';
            
		    	this.lookup[data.name] = data;
		    	return data;
		    };
			
            var formatDataGroup = function(data){
		    	data.description = data.description_en ? data.description_en : data.description_it;
            
		    	this.lookup[data.name] = data;
		    	return data;
		    };
			
		    this.viewUsers = new Ext.DataView({
				tpl: this.usersTemplate,
				singleSelect: true,
                overClass:'searchusermouseoverbg',
				itemSelector: 'div.thumb-wrap',
                loadingText: 'Loading details, please wait...',
				store: this.storeUsers,
				listeners: {
					'loadexception'  : {fn:this.onLoadException, scope:this},
					'beforeselect'   : {fn:function(view, node, sel){
				        return view.store.getRange().length > 0;
				    }, scope: this}
				},
				prepareData: formatDataUser.createDelegate(this)
			});
		    
            this.viewGroup = new Ext.DataView({
				tpl: this.groupTemplate,
                style:"background:#F0F1F3;",
                overClass:'searchusermouseoverbg',
				itemSelector: 'div.group-desc',
                loadingText: 'Loading group details, please wait...',
				store: this.storeGroup,
				listeners: {
					'loadexception'  : {fn:this.onLoadException, scope:this}
				},
				prepareData: formatDataGroup.createDelegate(this)

			});
		    
			var cfg = {
		    	title: 'Photos manager',
		    	layout: 'border',
				minWidth: 500,
				minHeight: 300,
				modal: true,
				closeAction: 'close',
				border: true,
				items:[{
					region: 'north',
                    border: false,
                    height: 90,
                    autoScroll: false,
                    items: this.viewGroup
				},{
					region: 'center',
					autoScroll: true,
                    border: false,
					items: this.viewUsers				
                }],
				buttons: [{
					text: 'Close',
					handler: function(){ this.win.close(); },
					scope: this
				}],
				keys: {
					key: 27, // Esc key
					handler: function(){ this.win.close(); },
					scope: this
				}
			};
			Ext.apply(cfg, this.config);
		    this.win = new Ext.Window(cfg);
            this.win.viewUsers = this.viewUsers;
            this.win.viewGroup = this.viewGroup;
		}
	    this.win.show(el);
		this.animateTarget = el;
	},
	
	initTemplates : function(){
	    this.usersTemplate = new Ext.XTemplate(
			'<tpl for=".">',
				'<div class="thumb-wrap" id="{photo}{id}" onclick="showUserInfo({id}, null, \'' + Ext.util.Format.htmlEncode('{"source": "group window"}') + '\')">',
                    /* The <span> element without any content has to be placed there to vertically align images in the middle on IE */
                    '<tpl if="(is_hidden == \'0\') && (filename != null)"><span></span>',
        				'<div class="thumb"><img style="padding:10px;" src="'+window.config.img_path+'t140x140/{[this.photoExtToJpg(values.filename)]}"></img></div>',
                    '</tpl>',
                    '<tpl if="(is_hidden == \'1\') || (filename === null)"><span></span>',
    			    	'<div class="thumb"><img style="padding:10px;" width=112 height=140 src="img/nophoto.png"></img></div>',
                    '</tpl>',
	    			'<span style="padding:10px;"><b>{shortName}</b></span>',
                    '<tpl for="groups">',
                        '<br /><span onmouseover="this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'" onclick="groupDetails(\'{id}\', \'{name}\', \'' + Ext.util.Format.htmlEncode('{"source": "group window", "group_id": "{id}"}') + '\')">{name}</span>',
                    '</tpl>',
                '</div>',
			'</tpl>', {
                // Substitution of photo's filename extension to .jpg (since all the thumb are saved as .jpg)
                photoExtToJpg: function(screenshot){
                    return Ext.util.Format.substr(screenshot, 0, screenshot.lastIndexOf(".")) + '.jpg'; 
                }
            }
		);
		this.usersTemplate.compile();
	    
        this.groupTemplate = new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="group_desc" style="font-family:Arial;">',
                    '<div style="font-size:180%;text-align:center;padding:10px;"><b>{name}</b></div>',
                    '<div style="padding-left:10px;font-size:120%;">',
                    '<tpl if="(description !== null)">',
                        '<span><b>Description:</b> {description_en}</span>',
                    '</tpl><br />',
                    '<tpl if="(url !== null)">',
                        '<span><b>Website:</b> further information could be found in the <a href="{url}" target="_blank">website of the group</a>.</span>',
                    '</tpl><br /><br />',
                    '</div>',
                '</div>',
            '</tpl>'
		);
		this.groupTemplate.compile();
	},
    
    load: function() {
        var window_id = this.config.id;
        Ext.Ajax.request({
            url: this.config.url,
            params: {src: this.config.logparams},
            success: function(response, request) {
                var data = Ext.decode(response.responseText);
                Ext.getCmp(window_id).viewGroup.store.loadData(data);
                Ext.getCmp(window_id).viewUsers.store.loadData(data);
            }
        });
    },
		
	onLoadException : function(v,o){
	    v.getEl().update('<div style="padding:10px;">Error loading images.</div>'); 
	}
};

String.prototype.ellipse = function(maxLength){
    if(this.length > maxLength){
        return this.substr(0, maxLength-3) + '...';
    }
    return this;
};
