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
  * Ext.ux.fbk.sonet.SearchWiki Extension Class
  *
  * @author  Marco Frassoni & Davide Setti
  * @version 1.0
  * @class Ext.ux.fbk.sonet.SearchWiki
  * <p>Whit this widget a user can search information on a MediaWiki installation</p>
  * <pre><code>
    This is a example of the json
    </code></pre>
*/

SearchWiki = Ext.extend(Ext.Panel, {
    /** 
     * @cgf {String} title The title of the Ext.Panel Default to null
     */
    title: null
    /**
     * @cfg {Boolean} hideToolbar This parameter should be set to true in order to hide the toolbar
     * containing an Ext.app.SearchField instance for performing queries. Default to false
     */
    ,hideToolbar: false
    /** 
     * @cgf {Boolean} dirtyUrl
     */
    ,dirtyUrl: null
    /** 
     * @cgf {String} wikiUrl
     */
    ,wikiUrl: null
    /** 
     * @cgf {String} apiUrl 
     */
    ,apiUrl: null
    /** 
     * @cgf {String} wikiDescription Name or description of the wiki, to be used within DataView emptyText message
     * Default to 'this wiki'
     */
    ,wikiDescription: 'this wiki'
    /** 
     * @cgf {Object} parent The parent of this object
     */
    ,parent: null

    /**
     * @private
     */
    ,initComponent: function(){

        if (!this.apiUrl)
            this.apiUrl = this.wikiUrl+'/api.php';

        this.pagesUrl = this.wikiUrl;
        if (this.dirtyUrl)
            this.pagesUrl += '/index.php/';

        this.store = new Ext.data.Store({
            proxy: new Ext.data.ScriptTagProxy({
                url: this.apiUrl
            }),
            reader: new Ext.data.JsonReader({
                root: 'query.search'
                /*,
                totalProperty: 'totalCount'*/
            },[
                {name: 'ns'},
                {name: 'title'}
            ]),
            baseParams: {
                srlimit: 5,
                format: 'json',     //get back the result as json
                action: 'query',
                list:   'search',
                /* search in the text of the page, for details see http://www.mediawiki.org/wiki/API:Query_-_Lists#search_.2F_sr
                 * the generated URL will be something like 
                 * conf.wikiUrl+'/api.php?start=0&srlimit=5&action=query&list=search&srsearch=whatyousearchfor&srwhat=text'
                 * the srsearch parameter is added by the listener of the search field when the user invoke the search (see below) 
                 */
                srwhat: 'text'  
            }
            ,listeners: {
                beforeload: function(store, options) {

                    var term;
                    if(this.parent.parent && Ext.getCmp(this.parent.parent.id+'-searchfield')) 
                        term = Ext.getCmp(this.parent.parent.id+'-searchfield').getValue();
                    else if(store.parent.searchfield) term = store.parent.searchfield.getValue();
                    //else term = 'searched';

                    var emptyText;
                    
                    if (term)
                        emptyText =  '<div style="padding:10px 5px 10px 5px;">No pages found.<br />'+
                        'Please <a target="_blank" href="'+this.pagesUrl+(term ? term : 'searched')+'?action=edit">start the <i>'+term+'</i> page</a> in '+this.wikiName+'</div>';
                    else
                        emptyText =  '<div style="padding:10px 5px 10px 5px;">No pages found</div>';
                    
                    store.parent.items.first().emptyText = emptyText;
                }
            }
            ,parent: this
            ,pagesUrl: this.pagesUrl
            ,wikiName: this.wikiDescription
        });
    
        /*
           this.bottombar = new Ext.PagingToolbar({
                store: this.store,
                beforePageText: '',
                pageSize: 5,
                displayInfo: true,
                displayMsg: '{0} - {1} of {2}',
                emptyMsg: 'No user',
                paramNames: {start: 'sroffset', limit: 'srlimit'}
        });
        */

        this.searchfield = (
            (this.parent && this.parent.searchfield) ? 
            this.parent.searchfield : 
            new Ext.app.SearchField({
                //id: 'searchfield-'+this.getId(),
                name: 'data[Search]',
                store: this.store,
                width: 180,
                paramName: 'srsearch',
                value: this.term,
                parent: this,
                listeners: {
                    render: function(c){
                        if(this.parent.term){
                            c.store.load({
                                params: {
                                    srsearch:this.parent.term
                                }
                            });
                        }
                    },
                    enter: {
                        fn: function(t, v){
                            this.setPref('term', v);
                        },
                        scope:this
                    }
                }
            })
        );

        this.view = new Ext.DataView({
            tpl: new Ext.XTemplate( 
                    '<p>Search results for <i>{[this.searchfield.getValue()]}</i>:</p>'
                    ,'<tpl for=".">'
                    ,'<p><a href="{this.pagesUrl}{title}" target="_blank">{title}</a></p>'
                    ,'</tpl>'
                    ,'<span><a target="_blank" style="float:right;padding:3px;" href="{this.pagesUrl}Special:Search?search={[this.searchfield.getValue()]}&fulltext=Search">More results...</a></span>'
                ,{
                    pagesUrl: this.pagesUrl,
                    searchfield: this.searchfield
            }),
            emptyText: '<div style="padding:10px 5px 10px 5px;">Search for pages in <a href="'+this.wikiUrl+'" target=_blank">'+this.wikiDescription+'</a></div>', 
            deferEmptyText: false,
            store: this.store,
            itemSelector: 'div.user-wrapper'
        });

        var config = {
            autoHeight: true
            ,defaults: { 
                autoScroll: true 
            }

            ,items:
                this.view
                //,bbar: this.bottombar

            // If hideToolbar is true tbar is set to null
            // Otherwise it contains an Ext.app.SearchField instance to perform queries
            ,tbar: this.hideToolbar ? null : ['<span qtip="Search in wiki pages">Search: </span>', '&nbsp;&nbsp;', this.searchfield]
        };

        // apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        SearchWiki.superclass.initComponent.apply(this, arguments);
    }

    /**
     * @private
     */
    ,onRender: function(){

        SearchWiki.superclass.onRender.apply(this, arguments);

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
             
         SearchWiki.superclass.constructor.call(this, config);
    }
});

Ext.reg('searchwiki', SearchWiki);
