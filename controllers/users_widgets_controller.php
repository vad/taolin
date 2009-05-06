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

class UsersWidgetsController extends AppController {
    var $name = 'UsersWidgets';

    function beforeFilter()
    {
        parent::beforeFilter();

        $this->checkSession();
        $this->mrClean = new Sanitize();
    }


    function getinitialconfig(){

        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';
        
        $u_id = $this->Session->read('id');

        $response['config']['addtomail'] = Configure::read('App.addtomail');
        $response['config']['appname'] = Configure::read('App.name');
        $response['config']['contactus'] = Configure::read('App.contactus');
        $response['config']['defaultgroupname'] = Configure::read('App.defaultgroupname');
        $response['config']['img_path'] = Configure::read('App.imagefolder.web_path');
        $response['config']['jabber_server'] = Configure::read('App.jabber.server');
        $response['config']['jabber_domain'] = Configure::read('App.jabber.domain');
        $response['config']['logo'] = Configure::read('App.logo.url');

        $response['success'] = true;
        
        $this->set('json', $response);
        
    }


    function getwidgetsposition($uw_id=''){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';
        
        $u_id = $this->Session->read('id');
        
        $response = $this->UsersWidget->getwidgetsposition($u_id, $uw_id);

        // merge global level and user level configurations (higher priority to the user's ones)
        $widgets = array();
        foreach($response as $widget) {
            // decode confs, encoded as JSON in DB
            $w_app_conf = json_decode($widget['Widget']['application_conf'], TRUE);
            $w_widget_conf = json_decode($widget['Widget']['widget_conf'], TRUE);
            $user_params = json_decode($widget['Widget']['user_params'], TRUE);

            $uw_widget_conf = json_decode($widget['UsersWidget']['widget_conf'], TRUE);
            $uw_app_conf = json_decode($widget['UsersWidget']['application_conf'], TRUE);

            //these MUST be arrays!
            if (!$uw_widget_conf)
                $uw_widget_conf = array();
            if (!$uw_app_conf)
                $uw_app_conf = array();

            $widget_conf = array_merge($w_widget_conf, $uw_widget_conf);
            $app_conf = array_merge($w_app_conf, $uw_app_conf);
            // the next merge is only to give back a better json
            $tmp = array_merge($widget['Widget'], $widget['UsersWidget']);

            // now put the merged confs into the array
            $tmp['widget_conf'] = $widget_conf;
            $tmp['application_conf'] = $app_conf;
            $tmp['user_params'] = $user_params;
            
            $widgets[] = $tmp;
        }
        $json['widgets'] = $widgets;

        $this->set('json', $json);
        return $widgets;
    }
    
    
    function movewidgets($str){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';

        $col = "0";
        $pos = -1;
        
        $u_id = $this->Session->read('id');

        $tok = strtok($str, "_");

        while ($tok) {
            list($w_id, $column) = split('[-]', $tok);
            if($column > $col) $pos = 0;
            else $pos = $pos + 1;
            $col = $column;
            $this->UsersWidget->movewidgets($w_id, $u_id, $col, $pos);
            $tok = strtok("_");
        }

        $this->set('json', "Go!");
    }

    
    function collapsewidget($uw_id, $type)
    {
        Configure::write('debug', '0');
        $this->layout = 'ajax';
        
        if(empty($uw_id))
            die('Are you trying to hack our site?');
        
        $user_id = $this->Session->read('id');

        // id in table users_widgets
        $uw_id = $this->mrClean->paranoid($uw_id);
       
        //now we have the users_widgets id, we need widgets id (and widget_conf, to merge with new prefs)
        $resWidget = $this->UsersWidget->find('first', array('conditions'=>array('UsersWidget.id'=>$uw_id, 'UsersWidget.user_id'=>$user_id),'fields'=>array('UsersWidget.application_conf','UsersWidget.widget_id'),'recursive'=>0));

        $uw_app_conf = json_decode($resWidget["UsersWidget"]["application_conf"], TRUE);
        
        $uw_app_conf['collapsed'] = ($type == 'collapse');

        $json_app_conf = $this->mrClean->escape(json_encode($uw_app_conf));

        $a['id'] = $uw_id;
        $a['user_id'] = $user_id;
        $a['application_conf'] = $json_app_conf;
        $this->UsersWidget->save($a);

        $response['success'] = true;
        $this->set('json', $response);
    }


