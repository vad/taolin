/**
 * @class Ext.layout.ToolbarLayout
 * @extends Ext.layout.ContainerLayout
 */
Ext.layout.ToolbarLayout = Ext.extend(Ext.layout.ContainerLayout, {

    // private
    onLayout : function(ct, target){
        if(!this.leftTr){
            target.addClass('x-toolbar-layout-ct');
            target.createChild([
            	{tag:'table', cls:'x-toolbar-left', cellspacing: 0, cn: {tag: 'tbody', cn: {tag: 'tr'}}},
            	{tag:'table', cls:'x-toolbar-right', cellspacing: 0, cn: {tag: 'tbody', cn: {tag: 'tr'}}}
            ]);
            this.leftTr = target.child('.x-toolbar-left tr', true);
            this.rightTr = target.child('.x-toolbar-right tr', true);
        } else {
        	this.align = this.container.initialConfig.align;
        	while(this.leftTr.lastChild) this.leftTr.removeChild(this.leftTr.lastChild);
        	while(this.rightTr.lastChild) this.rightTr.removeChild(this.rightTr.lastChild);
        }

//		Layout all the items.
        var items = ct.items.items;
        for(var i = 0, len = items.length; i < len; i++) {
            this.renderItem(items[i], i, target);
        }
    },

    // private
	getNextCell : function(c){
		return (((c.align == 'right') || (this.container.align == 'right') || (this.align == 'right')) ? this.rightTr : this.leftTr).appendChild(document.createElement('td'));
    },

    // private
    renderItem : function(c, position, target){
        if(c) {
        	if (c.isFill) { // A Fill just switches sides
        		this.align = 'right';
        	} else {
	        	if (c instanceof Ext.Element) {
	        		this.getNextCell().appendChild(c.dom);
	        	} else {
		        	if (c.rendered){
		        		if (this.renderOnLayout) {
			        		c.el.remove();
			        		delete c.el;
			        		c.rendered = false;
		        		} else {
			        		this.getNextCell(c).appendChild(c[c.wrap ? 'wrap' : 'el'].dom);
			        	}
		        	} else {
			            c.render(this.getNextCell(c));
			        }
			    }
			}
        }
    }
    /**
     * @property activeItem
     * @hide
     */
});

Ext.Container.LAYOUTS['toolbar'] = Ext.layout.ToolbarLayout;

/**
 * @class Ext.Toolbar
 * @extends Ext.Container
 * Basic Toolbar class. Toolbar elements can be created explicitly via their constructors, or implicitly
 * via their xtypes.  Some items also have shortcut strings for creation.  
 * @constructor
 * Creates a new Toolbar
 * @param {Object/Array} config A config object or an array of buttons to add
 */ 
 Ext.Toolbar = function(config){
    if(Ext.isArray(config)){
        config = {items: config, layout: 'toolbar'};
    } else {
    	config = Ext.apply({
    		layout: 'toolbar'
    	}, config);
	    if (config.buttons) {
	    	config.items = config.buttons;
	    }
    }
    Ext.Toolbar.superclass.constructor.call(this, config);
};

