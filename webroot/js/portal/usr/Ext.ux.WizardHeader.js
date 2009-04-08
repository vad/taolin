Ext.namespace('Ext.ux');
/**
 *  Wizard header component
 * 
 * @author Charles Opute Odili (chalu)
 * @version 2.0
 * @licence GPLv3
 */

/**
 * @class Ext.ux.Wizard.Header
 * @extends Ext.BoxComponent
 *
 * @private
 * @constructor
 * @param {Object} config The config object 
 */ 
Ext.ux.WizardHeader = Ext.extend(Ext.BoxComponent, {
  
    /**
     * @cfg {Number} height The height of this component. Defaults to "55".
     */  
    height : 55, 
    
    /**
     * @cfg {String} region The Region of this component. Since a {@link Ext.ux.Wiz} 
     * usually uses a {@link Ext.layout.BorderLayout}, this property defaults to
     * "north". If you want to change this property, you should also change the appropriate
     * css-classes that are used for this component.
     */  
    region : 'north', 
     
    /**
     * @cfg {String} titleText The title that gets rendered in the head of the component. This
     * should be a text describing the purpose of the wizard.
     */  
    titleText : '', 
	
	titleImg: Ext.BLANK_IMAGE_URL,

    /**
     * @cfg {String} stepText The text in the header indicating the current process in the wizard.
     * (defaults to "Step {0} of {1}: {2}").
     * {0} is replaced with the index (+1) of the current card, {1} is replaced by the
     * total number of cards in the wizard and {2} is replaced with the title-property of the
     * {@link Ext.ux.Wizard.Card}
     * @type String
     */
    stepText : "Step {0} of {1} {2}",

    /**
     * @cfg {Object} autoEl The element markup used to render this component.
     */
	autoEl : {
		tag : 'div',
		cls	: 'x-wizard-header',
		children : [{
		  	tag : 'div',
			cls : 'x-wizard-header-title',
		  	children: [{
				tag : 'img',
				align: 'center',
                height : '40px'
			}, {
				tag : 'span',
				cls : 'x-wizard-header-title-txt'
			}]
		}, {
			tag : 'div',
			cls : 'x-wizard-header-step'
		}]
	},

    /**
     * Overrides parent implementation to render this component properly.
     */
	onRender : function (ct, position) {
		Ext.ux.WizardHeader.superclass.onRender.call(this, ct, position);
	
		this.stepTemplate = new Ext.Template(this.stepText);
		this.stepTemplate.compile();
	
	    var el = this.el.dom.firstChild;	    
		this.titleTxtEl = new Ext.Element(el.lastChild);
		this.stepEl = new Ext.Element(el.nextSibling);			
		this.titleImgEl = new Ext.Element(el.firstChild);	
		
		this.titleImgEl.dom.src = this.titleImg;
		this.titleTxtEl.update(this.titleText); 	
	},
  
    /**
     * Updates the header with the approppriate information,
     * such as the progress of the wizard (i.e. which card is being shown etc.)
     *
     * @param {Number} currentStep The index of the card currently shown in 
     * the wizard
     * @param {String} title The title-property of the {@link Ext.ux.Wiz.Card}
     *
     */
  	updateStep : function (currentStep, title) {
  		var html = this.stepTemplate.apply({
  			0 : currentStep+1, 
  			1 : this.steps, 
  			2 : title
  		});
  		
  		this.stepEl.update(html);		 
  	},
	
	addSteps : function (num){		
		this.steps = parseInt(this.steps, 10) + num;
	},
	
	setStepCount : function (count){		
		this.steps = count;
	}
});
