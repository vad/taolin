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
  * Ext.ux.fbk.sonet.HtmlIncluder Extension Class
  *
  * @author  Marco Frassoni and Davide Setti
  * @version 1.0
  * @class Ext.ux.fbk.sonet.HtmlIncluder
  * <p>A simple widget to include HTML code</p>
  * <pre><code>
    This is a example of the json
    </code></pre>
*/


HtmlIncluder = function(json){

    HtmlIncluder.superclass.constructor.call(this, {
        autoHeight: true,
        defaults: { autoScroll: true },
        bodyStyle: 'padding:4px',
        autoLoad: json.url
    });
};

Ext.extend(HtmlIncluder, Ext.Panel); 

