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
  * Ext.ux.fbk.sonet.Iframer Extension Class
  *
  * @author Paolo Massa
  * @version 1.0
  * @class Ext.ux.fbk.sonet.Iframer
  * <p>This widget can include any html resource as iframe</p>
  * <pre><code>
    This is a example of the json
    </code></pre>
*/

/**
 * @constructor
 * @param {Object} json the json description file
 */

Iframer = function(json){

    var correctHeight;
    
    //if the height is NOT passed, we use a default value of 266
    if(json.height) {
	    correctHeight=json.height;
    } else {
	    correctHeight=266;
    }
    
    Iframer.superclass.constructor.call(this, {
        autoHeight: true,
        autoScroll: true,
        defaults: {
            autoScroll: true
        },
        html: '<iframe style="border: none;" src="'+json.iframe_src_url+'" width="100%" height="'+correctHeight+'" ></iframe>'
    });
    
    /** We cannot change the height on the fly using onload and a javascript function because at run time 
     *  we cannot access contentWindow.document.body of the contained src. We can do it only if the parent document and the iframe 
     *  are in the same domain (more precisely, the scheme, hostname and port match). Otherwise the JavaScript code throws an exception: 
     *  "Permission denied to get property HTMLDocument.body". 
     *  See for example http://www.mattcutts.com/blog/iframe-height-scrollbar-example/
     *  So we ask the json to pass the height, that's easy.
     *  A solution [http://www.surveygizmo.com/forum/?forum=3&topic=836 here] but you must be able to injext a script tag inside the <iframe> document 
     */
}

Ext.extend(Iframer, Ext.Panel); 
