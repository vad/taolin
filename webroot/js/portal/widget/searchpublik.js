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
  * Ext.ux.fbk.sonet.SearchPublik Extension Class
  *
  * @author  Marco Frassoni and Davide Setti
  * @version 1.0
  * @class Ext.ux.fbk.sonet.SeachPublik
  * <p>With this widget a user can search information about a FBK publication</p>
  * <pre><code>
    This is an example of the json
    </code></pre>
*/

SearchPublik = Ext.extend(Ext.Panel, {
    /** 
     * @cgf {String} title The title of the Ext.Panel Default to null
     */
    title: null
    /**
     * @cfg {Boolean} hideToolbar This parameter should be set to true in order to hide the toolbar
     * containing an Ext.ux.form.SearchField instance for performing queries. Default to false
     */
    ,hideToolbar: false
    /** 
     * @cgf {String} logparams Parameters to be logged (for research purposes). Default to null
     */
    ,logparams: null
    /**
     * @cfg {String} Path to banner image (height: 62px!). Default to null
     */
    ,banner: null
    /** 
     * @private
     */
    ,paramName: 'query'
    /**
     * @private
     */
    ,initComponent: function(){

       // If logparams is not defined (i.e. is null) define it!
       if(!this.logparams)
            this.logparams = {source:"search publik widget", widget_id: this.portlet_id};

       this.store = new Ext.data.JsonStore({
            autoDestroy: true,
            url: 'publiks/search/',
            method: 'POST',
            root: 'pubs',
            totalProperty: 'totalCount',
            fields:[
                {name: 'ID'},
                {name: 'INS_DATE'},
                {name: 'MOD_DATE'},
                {name: 'Title'},
                {name: 'PTitle'},
                {name: 'Pub_Type'},
                {name: 'PUBTIME_YEAR'},
                {name: 'Relevance'}
            ],
            baseParams: {
                limit:5,
                src: Ext.util.JSON.encode(this.logparams)
            },
            listeners:{
                beforeload: function(){
                    this.parent.view.emptyText = '<div style="padding:10px 5px;"><b>No publications found!</b><br/><br/>Search by author, journal or keywords.</div>';
                }
            },
            parent: this
        });

        this.view = new Ext.DataView({
            tpl: new Ext.XTemplate(
                     '<tpl for=".">',
                        '<div style="padding:10px;" class="publik-wrapper">{PTitle}<h3><a href="http://www.itc.it/publik/viewPublication.aspx?pubId={ID}" target="_blank">{Title}</a></h3></div>',
                    '</tpl>'
            ),
            emptyText: '<div style="padding:10px 5px 10px 5px;">Search within <a href="http://u-gov.fbk.eu/" target="_blank">FBK publications repository</a></div>', 
            deferEmptyText: false,
            store: this.store,
            itemSelector: 'div.user-wrapper',
            overClass: 'searchusermouseoverbg'
        });
        
        var config = {
            autoHeight: true
            ,defaults: { 
                autoScroll: true 
            }

            ,items: [
                {
                    html:'<div style="background: #DBDFDE url('+this.banner+') no-repeat;height:62px;'+(!this.banner?'display:none;':'') + '" />'
                },  
                this.view
            ]
            ,bbar: new Ext.PagingToolbar({
                store: this.store,
                beforePageText: '',
                pageSize: 5,
                displayInfo: true,
                displayMsg: '{0} - {1} of {2}',
                emptyMsg: 'No papers'
            })
            // If hideToolbar is true tbar is set to null
            // Otherwise it contains an Ext.ux.form.SearchField instance to perform queries
            ,tbar: this.hideToolbar ? null : 
                        [
                            '<span qtip="Search publications in FBK publik database">Search: </span>', ' ', ' ',
                            new Ext.ux.form.SearchField({
                                id: 'searchfield-'+this.getId(),
                                name: 'data[Search]',
                                store: this.store,
                                parent:this,
                                width: 180
                            })
                        ]
        };

        // apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        SearchPublik.superclass.initComponent.apply(this, arguments);

    }

    /**
     * @private
     */
    ,onRender: function(){
        SearchPublik.superclass.onRender.apply(this, arguments);
    }

    /**
     * @private
     */
    ,constructor: function(config){
         config = config || {};
         config.listeners = config.listeners || {};
         Ext.applyIf(config.listeners, {
         //add listeners config here
         });
             
         SearchPublik.superclass.constructor.call(this, config);
    }
});

Ext.reg('searchpublik', SearchPublik);
