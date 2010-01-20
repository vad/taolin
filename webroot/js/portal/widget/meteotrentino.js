/*
 * Ext JS Library 2.0.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

/**
  * Ext.ux.fbk.sonet.MeteoTrentino Extension Class
  *
  * @author  Marco Frassoni, Maurizio Napolitano & Davide Setti
  * @version 1.0
  * @class Ext.ux.fbk.sonet.MeteoTrentino
  * <p>MeteoTrentino weather forecast</p>
  * <pre><code>
    This is a example of the json
    </code></pre>
*/


MeteoTrentino = function(conf, panel_conf){
    Ext.apply(this, panel_conf);

    var url = '';
    var xslt = '';

    switch (conf.lang){
        case 'EN':
            url = conf.url_en;
            xslt = conf.xslt_en;
            break;
        case 'IT':
            url = conf.url_it;
            xslt = conf.xslt_it;
            break;
        case 'DE':
            url = conf.url_de;
            xslt = conf.xslt_de;
            break;
        default:
            url = conf.url_en;
            xslt = conf.xslt_en;
    }

    this.loadW = function(){
        
        var p = this;

        Ext.Ajax.request({
            url : 'xslt-applier.php',
            params: {'url': url, 'xslt': xslt},
            method: 'POST',
            success: function(result, request){
                p.applyHtml(result.responseText);
            },
            failure: function(result, request){
                $('#'+p.getId()+'-forecast-overview').html('<div class="error-msg">Uh oh! Something apparently went wrong, please apoligize us and send us a feedback!</div>');
            }
        });
    };

    this.applyHtml = function(html){

        var ov = $('#' +this.getId()+'-forecast-overview');
        var dv = $('#' +this.getId()+'-forecast-detailedview');

        if(html === null || html === '')
            ov.html('<div class="error-msg">Uh oh! Something apparently went wrong, please apoligize us and send us a feedback!</div>');

        var doc = $("<div>").html(html);

        ov.html(doc.find('#meteo_sintesi'));
        dv.html(doc.find('#meteo_oggi')); 

    }

    MeteoTrentino.superclass.constructor.call(this, {
        autoHeight: true,
        autoWidth: true,
        defaults: { autoScroll: true },
        items: [{
            html: 
                '<div id="'+this.getId()+'-forecast-overview" style="padding:5px 20px;"></div>' 
                +'<div id="'+this.getId()+'-forecast-detailedview" style="padding:5px;"></div>' 
                +'<div style="float:right;padding:10px;font-weight:bold;"><span class="sprited gear"><a href="javascript:void(0)" onclick="Ext.getCmp(\''+this.id+'\').ownerCt.showConf()">Change language</a></span></div>'
            ,border: false
            ,autoHeight: true
        }]
    });

    this.loadW();

};
Ext.extend(MeteoTrentino, Ext.Panel);

