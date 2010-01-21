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

    var l = conf.selected;

    if(!(l in conf.lang))
        l = conf.defaultValue;

    var url = conf.lang[l].url;
    var xslt = conf.lang[l].xslt_file;

    this.html = '';

    this.loadForecast = function(){
        
        var p = this;

        Ext.Ajax.request({
            url : 'xslt-applier.php',
            params: {'url': url, 'xslt': xslt},
            method: 'POST',
            success: function(result, request){
                p.html = result.responseText;
                p.renderForecast();
            },
            failure: function(result, request){
                $('#'+p.getId()+'-forecast-overview').html('<div class="error-msg">Uh oh! Something apparently went wrong, please apoligize us and send us a feedback!</div>');
            }
        });
    };

    this.renderForecast = function(){

        var ov = $('#' +this.getId()+'-forecast-overview');
        var dv = $('#' +this.getId()+'-forecast-detailedview');

        if(this.html === null || this.html === '')
            ov.html('<div class="error-msg">Uh oh! Something apparently went wrong, please apoligize us and send us a feedback!</div>');

        var doc = $("<div>").html(this.html);

        ov.html(doc.find('#meteo_sintesi'));

        var f = doc.find('.meteo_forecast');
        
        f.not('#today').hide();
        
        dv.html(f);

        this.visualize();
    }

    this.visualize = function(day){
        
        var ov = $('#' +this.getId()+'-forecast-overview');
        var dv = $('#' +this.getId()+'-forecast-detailedview');
        var lk = $('#' +this.getId()+'-forecast-links');

        var w_id = this.getId();

        var days = {
            'today': 'Today', 
            'tomorrow': 'Tomorrow', 
            'day_after_tomorrow': 'Day after tomorrow',
            'next_days': 'Next days'
        };

        var link = 'javascript:Ext.getCmp(\''+w_id+'\').visualize(\'{0}\')';

        if(this.html === null || this.html === '')
            ov.html('<div class="error-msg">Uh oh! Something apparently went wrong, please apoligize us and send us a feedback!</div>');

        lk.html('');

        if (day == null || day == '')
            day = 'today';

        for (var d in days){
            
            v = days[d];

            if (d === day){
                dv.find('#'+d).show();
                lk.append($('<span>').text(v));
            }
            else {
                dv.find('#'+d).hide();
                lk.append($('<a>').attr('href', String.format(link,d)).text(v));
            }
        }

        lk.children().css('padding', '5px 10px')
    }

    MeteoTrentino.superclass.constructor.call(this, {
        autoHeight: true,
        autoWidth: true,
        defaults: { autoScroll: true },
        items: [{
            html: 
                '<div id="'+this.getId()+'-forecast-overview" style="padding:5px 20px;"></div>' 
                +'<div id="'+this.getId()+'-forecast-detailedview" style="padding:5px;"></div>'
                + '<hr class="large">'
                +'<div id="'+this.getId()+'-forecast-links" style="padding:5px;text-align:center;"></div>'
                +'<div style="float:right;padding:10px;font-weight:bold;"><span class="sprited gears"><a href="javascript:void(0)" onclick="Ext.getCmp(\''+this.id+'\').ownerCt.showConf()">Change language</a></span></div>'
            ,border: false
            ,autoHeight: true
        }]
    });

    this.loadForecast();
    
};
Ext.extend(MeteoTrentino, Ext.Panel);
