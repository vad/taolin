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
    var $helpers = array('Html', 'Form');
    var $paginate = array(
        'limit' => 100,
        'order' => 'id'
    );
    
    function beforeFilter()
    {
        parent::beforeFilter();

        $this->checkSession();
        $this->san = new Sanitize();
    }


    function listwidgets(){
        Configure::write('debug', '0');
        $this->layout = 'ajax';

        //TODO: write a function to do this (and that sanitizes)
        $formdata = $this->params['form'];

        // pagination
        /*$limit = 5;
        $start = 0;

        if(!empty($formdata['limit']))
            $limit = $formdata['limit'];
         
        if(!empty($formdata['start']))
            $start = $formdata['start'];*/

        $this->Widget->recursive = 0;
        $filter = array('enabled' => '1');
        $fields = array('id', 'name', 'description', 'screenshot', 'modified');

        $widgets = $this->Widget->find('all', array(
            'conditions' => $filter
            ,'fields' => $fields 
            ,'order' => 'modified DESC'
            /*,'limit' => $limit
            ,'page' => $start/$limit + 1*/
        ));
        $count = $this->Widget->find('count', array('conditions' => $filter));
        $widgets = Set::extract($widgets, '{n}.Widget');
        
        foreach ($widgets as &$widget) {
            $widget["popularity"] = rand(1,5); //((float)rand(2,10))/2;
        }
        $results['widgets'] = $widgets;
        $results['totalCount'] = $count;

        $this->set('json', $results);
    }

    
    function donothing($id, $action){
        Configure::write('debug', '0');
        $this->layout = 'ajax';
        
        $response = array();
        $response['success'] = true;
        $this->set('json', $response);
    }


    function getwidgetby(){
        Configure::write('debug', '0');
        $this->layout = 'ajax';

        $response['success'] = false;

        $data = $this->params['url'];

        if(isset($data['value']) && $data['value'] != null){

            if($data['type'] != null)
                $type = $data['type'];
            else
                $type = 'id';

            $value = $data['value'];

            $widget = $this->Widget->find('first', array(
                'conditions' => array($type => $value),
                'fields' => array('id', 'name', 'description', 'screenshot'),
                'recursive' => 0
            ));

            $response['widget'] = $widget['Widget'];
            $response['success'] = true;
        }

        $this->set('json', $response);
    }

    
    /*****************************************************
     *****************************************************
     * ADMIN
     *****************************************************
     *****************************************************/

    function admin_index(){
        Configure::write('debug', '0');
        $this->layout = 'admin';
        
        $url = $this->params['url'];
        if (array_key_exists('q', $url) && $url['q']) { //check for a 'q' GET param
            $q = $url['q'];
            $this->paginate['conditions'] = array("name ILIKE '%$q%'");
            $this->set('query', $this->san->html($q));
        }

        $this->paginate['fields'] = array('id', 'name', 'enabled',
            'getWidgetCount(id) AS "Widget__count"');
        $this->paginate['order'] = array('Widget__count DESC');
        $res = $this->paginate();
        $this->set('widgets', $res);
    }
    
    
    function admin_activate($wid, $active = 1){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->Widget->save(array('id' => $wid, 'enabled' => $active));

        $referer = $this->params['url']['r'];

        if ($referer) {
            $this->Session->setFlash('Widget enable status changed.', 'admin_flash_message_success');
            $this->redirect($referer);
        }
    }
    
    function admin_add(){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax     
        $this->layout = 'admin';

        if (empty($this->data)) {
            $this->data = $this->Widget->create();
        } else {
            if ($this->Widget->save($this->data)) {
                $this->Session->setFlash('Widget created.', 'admin_flash_message_success');
                $this->redirect(array('action' => 'index'));
            } else {
                $this->Session->setFlash('Widget not created.', 'admin_flash_message_error');
                $this->redirect(array('action' => 'index'));
            }
        }
    }

    function admin_edit($wid){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax     
        $this->layout = 'admin';
        $this->recursive = -1;
        $this->Widget->id = $wid;

        if (empty($this->data)) {
            $this->data = $this->Widget->read();
        } else {
            if ($this->Widget->save($this->data)) {
                $this->Session->setFlash('Widget updated.', 'admin_flash_message_success');
                $this->redirect(array('action' => 'index'));
            } else {
                $this->Session->setFlash('Widget not updated.', 'admin_flash_message_error');
                $this->redirect(array('action' => 'index'));
            }

        }

    }
}
?>
