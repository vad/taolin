Ext.namespace('Ext.ux');
/**
 * Wizard component for ExtJs 2.x
 * 
 * @author Charles Opute Odili (chalu)
 * @version 2.0
 * @licence GPLv3
 */

/**
 *  CardLayout Implementation for wizards, 
 *  uses Ext.ux.XMetaForm extension (inspired by Saki's MetaForm )to
 *  allow dynamic metadata configurations. 
 *  Application of this extension requires a 'data' property in the
 *  packet sent from the server (even if it is empty) to function properly.
 *  else a failure type of Ext.form.Action.LOAD_FAILURE is assumed.
 *  
 * @class Ext.ux.Wizard
 * @extend Ext.ux.BasicWizard
 * 
 * @requires Ext.ux.Image {@link http://code.google.com/p/ext-ux-image/}
 * @requires Ext.ux.FormGroup {@link http://extjs.com/blog/2008/05/14/form-group/}
 * @requires Ext.ux.XMetaForm {@link http://code.google.com/p/ext-ux-xmetaform/}
 *
 * @constructor
 * @param {Object} config The config object 
 */ 
Ext.ux.Wizard = Ext.extend(Ext.ux.BasicWizard, {
	
	/**
	 * @cfg {Boolean / Object} autoInit
	 * Object specifying the initialization and global parameters
	 * for this wizard, including it's URL.  Defaults to false
	 */
	autoInit: false,
	
	/**
	 * @cfg {String} url
	 * The URL to submit 'pages' to, usefull in times where
	 * we have pages created with static code, defaults to null
	 */
	url: null,
	
	/**
	 * @cfg {String} loadingText
	 * Message to use in the loading mask of the wizard, default is 'Loading ..'
	 */
	loadingText: 'Loading ...',
	
	/**
	 * @cfg {String} savingText
	 * Message to use in the saving mask of the wizard, default is 'Saving ...'
	 */
	savingText: 'Saving ...',
	
	/**
	 * @cfg {Boolean} fileUpload
	 * true to enable file upload in this wizard, false otherwise. Default  is false
	 */
	fileUpload: false,
	
	/**
	 * @cfg {Boolean} rewiewEntries
	 * true to show entries as a final step, defaults to false
	 */
	reviewEntries: false,
	
	/**
	 * @cfg {Object} westConfig A config-object to use with {@link Ext.ux.Wiz.West}.
	 * If not present, it defaults to an empty object. 
	 * Valid params are <code>images</code> which is an array of image src strings
	 * to use to further indicate the current step been observed in the wizard, 
	 * <code>width</code> the width of the west region.
	 */
	westConfig: {
		width: 0
	},
	
	/**
	 * @cfg {Object} helpBtn
	 * Default object config for a help button, specify as null if this is not needed
	 */
	helpBtn: {
		tooltip: 'Help',
		text: 'Help',
		iconCls: 'help-btn'
	},
	
	/**
	 * @cfg {Boolean} monitorValid
	 * If set to true, the wizard monitors it's valid state and disables/enables the nextBtn acccordingly
	 */
	monitorValid: true,
	
	/**
     * Inits this component with the specified config-properties and automatically
     * creates its components.
     */
	initComponent: function(){
		this.prev = {};		
		Ext.ux.Wizard.superclass.initComponent.apply(this, arguments);
		
		this.westComp = new Ext.ux.WizardWest(Ext.apply(this.westConfig, {
			region: 'west'
		}));
		this.add(this.westComp);
		this.cards.onMetaChange = this.onMetaChange.createDelegate(this);
		
		if(this.reviewEntries === true){
			this.reviewTpl = new Ext.XTemplate(
				'<table width="100%" border="0">',												
					'<tpl for=".">',
						'<tr class="{[xindex % 2 === 0 ? "x-wizard-field-review-plain" : "x-wizard-field-review-gray"]}">',
							'<td class="x-wizard-field-review" valign="middle">{field}</td>',
							'<td class="x-wizard-field-review" valign="middle">{value}</td>',
						'</tr>',
		    		'</tpl>',
	    		'</table>'
			).compile();	
		}
		
		this.addEvents(
			/**
			  * @event help Fires when the wizard help button is clicked
			  * @param {Ext.Panel} activeCard the currently active card
			  */
			 'help',
			 
			 /**
			  * @event metachange Fires when crads are recieved from the server
			  * @param {Ext.ux.XMetaForm} form the form makin the request for cards
			  * @param {Object} meta the metadat response from the server
			  */
			 'metachange'
		);
		
		this.on({
			scope: this,
			'afternav': this.afternav,
			'beforenav': this.beforenav,
			'beforefinish': this.beforefinish
		});
		
		if(this.helpBtn){
			Ext.apply(this.helpBtn, {
				scope: this,
				handler: this.help				
			});
		}
	},
	
	/**
	 * @private 
	 * @param {Object} pages
	 */
	initCards: function(pages){
		var self = this;
		if(this.autoInit !== false){
			Ext.apply(this.autoInit.params || {}, {meta:true});
		}
		return new Ext.ux.form.XMetaForm({
			loadingText: this.loadingText,
			savingText: this.savingText,
			layout: this.animate ? 'slickcard' : 'card',
			activeItem: this.activeIndex || 0,
			region: 'center',
			frame: this.frame,
			fileUpload: this.fileUpload,
			monitorValid: this.monitorValid,
			defaults: {
				border: false,
				autoHeight: true,
				autoScroll: true,
				bodyStyle: 'padding:10px; position:relative;'
			},
			autoInit: this.autoInit,
			url: ((typeof this.autoInit == 'object') ? this.autoInit.url : this.url || ''),
			items: this.itemsInit(pages),
			bindHandler : function() {
				if(!this.bound){
		            return false; // stops binding
		        }
				
		        var valid = this.isValid.call(self.getActiveCard(), false, true);				
		        if(!self.getToolbar().disabled && (self.nextBtn.disabled === valid)){
                    self.nextBtn.setDisabled(!valid);
                }			
		        this.fireEvent('clientvalidation', this, valid);
			}
		});
	},
	
	/**
	 * @private
	 * @param {Object} pages
	 */
	itemsInit: function(pages){
		var items = Ext.ux.Wizard.superclass.itemsInit.apply(this, arguments);
		if(this.reviewEntries === true && Ext.isArray(items)){
			items.push({
				index: this.cardCount || items.length,
				trailText: 'Confirmation'
			});
		}			
		return items;
	},
	
	/**
	 * @private
	 * @param {Object} config
	 */
	buildPage: function(config){	
		if( !Ext.isEmpty(config) ){
			this.buildPlugins(config);
			var items = config.items;
			if( !Ext.isEmpty(items) ) {
				this.buildPage(items);
			} else {            
				// handle regexps
	            if( !Ext.isEmpty(config.regex) ) {
	                config.regex = new RegExp(config.regex);
	            }
	            
	            // to avoid checkbox misalignment
	            if('checkbox' === config.xtype) {
	                Ext.apply(config, {
	                     boxLabel:' ',
	                     checked: config.defaultValue
	                });
	            }
			}																	
		}		
		return config;
	},
	
	/**
	 * @private
	 */
	buildToolbar: function(){
		var tbar = this.getToolbar();
		tbar.add(this.helpBtn || '', '->', this.backBtn, '', '-', '', this.nextBtn, this.replayBtn || '');
		tbar.doLayout();
	},
	
	/**
	 * Updates the step / trail information
	 * @param {Ext.Panel} activeCard the currently active card
	 */
	updateTrails: function(activeCard){
		Ext.ux.Wizard.superclass.updateTrails.apply(this, arguments);
		if(this.useTrail === true){
			this.westComp.updateStep(this.next || this.activeIndex);		
		}
	},
	
	/**
     * If we are loading cards from the server, then disable the toolbar
     * till we are done.
     */
	afterRender: function(){
		Ext.ux.Wizard.superclass.afterRender.apply(this, arguments);		
		if(this.autoInit !== false){
			this.getToolbar().disable();
		}												
	},
	
	/**
	 * Called when we get cards from the server
	 * @param {Ext.ux.XMetaForm} form The formpanel making the request
	 * @param {Object} meta The configurations from the server
	 */
	onMetaChange: function(form, meta){
		var cards = this.cards;		
		var activeItem = cards.getLayout().activeItem;
	    if(activeItem.index){
	      	cards.items.each(function(c){
		        if(c.index > activeItem.index){
		            this.items.remove(c);
		        }
	      	}, cards);
	    }else{
	      cards.removeAll();
	      activeItem = null;
	    }    		
		
	    var pages = meta.pages || meta.cards;
		Ext.each(pages, function(page){	
			if(activeItem){
		        page.index = (page.index + activeItem.index) + 1;
		        
		        if(this.nextBtn.getText() === this.endBtnText){
		        	this.nextBtn.setText(this.nextBtnText);
		        }
		    }else{
		        activeItem = page.isActiveItem ? page.index : 0;
		    }
	        
		}, this);
		
		this.cardCount = cards.items.getCount() + pages.length;
		var items = Ext.applyIf(this.itemsInit(pages), meta.formConfig || {});
		Ext.each(items, function(item){
			cards.add(item);
		});
		
		cards.doLayout();		
		cards.getLayout().setActiveItem(activeItem);
		this.getToolbar().enable();
		
		this.cardCount = cards.items.getCount();
		this.headComp.setStepCount(this.cardCount);
		this.start(activeItem);	
		this.fireEvent('metachange', form, meta);
	},
	
	/**
	 * Return the Ext.form.Field values from a card
	 * @param {Number} index The index of the card to inspect
	 * @param {Boolean} forDisplay Are requesting values for display? (usually if Ext.ux.Wizard#reviewEntries is true)
	 * 
	 * @return {Object} The card's input values
	 */
	getCardValues: function(index, forDisplay){		
    	var values = {};
		var card = this.getCard(index);
		var fields = card.findBy(function(c) {
	      	return c.isFormField === true;
	    });
				
    	Ext.each(fields, function(field) {
			var fieldName = undefined;			
			if(forDisplay === true){
				fieldName = field.initialConfig.reviewLabel;			
		    	if(fieldName === undefined){
					var fieldEl = field.getEl();
					fieldName = (fieldEl ? fieldEl.up('div.x-form-item').child('label', true).innerHTML : undefined);
					if(fieldName === undefined){	// in case the label is hidden				
						fieldName = Ext.util.Format.capitalize( field.hiddenName || field.name );
					}					
				}
			}else{
				fieldName = field.hiddenName || field.name;												
			}
			
			if( fieldName.indexOf(':') !== -1 ){
				fieldName = fieldName.substring(0, fieldName.indexOf(':'));
			}
			
	      	if(fieldName !== undefined){
				var val = field.getValue();
	      		values[fieldName] = val;
				
				if(forDisplay === true && field.isXType('combo') === true){
					if(field.findRecord && field.valueField) {
			
						if((typeof val.indexOf === 'function') && val.indexOf(',') != -1){
							// we may have a lovcombo with several options selected
							var keys = val.split(',');
							var vals = [];
							Ext.each(keys, function(key){
								var rec = field.findRecord(field.valueField, key);
								if(rec){
									vals.push(rec.data[field.displayField]);
								}
							});
							val = vals.join(', ');
						}else{
							var rec = field.findRecord(field.valueField, val);
							if(rec){
								val = rec.data[field.displayField];
							}
						}
										
					}
					values[fieldName] = val;
				}	      		
	      	}
	    });
	    return values;
	},	
	
	/**
	 * Gives us the values enterd in this wizard
	 * @param {Boolean} forDisplay Are requesting values for display? (usually if Ext.ux.Wizard#reviewEntries is true)
	 */
	getValues: function(forDisplay){
		var values = {};
		this.cards.items.each(function(item){
			Ext.apply(values, this.getCardValues(item.index, forDisplay));
		}, this);
				
		return values;
	},
	
	/**
	 * Usually called internally by {@link Ext.ux.Wizard#getNext}
	 * This presently does routing with single field values,
	 * have not been tested with fields that can have multiple values
	 * and will likely fail when we need to route based on the values of several fields.
	 * @param {Ext.Panel} panel the currently active card
	 * 
	 * @return {Number} The card index we should navigate to from here, 
	 * or null if no sequenceCtrl is set on the current card.
	 */
	sequenceCtrl: function(panel){
	    var seqIndex = null;
		var sequenceCtrl = panel.sequenceCtrl;
	    if(sequenceCtrl) {
	    	var fieldValues = this.getCardValues(panel.index);
	      	Ext.each(sequenceCtrl, function(field) {
	        	seqIndex = field.values[fieldValues[field.key]];
	      	}, this);
	    }
	    return seqIndex;
	},
	
	/**
	 * What is the index of the next card we are about to navigate to.
	 * When using sequenceCtrl, if you moved from page 2 to page 4,
	 * then you should be taken back to page 2 from page 4. 
	 * You should not see page 3, which is now off your path because of your inputs in page 2.
	 * The wizard has to be reset to resume 'free' navigation else this 'custom' path will not change.
	 * I have tried not to attempt 'implementing' browser history here :)
	 * 
	 * @param {Number} index Optionall index to explicitly navigate to, used during 'Replay'
	 * 
	 * @return {Number} The card index we should navigate to
	 */
	getNext: function(index){
		if(index !== undefined){
			return parseInt(index, 10);
		}
		
		var activeCard = this.getActiveCard();		
		var activeCardIndex = parseInt(activeCard.index, 10);
		var next = this.sequenceCtrl(activeCard);		
		
		if(this.dir === -1){
			var prevCardIndex = this.prev[activeCardIndex];
			if(Ext.isEmpty(prevCardIndex)){
				next = activeCardIndex + this.dir;
			}else{
				next = prevCardIndex;		
			}			
		}else if(this.dir === 1){						
			if(Ext.isEmpty(next)){
				next = activeCardIndex + this.dir;
			}else{
				// we are probably leaping over some 'pages'
				// we should be able to 'go back' correctly
				// If you moved from page 2 to page 4, then 
				// you should be taken back to page 2 from page 4
				// you should not see page 3, which is now
				// off your path because of your inputs in
				// page 2. I suppose that the form has to
				// be reset to resume 'free' navigation else
				// this 'custom' path will not change. I have tried
				// not to attempt 'implementing' browser history here :)
				this.prev[next] = activeCardIndex;
			}							
		}	
		return next;
	},
	
	/**
	 * Validate the currently active card
	 * 
	 * @return {Boolean} If the currently active card is valid
	 */
  	validateCard: function() {
  		if(this.dir === 1){
  			var activeCard = this.getActiveCard();
		    return this.cards.isValid.call(activeCard, true, false);
  		}
  		return true;
  	},
  	
	/**
	 * Validate the all cards in the wizard
	 * 
	 * @return {Boolean} If the wizard cards are valid
	 */
  	validate: function(){
  		return this.cards.isValid(true, false);
  	},
	
	/**
	 * @private
	 */
	beforenav: function(){
		return this.validateCard();
	},
	
	/**
	 * @private
	 */
	afternav: function(){
		var cardItems = this.cards.items;
		if( (this.next == cardItems.length-1) && (this.reviewEntries === true) ){
			this.showReview();
		}
	},
	  
	/**
	 * @private
	 */
	beforefinish: function(){
		return this.validate();
	},
	
	/**
	 * Submit the values entered in the wizard
	 * @param {Object} o Submission parameters
	 */
	submit: function(o){
		var oParams;
		if(typeof this.autoInit === 'object'){
			oParams = this.autoInit;
		}

                oParams = Ext.apply(oParams || {}, {params: this.baseParams});
		oParams = Ext.apply(oParams, o || {});
		
		// we may not have loaded pages from the server,
		// in this case we should have a url config param to submit the wizard values to
		oParams.url = oParams.url || this.url;
		var successCb = oParams.success;
		delete oParams.success;
		
		var failureCb = oParams.failure;
		delete oParams.failure;
		
		this.getToolbar().disable();
		this.cards.submit(Ext.apply({
			success: function(form, action){
				this.getToolbar().enable();
				this.nextBtn.disable();	
				if(this.replayBtn){
					this.replayBtn.disable();
				}
				
				this.reset();
				if(successCb){
					successCb.call(this, form, action, Ext.ux.BasicWizard.FINISH_MODE);
				}
			},
			failure: function(form, action){
				this.getToolbar().enable();				
				if(failureCb){
					failureCb.call(this, form, action, Ext.ux.BasicWizard.FINISH_MODE);
				}
			},
			scope: this
		}, oParams));		
	},
	
	/**
	 * Reset the cards in the wizard
	 */
	reset: function(){
		var cards = this.cards;
		Ext.each(cards.findBy(function(c) {
	      	return c.isFormField === true;
	    }), function(field) {
	    	field.reset();
	    });
	},
	
	/**
	 * Gives us a way to see our entries in the wizard so far.
	 * Usually called internally on the (internally injected) last card, only if {@link Ext.ux.Wizard#reviewEntries} is set to true
	 */
	showReview: function(){
		if(this.reviewEntries === true){
			if(this.reviewPanel === undefined){		
				var activeCard = this.getActiveCard();
				var reviewStore = this.getReviewStore();				
				this.reviewDataViewer = new Ext.DataView({
					tpl: this.reviewTpl,
					store: reviewStore,
					autoHeight: true,
					itemSelector: ''
				});
				this.reviewPanel = new Ext.ux.FormGroup({
					title: 'Review Entries',
					collapsible: false,
					items: {
						height: 200,
						autoScroll: true,
						items: this.reviewDataViewer
					}
					
				});
				activeCard.add(this.reviewPanel);
				activeCard.doLayout();
			}else{
				this.reviewDataViewer.setStore( this.getReviewStore() );
				this.reviewDataViewer.refresh();
			}
		}
	},
	
	/**
	 * Creates the Ext.data.SimpleStore by {@link Ext.ux.Wizard#showReview}
	 * 
	 * @return {Ext.data.SimpleStore} store used to show entry reviews
	 */
	getReviewStore: function(){
		var valuesObj = this.getValues(true);
		var stack = [];
		for(var prop in valuesObj){
		  	if(valuesObj.hasOwnProperty(prop)){
				if( typeof valuesObj[prop] === 'function' ){								
					continue;								
				}
		  		stack.push( [prop, valuesObj[prop]] );
		  	}
		}
		  
		return new Ext.data.SimpleStore({
            'id': 0,
			data : stack,
            fields: ['field', 'value']            
        });
	},
	
	/**
	 * @private
	 * @param {Object} index
	 */
	replay: function(index){
		if(this.fireEvent('beforereplay') !== false){			
			this.nextBtn.disable();	
			this.replayBtn.disable();			
			Ext.ux.BasicWizard.FINISH_MODE = Ext.ux.BasicWizard.REPLAY;
							
			this.onReplay(index);
			this.fireEvent('replay', index);			
		}			
	},
	
	/**
	 * Execute the replay of the wizard.
	 * Has to be explicitly called (unlike in superclass version),
	 * usually listening for, and handling the 'replay' event. E.g
	<pre><code>
	...
	listeners: {
		'replay': function(index){
			this.submit({
				success: function(){
					this.doReplay(index);
				}
			});
		}
	}
	</code></pre>
	 * or overriding {@link Ext.ux.Wizard#onReplay} in a subclass, E.g
	<pre><code>
	...
	onReplay: function(index){
		this.submit({
			success: function(){
				this.doReplay(index);
			}
		});
	}
	</code></pre>
	 * @param {Object} index Where we are replaying to
	 */
	doReplay: function(index){
		this.reset();
		Ext.ux.Wizard.superclass.doReplay.apply(this, arguments);		
	},
	
	/**
	 * @private
	 */
	help: function () {
		var activeCard = this.getActiveCard();
		this.onHelp(activeCard);
		this.fireEvent('help', activeCard);
	},
	
	/**
	 * Context (card) sensitive help handler
	 * @param {Ext.Panel} activeCard The currently active card
	 */
	onHelp: Ext.emptyFn
});

Ext.reg('wizard', Ext.ux.Wizard);

