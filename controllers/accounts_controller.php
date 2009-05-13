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

uses('sanitize');

class AccountsController extends AppController {

    var $name = 'Accounts';
    var $helpers = array('Html','Form','Javascript');
    var $uses = array('User','Widget');
    var $AuthComponent;


    function beforeFilter()
    {
        //This is used only for logging the invoked javascript method
        $action = $this->action;
        $id = $this->Session->read('id');
        $this->params['user_agent'] = $_SERVER['HTTP_USER_AGENT'];
        if ($action == 'checkuser') {
            // a really bad hack... we don't want to log the pwd of course!
            $tmp = $this->params['form']['password'];
            $this->params['form']['password'] = 'noway';
            $log = $action.': '.$id.': '.serialize($this->params);
            $this->params['form']['password'] = $tmp;
        } else {
            $log = $action.': '.$id.': '.serialize($this->params);
        }
        
        App::import('Controller','Logs');
        $logContr = new LogsController;
        $logContr->constructClasses();
        $logContr->write($log);
        
        $log = str_replace("\n", " ", $log);
        $this->log($log, 'stat');
        
        //set json view as default
        $this->view = 'Json';

        //initialize auth component
        $this->Conf->startup(&$this); //start Conf component
        $auth_comp = $this->Conf->get('Auth.method').'auth';
        App::import('Component', $auth_comp);
        $cn = $auth_comp . 'Component';
        $this->AuthComponent = new $cn();
    }

    function login(){
        if ($this->Session->check('id')) {
            // if session is ok, redirect the user to the portal page
            $this->redirect('/');
            exit();
        } 
    }

    
    function issessionup(){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';              //set the layout to Ajax so the ajax doesn't break

        $this->set('json', $this->Session->check('id'));
    }


    function logout(){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->Session->destroy();
        $appname = $this->Conf->get('Site.name');
        $this->flash('Thanks for using '.$appname.'!','/login');
    }


    function doconnection($myuser, $password) {
        $ret = $this->AuthComponent->connecttoserver($myuser, $password);
        return $ret;    
    }   
    

    function getuserdn() {
        $ret = $this->AuthComponent->getuserdn();
        return $ret;
    }   

    function getusergroups(){
        $ret = $this->AuthComponent->getusergroups();
        return $ret;
    }


    function checkuser() {
        if ($this->Session->check('id')) {
            // Force the user to login
            $this->redirect('/');
            exit();
        } 
        
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';              //set the layout to Ajax so the ajax doesn't break
        
        $this->User->recursive = 0;
        $san = new Sanitize();
        
        $formdata = $this->params['form'];
        $myuser = $san->paranoid($formdata['username']);
        $password = $formdata['password'];

        $conn = $this->doconnection($myuser, $password);
       
        if($conn && ($password!=Null || $password!="")) {
            //password corretta, puoi assumere che l'utente sia veramente $login
            $response['success'] = true;

            //mi connetto al db e cerco di capire se l'utente e' champion o no
            $user = $this->User->findByLogin($myuser, array('id'));
            $uid = $user['User']['id'];
            $active = $this->Acl->check(
                array('model' => 'User', 'foreign_key' => $uid),
                'site'
            );

            // SE CHAMPION
            if ($active) {
                $response['error']['champion'] = true; //EXT forms need this to know if things did not work

                $this->Session->write('logged', true);
                $this->Session->write('id', $uid);
                $this->Session->write('login', $myuser);
                $this->Session->write('password', $password);
                
                $this->Widget->is_user_already_present($uid);
                
                //find user's dn
                $member_dn = $this->getuserdn(); 
                //find user's groups
                $session_groups = $this->getusergroups();

                $this->Session->write('groups', $session_groups);
                $this->Session->write('user_dn', $member_dn);
            } else  { // SE NON CHAMPION MA DATI CORRETTI
                $response['error']['champion'] = false;
            }

        } else {
            $response['success'] = false;
            $response['error']['champion'] = false;
        }

        $response['contactus'] = $this->Conf->get('Site.admin');
        $this->set('json', $response);
    }


    function getgroups() {
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';              //set the layout to Ajax so the ajax doesn't break

        $this->set('json', $this->Session->read('groups'));
    }


    function getcredits() {
    	Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';              //set the layout to Ajax so the ajax doesn't break

		$credits = array();
        $credits['user'] = $this->Session->read('login');
        $credits['password'] = $this->Session->read('password');
        $this->set('json', $credits);
    	
    }
    
}
?>
