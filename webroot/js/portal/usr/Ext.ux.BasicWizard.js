Ext.namespace('Ext.ux');
/**
 * Wizard foundation, handles navigtion, core events, workflow etc
 * 
 * @author Charles Opute Odili (chalu)
 * @version 2.0
 * @licence GPLv3
 */

/**
 * Basic cardLayout implementation for wizards,
 * 
 * @class Ext.ux.BasicWizard
 * @extend Ext.Panel
 * 
 * @requires SlickCardLayout: {@link http://extjs.com/forum/showthread.php?t=15299}
 * @requires ToolbarLayout : {@link http://extjs.com/forum/showthread.php?t=26480}
 *
 * @constructor
 * @param {Object} config The config object 
 */ 
Ext.ux.BasicWizard = Ext.extend(Ext.Panel, {
	
	/**
	 * @cfg {String} backBtnText
	 * Label text for the back navigation button, default is 'Back'
	 */
	backBtnText: 'Back',
	
	/**
	 * @cfg {String} nextBtnText
	 * Label text for the foward navigation button, default is 'Continue'
	 */
	nextBtnText: 'Continue',
	
	/**
	 * @cfg {String} endBtnText
	 * Label text for the foward navigation button on the last page / view, defaults 'Finish'
	 */
	endBtnText: 'Finish',
	
	/**
	 * @cfg {Boolean} animate
	 * If to animate the navigation, default is true
	 */
	animate: true,
	
	/**
	 * @cfg {Boolean} frame
	 * true to frame the wizard, false otherwise. Default is false
	 */
	frame: false,
	
	/**
	 * @cfg {Boolean} useTrail
	 * true to enable display of step trails, false otherwise. Default is true
	 */
	useTrail: true,	
	
	/**
	 * @cfg {Object} headerConfig A config-object to use with {@link Ext.ux.WizardHeader}.
	 * If not present, it defaults to an empty object. 
	 * Valid params are <code>titleText</code> for the wizard title, <code>titleImg</code> for a corresponding title image
	 */
	headerConfig : {},	
	
	/**
	 * @cfg {Number} replayTo
	 * index to replay the wizard from (after finishsuccess)
	 */
	replayTo: null,
	
	/**
	 * @cfg {String} replayBtnTxt
	 * text for the replay button
	 */
	replayBtnTxt: 'Replay',
	
	/**
	 * @cfg {Number} activeIndex The 0 - based card index to start the wizard with, default is 0
	 */
	activeIndex: 0,
	
	/**
	 * @cfg {String} toolbarLocation
	 * Where to place the navigation-buttons toolbar, valid options are 'bottom' or 'top'.
	 * Default is 'bottom'
	 */
	toolbarLocation: 'bottom',
	
	/**
     * Inits this component with the specified config-properties and automatically
     * creates its components.
     */
	initComponent: function(){
		this.cards = this.initCards(this.items);
		this.cardCount = this.cards.items.length;		
		
		
        this.headComp = new Ext.ux.WizardHeader(Ext.apply(this.headerConfig, {
            steps : this.cardCount
        }));				
		
		Ext.apply(this, {
			layout: 'border',
			defaults: {border: false},
		    items: [this.headComp, this.cards]
		});								
				
		var tBar = new Ext.Toolbar();
		if(this.toolbarLocation === 'top'){
			this.tbar = tBar;
		}else if(this.toolbarLocation === 'bottom'){
			this.bbar = tBar;
		}
			
		Ext.ux.BasicWizard.superclass.initComponent.apply(this, arguments);
		Ext.ux.BasicWizard.FINISH = 0;
		Ext.ux.BasicWizard.REPLAY = 1;
		Ext.ux.BasicWizard.FINISH_MODE = -1;
		
		this.addEvents(
			/**
        	 * @event finish Fires after the last card in the navigation is reached
        	 */
			'finish',
			
			/**
			 * @event Fires after 'replay' action is triggered
			 * @param {Number} index  Where we are replaying to
			 */
			 'replay',
			 
			 /**
			  * @event navigate Fires when a navigation occurs, if the beforenav event is not aborted
			  * @param {Number} dir The navigation direction. bact => -1, next => 1
			  * @param {Number} index Where to navigate to
			  */
			 'navigate',
			 
			 /**
			  * @event beforenav Fires before a navigation is attempted, 
			  * return false if you wish to cancel the navigation.
			  * @param {Number} dir The navigation direction. bact => -1, next => 1
			  * @param {Number} index Where to navigate to
			  */
			 'beforenav',
			 
			 /**
			  * @event afternav Fires after a navigation has been handled
			  * @param {Number} dir The navigation direction. bact => -1, next => 1
			  */
			 'afternav',
			 
			 /**
			  * @event beforefinish
			  * Fires before a finish action is initiated, return false to calcel the prcessing
			  */
			 'beforefinish',
			 
			 /**
			  * @event beforereplay
			  * Fires before the replay action is processed, return false to calcel the prcessing
			  */
			 'beforereplay'			 			 
		);
		
	},
	
	/**
	 * @private
	 * @param {Object} pages
	 */
	initCards: function(pages){
		return new Ext.Container({
			autoEl: {
				tag : 'div'
			},
			layout: this.animate ? 'slickcard' : 'card',
			activeItem: this.activeIndex,
			region: 'center',			
			hideBorders: true,
			defaults: {	
				frame: this.frame,
				autoScroll: true,
				bodyStyle: 'padding:15px'
			},
			items: this.itemsInit(pages)
		});
	},
	
	/**
	 * @private
	 * @param {Object} pages
	 */
	itemsInit: function(pages){
		var stack = [];
		if(pages){
			Ext.each(pages, function(page){		
				var oConfig = this.buildPage(page);
				// BoxComponent or Conatainer if possible
		        stack.push(new Ext.Panel(oConfig));
			}, this);
		}	
		
		if(stack.length >= 1){
			return stack;
		}else{
			return {};
		}
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
			}																	
		}		
		return config;
	},
	
	/**
	 * @private
	 * @param {Object} item
	 */
	buildPlugins: function(item){
		var plugins = item.plugins;
		if( !Ext.isEmpty(plugins) ){        	
			delete item.plugins;
        	var stack = [];
    		Ext.each(plugins, function(plugin){
				if( typeof plugin.init !== 'function' ){
					stack.push( Ext.ComponentMgr.create(plugin) );
				}
    		});
			item.plugins = stack;
        }
	},
	
	/**
     * Renders the wizard within it's container
     */
	onRender: function(){
		Ext.ux.BasicWizard.superclass.onRender.apply(this, arguments);				
		
		this.backBtn = new Ext.Toolbar.Button({
			disabled: true,
			id: 'move-page-back',
			text: this.backBtnText || 'Back',
			handler: this.navigate.createDelegate(this, [-1])
		});
		
		this.nextBtn = new Ext.Toolbar.Button({
			disabled: true,
			id: 'move-page-next',
			text: this.nextBtnText || 'Continue',
			handler: this.navigate.createDelegate(this, [1])
		});		
		
		if(this.replayTo !== null && (typeof this.replayTo === 'number')){
			this.replayBtn = new Ext.Toolbar.Button({
				disabled: true,
				id: 'replay-wiz',
				text: this.replayBtnTxt,
				handler: this.replay.createDelegate(this, [this.replayTo])
			});
		}
		
		this.buildToolbar();				
	},
	
	/**
	 * Start the wizard after it is rendered
	 */
	afterRender: function() {
		Ext.ux.BasicWizard.superclass.afterRender.apply(this, arguments);
		this.start(this.activeIndex);
	},
	
	/**
	 * Updates the step / trail information
	 * @param {Ext.Container} activeCard the currently active card
	 */
	updateTrails: function(activeCard){
		if(this.useTrail === true){
			var trailText = (activeCard.title || activeCard.trailText);
			trailText = trailText ? ' - ' + trailText : '';				
			this.headComp.updateStep(this.next || this.activeIndex, trailText);
		}
	},
	
	/**
	 * @private
	 * @param {Object} index
	 */
	start: function(index){
		this.backBtn.setDisabled( index === 0 );		
		this.nextBtn.setText(this.nextBtnText);
		this.nextBtn.setDisabled( (this.cardCount > 1) ? false : true );
		if(this.replayBtn){
			this.replayBtn.disable();
		}
		
		new Ext.util.DelayedTask().delay(500, function(){
			this.updateTrails(this.getActiveCard());
		}, this);
	},
	
	/**
	 * Returns the navigatin toolbar, which may be a top or a bottom toolbar (tbar || bbar)
	 * depending on the value of {@link Ext.ux.BasicWizard#toolbarLocation}
	 * 
	 * @return {Ext.Toolbar} Navigation toolbar
	 */
	getToolbar: function(){
		var tbar = (!this.getBottomToolbar()) ? this.getTopToolbar() : this.getBottomToolbar();
		return tbar;
	},
	
	/**
	 * @private
	 */
	buildToolbar: function(){
		var tbar = this.getToolbar();
		tbar.add('->', this.backBtn, '', '-', '', this.nextBtn, this.replayBtn || '');
		tbar.doLayout();
	},
	
	/**
	 * Return the card at the specified index or the currently active card
	 * if the index param is not given.
	 * @param (String/Number) index Optional query index
	 * 
	 * @return {Ext.Container} The requested card
	 */
	getCard: function(index){
		var layout = this.cards.getLayout();
		if( Ext.isEmpty(index) ){
			return layout.activeItem;			
		}		
		return layout.container.getComponent(index);
	},
	
	/**
	 * Returns the currently active card
	 * 
	 * @return {Ext.Container} The currently active card
	 */
	getActiveCard: function(){
	    return this.getCard();
	},
	
	/**
	 * Calculate the next navigation step based on where we are now or the specified index
	 * @param {String/Number} index Optional index to calculate with
	 * 
	 * @return {Number} position of the next card.
	 */
	getNext: function(index){
		if( Ext.isEmpty(index) ){
			var pageIndex = this.getActiveCard().index;
			if(Ext.isEmpty(pageIndex)  || isNaN(pageIndex)){
				throw this.getXType() + " requires 'pages' to have a numeric index property. User provided : " + pageIndex;
			}
			return parseInt(pageIndex, 10) + this.dir;			
		}else{
			// we are doing a replay!
			return parseInt(index, 10);
		}			
	},
	
	/**
	 * See if there is a card to navigate to, based on where we are
	 * now and our navigation direction.
	 * 
	 * @return {Boolean} true if a 'next card' exist, else false
	 */
	hasNext: function(){
		var next = this.getCard(this.getNext());
		if( Ext.isEmpty(next)){
			return false;
		}
		return true;
	},
	
	/**
	 * @private
	 */
	moveNext: function(){
		var layout = this.cards.getLayout();
		layout.setActiveItem(this.next);
		var activeCard = layout.activeItem;
		activeCard.doLayout();
		
		this.updateTrails(activeCard);						
		this.fireEvent('afternav', this.dir);
	},
	
	/**
	 * @private
	 * @param {Object} dir
	 * @param {Object} index
	 */
	navigate: function(dir, index){
		this.dir = dir;							
		if(this.fireEvent('beforenav', dir, index) !== false){
			this.onNavigate(index);
			this.fireEvent('navigate', dir, index);
		}
	},
	
	/**
	 * Navigate to the appropriate card. If index is provided (usually during replay),
	 * then take us to the card at that index.
	 * @param {String/Number} index Optional index to navigate to
	 */
	onNavigate: function(index){
		var nextBtn = this.nextBtn;
		var backBtn = this.backBtn;
		var replayBtn = this.replayBtn;
		
		this.next = this.getNext(index);
		backBtn.setDisabled(this.next === 0);	   

        if(this.dir !== 1){
        	// a back navigation was isssued
        	this.moveNext();
        	if(nextBtn.disabled && (this.next === this.cardCount - 2)){
        		// executed when a back navigation is initiated after the last page
	        	// is reached, so we turn it back on and reset it's label.	        		
	        	nextBtn.enable();
        	} else {
				if(replayBtn && !replayBtn.disabled){
					replayBtn.disable();
				}
        		if((this.endBtnText != this.nextBtnText) && (nextBtn.getText() == this.endBtnText)){
        			nextBtn.setText(this.nextBtnText);
        		}
        	}
        } else if(this.next == this.cardCount - 1){
        	nextBtn.setText(this.endBtnText);
			if(replayBtn){
				replayBtn.enable();
			}
        	this.moveNext();        		        
        } else if(this.next == this.cardCount){	        	
	       	this.finish();
        } else {
        	// just move on
        	this.moveNext();
        }        
	},
		
	/**
	 * @private
	 */
	finish: function(){
		if(this.fireEvent('beforefinish') !== false){
			// you are done and want to move on to
			// more important things :)
			this.nextBtn.disable();	
			if(this.replayBtn){
				this.replayBtn.disable();
			}
			
			Ext.ux.BasicWizard.FINISH_MODE = Ext.ux.BasicWizard.FINISH;
			this.onFinish();
			this.fireEvent('finish');			
		}
	},
	
	/**
	  Called when the next-button is click after reaching the last card.
	 * Implementations can close the wizard window here.
	 */
	onFinish: Ext.emptyFn,
	
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
			this.doReplay(index);
			this.fireEvent('replay', index);			
		}			
	},
	
	/**
	 * Ectivate the replay of the wizard
	 * @param {Object} index Where we are replaying to
	 */
	doReplay: function(index){
		this.start(index);	
		this.navigate(1, index);
	},
	
	onReplay: Ext.emptyFn
	
});

Ext.reg('basicwizard', Ext.ux.BasicWizard);
