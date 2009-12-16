/**
 * This file is part of taolin project (http://taolin.fbk.eu)
 * Copyright (C) 2008, 2009 FBK Foundation, (http://www.fbk.eu)
 * Authors: SoNet Group (see AUTHORS.txt)
 *
 * This file is a modified version of a file of Ext JS Library 2.2.1
 * (see copyright below).
 * According to the Ext JS Library 2.2.1 license (see
 * http://extjs.com/license ), Ext JS Library 2.2.1 is double licensed.
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
 * Ext JS Library 2.2.1
 * Copyright(c) 2006-2009, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.DataView.LabelEditor = function(cfg, field){
    Ext.DataView.LabelEditor.superclass.constructor.call(this,
        field || new Ext.form.TextArea({
            allowBlank: false,
            growMin:90,
            anchor: '90%',
            growMax:240,
            grow:true,
            selectOnFocus:true
        }),cfg
    );
}

Ext.extend(Ext.DataView.LabelEditor, Ext.Editor, {
    alignment: "tl-tl",
    cls: "x-small-editor",
    shim: false,
    completeOnEnter: true,
    labelSelector: 'span.x-editable',

    init : function(view){
        this.view = view;
        view.on('render', this.initEditor, this);
        this.on('complete', this.onSave, this);
    },

    initEditor : function(){
        this.view.getEl().on('mousedown', this.onMouseDown, this, {delegate: this.labelSelector});
    },

    onMouseDown : function(e, target){
        if(!e.ctrlKey && !e.shiftKey){
            var item = this.view.findItemFromChild(target);
            e.stopEvent();

            var record = this.view.store.getAt(this.view.indexOf(item));
            var formattedString = record.data[this.dataIndex].replace(/(&#39;)/g,"\'");

            // Adjusting the size of the editor

            this.view.store.parent.formatText(record.id, true);

            width = $(target).width() + 20;
            height = $(target).height() + 20;
            this.setSize(width, height);

            this.startEdit(target, unescape(formattedString));
            this.activeRecord = record;

        }
        else
            e.preventDefault();
        
    },

    onSave : function(ed, value){
        this.activeRecord.set(this.dataIndex, value);
    }
});
