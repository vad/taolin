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
    listeners: {
        resize: {
            fn: function(panel, panelWidth, panelHeight){ 
                    panel.items.last().setWidth(panelWidth);
                }, 
            scope: this
        }
        ,render: function(){
            var jPortlet = $('#'+this.getId());
            var tools = jPortlet.find('.x-tool');
            tools.css({visibility: 'hidden'});

            //hoverIntent provided some problems with tooltip so we
            //decided to switch back to hover even if it doesn't
            //completely work with IE
            jPortlet.hover(function(){
                tools.css({visibility: 'visible'});
                }, function(){
                tools.css({visibility: 'hidden'});
            });
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
        w_class.prototype.setPref = function(pref, value) {Ext.getCmp(this.portlet_id).setPref(pref, value);};
   
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
            //baseCls: 'feedback_widget'
            autoHeight: true
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
                text: 'Change',
                handler: function(){
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
                },
                scope: this,
                formBind: true
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
            field.name = x.name;
            this.confForm.add(field);
        }

        this.insert(0, this.confForm);
        this.doLayout();
    }
    ,setPref:function(pref, value, callbackfun){

        var params = {id: this.getId()};
        params[pref] = value;
    
        Ext.Ajax.request({
            url : 'users_widgets/changeconf'
            ,method: 'POST'
            ,params: params
            ,callback: callbackfun  
       });
    }
});
Ext.reg('portlet', Ext.ux.Portlet);
