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

class UsersController extends AppController {
    var $name = 'Users';
    var $helpers = array('Html','Form','Javascript');
    var $components = array('Email');
    var $paginate = array(
        'limit' => 50,
        'order' => 'User.surname'
    );

    function beforeFilter()
    {
        parent::beforeFilter();

        $this->checkSession();
        $this->san = new Sanitize();
    }

    function getidfromjidnode($jidnode){
        
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';
        
        $login = $this->san->paranoid($jidnode);
        $this->User->recursive = 0;
        $fields = array('User.id');
        $user = $this->User->findByLogin($login, $fields);
        
        $this->set('id', $user[User][id]);
    }

    function getinfo($id=-1) {
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';

        if ($id==-1)
            $id = $this->Session->read('id');
        else {
            $id = $this->san->paranoid($id);
        }

        $fields = array('User.id', 'User.login',
            'User.name', 'User.surname', 'User.created',
            'COALESCE(mod_date_of_birth, date_of_birth) AS date_of_birth',             
            'COALESCE(mod_personal_page, personal_page) AS personal_page',
            'COALESCE(mod_email, email) AS email',
            'COALESCE(mod_phone, phone) AS phone',
            'COALESCE(mod_phone2, phone2) AS phone2',
            'mod_home_address AS home_address',
            'mod_carpooling AS carpooling', 'gender',
            'User.groups_description', 'User.mod_description',
            'User.active', 'User.tags', 'Workplace.building_id',
            'User.facebook', 'User.linkedin', 'User.twitter'
        );

        $conditions = array('User.id' => $id);
        //$this->User->bindModel(array('hasMany' => array('ContentTag')));
        $user = $this->User->find('first', array(
            'conditions' => $conditions, 
            'recursive' => 0,
            'fields' => $fields
        ));
        
        // move mod_* fields "created" with AS from [0] to [User]
        foreach($user[0] as $key => $mod_defined){
            $user['User'][$key] = $mod_defined;
        }

        $conditions['Photo.default_photo'] = 1;
        $conditions['Photo.is_hidden'] = 0;
        $fields = array('Photo.filename', 'Photo.is_hidden');
        $photo = $this->User->Photo->find('first', array(
            'conditions' => $conditions, 
            'recursive' => 0,
            'fields' => $fields
        ));

        // Tokenize groups_description and retrieve their description from groups table
        if(isset($user['User']['groups_description']) && $user['User']['groups_description']!=null){
            $group_name = strtok($user['User']['groups_description'], ",");
            $groups_desc = null;
    
            while ($group_name) {
                $result = $this->User->Group->findByName($group_name, array('id','description_en', 'description_it'), null, 0); 
                $group = $result['Group'];
                $group['name'] = $group_name;

                $user['User']['groups'][] = $group;
                $group_name = strtok(",");
            }
        }

        $addtomail = '@'.$this->Conf->get('Organization.domain');

        $json['user'] = $user['User'];
        if ((!$user['User']['email']) && ($user['User']['login'])){
            $json['user']['email'] = $user['User']['login'].$addtomail;
        }

        //read the name for the group in the westpanel.js from the config file 
        $defaultgroupname = $this->Conf->get('Site.group_name'); 
        $json['user']['defaultgroupname'] = $defaultgroupname; 

        $imagefoldername = $this->Conf->get('Images.people_web_path');

        if (!empty($photo['Photo'])){

            /* Since all the photos are saved in .jpg extension, replace the
             * original file extension with .jpg
             */
            $photo_jpg = substr_replace($photo['Photo']['filename'], '.jpg', strrpos($photo['Photo']['filename'], '.'));
            $json['user']['photo'] = Router::url('/').$imagefoldername.'t640x480/'.$photo_jpg;
        }
        
        if (!empty($user['Workplace'])){
            $json['user']['building_id'] = $user['Workplace']['building_id'];
        }

        $this->set(compact('json'));
    }


