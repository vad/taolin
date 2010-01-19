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


/**
  * Ext.ux.fbk.sonet.Note Extension Class
  *
  * @author  Marco Frassoni and Davide Setti
  * @version 1.0
  * @class Ext.ux.fbk.sonet.Note
  * @constructor
  * @param {Ext.Panel} panel_conf Configuration options
  * @param {Object} conf Configuration options
**/  

/*
  * <p>Whit this widget a user can write a personal note</p>
  * <pre><code>
    This is a example of the json
    </code></pre>
*/

Note = function(conf, panel_conf){
    Ext.apply(this, panel_conf);

    var note_title = conf.title ? conf.title : 'Note';

    var note_background = conf.bgcolor;
    if (note_background.charAt(0) != '#')
        note_background = '#'+note_background;

    this.form = new Ext.form.FormPanel({
        autoHeight: true
        ,buttonAlign: 'center'
        ,cls:'note-widget'
        ,parent: this
        ,items: [
        {
            xtype: 'textarea'
            ,hideLabel: true
            ,cls:'note-text-area'
            ,ctCls:'note-text-container'
            ,name: 'text'
            ,emptyText: 'Write here your notes...'
            ,anchor: '0 15%'  // anchor width by percentage and height by raw adjustment
            ,grow:true
            ,value:conf.text
            ,enableKeyEvents:true
            ,style:'border:1px solid transparent' // avoid horizontal scrollbar
            ,listeners: {
                keyup: {
                    fn: function(t, e) {
                        var kc = e.keyCode;
                        
                        // these keys don't trigger any change: if the key pressed was one of them, stop here
                        if ((kc == e.ALT) || (kc == e.CTRL) || (kc == e.SHIFT) || (kc == 15) || (kc == e.UP) || (kc == e.DOWN) || (kc == e.LEFT) || (kc == e.RIGHT) || (kc == e.CAPS_LOCK) || (kc == e.HOME) || (kc == e.END) || (kc == 0))
                            return;
                        
                        /* // ESC cause problems with the chat
                        // save now if ESC was pressed
                        if (kc == e.ESC){
                            t.dTask.delay(0);
                            return true;
                        }
                        */

                        this.form.items.items[1].setText('Writing...');
                        t.dTask.delay(1000);
                    }
                    ,scope:this
                },
                beforerender: {
                    fn: function(t) {
                        t.dTask = new Ext.util.DelayedTask(this.form.saveText, this.form);
                    }
                    ,scope:this
                },
                render : {
                    fn: function(){
                        Ext.getCmp(panel_conf.portlet_id).setTitle(note_title);
                        if(note_background && note_background != '') {
                            $('#'+this.id+' .note-text-container').css('background',note_background);
                            
                            // font color
                            var b = note_background.getBrightness();
                            var note_foreground = (b > 127) ? 'black' : 'white';
                            $('#'+this.id+' .note-text-area').css('color', note_foreground);
                        }

                        var ta = this.form.items.first(); //this is a closure for the setTimeout
                        setTimeout(function(){ta.autoSize();}, 500);
                    },
                    scope: this
                }
            }
        },{
            xtype:'label'
            ,text:'Automatically save'
            ,style:'color:gray;'
        },{
            html:'<a href="javascript:Ext.getCmp(\''+this.getId()+'\').form.sendTo()" style="float:right">Email to</a>'
        }],
        saveText:function() {
            var text = this.items.items[0].getValue();
            this.items.items[1].setText('Saved.');
            this.parent.setPref('text', text);
        }
        ,sendTo:function() {

            var text = this.items.items[0].getValue();
            var prefix = "Hi all!\nI think that you may be interested in:\n\n";
            var logparams = '{"source": "note widget", "widget_id": "'+this.parent.portlet_id+'"}';
            new SendToWindow(prefix+text, null, logparams);
        }
    });

    Note.superclass.constructor.call(this, {
        items: this.form
        ,autoHeight: true
        ,autoWidth: true
        ,defaults: { autoScroll: true }
        ,layout: 'fit'
    });
    
};

Ext.extend(Note, Ext.Panel); 