(function(){

var T = Ext.Toolbar;

Ext.extend(T, Ext.Container, {

    defaultType: 'tbbutton',

    trackMenus : true,

    // private
    autoCreate: {
        cls:'x-toolbar x-small-editor'
    },

    // private
    onRender : function(ct, position){
        this.el = ct.createChild(Ext.apply({ id: this.id },this.autoCreate), position);
    },

    /**
     * Adds element(s) to the toolbar -- this function takes a variable number of
     * arguments of mixed type and adds them to the toolbar.
     * @param {Mixed} arg1 The following types of arguments are all valid:<br />
     * <ul>
     * <li>{@link Ext.Toolbar.Button} config: A valid button config object (equivalent to {@link #addButton})</li>
     * <li>HtmlElement: Any standard HTML element (equivalent to {@link #addElement})</li>
     * <li>Field: Any form field (equivalent to {@link #addField})</li>
     * <li>Item: Any subclass of {@link Ext.Toolbar.Item} (equivalent to {@link #addItem})</li>
     * <li>String: Any generic string (gets wrapped in a {@link Ext.Toolbar.TextItem}, equivalent to {@link #addText}).
     * Note that there are a few special strings that are treated differently as explained next.</li>
     * <li>'separator' or '-': Creates a separator element (equivalent to {@link #addSeparator})</li>
     * <li>' ': Creates a spacer element (equivalent to {@link #addSpacer})</li>
     * <li>'->': Creates a fill element (equivalent to {@link #addFill})</li>
     * </ul>
     * @param {Mixed} arg2
     * @param {Mixed} etc.
     */
    add : function(){
        var a = arguments, l = a.length;
        for(var i = 0; i < l; i++){
            var el = a[i];
            if(el.isFormField){ // some kind of form field
                this.addField(el);
            }else if(el.render){ // some kind of Toolbar.Item
                this.addItem(el);
            }else if(typeof el == "string"){ // string
                if(el == "separator" || el == "-"){
                    this.addSeparator();
                }else if(el == " "){
                    this.addSpacer();
                }else if(el == "->"){
                    this.addFill();
                }else{
                    this.addText(el);
                }
            }else if(el.tag){ // DomHelper spec
                this.addDom(el);
            }else if(el.tagName){ // element
                this.addElement(el);
            }else if(typeof el == "object"){ // must be button config?
                if(el.xtype){
                    this.addItem(Ext.ComponentMgr.create(el, 'button'));
                }else{
                    this.addButton(el);
                }
            }
        }
    },
    
    /**
     * Adds a separator
     * @return {Ext.Toolbar.Item} The separator item
     */
    addSeparator : function(){
        return this.addItem(new T.Separator());
    },

    /**
     * Adds a spacer element
     * @return {Ext.Toolbar.Spacer} The spacer item
     */
    addSpacer : function(){
        return this.addItem(new T.Spacer());
    },

    /**
     * Forces subsequent additions into the float:right toolbar
     */
    addFill : function(){
    	this.addItem(new T.Fill());
    },

    /**
     * Adds any standard HTML element to the toolbar
     * @param {Mixed} el The element or id of the element to add
     * @return {Ext.Toolbar.Item} The element's item
     */
    addElement : function(el){
    	var item = new T.Item({el:el});
        this.addItem(item);
        return item;
    },
    
    /**
     * Adds any Toolbar.Item or subclass
     * @param {Ext.Toolbar.Item} item
     * @return {Ext.Toolbar.Item} The item
     */
    addItem : function(item){
    	Ext.Toolbar.superclass.add.apply(this, arguments);
    	return item;
    },
    
    /**
     * Adds a button (or buttons). See {@link Ext.Toolbar.Button} for more info on the config.
     * @param {Object/Array} config A button config or array of configs
     * @return {Ext.Toolbar.Button/Array}
     */
    addButton : function(config){
        if(Ext.isArray(config)){
            var buttons = [];
            for(var i = 0, len = config.length; i < len; i++) {
                buttons.push(this.addButton(config[i]));
            }
            return buttons;
        }
        var b = config;
        if(!(config instanceof T.Button)){
            b = config.split ? 
                new T.SplitButton(config) :
                new T.Button(config);
        }
        this.initMenuTracking(b);
        this.addItem(b);
        return b;
    },

    // private
    initMenuTracking : function(item){
        if(this.trackMenus && item.menu){
            item.on({
                'menutriggerover' : this.onButtonTriggerOver,
                'menushow' : this.onButtonMenuShow,
                'menuhide' : this.onButtonMenuHide,
                scope: this
            })
        }
    },

    /**
     * Adds text to the toolbar
     * @param {String} text The text to add
     * @return {Ext.Toolbar.Item} The element's item
     */
    addText : function(text){
    	var t = new T.TextItem(text);
        this.addItem(t);
        return t;
    },
    
    /**
     * Inserts any {@link Ext.Toolbar.Item}/{@link Ext.Toolbar.Button} at the specified index.
     * @param {Number} index The index where the item is to be inserted
     * @param {Object/Ext.Toolbar.Item/Ext.Toolbar.Button/Array} item The button, or button config object to be
     * inserted, or an array of buttons/configs.
     * @return {Ext.Toolbar.Button/Item}
     */
    insertButton : function(index, item){
        if(Ext.isArray(item)){
            var buttons = [];
            for(var i = 0, len = item.length; i < len; i++) {
               buttons.push(this.insertButton(index + i, item[i]));
            }
            return buttons;
        }
        if (!(item instanceof T.Button)){
           item = new T.Button(item);
        }
        Ext.Toolbar.superclass.insert.call(this, index, item);
        return item;
    },
    
    /**
     * Adds a new element to the toolbar from the passed {@link Ext.DomHelper} config
     * @param {Object} config
     * @return {Ext.Toolbar.Item} The element's item
     */
    addDom : function(config){
    	var item = new T.Item({autoEl: config});
        this.addItem(item);
        return item;
    },

    /**
     * Adds a dynamically rendered Ext.form field (TextField, ComboBox, etc). Note: the field should not have
     * been rendered yet. For a field that has already been rendered, use {@link #addElement}.
     * @param {Ext.form.Field} field
     * @return {Ext.ToolbarItem}
     */
    addField : function(field){
    	this.addItem(field);
    	return field;
    },

    // private
    onDisable : function(){
        this.items.each(function(item){
             if(item.disable){
                 item.disable();
             }
        });
    },

    // private
    onEnable : function(){
        this.items.each(function(item){
             if(item.enable){
                 item.enable();
             }
        });
    },

    // private
    onButtonTriggerOver : function(btn){
        if(this.activeMenuBtn && this.activeMenuBtn != btn){
            this.activeMenuBtn.hideMenu();
            btn.showMenu();
            this.activeMenuBtn = btn;
        }
    },

    // private
    onButtonMenuShow : function(btn){
        this.activeMenuBtn = btn;
    },

    // private
    onButtonMenuHide : function(btn){
        delete this.activeMenuBtn;
    }
});
Ext.reg('toolbar', Ext.Toolbar);

/**
 * @class Ext.Toolbar.Item
 * The base class that other non-ineracting Toolbar Item classes should extend in order to
 * get some basic common toolbar item functionality.
 * @constructor
 * Creates a new Item
 * @param {HTMLElement} el 
 */
T.Item = Ext.extend(Ext.BoxComponent, {
    hideParent: true, //  Hiding a Toolbar.Item hides its containing TD
    enable:Ext.emptyFn,
    disable:Ext.emptyFn,
    focus:Ext.emptyFn
});
Ext.reg('tbitem', T.Item);

/**
 * @class Ext.Toolbar.Separator
 * @extends Ext.Toolbar.Item
 * A simple class that adds a vertical separator bar between toolbar items.  Example usage:
 * <pre><code>
new Ext.Panel({
	tbar : [
		'Item 1',
		{xtype: 'tbseparator'}, // or '-'
		'Item 2'
	]
});
</code></pre>
 * @constructor
 * Creates a new Separator
 */
T.Separator = Ext.extend(T.Item, {
    onRender : function(ct, position){
        this.el = ct.createChild({tag:'span', cls:'ytb-sep'}, position);
    }
});
Ext.reg('tbseparator', T.Separator);

/**
 * @class Ext.Toolbar.Spacer
 * @extends Ext.Toolbar.Item
 * A simple element that adds extra horizontal space between items in a toolbar.
 * <pre><code>
new Ext.Panel({
	tbar : [
		'Item 1',
		{xtype: 'tbspacer'}, // or ' '
		'Item 2'
	]
});
</code></pre>
 * @constructor
 * Creates a new Spacer
 */
T.Spacer = Ext.extend(T.Item, {
    onRender : function(ct, position){
        this.el = ct.createChild({tag:'div', cls:'ytb-spacer'}, position);
    }
});
Ext.reg('tbspacer', T.Spacer);

/**
 * @class Ext.Toolbar.Fill
 * @extends Ext.Toolbar.Spacer
 * A non-rendering placeholder item which instructs the Toolbar's Layout to begin using
 * the right-justified button container.
 * <pre><code>
new Ext.Panel({
	tbar : [
		'Item 1',
		{xtype: 'tbfill'}, // or '->'
		'Item 2'
	]
});
</code></pre>
 * @constructor
 * Creates a new Fill
 */
T.Fill = Ext.extend(T.Item, {
    // private
    render : Ext.emptyFn,
    isFill : true
});
Ext.reg('tbfill', T.Fill);

/**
 * @class Ext.Toolbar.TextItem
 * @extends Ext.Toolbar.Item
 * A simple class that renders text directly into a toolbar.
 * <pre><code>
new Ext.Panel({
	tbar : [
		{xtype: 'tbtext', text: 'Item 1'} // or simply 'Item 1'
	]
});
</code></pre>
 * @constructor
 * Creates a new TextItem
 * @param {String/Object} text A text string, or a config object containing a <tt>text</tt> property
 */
T.TextItem = Ext.extend(T.Item, {
	constructor: function(config){
		if (typeof config == 'string') {
			config = { autoEl: { cls: 'ytb-text', html: config }};
		} else {
			config.autoEl = { cls: 'ytb-text', html: config.text || ''};
		}
	    T.TextItem.superclass.constructor.call(this, config);
	},
    setText: function(t) {
    	if (this.rendered) {
    		this.el.dom.innerHTML = t;
    	} else {
    		this.autoEl.html = t;
    	}
    }
});
Ext.reg('tbtext', T.TextItem);

/**
 * @class Ext.Toolbar.Button
 * @extends Ext.Button
 * A button that renders into a toolbar. Use the <tt>handler</tt> config to specify a callback function
 * to handle the button's click event.
 * <pre><code>
new Ext.Panel({
	tbar : [
		{text: 'OK', handler: okHandler} // tbbutton is the default xtype if not specified
	]
});
</code></pre>
 * @constructor
 * Creates a new Button
 * @param {Object} config A standard {@link Ext.Button} config object
 */
T.Button = Ext.extend(Ext.Button, {
    hideParent : true,

    onDestroy : function(){
        T.Button.superclass.onDestroy.call(this);
        if(this.container){
            this.container.remove();
        }
    }
});
Ext.reg('tbbutton', T.Button);

/**
 * @class Ext.Toolbar.SplitButton
 * @extends Ext.SplitButton
 * A split button that renders into a toolbar.
 * <pre><code>
new Ext.Panel({
	tbar : [
		{
			xtype: 'tbsplit',
		   	text: 'Options',
		   	handler: optionsHandler, // handle a click on the button itself
		   	menu: new Ext.menu.Menu({
		        items: [
		        	// These items will display in a dropdown menu when the split arrow is clicked
			        {text: 'Item 1', handler: item1Handler},
			        {text: 'Item 2', handler: item2Handler},
		        ]
		   	})
		}
	]
});
</code></pre>
 * @constructor
 * Creates a new SplitButton
 * @param {Object} config A standard {@link Ext.SplitButton} config object
 */
T.SplitButton = Ext.extend(Ext.SplitButton, {
    hideParent : true,

    onDestroy : function(){
        T.SplitButton.superclass.onDestroy.call(this);
        if(this.container){
            this.container.remove();
        }
    }
});

Ext.reg('tbsplit', T.SplitButton);
// backwards compat
T.MenuButton = T.SplitButton;

})();