    /**
     * This function returns an array containing user's personal information
     * and load it in a form
     * It send an array to a view via $this->set to the view
     */
    function getusersettings() {
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';
        
        $id = $this->Session->read('id');

        $condition = array('User.id' => $id);
        $this->User->recursive = 0;
        
        $user  = $this->User->find($condition, array(
            'name', 'surname', 'login',
            'COALESCE(mod_personal_page, personal_page) AS personal_page', 
            'COALESCE(mod_email, email) AS email', 
            'COALESCE(mod_date_of_birth, date_of_birth) AS date_of_birth',             
            'COALESCE(mod_phone, phone) AS phone', 
            'COALESCE(mod_phone2, phone2) AS phone2', 
            'mod_description AS description',
            'mod_home_address AS home_address',
            'mod_carpooling AS carpooling',
            'groups_description',
            'facebook', 'linkedin', 'twitter'
        ));
        
        foreach ($user['User'] as $key => $userid){
            $users[] = array('id' => $key, 'value' => $userid);
        }
        foreach ($user[0] as $key => $mod_defined){
            $users[] = array('id' => $key, 'value' => $mod_defined);
        }

        /*****************************************************
         * START RETRIEVING DEFAULT PHOTO 
         *****************************************************/

        $resphoto = $this->User->Photo->getdefault(
            $id,
            array('Photo.filename')
        );
        
        if (!empty($resphoto['Photo'])){
            /* Since all the photos are saved in .jpg extension, replace the
             * original file extension with .jpg
             */
            $photo = substr_replace($resphoto['Photo']['filename'], '.jpg', strrpos($resphoto['Photo']['filename'], '.'));
        } else
            $photo = null;
           
        // Insert the value in the third position of the array
        array_splice($users, 2, 0, array(array('id' => 'photo', 'value' => $photo)));
        
        /*****************************************************
         * END DEFAULT PHOTO RETRIEVE 
         *****************************************************/
        
        $json['data'] = $users;
        $json['success'] = true;
        $this->set('json', $json);
    }

    function searchusers() {
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';

        $this->User->recursive = 0;

        $formdata = $this->params['form'];
        $limit = 5;
        $start = 0;

        if(!empty($formdata['limit']))
            $limit = $formdata['limit'];
         
        if(!empty($formdata['start']))
            $start = $formdata['start'];

        $query = $formdata['query'];
        $query = $this->san->escape($query);

        $condition = 'id = '.$query;

        $user_ar = $this->User->search_matching($query, $start, $limit);

        $ret['totalCount'] = $user_ar['count'][0][0]['count'];
        if ($ret['totalCount']){
            foreach($user_ar['users'] as $user){
                $users[] = $user['users'];
            }
        } else {
            $users = array();
        }

        $ret['users'] = $users;
        $ret['totalCount'] = $user_ar['count'][0][0]['count'];

        $this->set('json', $ret);
    }


    function getrandomusers($n=5) {
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';

        $n = $this->san->paranoid($n);

        if ($n > 30) $n = 30;

        $this->User->recursive = 0;
        
        $users = $this->User->find('all',
            array(
                'fields' => array('id', 'name', 'surname', 'login'),
                'order' => 'RANDOM()',
                'limit' => $n
            )
        );
        $users = Set::extract($users, '{n}.User');
        
        $this->set('json', $users);
    }


    function getrandomchampions($n=5) {
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';

        $n = $this->san->paranoid($n);

        if ($n > 30) $n = 30;

        $filter = array('active' => 1);
        $this->User->recursive = 0;
        
        $users = $this->User->find('all',
            array('conditions' => $filter,
                'fields' => array('id', 'name', 'surname', 'login'),
                'order' => 'RANDOM()',
                'limit' => $n
            )
        );
        $users = Set::extract($users, '{n}.User');
        
        $this->set('json', $users);
    }


    function listchampions($n=100) {
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';

        $n = $this->san->paranoid($n);

        if ($n > 100) $n = 100;

        //TODO: hide myself
        //$thisId = $this->Session->read('id');
        
        $filter = array('active' => 1);
        $this->User->recursive = 0;
        
        $users = $this->User->find('all',
            array('conditions' => $filter,
                'fields' => array('User.id',
                    'name || \' \' || surname AS "User__name"',
                    'COALESCE(mod_email, email) AS "User__email"', 
                    'User.login'
                ),
                'order' => 'User.login',
                'limit' => $n
            )
        );

        $clean_users = array();
        foreach($users as $user){
            
            if(!$user['User']['email'] || $user['User']['email']==null || $user['User']['email']==''){
                $addtomail = $this->Conf->get('Organization.domain');
                $user['User']['email'] = $user['User']['login'].'@'.$addtomail;
            }

            $clean_users[] = $user['User'];
        }
        
        $this->set('json', $clean_users);
    }


    function getlastarrivedusers($n=5, $photo=false) {

        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';
            
        $this->User->recursive = 0;

        $n = $this->san->paranoid($n);
        if ($n > 30) $n = 30;

        if($photo == 'true') {
            $conditions = array('User.deleted' => 0);
            $queryObj = $this->User->Photo;
        } else {
            $conditions = null;
            $queryObj = $this->User;
        }

        //TODO: and if a photo is not visible?
        $users = $queryObj->find('all',
            array(
                'conditions' => $conditions,
                'fields' => array('User.id', 'User.name', 'User.surname', 'User.login'),
                'order' => 'User.created DESC',
                'limit' => $n
            )
        );

        $users = Set::extract($users, '{n}.User');
        
        $this->set('json', $users);
    }


