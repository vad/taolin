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
  * Ext.ux.fbk.sonet.XTemplate Extension Class
  *
  * @author  Marco Frassoni and Davide Setti
  * @version 1.0
  * @class Ext.ux.fbk.sonet.XTemplate
  * @constructor
**/


Ext.ns( 'Ext.ux.fbk.sonet' );

Ext.ux.fbk.sonet.XTemplate = Ext.extend(Ext.XTemplate, {

    constructor: function(){
        Ext.ux.fbk.sonet.XTemplate.superclass.constructor.apply(this, arguments);
    }

    // Returns true if the owner of the timeline's event is the user
    ,isOwner: function(u_id){
        return window.user.id === u_id;
    }

    ,formatEventDate: function(eventDate, printHours){
        
        // Formatting Date object in order to compare it
        formattedEventDate = eventDate.toDateString();

        var today = new Date(), yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        // Comparing Date
        if(formattedEventDate == today.toDateString()){
            if(printHours){
                var diff = Math.ceil((today.getTime()-eventDate.getTime())/(1000*60));
                return ((diff < 59) ? Ext.util.Format.plural(diff, "minute") : Ext.util.Format.plural(Math.floor(diff/60), "hour")) + " ago" ;
            } 
            else return 'Today';
        }
        else if(formattedEventDate == yesterday.toDateString())
            return printHours ? 'Yesterday at ' + eventDate.format('H:i') : 'Yesterday';
        else
            return printHours ? eventDate.format('F, d \\a\\t H:i') : eventDate.format('F, d Y');
    }

    // Substitution of photo's filename extension to .jpg (since all the thumb are saved as .jpg)
    ,photoExtToJpg: function(screenshot){
        return Ext.util.Format.substr(screenshot, 0, screenshot.lastIndexOf(".")) + '.jpg'; 
    }

});
