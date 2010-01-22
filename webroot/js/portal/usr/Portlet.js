/**
 * This file is part of taolin project (http://taolin.fbk.eu)
 * Copyright (C) 2008, 2009 FBK Foundation, (http://www.fbk.eu)
 * Authors: SoNet Group (see AUTHORS.txt)
 *
 * This file is a modified version of a file of Ext JS Library 2.0.2
 * (see copyright below).
 * According to the Ext JS Library 2.0.2 license (see
 * http://extjs.com/license ), Ext JS Library 2.0.2 is double licensed.
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
 * Ext JS Library 2.0.2
 * Copyright(c) 2006-2008, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.ux.Portlet = Ext.extend(Ext.Panel, {
    anchor: '100%',
    frame:true,
    collapsible:true,
    draggable:true,
    autoDestroy:true,
    cls:'x-portlet',
    onRender: function(){        
        Ext.ux.Portlet.superclass.onRender.apply(this, arguments);
        
        var jPortlet = $('#' + this.getId());
        var tools = jPortlet.find('.x-tool');
        tools.css({
            visibility: 'hidden'
        });
        
        //hoverIntent provided some problems with tooltip so we
        //decided to switch back to hover even if it doesn't
        //completely work with IE
        jPortlet.hover(function(){
                tools.css({
                    visibility: 'visible'
                });
            }, function(){
                tools.css({
                    visibility: 'hidden'
                });
        });        
    },
    listeners: {
        resize: {
            fn: function(panel, panelWidth, panelHeight){ 
                panel.items.last().setWidth(panelWidth);
            },
            scope: this
        }
        ,expand: function(panel){
            var w = panel.getInnerWidth();
            panel.items.last().setWidth(w-1);
            panel.items.last().setWidth(w);
        }
    },
    updateWidget: function(conf){
        if (conf)
            this.lastConf = conf;
        else
            var conf = this.lastConf;

        var w_class = Ext.util.JSON.decode(conf.string_identifier);

        //TODO: this doesn't need to be done for every instantiation
        w_class.prototype.setPortletTitle = function(title) {Ext.getCmp(this.portlet_id).setTitle(title);};
        w_class.prototype.setPref = function(pref, value, callback) {Ext.getCmp(this.portlet_id).setPref(pref, value, callback);};
   
        this.remove(this.items.last());
        this.add(new w_class(conf.widget_conf, {portlet_id: conf.id}));
        this.userParams = conf.user_params; //user's configurable params (name, type, description)
        this.widgetConf = conf.widget_conf; //params value
    
        this.doLayout();

    },
    showConf: function(){

        if ((!this.userParams) || (this.userParams.length == 0))
            return;

        if (this.confForm){
            this.remove(this.items.items[0], true);
            this.confForm = null;
            return;
        }
        else if(this.collapsed)
            // if the widget is collapsed, expand it before showing the confForm
            this.toggleCollapse(true);

        this.confForm = new Ext.form.FormPanel({
            baseCls: 'portlet_conf'
            ,autoHeight: true
            //,title: 'Change your settings'
            ,bodyStyle:'padding:10px;background:transparent'
            ,style:'background:#F5F5F5 url(img/portlet_conf_bg.png) repeat-x scroll center top;border-style:none none solid;border-width:0 0 1px; border-color: #DDDDDD'
            ,buttonAlign: 'center'
            ,items: [
            {
                xtype: 'hidden'
                ,name: 'id'
                ,value: this.getId()
            }],
            
            buttons: [{
                    text: 'Change'
                    ,handler: this.submit
                    ,scope: this
                    ,formBind: true
                }
                ,{
                    text: 'Cancel'
                    ,handler: function(){
                        this.remove(this.items.items[0], true);
                        this.confForm = null;
                    }
                    ,scope: this
                }
            ]
            ,keys:{
                key: Ext.EventObject.ENTER
                ,fn: function(){this.submit()}
                ,scope: this
            }
        });
      
        var field;
        for (var i=0, x; x = this.userParams[i++];){
            field = {};
            if(x.type=='string') {
                field.xtype = 'textfield';
                field.fieldLabel = x.description ? x.description : x.name;
                field.anchor = '100%';
                if (this.widgetConf[x.name])
                    field.value = this.widgetConf[x.name];
            }
            else if(x.type=='integer') {
                field.xtype = 'textfield';
                field.fieldLabel = x.description ? x.description : x.name;
                field.anchor = '100%';
                if (this.widgetConf[x.name])
                    field.value = this.widgetConf[x.name];
            }
            else if(x.type=='boolean') {
                field.xtype = 'checkbox';
                field.boxLabel = x.description ? x.description : x.name;
                field.hideLabel = true;
                if (this.widgetConf[x.name])
                    field.checked = this.widgetConf[x.name];
            }
            else if(x.type=='color') {
                field.xtype = 'colorpickerfield';
                field.fieldLabel = x.description ? x.description : x.name;
                field.anchor = '100%';
                if (this.widgetConf[x.name])
                    field.value = this.widgetConf[x.name];
            }
            else if(x.type=='BooleanList') {
                field.xtype = 'checkboxgroup';
                field.fieldLabel = x.description ? x.description : x.name;
                field.cls = 'boolean-list';
                field.anchor = '100%';
                field.columns = 1;
                field.items = new Array();
                
                var i = 0;
                for (var k in x.values){ //create checkboxes
                    // use key as checkbox label unless a title has been specified
                    var label = k;
                    if ('title' in x.values[k])
                        label = x.values[k].title;

                    var cb = { //checkbox
                        xtype: 'checkbox'
                        ,boxLabel: label
                        ,inputValue: k
                        ,name: x.name+"_"+i
                    };
                   
                    /* If the controlled item is already present in the user
                     * parameters (i.e. the user already choose that option) 
                     * then the corrisponding checkbox is checked.
                     * More details about user params here: http://wiki.github.com/vad/taolin/userparams
                     *
                     */
                    if(this.widgetConf[x.name][k])
                        cb.checked = true;

                    field.items.push(cb);
                    i++;
                }
                
                this.confForm.add({
                    xtype: 'hidden'
                    ,name: x.name //length
                    ,value: i
                });
                
                /*
                 
                if (this.widgetConf[x.name])
                    field.value = this.widgetConf[x.name];
                */
            }
            else if(x.type=='combobox'){
                field.xtype = 'combo';
                field.fieldLabel = x.description ? x.description : x.name;

                dt = new Array();

                for (var o in x.opt){
                    field[o] = x.opt[o];
                } 

                for (var k in x.values){ //create combobox's items
                    dt.push([k, x.values[k]]);
                }

                field.store = new Ext.data.SimpleStore({
                    fields: x.fields,
                    data: dt
                });

                /* If the controlled item is already present in the user
                 * parameters (i.e. the user already choose that option) 
                 * then the combobox is rendered with that default value.
                 * More details about user params here: http://wiki.github.com/vad/taolin/userparams
                 */
                if(this.widgetConf[x.name]){
                    field.value = x.values[this.widgetConf[x.name]];
                }
            }
            field.name = x.name;
            this.confForm.add(field);
        }

        this.insert(0, this.confForm);
        this.doLayout();
    }
    ,setPref:function(pref, value, callback){ // set a single settings

        var params = {id: this.getId()};
        params[pref] = value;
    
        Ext.Ajax.request({
            url : 'users_widgets/changeconf'
            ,method: 'POST'
            ,params: params
            ,callback: callback
       });
    }
    ,submit: function(){ //submit the form and set all the settings
        this.confForm.getForm().submit(
            {
                url:'users_widgets/changeconf',
                //waitMsg:'Saving Data...',
                scope:this,
                success: function(form,action){
                    this.remove(this.items.items[0], true);
                    this.confForm = null;
                    
                    this.updateWidget(action.result.widget);
                }
        }
        );
    }
});
Ext.reg('portlet', Ext.ux.Portlet);