    function setusersettings() {
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';
            
        if (empty($this->params))
            die('Are you joking me?');
        
        $id = $this->Session->read('id');

        $condition = array('id' => $id);
        $fields = array(
            'mod_date_of_birth','mod_email','mod_personal_page',
            'mod_description','mod_working_place','mod_phone',
            'mod_phone2', 'mod_home_address', 'mod_carpooling',
            'facebook', 'linkedin', 'twitter'
        );
        
        $user_com = $this->User->find('first', array('conditions' => $condition, 'fields' => $fields, 'recursive' => -1));
        
        $data = array();
        $mod_fields = array();

        $form = $this->params['form'];
        $user = $user_com['User'];

        if(array_key_exists('date_of_birth', $form) && (strcasecmp($form['date_of_birth'],$user['mod_date_of_birth'])!=0)){
            $data['mod_date_of_birth'] = str_replace('/','-',$form['date_of_birth']);
        }

        if(array_key_exists('email', $form) && (strcasecmp($form['email'],$user['mod_email']))){
            $data['mod_email'] = $form['email'];
            $mod_fields['email'] = $data['mod_email'];
        }

        if(array_key_exists('description', $form) && (strcasecmp($form['description'],$user['mod_description']))){
            $data['mod_description'] = $form['description'];
            $mod_fields['description'] = $data['mod_description'];
        }

        if(array_key_exists('personal_page', $form) && (strcasecmp($form['personal_page'],$user['mod_personal_page']))){
            $data['mod_personal_page'] = $form['personal_page'];
            $mod_fields['personal page'] = $data['mod_personal_page'];
        }

        if(array_key_exists('phone', $form) && (strcasecmp($form['phone'],$user['mod_phone']))){
            $data['mod_phone'] = $form['phone'];
        }

        if(array_key_exists('phone2', $form) && (strcasecmp($form['phone2'],$user['mod_phone2']))){
            $data['mod_phone2'] = $form['phone2'];            
        }

        if(array_key_exists('home_address', $form) && (strcasecmp($form['home_address'], $user['mod_home_address']))){
            $data['mod_home_address'] = $form['home_address'];            
            $mod_fields['home address'] = $data['mod_home_address'];
        }

        if(array_key_exists('linkedin', $form) && (strcasecmp($form['linkedin'], $user['linkedin']))){
            $data['linkedin'] = $form['linkedin'];            
            $mod_fields['linkedin'] = $data['linkedin'];
        }

        if(array_key_exists('twitter', $form) && (strcasecmp($form['twitter'], $user['twitter']))){
            $data['twitter'] = $form['twitter'];            
            $mod_fields['twitter'] = $data['twitter'];
        }

        if(array_key_exists('facebook', $form) && (strcasecmp($form['facebook'], $user['facebook']))){
            $data['facebook'] = $form['facebook'];            
            $mod_fields['facebook'] = $data['facebook'];
        }

        $carpooler = array_key_exists('carpooling', $form);
        if( $carpooler != $user['mod_carpooling']){
            $data['mod_carpooling'] =  $carpooler;
            if($carpooler)
                $mod_fields['carpooling'] = 'available';
            else 
                $mod_fields['carpooling'] = 'not available';
        }
        
        if(!empty($data)) {
        
            $data['id'] = $id;
        
            $this->User->save($data);
            $response['text'] = 'Data saved';

            if(!empty($mod_fields)){
                
                // $m_fields is a string containing modified fields
                $m_fields = '';
    
                foreach($mod_fields as $key => $field){
                    $m_fields .= ' '.$key.',';
                }      

                // Drop last comma
                $m_fields = substr($m_fields, 0, -1);

                // Last field introduced by 'and' not by a comma. Thus replace it!
                if(count($mod_fields) > 1)
                    $m_fields = substr_replace($m_fields, ' and', strrpos($m_fields, ','), 1);
               
                // Format it better!!!!
                $m_fields = ' modifying '.$m_fields;
            }

            $this->addtotimeline(array('id' => $id, 'modfields' => $m_fields));

        }

        $response['success'] = true;
        
        $this->set('json', $response);
    }

    function setprivacypolicyacceptance(){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';

        $id = $this->Session->read('id');
        $data['id'] = $id;
        
        $data['privacy_policy_acceptance'] = $this->params['form']['accepted'];

        $this->User->save($data);

        $response['success'] = true;
        
        $this->set('json', $response);
    }
    
    function getprivacypolicyacceptance(){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';
        $this->User->recursive = -1;

        $id = $this->Session->read('id');

        $resuser = $this->User->find('first', array('conditions' => array('id' => $id), 'fields' => array('privacy_policy_acceptance')));

        $response['success'] = true;
        $response['user'] = $resuser['User'];
        
        $this->set('json', $response);
    }