    /*
     * $w_id: widget id in users_widgets
     */
    function removewidget($w_id){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';
        
        $user_id = $this->Session->read('id');

        $filter = array('UsersWidget.id'=>$w_id);
        
        $widget = $this->UsersWidget->find('first', array(
                        'conditions' => $filter
                        ,'fields' => array('UsersWidget.user_id','Widget.name')
                        ,'recursive' => 1
                    )
                );

        $response['success'] = false;

        if(isset($widget['UsersWidget']['user_id']) && ($widget['UsersWidget']['user_id'] == $user_id)){
            $this->UsersWidget->delete($w_id);
            $response['success'] = true;
            $response['widget_name'] = $widget['Widget']['name'];
        }

        $this->set('json', $response);
    }    

    
    function undoremovewidget($w_id){

        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';
        
        $this->UsersWidget->recursive = -1;

        $user_id = $this->Session->read('id');

        $filter = array('id'=>$w_id);

        $this->UsersWidget->enableSoftDeletable('find', false); // enable finding of already soft-deleted records too

        $widget = $this->UsersWidget->find('first', array(
                        'conditions' => $filter
                        //,'fields' => array('user_id','col','pos','tab')
                    )
                );

        $this->UsersWidget->enableSoftDeletable('find', true);

        if(isset($widget['UsersWidget']['user_id']) && ($widget['UsersWidget']['user_id'] == $user_id)){
            $this->UsersWidget->undelete($w_id);
            $response['success'] = true;
            $response['widget'] = $this->getwidgetsposition($w_id);
        }
        else {
            $response['success'] = false;
        }
    
        $this->set('json', $response);
    }   

    
    function changeconf(){
        $DEBUG = 0;
        Configure::write('debug', $DEBUG);
        $this->layout = 'ajax';

        $formdata = $this->params['form'];

        if(empty($formdata['id']))
            die('Are you trying to hack our site?');
        
        $user_id = $this->Session->read('id');

        // id in table users_widgets
        $uw_id = $this->mrClean->paranoid($formdata['id']);
        unset($formdata['id']);
       
        //now we have the users_widgets id, we need widgets id (and widget_conf, to merge with new prefs)
        $result = $this->UsersWidget->find('first', array(
            'fields' => array('UsersWidget.widget_conf', 'Widget.user_params'),
            'conditions' => array('user_id' => $user_id, 'UsersWidget.id' => $uw_id)
        ));

        if (!$result)
            die('This widget is not yours!');

        $uw_conf = json_decode($result["UsersWidget"]["widget_conf"], TRUE);
        
        if (!$uw_conf) //this MUST be an array
            $uw_conf = array();

        //get and decode user_params, so we know how to properly handle formdata
        $user_params = json_decode($result['Widget']['user_params'], TRUE);

        //loop thorough user_params instead of formdata, because checkboxes don't
        //send anything if not checked
        foreach ($user_params as $param) {
            $name = $param['name'];
            $type = $param['type'];

            if ($type == 'boolean') {
                if (array_key_exists($name, $formdata))
                    $formdata[$name] = true;
                else
                    $formdata[$name] = false;
            }
            else if ($type == 'BooleanList') {
                $len = $formdata[$name];
                
                for($i=0; $i<$len; $i++){ // extracts the $list of selected values for this BooleanList
                    $key = $name.'_'.$i; // values are in form name_0, name_1, ...
                    if (array_key_exists($key, $formdata)){
                        $list[] = $formdata[$key];
                        unset($formdata[$key]);
                    }
                }
                
               
                // replace $name with the list of selected values
                unset($formdata[$name]);
                foreach($list as $key){
                    $this->log($key);
                    $formdata[$name][$key] = $param['values'][$key];
                }
            } 
        }
        
        $widget_conf = json_encode(array_merge($uw_conf, $formdata));

        $data['widget_conf'] = $widget_conf;
        $this->UsersWidget->id = $uw_id;
        $this->UsersWidget->save($data);

        //get the new widget configuration (so JS-side can build the updated widget)
        $tmp = $this->getwidgetsposition($uw_id);
        Configure::write('debug', $DEBUG);
        $response['widget'] = $tmp[0];
        $response['success'] = true;

        // If the user is changing his/her chat status, save it into the timeline
        if(isset($formdata['status']) && ($formdata['status'] != null) && ($formdata['status'] != "")){
            $escaped_status = $this->mrClean->html($formdata['status']);
            $this->addtotimeline(array('status' => $escaped_status));
        }

        $this->set('json', $response);
    }
    
    
    /*
     * $w_id: widget id
     */
    function addwidget($w_id){
        $DEBUG = 0;
        Configure::write('debug', $DEBUG);
        
        $this->layout = 'ajax';

        $col = 0;
        $pos = -1;
        
        $u_id = $this->Session->read('id');

        $query = "INSERT INTO users_widgets (widget_id,col,pos,widget_conf,user_id) SELECT id,$col, (SELECT MIN(pos) FROM users_widgets WHERE user_id=$u_id AND col=$col GROUP BY user_id) - 1,'{}', $u_id  FROM widgets WHERE id=$w_id";
        $this->UsersWidget->query($query);
        
        //this checks only for this connection
        $out = $this->UsersWidget->query("SELECT currval(pg_get_serial_sequence('users_widgets', 'id')) AS \"UsersWidget__id\", name AS \"Widget__name\" FROM widgets WHERE id=$w_id");
        $uw_id = $out[0]['UsersWidget']['id'];
        
        $json = $this->getwidgetsposition($uw_id);
        Configure::write('debug', $DEBUG);

        $this->addtotimeline(array(
            "name" => $out[0]['Widget']['name'],
            "w_id" => $w_id
        ));

        $this->set('json', $json);
    }
}
?>
