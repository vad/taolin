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

function openFirstLoginWizard(){
    var win_size = getBodySize(9/10)
    ,win = new Ext.Window({
        id: 'wizard',
        layout:'fit'
        ,width: win_size[0]
        ,modal: true
        ,shadow: 'frame'
        ,constrain: true
        ,height: win_size[1]
        ,center: true
        ,title: 'Wizard window'
        ,closable: false
        ,items: {
            xtype: 'basicwizard'
            ,id: 'first_login_wizard'
            ,backBtnText: 'Previous'
            ,endBtnText: 'Finish'
            ,listeners: {
                beforenav: function(dir, index){
                    
                    if ((dir == 1) && (!('next' in this) || (this.next == 0))){ // moving from card 0 to 1
                        var cb = Ext.getCmp('privacy_policy_agreement_checkbox');
                        
                        if (!cb.checked) {
                            alert("In order to proceed you have to accept the privacy policy. If you find any problem with it, please contact Human Resources. Otherwise please check the checkbox below near 'I read and accept the provacy policy' and then click the 'Continue' button. Thanks!");
                            return false;
                        }
                    }   
                    else if ((dir == 1) && (this.next == 1)){ // moving from card 1 to 2

                        var wizard_form = this.getCard(1).items.first().getForm();
                        
                        if(!wizard_form.isValid()){ // if validation of form fields fails
                            alert('Before going on with the wizard, please complete this page in its mandatory fields and checking for any inconstency');
                            return false;
                        }

                    }

                }
                ,beforefinish: function(){

                    var wizard_form = this.getCard(1).items.first().getForm();

                    if(wizard_form){ 
                       
                        wizard_form.submit({ // submitting form 
                            success: function(){
                                eventManager.fireEvent('newtimelineevent');
                                showUserInfo(null, true); // reload user info
                                Ext.getCmp('settings').items.first().form.load(); // reload user settings
                            }
                            ,scope: this
                        });

                    }
                    
                    // User ends the initial wizard. Save this in the db
                    Ext.Ajax.request({
                        url: 'users/setprivacypolicyacceptance',
                        params: {accepted: '1'},
                        method: 'POST',
                        success: function(){
                            this.ownerCt.close(); // close wizard window
                        }
                        ,failure: function(){
                            this.ownerCt.close(); // close wizard window
                        }
                        ,scope: this
                    });
               
                }
            }
            ,onEsc: Ext.emptyFn
            ,animate: false
            ,headerConfig: {
                titleText: 'First login wizard'
                ,titleImg: 'img/wizard-wand.jpg'
            }
            ,items: [{
                index: 0
                ,trailText: 'Privacy policy'
                ,items: [
                    {
                        autoLoad: './pages/privacy_policy'
                        ,style: 'font-size: 120%;border: 1px solid'
                        ,border: false
                        ,height: win_size[1] - 180
                        ,autoScroll:true
                    }
                    ,new Ext.form.FormPanel({
                        border: false,
                        bodyStyle:'padding: 20px 0 0 10px;'
                        ,cls: 'form_settings'
                        ,items: [{
                            id: 'privacy_policy_agreement_checkbox',
                            xtype:'checkbox',
                            hideLabel: true,
                            boxLabel: 'I read and accept the privacy policy',
                            name: 'privacy_policy_agreement',
                            value: false
                        }]
                    })
                ]
            },{ 
                index: 1
                ,trailText: 'Edit your settings!'
                ,items: new Ext.ux.fbk.sonet.WizardSettings()
            },{     
                index: 2
                ,trailText: 'Further information about '+config.appname+'!'
                ,items: 
                    {
                        autoLoad: './pages/welcome_wizard_last_step'
                        ,style: 'font-size: 120%;'
                        ,border: false
                    }
            }]
        }
    });                                 
    win.show();
}
