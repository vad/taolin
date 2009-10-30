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
  * Ext.ux.fbk.sonet.EventManager Extension Class
  *
  * @author  Marco Frassoni and Davide Setti
  * @version 1.0
  * @class Ext.ux.fbk.sonet.EventManager
  * @constructor
**/

/*
  * <p>Extends the common interface provided by ExtJs (Ext.util.Observable) to fire events</p>
  * <pre><code>
    var eventManager = new Ext.ux.fbk.sonet.EventManager({
        name: 'example'
        ,events:{
            'open': true
            ,'quit': true
        }
        ,listeners:{
            open: function(){
                // By default, "this" will be the object that fired the event.
                alert('Opening: ' + this.name);
            }
            ,quit: function(){
                alert('Bye bye!');
            }
        }
    });
    </code></pre>
*/

Ext.ns( 'Ext.ux.fbk.sonet' );

Ext.ux.fbk.sonet.EventManager = Ext.extend(Ext.util.Observable, {
    name: "eventmanager"

    ,constructor: function(config){
        Ext.apply(this, config);

        this.addEvents(config.events);

        this.listeners = config.listeners;

        // Call our superclass constructor to complete construction process.
        Ext.ux.fbk.sonet.EventManager.superclass.constructor.call(this);
    }
});
