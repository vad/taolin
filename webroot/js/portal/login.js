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

Ext.onReady(function(){

    Ext.QuickTips.init();
    // message target    
    Ext.form.Field.prototype.msgTarget = "side";

    /*
    layout:'ux.center',
    items: {
        width: '100%'
        }
    */
    var login_form = new Ext.FormPanel({
        title: 'Login',
        id: 'login_form',
        width: 300,
        height: 150,
        frame: true,
        defaultType: 'textfield',
        bodyStyle: 'padding: 20px 0px 0px 0px',
        collapsible: false,
        items:[{
            fieldLabel: 'Username',
            name: 'username',
            inputType: 'text',
            //allowBlank: false,            //simple validation
            autoCreate:{tag: "input", type: "text", size: "20", autocomplete: "on"},
            id: 'campouser' 
        },{
            fieldLabel: 'Password',
            name: 'password',
            //allowBlank: false,           //simple validation
            inputType: 'password',
            autoCreate:{tag: "input", type: "password", size: "20", autocomplete: "on"},
            id: 'campopass'
        }],
        buttons: [{
            id: 'login_button',
            text: 'Login',
            handler: function(){ performLogin(login_form); }
         },{
            text: 'Cancel',
            handler: function() {
                login_form.form.reset();
            }
         }],
        submit: function(){
            this.getEl().dom.setAttribute('action', '.');
            this.getForm().getEl().dom.submit();
        },
        onSubmit: Ext.emptyFn
      });

    login_form.render('login-form');
    Ext.get('campouser').focus();

    var map = new Ext.KeyMap("login_form", {
        key: 13,
        fn: function(){ performLogin(login_form); },
        scope: login_form
    }); 

})

