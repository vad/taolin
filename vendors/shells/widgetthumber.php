<?php
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
?>
<?
class WidgetThumberShell extends Shell {
    var $uses = array('Widget');
    
    function main() {

        $total = 0;

        $widget_format = array(
                array(
                    'width' => 300,
                    'height' => 300
                ),
                array(
                    'width' => 40,
                    'height' => 40
                ),
                array(
                    'width' => 140,
                    'height' => 140
                )

            );

        // Importing components to be used
        App::import('Component','Thumber');
        $this->Thumber = new ThumberComponent(null);
        
        App::import('Component','PhotoUtil');
        $this->Thumber->PhotoUtil = new PhotoUtilComponent(null);
        
        //Get widget screenshots
        $widgets = $this->Widget->find('all', array(
                    'conditions'=>array(
                        'screenshot IS NOT NULL',
                        'screenshot != \'\''
                    ), 
                    'fields'=>array(
                        'id','screenshot'

                    ),
                    'recursive'=> -1)
                );

        foreach($widgets as $widget) {
            $sc = $widget['Widget']['screenshot'];

            $screenshot = substr(strrchr($sc, '/'), 1);
            $wp = substr($sc, 0, - mb_strlen($screenshot));

            if ( $wp == 'img/widget/' )
                $widget_path = 'webroot/img/widget/';
            else
                $widget_path = "plugins/".substr($wp, 0, - mb_strlen(strstr($wp, '/')))."/vendors".strstr($wp, '/');

            //$this->out($widget_path.$screenshot);

            if($this->Thumber->createthumb($screenshot, $widget_path, true, $widget_format, 9, false))
                $this->out("Thumb for ".$widget_path.$screenshot." created");
                $total += 1;
        }

        //Print out total
        if($total > 0)
            $this->out("Created $total thumb");
    }
}
?>
