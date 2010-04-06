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

class BuildingsController extends AppController {

    function getlist() {
        Configure::write('debug', '0');
		$this->layout = 'ajax';

        //$uid = $this->Session->read('id');
        
        $list = $this->Building->find('all', array(
            'fields' => array('id', 'name', 'description'),
            'recursive' => 0
        ));
        $json['buildings'] = Set::extract($list, '{n}.Building');
       
        $this->set(compact('json'));
    }

    function admin_index(){
        Configure::write('debug', '0');
        $this->layout = 'admin';

        $this->Building->recursive = -1;
        $this->paginate['fields'] = array('Building.id', 'Building.name', 'Building.imagepath');
        $res = $this->paginate();
        $this->set('buildings', $res);
    }
    
    function admin_add(){
        Configure::write('debug', '0');
        $this->layout = 'admin';
        
        if (!empty($this->data)) {
            if ($this->Building->save($this->data)) {
                $this->Session->setFlash('Building created.', 'admin_flash_message_success');
                $this->redirect(array('action' => 'index'));
            }
        }

    }
   
    function admin_edit($bid){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax     
        $this->layout = 'admin';
        $this->Backgournd->recursive = -1;
        $this->Building->id = $bid;

        if (empty($this->data)) {
            $this->data = $this->Building->read();
        } else {
            if ($this->Building->save($this->data)) {
                $this->Session->setFlash('Building updated.', 'admin_flash_message_success');
                $this->redirect(array('action' => 'index'));
            }
        }
    }
}
?>
