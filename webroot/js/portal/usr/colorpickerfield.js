/**
 * @class Ext.ux.form.ColorPickerField
 * @extends Ext.form.TriggerField
 * This class makes Ext.ux.ColorPicker available as a form field.
 * @license: BSD
 * @author: Robert B. Williams (extjs id: vtswingkid)
 * @constructor
 * Creates a new ColorPickerField
 * @param {Object} config Configuration options
 * @version 1.1.2
 */

Ext.namespace("Ext.ux", "Ext.ux.menu", "Ext.ux.form");
Ext.ux.menu.ColorItem = function(config){
	if(!config)config={};
	config.style="width:350px;";
    Ext.ux.menu.ColorItem.superclass.constructor.call(this, new Ext.ux.ColorPicker(config), config);
    this.picker = this.component;
	this.addEvents('select');
    this.picker.on("render", function(picker){
        picker.getEl().swallowEvent("click");
    });
	this.picker.on("select", this.onSelect, this);	
};
Ext.extend(Ext.ux.menu.ColorItem, Ext.menu.Adapter, {
    // private
    onSelect : function(picker, color){
        this.fireEvent("select", this, color, picker);
        Ext.ux.menu.ColorItem.superclass.handleClick.call(this);
    }
});

Ext.ux.menu.ColorMenu = function(config){
    Ext.ux.menu.ColorMenu.superclass.constructor.call(this, config);
    this.plain = true;
    var ci = new Ext.ux.menu.ColorItem(config);
    this.add(ci);
    this.picker = ci.picker;
    this.relayEvents(ci, ["select"]);	
};
Ext.extend(Ext.ux.menu.ColorMenu, Ext.menu.Menu, {
    beforeDestroy : function() {
        this.picker.destroy();
    }
});

Ext.ux.form.ColorPickerField = Ext.extend(Ext.form.TriggerField,  {
    initComponent : function(){
        Ext.ux.form.ColorPickerField.superclass.initComponent.call(this);
		this.menu = new Ext.ux.menu.ColorMenu();
    },
	setValue : function(v){
        Ext.ux.form.ColorPickerField.superclass.setValue.apply(this, arguments);
		var i = this.menu.picker.rgbToHex(this.menu.picker.invert(this.menu.picker.hexToRgb(v)));
		this.el.applyStyles('background: #'+v+'; color: #'+i+';');
    },
    onDestroy : function(){
        if(this.menu) {
            this.menu.destroy();
        }
        if(this.wrap){
            this.wrap.remove();
        }
        Ext.ux.form.ColorPickerField.superclass.onDestroy.call(this);
    },
    onBlur : function(){
        Ext.ux.form.ColorPickerField.superclass.onBlur.call(this);
		var v = this.getValue();
		var i = this.menu.picker.rgbToHex(this.menu.picker.invert(this.menu.picker.hexToRgb(v)));
		this.el.applyStyles('background: #'+v+'; color: #'+i+';');
    },
	menuListeners : {
        select: function(m, c){
            this.setValue(c);
            this.focus.defer(10, this);
        },
        show : function(m){ // retain focus styling
            this.onFocus();
        },
        hide : function(){
            this.focus.defer(10, this);
            var ml = this.menuListeners;
            this.menu.un("select", ml.select,  this);
            this.menu.un("show", ml.show,  this);
            this.menu.un("hide", ml.hide,  this);
        }
    },
    onTriggerClick : function(){
        if(this.disabled){
            return;
        }
        this.menu.on(Ext.apply({}, this.menuListeners, {
           scope:this
        }));
        this.menu.show(this.el, "tl-bl?");
        this.menu.picker.setColor(this.getValue());
    }
});
Ext.reg("colorpickerfield", Ext.ux.form.ColorPickerField);
