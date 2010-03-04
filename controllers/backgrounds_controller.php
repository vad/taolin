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

class BackgroundsController extends AppController {
    var $name = 'Backgrounds';
    var $paginate = array(
        'limit' => 10,
        'order' => 'name'
    );
    

    function admin_index(){
        Configure::write('debug', '0');
        $this->layout = 'admin';

        $this->paginate['fields'] = array('id', 'name', 'path');
        $res = $this->paginate();
        $this->set('backgrounds', $res);
    }
    
    function admin_add(){
        Configure::write('debug', '0');
        $this->layout = 'admin';
        $this->recursive = -1;
        
        if (!empty($this->data)) {
            if ($this->Background->save($this->data)) {
                $this->Session->setFlash('Background created.', 'admin_flash_message_success');
                $this->redirect(array('action' => 'index'));
            }
        }

    }
   
    function admin_edit($bid){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax     
        $this->layout = 'admin';
        $this->recursive = -1;
        $this->Background->id = $bid;

        if (empty($this->data)) {
            $this->data = $this->Background->read();
        } else {
            if ($this->Background->save($this->data)) {
                $this->Session->setFlash('Background updated.', 'admin_flash_message_success');
                $this->redirect(array('action' => 'index'));
            }
        }
    }
}

?>
