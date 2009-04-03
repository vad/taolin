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
  * Ext.ux.fbk.sonet.GoogleWidget Extension Class
  *
  * @author  Marco Frassoni and Davide Setti
  * @version 1.0
  * @class Ext.ux.fbk.sonet.GoogleWidget
  * <p>A widget that improve the google search into taolin</p>
  * @note: this widget need a google key
*/

GoogleWidget = function(conf, panel_conf){
    Ext.apply(this, panel_conf);

    function GoogleOnLoad() {
      // Create a search control
      var searchControl = new google.search.SearchControl();
      var options_o = new google.search.SearcherOptions();
      var options_c = new google.search.SearcherOptions();

      // set results appearance
      searchControl.setResultSetSize(google.search.Search.SMALL_RESULTSET);
      options_o.setExpandMode(google.search.SearchControl.EXPAND_MODE_OPEN);
      options_c.setExpandMode(google.search.SearchControl.EXPAND_MODE_CLOSED);
      
      // Add in a full set of searchers
      searchControl.addSearcher(new google.search.WebSearch(), options_o);
      searchControl.addSearcher(new google.search.BookSearch(), options_c);
      searchControl.addSearcher(new google.search.PatentSearch(), options_c);
      
      // tell the searcher to draw itself and tell it where to attach
      searchControl.draw(document.getElementById("searchgoogle"));
    }
    
    google.load('search', '1.0', {callback:GoogleOnLoad});

    GoogleWidget.superclass.constructor.call(this, {
        html:'<div id="searchgoogle">Loading</div>'
        ,bodyStyle:'padding-left:5px;padding-right:5px;'
        ,autoHeight: true
        ,autoWidth: true
        ,defaults: { autoScroll: true }
        ,layout: 'fit'
    });
    
};

Ext.extend(GoogleWidget, Ext.Panel); 
