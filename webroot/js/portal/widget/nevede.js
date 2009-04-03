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
  * Ext.ux.fbk.sonet.Nevede Extension Class
  *
  * @author  Marco Frassoni and Davide Setti
  * @version 1.0
  * @class Ext.ux.fbk.sonet.Nevede
  * <p>This widget show a event lists</p>
  * <pre><code>
    This is a example of the json
    </code></pre>
*/

Nevede = function(conf, panel_conf){
    Ext.apply(this, panel_conf);

    if (!conf.nevedeUrl)
        // Should ends with an '/'!!!
        conf.nevedeUrl = 'http://nevede.alwaysdata.net/meetings/';

    listUrl = conf.nevedeUrl +'list/';

    conf.detailsUrl = conf.nevedeUrl+'view/';

    var limit = 5;
    this.currentPage = 1;
    
    var store = new Ext.data.Store({
        proxy: new Ext.data.ScriptTagProxy({
            url: listUrl
        }),
        reader: new Ext.data.JsonReader({
            totalProperty: 'totalCount',
            root: 'meetings'
        },[
            {name: 'created', mapping: 'fields.created'},
            {name: 'modified', mapping: 'fields.modified'},
            {name: 'hidden_id', mapping: 'fields.hidden_id'},
            {name: 'title', mapping: 'fields.title'}
        ]),
        baseParams: {
            limit: limit,
            format: 'json', 	//get back the result as json
            action: 'query',
            list:   'search'
        }
        ,parent: this
        ,listeners:{
            load: function(store, records, options){
                var nevedewidget = $('#'+this.parent.getId());
                var imgs = nevedewidget.find('.nevede-img')
                imgs.css({visibility: 'hidden'});

                //hoverIntent provided some problems with tooltip so we
                //decided to switch back to hover even if it doesn't
                //completely work with IE
                nevedewidget.hover(function(){
                            imgs.css({visibility: 'visible'});
                        }, function(){
                            imgs.css({visibility: 'hidden'});
                        });
            }
        }
    });
    store.load();

    var resultTpl = new Ext.XTemplate( 
        '<div class="nevede-widget">'
        ,'<span style="float:right">'        
        	,'<a href="{this.nevedeUrl}" target="_blank">Help</a> | '
            ,'<a href="{this.nevedeUrl}create/" target="_blank">Create new meeting</a>'
        ,'</span>' 
        ,'<br/>'
        ,'Latest meetings:'
        ,'<ul>'
        ,'<tpl for=".">'
        ,'<span>'
            ,'<li>'
                ,'<span class="nevede-img">'
                    ,'<img src="js/portal/shared/icons/fam/email.png" onclick="Ext.getCmp(\''+this.getId()+'\').sendTo(\'{this.detailsUrl}{hidden_id}\',\'{title}\');" title="Click to email this meeting" width="12px" height="12px" style="float:right;padding:0 5px;cursor:pointer;">'
                ,'</span>'
                ,'<a href="{this.detailsUrl}{hidden_id}" target="_blank">{title}</a>'
                ,'<span style="color:#888888;font-size:90%;">'
                    ,' - created on {[Date.parseDate(values.created, "Y-m-d H:i:s").format("F j, Y")]}'
                ,'</span>'
            ,'</li>'
        ,'</span>'
        ,'</tpl>'
        ,'</ul>'
        ,'<div class="pages">Pages: '
        ,'<tpl for="this.pages()">'
            ,'<tpl if="this.getPageNumber() != xindex">'
                ,'<a href="javascript:void(0)" onclick="Ext.getCmp(\''+this.getId()+'\').loadPage({.+1})" class="page">{.+1}</a>'
            ,'</tpl>'
            ,'<tpl if="this.getPageNumber() == xindex">'
                ,'<span class="page">{.+1}</span>'
            ,'</tpl>'
        ,'</tpl>'
        ,'</div>'
        ,'</div>'
        ,{
            detailsUrl: conf.detailsUrl
            ,nevedeUrl: conf.nevedeUrl
            ,pages: function(){
                return range(Math.ceil(store.reader.jsonData.totalProperty/limit));
            },
            getPageNumber: function(){
                return this.parent.currentPage;
            },
            parent: this
        }
    )

    this.loadPage = function(nPage){
        store.load({
            params: {
                page: nPage
            }
        });
        this.currentPage = nPage;
    }
    
    this.sendTo = function(url, title) {
        var text = 'We are scheduling a meeting using Nevede meeting scheduler.\n\nPlease make your choices!\n\nTitle:\n - '+ title + '\nURL:\n - '+ url + '\n\n--\nThis email was automatically generated by taolin. You can provide feedback about this feature with the feedback widget';
        var logparams = '{"source": "nevede widget", "widget_id": "'+this.portlet_id+'"}';

        new SendToWindow(text, null, logparams);
    }

    Nevede.superclass.constructor.call(this, {
        autoHeight: true,
        defaults: { autoScroll: true },
        items: new Ext.DataView({
            tpl: resultTpl
            ,store: store
            ,itemSelector: 'div.user-wrapper'
        })
    });
};
Ext.extend(Nevede, Ext.Panel);
