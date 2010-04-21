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

// FROM:
//  http://www.extjs.com/forum/showthread.php?31093-GridPanel-maxHeight
Ext.grid.GridView.override({
    layout : function(){
        if(!this.mainBody){
            return; // not rendered
        }
        var g = this.grid;
        var c = g.getGridEl();
        var csize = c.getSize(true);
        var vw = csize.width;

        if(vw < 20 || csize.height < 20){ // display: none?
            return;
        }

        if(g.autoHeight){        
            if (g.maxHeight) {
                var hdHeight = this.mainHd.getHeight();
                var vh = Math.min(csize.height, g.maxHeight);
                this.el.setSize(csize.width, vh);    
                this.scroller.setSize(vw, vh - hdHeight);            
            } else {
                this.scroller.dom.style.overflow = 'visible';
                if(Ext.isWebKit){
                    this.scroller.dom.style.position = 'static';
                }
            }
        }else{
            this.el.setSize(csize.width, csize.height);

            var hdHeight = this.mainHd.getHeight();
            var vh = csize.height - (hdHeight);

            this.scroller.setSize(vw, vh);
            if(this.innerHd){
                this.innerHd.style.width = (vw)+'px';
            }
        }
        if(this.forceFit){
            if(this.lastViewWidth != vw){
                this.fitColumns(false, false);
                this.lastViewWidth = vw;
            }
        }else {
            this.autoExpand();
            this.syncHeaderScroll();
        }
        this.onLayout(vw, vh);
    }
}); 


/* Override needed to solve a bug in ExtJs 3.2.0
 * Should be fixed in Extjs 3.2.1
 * see: http://www.extjs.com/forum/showthread.php?95964-OPEN-814-3.2-allowblank-not-allowing-empty-field-%28if-other-validation-required%29/page2
 */
Ext.override(Ext.form.TextField, {
    getErrors: function(value) {
        var errors = Ext.form.TextField.superclass.getErrors.apply(this, arguments);

        value = value || this.processValue(this.getRawValue());

        if (Ext.isFunction(this.validator)) {
            var msg = this.validator(value);
            if (msg !== true) {
                errors.push(msg);
            }
        }

        if (value.length < 1 || value === this.emptyText) {
            if (this.allowBlank) {
                //if value is blank and allowBlank is true, there cannot be any additional errors
                return errors;
            } else {
                errors.push(this.blankText);
            }
        }
    
        if (!this.allowBlank && (value.length < 1 || value === this.emptyText)) { // if it's blank
            errors.push(this.blankText);
        }

        if (value.length < this.minLength) {
            errors.push(String.format(this.minLengthText, this.minLength));
        }

        if (value.length > this.maxLength) {
            errors.push(String.format(this.maxLengthText, this.maxLength));
        }

        if (this.vtype) {
            var vt = Ext.form.VTypes;
            if(!vt[this.vtype](value, this)){
                errors.push(this.vtypeText || vt[this.vtype +'Text']);
            }
        }

        if (this.regex && !this.regex.test(value)) {
            errors.push(this.regexText);
        }

        return errors;
    }
});