    function sendmail(){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';
        $this->User->recursive = 0;
        $response['success'] = false;

        if (empty($_POST['to']))
            die('Hey Luke Skywalker, use the force. (to field required)');

        if (empty($_POST['text']))
            die('Hey Luke Skywalker, use the force. (text field required)');

        $text = $_POST['text'];
        
        $u_id = $this->Session->read('id');

        $sender = $this->User->getemail($u_id, $this->Conf->get('Organization.domain'));

        $this->Email->from = $sender;
        $this->Email->to = $_POST['to'];
        if(!empty($_POST['cc'])) $this->Email->cc[] = $_POST['cc'];
        if(!empty($_POST['bcc'])) $this->Email->bcc[] = $_POST['bcc'];
        $appname = $this->Conf->get('Site.name');
        $this->Email->subject = 'Notification from '.$appname;
        $response['success'] = $this->Email->send($text);

        $this->set('json', $response);
    }


    function addtag($tag){
        Configure::write('debug', '2');     //turn debugging off; debugging breaks ajax
        $this->layout = 'ajax';
        $u_id = $this->Session->read('id');
        echo $u_id;
        $this->User->findById($u_id);
        echo $this->User->field('login');
        $this->User->addTags(array($tag), $u_id);
        
        $this->set('json', '');       
    }

    /*****************************************************
     *****************************************************
     * ADMIN
     *****************************************************
     *****************************************************/

    function admin_index(){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
        $this->layout = 'admin';
        
        $url = $this->params['url'];
        if (array_key_exists('q', $url) && $url['q']) { //check for a 'q' GET param
            $q = $url['q'];
            $this->paginate['conditions'] = array("tsv @@ plainto_tsquery('english', '$q')");
            $this->set('query', $this->san->html($q));
        }

        $this->paginate['fields'] = array('id', 'name', 'surname', 'login');
        $users = $this->paginate();

        foreach ($users as &$user) {
            $user['User']['active'] = $this->Acl->check(
                array('model' => 'User', 'foreign_key' => $user['User']['id']),
                'site'
            );
        }

        $this->set('users', $users);
        $this->set('url', $this->params['url']['url']);
    }


    function admin_activate($uid, $active = 1){
        Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax

        $aro = new Aro();

        //find the id of this user's aco
        $aro->create();
        $user_aro = $aro->find('first', array(
            'conditions' => array(
                'model' => 'User',
                'foreign_key' => $uid
            ),
            'fields' => array('id')
        ));
        
        $new_aro = array('model' => 'User', 'foreign_key' => $uid);
        if ($user_aro)
            $new_aro['id'] = $user_aro['Aro']['id'];

        if ($active){ // add this user to the users Aro group
            // find the id of the users group
            $aro->create();
            $users_aro = $aro->findByAlias('users');
            $users_aro_id = $users_aro['Aro']['id'];
        
            $new_aro['parent_id'] = $users_aro_id;
            
            $this->addtotimeline(null, null, null, $uid);

        } else {
            $new_aro['parent_id'] = NULL;
        }

        $aro->save($new_aro);

        $referer = $this->params['url']['r'];

        if ($referer) {
            $this->Session->setFlash('User activation status changed.', 'admin_flash_message_success');
            $this->redirect($referer);
        }
    }
   

    function admin_create_basic_acl(){
        Configure::write('debug', '2');     //turn debugging off; debugging breaks ajax
        die('not now!');
        $aco = new Aco();
        $aro = new Aro();
        /*
        $aro->create();
        $aro->save(array('alias' => 'users'));
        $aro->create();
        $aro->save(array('alias' => 'admins', 'parent_id' => 1));

        $aco->create();
        $aco->save(array('alias' => 'admin'));
        $aco->create();
        $aco->save(array('alias' => 'site', 'parent_id' => 1));
        */

        //$this->Acl->grant(array('alias' => 'users'), array('alias' => 'site'));
        $rr = $aro->findByAlias('users');
        $rc = $aco->findByAlias('site');
        print_r($rr);
        $this->Acl->grant(array('Aro' => array('alias' => 'users')),
            array('Aco' => array('alias' => 'site')), '*');
        //$this->Acl->grant(2, 1);
        //$this->Acl->grant(array('alias' => 'admins'), array('alias' => 'admin'));

        $this->set('json', 'a');
    }

    function admin_create_aros($uid, $active = 1){
        Configure::write('debug', '2');     //turn debugging off; debugging breaks ajax

        $aro = new Aro();

        $champions = $this->User->find('all', array(
            'fields' => array('id', 'active'),
            'conditions' => array('active' => 1)
        ));

        foreach ($champions as $champion) {
            //$aro->create();
            //$aro->save(array('model' => 'User', 'foreign_key' => $champion['User']['id'], 'parent_id' => 1));
        }

        $this->set('json', 'a');
    }
}
?>
