/**
 * @class Ext.ux.form.IconCombo
 * @extends Ext.form.ComboBox
 *
 * Adds icons on the left side of both the default combo textbox
 * and dropdown list. CSS classes to be used for these icons must
 * be in combo store to show up correctly.
 *
 * @author  Ing. Jozef SakÃ¡loÅ¡
 * @copyright (c) 2008, Ing. Jozef SakÃ¡loÅ¡
 * @version   1.0
 * @date      19. March 2008
 * @revision  $Id: Ext.ux.form.IconCombo.js 589 2009-02-21 23:30:18Z jozo $
 *
 * @license Ext.ux.form.IconCombo is licensed under the terms of
 * the Open Source LGPL 3.0 license.  Commercial use is permitted to the extent
 * that the code/component(s) do NOT become part of another Open Source or Commercially
 * licensed development library or toolkit without explicit permission.
 * 
 * 
 * License details: http://www.gnu.org/licenses/lgpl.html
 */

// Create user extensions namespace (Ext.ux)
Ext.namespace('Ext.ux');
 

Ext.ux.IconCombo = function(config) {
 
    // call parent constructor
    Ext.ux.IconCombo.superclass.constructor.call(this, config);
 
    this.tpl = config.tpl ||
          '<tpl for="."><div class="x-combo-list-item x-icon-combo-item {' 
        + this.iconClsField 
        + '}">{' 
        + this.displayField 
        + '}</div></tpl>'
    ;
 
} // end of Ext.ux.IconCombo constructor
 
// extend
Ext.extend(Ext.ux.IconCombo, Ext.form.ComboBox, {
 
    initFlags: function() {
        var wrap = this.el.up('div.x-form-field-wrap');
        this.wrap.applyStyles({position:'relative'});
        this.el.addClass('x-icon-combo-input');
        this.flag = Ext.DomHelper.append(wrap, {
            tag: 'div', style:'position:absolute'
        });
    },

    setIconCls: function() {
        var rec = this.store.query(this.valueField, this.getValue()).itemAt(0);
        if(rec) {
            this.flag.className = 'x-icon-combo-icon ' + rec.get(this.iconClsField);
        }
    },
 
    setValue: function(value) {
        Ext.ux.IconCombo.superclass.setValue.call(this, value);
        this.setIconCls();
    }
 
}); // end of extend
 
// end of file
