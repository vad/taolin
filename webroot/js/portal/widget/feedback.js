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
  * Ext.ux.fbk.sonet.Feedback Extension Class
  *
  * @author  Marco Frassoni and Davide Setti
  * @version 1.0
  * @class Ext.ux.fbk.sonet.Feedback
  * <p>With this widget a user can send a feedback to the sonet team</p>
  * <pre><code>
    This is a example of the json
    </code></pre>
*/

Feedback = function(conf, panel_conf){
    Ext.apply(this, panel_conf);

    this.form = new Ext.form.FormPanel({
        baseCls: 'feedback_widget'
        ,autoHeight: true
        ,bodyStyle:'padding:10px'
        ,buttonAlign: 'center'
        ,items: [
        {
            xtype: 'label',
            cls: 'feedback_label',
            text: "Your feedback is very important! Please write your suggestions (in Italian or English) here. Thanks!"
            ,anchor: '0 30%'  // anchor width by percentage and height by raw adjustment
        },{
            xtype: 'textarea',
            hideLabel: true,
            cls: 'feedback_text',
            grow: true,
            name: 'text'
            ,anchor: '0 50%'  // anchor width by percentage and height by raw adjustment
        }],

        buttons: [{
            text: 'Submit',
            handler: function(){
                
                var view = this.view;
                
                var sentText = this.form.items.items[1].getValue();

                this.form.getForm().submit(
                    {
                        url:'feedbacks/add',
                        waitMsg:'Saving Data...',
                        success: function(form,action){
                            Ext.example.msg('Sent, thanks for your message!', sentText);
                            form.reset();
                            if(!view.hidden) view.store.load();
                            reloadTimeline();
                        }
                    }
                );
                 
            },
            scope: this,
            formBind: true
        }
        /*,{
            text: 'Cancel'
        }*/
        ]
    });

    this.view = new Ext.DataView({
        tpl: new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="user-wrapper" style="background:{[xindex % 2 === 0 ? "white" : "#EEEEEE"]}">',
                    '<div>{[values.text.urlize().smilize()]}</div><br /><span style="color:#777777;">Left on {[Date.parseDate(values.created, "Y-m-d H:i:s").format("F j, Y")]}</span>',
                '</div>',
            '</tpl>'
        ),
        overClass:'searchusermouseoverbg',
	    itemSelector: 'span:first-child',
        hidden: true,
        loadingText: 'Loading feedbacks, please wait...',
	    store: new Ext.data.JsonStore({
            url: 'feedbacks/getuserfeedbacks',
            root: 'feedbacks',
            fields: ['text', 'created']
        })
    });

    this.viewFeedbacks = function(){

        if(this.view.hidden){
            this.view.store.load();
            Ext.get(this.view.id + '-img-view-detail').dom.src = 'js/portal/shared/icons/fam/arrow_down.png';
            Ext.get(this.view.id + '-view-detail').dom.innerHTML = 'Hide your 5 latest feedbacks';
            this.view.show();
        }
        else {
            Ext.get(this.view.id + '-img-view-detail').dom.src = 'js/portal/shared/icons/fam/arrow_right.png';
            Ext.get(this.view.id + '-view-detail').dom.innerHTML = 'See your 5 latest feedbacks';
            this.view.hide();
        }
    };

    Feedback.superclass.constructor.call(this, {
        autoHeight: true,
        autoWidth: true,
        defaults: { autoScroll: true },
        items: [{
            items: this.form
        },{
            style: 'padding:5px'
        },{
            html: '<div style="padding-left:15px;"><img id="'+this.view.id+'-img-view-detail" style="vertical-align:middle;" src="js/portal/shared/icons/fam/arrow_right.png" /> <span id="'+this.view.id+'-view-detail" onmouseover="this.style.textDecoration=\'underline\'; this.style.cursor=\'default\'" onmouseout="this.style.textDecoration=\'none\'" style="text-align:left;line-height:150%;font-size:100%;font-family:Verdana;" onclick="Ext.getCmp(\''+this.getId() +'\').viewFeedbacks()">See your 5 latest feedbacks</span></div>'
        },{
            style: 'padding:5px'
        },{
            items: this.view
        }]
        //,layout: 'fit'
    });
  
};

Ext.extend(Feedback, Ext.Panel); 
