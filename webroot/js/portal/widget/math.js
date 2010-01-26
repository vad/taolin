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
  * Ext.ux.fbk.sonet.MathWidget Extension Class
  *
  * @author  Marco Frassoni and Davide Setti
  * @version 1.0
  * @class Ext.ux.fbk.sonet.MathWidget
  * <p>A widget to manager a calculator inside taolin</p>
  * <pre><code>
    This is a example of the json
    </code></pre>
*/

MathWidget = function(conf, panel_conf){
    Ext.apply(this, panel_conf);

    //there's an issue if no callback specified
    var f = function(){};

    google.load('visualization', '1', {callback: f,
        packages:'scatterchart'});

    var helpString = 'Type any math expression and push \"Enter\". Examples: \"3+4\" or \"2 * pow(2,5)\".<br /><a target=\"_blank\" href=\"http://www.w3schools.com/jsref/jsref_obj_math.asp\">List of available functions</a>';

    this.calcForm = new Ext.form.FormPanel({
        autoHeight: true
        ,buttonAlign: 'center'
        ,parent: this
        ,style: 'padding:5px'
        ,items: [
        {
            xtype: 'textfield'
            ,fieldLabel: 'Expression'
            //,hideLabel: true
            ,name: 'expression'
            ,anchor: '100%'
        },{
            xtype: 'textfield'
            ,fieldLabel: 'Result'
            ,name: 'result'
            ,value: '0'
            ,readOnly:true
            ,anchor: '100%'
    	},{
            /* Using JQuery toggle to show/hide an originally hidden div */
            html:  '<div style="padding:10px 0 5px 5px;"><span onclick="$(\'#calcForm-math-help_'+this.getId()+'\').toggle(400)" class="a sprited help-icon">Help</span></div><div id="calcForm-math-help_'+this.getId()+'" style="display:none;padding:10px 5px;background:#f6f6f6;">' + helpString + '</div>'
        }
        ]
        ,keys:{
            key: Ext.EventObject.ENTER
            ,fn: function(){this.calcForm.evaluate()}
            ,scope: this
        }
        ,evaluate: function(){
            var eq = this.items.get(0).getValue();
            
            with (Math) {
                var res = eval(eq);
            }
            this.items.get(1).setValue(res);
        }
        ,buttons: [{
            text: 'Result'
            ,handler: function(){this.calcForm.evaluate()}
            ,scope:this
        }]
    });

    this.graphForm = new Ext.form.FormPanel({
        autoHeight: true
        ,buttonAlign: 'center'
        ,parent: this
        ,style: 'padding:5px'
        ,items: [
        {
            xtype: 'textfield'
            ,fieldLabel: 'f(x)'
            ,labelSeparator: '='
            ,name: 'function-text'
            ,anchor: '100%'
        },{
            xtype: 'textfield'
            ,fieldLabel: 'range'
            ,name: 'range'
            ,value: '-5, 5'
            ,anchor: '100%'
        },{
            xtype: 'label'
            ,html:  '<div style="padding:10px 0 5px 5px;"><span id="demobutton_'+this.getId()+'" class="sprited chart-icon a">Demo</span> &nbsp; '
            + '<a id="helpbutton_graph_'+this.getId()+'" class="sprited help-icon a">Help</span></div><div id="graphForm-math-help_'+this.getId()+'" style="display:none;padding: 10px 5px;background:#f6f6f6;">' + helpString + '</div>'
        },{
            //dummy component that is rendered at the end
            xtype:'component'
            ,widgetId: this.getId()
            ,listeners:{
                beforerender: function(dummy){
                    var wi = this.widgetId;
                    var gf = Ext.getCmp(wi).graphForm;
                    gf.items.remove(dummy);

                    Ext.EventManager.on('helpbutton_graph_'+wi,
                        'click', function(){
                            $('#graphForm-math-help_'+gf.parent.getId()).toggle(400);
                        }, gf
                    );
                    Ext.EventManager.on('demobutton_'+wi, 'click', function(){
                            this.getComponent(0).setValue('x*sin(x)');
                            this.plot();
                        }, gf
                    );
                }
            }
        }]
        ,plot: function(){
            var el = document.getElementById('plot_'+this.parent.getId());
            // form's width includes padding
            var w = this.getInnerWidth();
            var h = w * 3/4;
            var eq = this.items.get(0).getValue();
            var range = this.items.get(1).getValue();
            var commaPos = range.indexOf(',');
            var llim = parseInt(range.substr(0,commaPos));
            var ulim = parseInt(range.substr(commaPos+1));
            
            this.parent.drawChart(eq, llim, ulim, 500, 2, el, w, h);
        }
        ,keys:{
            key: Ext.EventObject.ENTER
            ,fn: function(){this.graphForm.plot()}
            ,scope: this
        }
        ,buttons: [{
            text: 'Plot'
            ,handler: function(){this.graphForm.plot()}
            ,scope:this
        }]
    });

    MathWidget.superclass.constructor.call(this, {
        autoHeight: true
        ,autoWidth: true
        ,style: 'margin-top:2px'
        ,defaults: { autoScroll: true }
        ,layout: 'fit'
        ,items: new Ext.TabPanel({
            border: false,
            tabWidth:115,
            enableTabScroll:true,
            autoWidth: true,
            autoHeight: true,
            activeTab: 0,
            layoutOnTabChange:true,
            plain:true,
            deferredRender:true,
            frame:false,
            defaults: {
                autoScroll:true
            },
            items: [
                {
                    title: 'Calculator'
                    ,items: [
                        this.calcForm
                    ]
                    ,autoHeight: true
                }
                ,{
                    title: 'Graphs'
                    ,items: [
                        this.graphForm
                        ,{
                            html: '<div id="plot_'+this.getId()+'" />'
                        }
                    ]
                    ,autoHeight: true
                }
            ]
        })
        ,drawChart: function(equation,xmin,xmax, numPoints, pointSize,
             el, width, height) {
            var data = new google.visualization.DataTable();
            data.addColumn('number', 'x');
            data.addColumn('number', 'y');
            data.addRows(numPoints);
            var step = (xmax-xmin) / (numPoints-1);
            var evaluatedEq;
            with(Math) {
                evaluatedEq = eval('with (Math) {(function(){ return function(x){ return '+equation+' } })()}');
            }
            var x, y;
            for(var i = 0; i < numPoints; i++) {
                x = xmin + step * i;
                data.setValue(i,0,x);
                y = evaluatedEq(x);
                data.setValue(i,1,y);
            }
            el.innerHTML = "";
            var chart = new google.visualization.ScatterChart(el);
            chart.draw(data, {width: width, height: height,
                titleX: 'X', titleY: 'Y', legend: 'none',
                pointSize: pointSize});
        }
    });
    
};

Ext.extend(MathWidget, Ext.Panel); 
