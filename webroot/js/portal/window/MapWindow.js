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
  * Ext.ux.fbk.sonet.MapWindow
  *
  * @author  Marco Frassoni and Davide Setti
  * @class Ext.ux.fbk.sonet.MapWindow
  * #@extends Ext.Window
  * <p>A window that shows a map of a building</p>
  * <pre><code>
    This is a example of the json
    </code></pre>
*/

Ext.namespace( 'Ext.ux.fbk.sonet' );

Ext.ux.fbk.sonet.MapWindow = Ext.extend(Ext.Window, {
    id: 'map-window'
    ,title: 'Workplace'
    ,resizable:false
    ,autoShow:true
    ,iconCls: 'map'
    ,buildingId:1
    ,selectedUsers:Array()
    ,logparams: null
    /**
      * @private
      */
    ,initComponent: function(){
        var pc = $('#portal_central');
        var pco = pc.offset();
        var pcw = pc.width();
        var window_width = Math.round(pcw*(19/20))
        var pch = pc.height();
        var window_height = Math.round(pch*(19/20));
        var x = pco.left + (pcw - window_width) / 2.;
        var y = pco.top + (pch - window_height) / 2.;

        var config = {
            width: window_width
            ,height: window_height
            ,x: x
            ,y: y
            ,autoScroll:false
            /** initial map to display
              */
            ,items: [{
                    xtype:'combo'
                    ,store: new Ext.data.JsonStore({
                        url: 'buildings/getlist',
                        root: 'buildings',
                        fields: ['id', 'name', 'description']
                        ,autoLoad:true
                        ,listeners: {
                            scope:this
                            ,load: function(t, records, opts){ //set default value in the combobox
                                this.buildingSelect.setValue(this.buildingId);
                                this.buildingSelect.un('load');
                            }
                        }
                    })
                    ,displayField:'name'
                    ,valueField:'id'
                    ,typeAhead: true
                    ,forceSelection: true
                    ,triggerAction: 'all'
                    ,emptyText:'Select a building...'
                    ,selectOnFocus:true
                    ,editable:false
                    ,width:300
                }, {
                    border: false,
                    items: [{
                        html:'<div id="building-maps"><img class="map" src="ext/resources/images/default/s.gif" /></div>'
                    },{
                        html:'<div id="map-window-map" style="height:0"></div>'
                    }]
                }
            ]
            ,initialized: false
            ,mainTools: [{
                    iconOn: 'http://www.openlayers.org/api/theme/default/img/pan_on.png'
                    ,iconOff: 'http://www.openlayers.org/api/theme/default/img/pan_off.png'
                    ,text: 'Pan'
                    ,cls: 'pan-tool'
                    ,onclick: 'setPanTool'
                },{
                    iconOn: 'http://www.openlayers.org/api/theme/default/img/add_point_on.png'
                    ,iconOff: 'http://www.openlayers.org/api/theme/default/img/add_point_off.png'
                    ,text: 'Mark you position'
                    ,cls: 'mark-tool'
                    ,onclick: 'setMarkTool'
            }]
        };

        Ext.apply(this, config);

        Ext.ux.fbk.sonet.MapWindow.superclass.initComponent.apply(this, arguments);

        this.buildingSelect = this.items.itemAt(0);
    } // eo function initComponent

    /**
      * @private
      */
    ,onRender: function(){
        //populate combobox
        
        this.buildingSelect.on({
            scope:this
            ,select: function(t,r,o){
                this.loadMap();
            }
        });
        
        Ext.ux.fbk.sonet.MapWindow.superclass.onRender.apply(this, arguments);
    }

    /**
      *
      */
    ,listeners: {
        show: function(t) {
            t.loadMap(t.buildingId, this.logparams);
        }
    }
    /**
      * load map, performing an Ajax call to 'workplaces/getinbuilding/1'
      * This call expects a list of workplaces and a buildingInfo object like:
      * <pre><code>
      * {
      *   "buildingInfo":{
      *     "id":"1","name":"Povo, piano rialzato","description":null,"top":"149",
      *         "left":"52","bottom":"911","right":"1192","width":1214,"height":984
      *   },
      *   "workplaces":[
      *   {"x":"0.77714","y":"0.668451","user_id"
      *     :"685","name":"Davide","surname":"Setti","phone":"334"},{"x":"0.753792","y":"0.666893","user_id":"652"
      *     ,"name":"Marco","surname":"Frassoni","phone":"0"}
      *   ]
      * }
      * </code></pre>
      */
    ,loadMap: function(buildingId, logparams){
        if (!buildingId)
            buildingId = this.buildingSelect.getValue();

        Ext.Ajax.request({
            url: 'workplaces/getinbuilding/'+buildingId
            ,scope: this
            ,params: {src: logparams}
            ,success: function (result, request) {
                var data = Ext.util.JSON.decode(result.responseText);
                var bi = data.buildingInfo;

                // php gives us strings (...)
                bi.left = parseInt(bi.left);
                bi.right = parseInt(bi.right);
                bi.top = parseInt(bi.top);
                bi.bottom = parseInt(bi.bottom);
                bi.width = parseInt(bi.width);
                bi.height = parseInt(bi.height);

                this.buildingInfo = bi;

                this.store = new Ext.data.JsonStore({
                    data:data
                    ,root:'workplaces'
                    ,fields:['x', 'y', "user_id","name","surname","phone"]
                });

                if (!this.initialized) {
                    this.setupimagetool();
                    this.setupzoomtools();
                    this.setupmaintools();
                    this.initialized = true;
                } else {
                    //refresh the map, the Date thing prevents caching
                    $("#building-maps img.map").attr("src",
                        "workplaces/getmap?v="+ (new Date()).getTime());
                }
            }
        });
    }
    /**
      * @private
      */
    ,imageLoaded: function(){
        var mw = Ext.getCmp('map-window');
        mw.refreshMapTag(mw.store);
        $('img.map').load(function(){
            mw.refreshMapTag(mw.store);
        });
    }
    
    /**
     * Create or replace the map tag associated with the image.
     * @param {Ext.data.Store} store Contains workplaces
     */
    ,refreshMapTag: function(store){
        var tpl = new Ext.XTemplate(
            '<map name="floormap">',
            '<tpl for=".">',
            '<area shape="circle" coords="{[this.fromNormalizedCoord(values.x, values.y)]},16" title="{name} {surname}" href="javascript:void(0)" onclick="showUserInfo({user_id}, null, \'' + Ext.util.Format.htmlEncode('{"source": "map window"}') + '\')" />',
            '</tpl>',
            '</map>',
            {
                fromNormalizedCoord: function(x, y){
                    c = this.parent.fromNormalizedCoord({x:x, y:y});
                    return [c.x, c.y].join();
                }
                ,parent: this
            }
        );

        //delete the old dataview and its HTML element
        if ($('map[name="floormap"]').length){
            delete this.dv;
            $('map[name="floormap"]').remove();
        }

        this.dv = new Ext.DataView({
            tpl: tpl,
            store: store,
            itemSelector: 'div.nonexistant',
            renderTo: $('img.map').parent().get(0)
        });

        //bad hack to force the browser to read again the map
        $("#building-maps img.map").attr('usemap', '#nonexistantmap');
        $("#building-maps img.map").attr('usemap', '#floormap');
    }
    /**
      * @private
      */
    ,setupimagetool: function(){
        var width = Ext.getCmp('map-window').width - 10;
        var height = Ext.getCmp('map-window').height - 60;

        var tx = 0, ty = 0;
        var bx = width;
        var by = parseInt(bx*height/width);

        //Date prevents caching
        $("#building-maps img.map").attr("src", "workplaces/getmap?v="+ (new Date()).getTime()).imagetool({
            viewportWidth: width
            ,viewportHeight: height
            ,topX: tx
            ,topY: ty
            ,bottomX: bx + tx
            ,bottomY: by + ty
            ,allowZoom: false
            ,mapName: 'map'
            ,afterSetup: this.imageLoaded
            //,loading:'img/extanim32.gif'
        });

    }
    /**
      * @private
      */
    ,setupmaintools: function(){
        var tools = this.mainTools;
        
        var divCss = {
            position: 'absolute'
            ,left:'12px'
            ,width:'24px'
            ,height:'22px'
        };
        
        var tcfg;
        for (var i=0; i<tools.length; i++) {
            tcfg = tools[i];
            var tool = $("<img>")
                .attr({
                    title: tcfg.text
                    ,src: (i == 0) ? tcfg.iconOn : tcfg.iconOff
                    ,'class': "icon "+tcfg.cls
                })
                .css('position', 'relative')
                .data("cfg", tcfg)
                .click(function(){
                    var cfg = $(this).data("cfg");
                    Ext.getCmp("map-window")[cfg.onclick](this);
                });

            $("#building-maps img.map").parent().append(tool);

            divCss.top = (i*22 + 55)+'px';
            var div = $("<div><\/div>").addClass(tcfg.cls).css(divCss);

            tool.wrap(div);
        }

    }
    /**
      * @private
      */
    ,enableMainToolIcon: function(icon){
        var image = $("#building-maps img.map");
        var dim = image.data("dim");
        var cfg = $(icon).data("cfg");

        image.parent().find('.icon').each(function(i){
            var tcfg = $(this).data("cfg");
            
            $(this).attr('src', (this == icon) ? tcfg.iconOn : tcfg.iconOff);
        });
    }

    /**
     * Converts coords from normalized (in range [0:1]) to real (considering zoom
     * level)
     * @param {Object} c An object in format {x: Float, y: Float} where 0 <= x,y <= 1
     * @return {Object} An object in format {x: Float, y: Float} 
     */
    ,fromNormalizedCoord: function(c){
        var image = $("#building-maps img.map");
        var dim = image.data("dim");
        var x = c.x, y = c.y;
        var bi = this.buildingInfo;

        // x, y values are in range 0:1
        x = x*(bi.right - bi.left) + bi.left;
        y = y*(bi.bottom - bi.top) + bi.top;

        // scale independency
        zoomLevel = image.width()/bi.width;
        x *= zoomLevel;
        y *= zoomLevel;

        return {
            x: Math.round(x),
            y: Math.round(y)
        };
    }
    /**
     * Converts coords from real (considering zoom level) to normalized 
     * (in range [0:1])
     * @param {Object} c An object in format {x: Float, y: Float} 
     * @return {Object} An object in format {x: Float, y: Float} where 0 <= x,y <= 1
     */
    ,toNormalizedCoord: function(c){
        var image = $("#building-maps img.map");
        var dim = image.data("dim");
        var x = c.x, y = c.y;
        var bi = this.buildingInfo;

        // zoom independency
        zoomLevel = image.width()/bi.width;
        x /= zoomLevel;
        y /= zoomLevel;

        // x, y values in range 0:1
        x = (x - bi.left)/(bi.right - bi.left);
        y = (y - bi.top)/(bi.bottom - bi.top);

        return {
            x: x,
            y: y
        };
    }
    /**
      * Handle mouse click when Mark Tool selected and saves the position
      * @private
      */
    ,mouseClicked: function(e){
        e.preventDefault();
        var image = $("#building-maps img.map");
        var dim = image.data("dim");
        var offset = image.offset({scroll: false});
        var mw = Ext.getCmp('map-window');

        var clickX = e.pageX - offset.left;
        var clickY = e.pageY - offset.top;
        var nc = mw.toNormalizedCoord({x: clickX, y: clickY});

        Ext.Ajax.request({
            url : 'workplaces/save/'
            ,method: 'POST'
            ,scope: mw
            ,params: {
                x: nc.x
                ,y: nc.y
                ,building: mw.buildingSelect.getValue()
            }
            ,success: function ( result, request ) {
                Ext.example.msg('Workplace', 'Position saved on the map');
                this.loadMap();
            }
        });
    }
    /**
      *
      */
    ,setMarkTool: function(icon){
        var image = $("#building-maps img.map");
        var dim = image.data("dim");
        var cfg = $(icon).data("cfg");

        dim.allowPan = false;
        image.click(this.mouseClicked);
        dim.cursor = 'crosshair';
        image.css('cursor', dim.cursor);

        
        this.enableMainToolIcon(icon);
    }
    /**
      *
      */
    ,setPanTool: function(icon){
        var image = $("#building-maps img.map");
        var dim = image.data("dim");

        dim.allowPan = true;
        image.unbind('click', this.mouseClicked);
        image.css('cursor', dim.panCursor);
        dim.cursor = dim.panCursor;
        
        this.enableMainToolIcon(icon);
    }
    /**
      * Change coords of map tag areas' according to the specified zoom factor
      * @private
      * @param {Float} zf Zoom factor (zoom in if zf > 1)
      */
    ,zoomMapTag: function(zf){
        $('map area').each(function(){
                var a = $(this).attr('coords').split(',');
                for (var i=0; i < a.length; i++){
                    a[i] *= zf;
                }
                $(this).attr('coords', a.join(','));
            }
        );
    }
    /**
      * Zoom in (if possible)
      */
    ,zoomIn: function(){
        var image = $("#building-maps img.map");
        var dim = image.data('dim');
        var mw = Ext.getCmp('map-window');
        var zf = dim.zoomFactor;

        if (image.zoomIn())
            mw.zoomMapTag(zf);
    }
    /**
      * Zoom out (if possible)
      */
    ,zoomOut: function(){
        var image = $("#building-maps img.map");
        var dim = image.data('dim');
        var mw = Ext.getCmp('map-window');
        var zf = dim.zoomFactor;

        if (image.zoomOut())
            mw.zoomMapTag(1./zf);
    }
    /**
      *
      */
    ,setupzoomtools: function(){
        var zoomtools = [{
            icon: 'http://www.openlayers.org/api/img/zoom-plus-mini.png'
            ,text: 'Zoom in'
            ,cls: 'zoom-in-tool'
            ,onclick: this.zoomIn
        },{
            icon: 'http://www.openlayers.org/api/img/zoom-minus-mini.png'
            ,text: 'Zoom out'
            ,cls: 'zoom-out-tool'
            ,onclick: this.zoomOut
        }];
        
        var divCss = {
            position: 'absolute'
            ,left:'15px'
            //,top:'20px'
            ,width:'18px'
            ,height:'18px'
        };
        
        var tcfg;
        for (var i=0; i<zoomtools.length; i++) {
            tcfg = zoomtools[i];
            var tool = $("<img>")
                .attr({
                    title: tcfg.text
                    ,src: tcfg.icon
                })
                .css('position', 'relative')
                .data("cfg", tcfg)
                .click(function(){
                    var cfg = $(this).data("cfg");
                    cfg.onclick();
                }
            );

            $("#building-maps img.map").parent().append(tool);
            
            divCss.top = (i*18 + 10)+'px';
            var div = $("<div><\/div>").addClass(tcfg.cls).css(divCss);

            tool.wrap(div);
        }

    }
});
