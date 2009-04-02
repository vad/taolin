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
<?php

uses('sanitize');

class WidgetsController extends AppController {

    var $name = 'Widgets';
    var $uses = array('Widget','User');
    
    function beforeFilter()
    {
        parent::beforeFilter();

        $this->checkSession();
        $this->mrClean = new Sanitize();
    }




    function listwidgets(){
        Configure::write('debug', '0');
        $this->layout = 'ajax';

        //TODO: write a function to do this (and that sanitizes)
        $formdata = $this->params['form'];
        $limit = 5;
        $start = 0;

        if(!empty($formdata['limit']))
            $limit = $formdata['limit'];
         
        if(!empty($formdata['start']))
            $start = $formdata['start'];

        $this->Widget->recursive = 0;
        $filter = array('enabled' => '1');
        $fields = array('id', 'name', 'description', 'screenshot', 'modified');

        $widgets = $this->Widget->find('all', array(
            'conditions' => $filter,
            'fields' => $fields, 
            'order' => 'modified DESC',
            'limit' => $limit,
            'page' => $start/$limit + 1
        ));
        $count = $this->Widget->find('count', array('conditions' => $filter));
        $widgets = Set::extract($widgets, '{n}.Widget');
        
        foreach ($widgets as &$widget) {
            $widget["popularity"] = rand(1,5); //((float)rand(2,10))/2;
        }
        $results['widgets'] = $widgets;
        $results['totalCount'] = $count;

        $this->set('result', $results);
    }

    
    function donothing($id, $action){
        Configure::write('debug', '0');
        $this->layout = 'ajax';
        
        $response = array();
        $response['success'] = true;
        $this->set('response', $response);
    }


    function getwidgetby(){
        Configure::write('debug', '0');
        $this->layout = 'ajax';

        $response['success'] = false;
        if(isset($this->params['form']['value']) && $this->params['form']['value'] != null){

            if($this->params['form']['type'] != null)
                $type = $this->params['form']['type'];
            else
                $type = 'id';

            $value = $this->params['form']['value'];

            $widget = $this->Widget->find('first', array(
                'conditions' => array($type => $value),
                'fields' => array('id', 'name', 'description', 'screenshot'),
                'recursive' => 0
            ));

            $response[] = $widget['Widget'];
            $response['success'] = true;
        }

        $this->set('json', $response);
    }
}
?>
