Ext.namespace('Ext.ux');
/**
 *  Wizard west region component
 * 
 * @author Charles Opute Odili (chalu)
 * @version 2.0
 * @licence GPLv3
 */

/**
 * @class Ext.ux.WizardWest
 * @extends Ext.Container
 *
 * @private
 * @constructor
 * @param {Object} config The config object 
 */ 
Ext.ux.WizardWest = Ext.extend(Ext.Container, {
	width: 0,
	
	autoEl: {
		tag: 'div'
	},
	
	style: 'padding-top:20px',
	
	layout: 'table',
	
	layoutConfig: {
		columns: 1
	},
	
	defaults: {
		style: 'padding:5px 7px'
	},
	
	images: [],
	
	initComponent: function(){
		var images = [];
		Ext.each(this.images, function(img){
			images.push( new Ext.ux.Image({src:img, disabled: true}) );
		}, this);

		Ext.apply(this, {items: images});
		Ext.ux.WizardWest.superclass.initComponent.apply(this, arguments);
	},
	
	/**
     * Updates the west region with the approppriate information,
     * by highlighting the image corresponding to the step been observed.
     *
     * @param {Number} currentStep The index of the card currently shown in 
     * the wizard
     */
  	updateStep: function (currentStep) {
		var items = this.items;
		var currentItem = items.itemAt(currentStep);
		if(currentItem && items.getCount() >= 1){
			currentItem.enable();		
			items.each(function(item){
				if(currentItem !== item){
					item.disable();
				}			
			});			
		}			
  	}
});
