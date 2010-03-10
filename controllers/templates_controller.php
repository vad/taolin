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

class TemplatesController extends AppController {
    var $name = 'Templates';
    var $paginate = array(
        'limit' => 8,
        'order' => 'id'
    );
    

    function admin_index(){
        Configure::write('debug', '0');
        $this->layout = 'admin';

        $this->paginate['fields'] = array('id', 'name', 'temp', 'icon', 'is_unique');
        $res = $this->paginate();
        $this->set('templates', $res);
    }
    
    function admin_add(){
        Configure::write('debug', '0');
        $this->layout = 'admin';
        $this->recursive = -1;
        
        if (!empty($this->data)) {
            if ($this->Template->save($this->data)) {
                $this->Session->setFlash('Template created.', 'admin_flash_message_success');
                $this->redirect(array('action' => 'index'));
            }
        }

    }
   
    function admin_edit($tid){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax     
        $this->layout = 'admin';
        $this->recursive = -1;
        $this->Template->id = $tid;

        if (empty($this->data)) {
            $this->Session->setFlash('Please be careful while editing the template\'s name, because changing that value may broke templates\' retrievial by the timeline.', 'admin_flash_message_warning');
            $this->data = $this->Template->read();
        } else {
            if ($this->Template->save($this->data)) {
                $this->Session->setFlash('Template updated.', 'admin_flash_message_success');
                $this->redirect(array('action' => 'index'));
            }
        }
    }
}

?>
