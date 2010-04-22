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

class AppController extends Controller
{
    var $components = array('Acl', 'Conf', 'Email');

    function checkSession()
    {
        // If the session info hasn't been set...
        if (!$this->Session->check('id'))
        {
            // Force the user to login
            $this->redirect('/login');
            exit();
        }
        
        if ((array_key_exists('admin', $this->params)) || ($this->params['action'] == 'admin')){
            if (!$this->Acl->check(array('model' => 'User', 'foreign_key' => $this->Session->read('id')), 'admin')){
                echo 'Not allowed';
                exit();
            }
        };
    }

    function beforeFilter()
    {
        $action = $this->action;
        $id = $this->Session->read('id');
        $this->params['user_agent'] = $_SERVER['HTTP_USER_AGENT'];
        $log = $action.': '.$id.': '.serialize($this->params);

        App::import('Controller','Logs');
        $logContr = new LogsController;
        $logContr->constructClasses();
        $logContr->write($log);

        $log = str_replace("\n", " ", $log);
        $this->log($log, 'stat');

        //set json view as default
        $this->view = 'Json';

        //workaround to pass variables to the pages_controller
        $this->Conf->startup(&$this);
        Configure::write('App.name', $this->Conf->get('Site.name'));
        Configure::write('App.contactus', $this->Conf->get('Site.admin'));
    }

    function beforeRender() {

        $action = $this->action;
        // override views relative dir
        $ovrd = '..'.DS.'override'.DS.'views'.DS;
        if ($this->params['controller'] == 'pages') {
            $filename = $this->viewVars['page'];
        } else {
            $filename = $action;
        }
        $override_filename = VIEWS.$ovrd.$this->viewPath.DS.$filename.'.ctp';

        if (file_exists($override_filename)){
            $this->viewPath = '../override/views/pages';
        }
    }

    function _sendMail($from, $to, $subject = null, $text, $cc = null, $bcc = null, $template = null, $sendas = null){
        
        $this->Email->from = $from;
        $this->Email->to = $to;

        if($subject)
            $this->Email->subject = $subject;
        else
            $this->Email->subject = 'Email notification from '.$this->Conf->get('Site.name');

        if($sendas)
            $this->Email->sendAs = $sendas;

        if($template){
            $this->Email->template = $template;
            return $this->Email->send();
        } else {
            return $this->Email->send($text);
        }
    }
}
?>
