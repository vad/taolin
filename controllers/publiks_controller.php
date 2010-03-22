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

class PubliksController extends AppController {
    var $name = 'Publiks';

    function beforeFilter()
    {
        parent::beforeFilter();
        $this->checkSession();
        
        $this->mrClean = new Sanitize();
    }


    function search() {
        $publik = $this->Conf->get('Organization.publications');
        if ($publik == 1)    { 
            Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
            $this->layout = 'ajax';
            
            $query = $this->params['form']['query'];
            $results = $this->Publik->search($query);

            if ($this->params['form']['start'])
                $start = $this->mrClean->paranoid($this->params['form']['start']);
            else
                $start = 0;
            
            if ($this->params['form']['limit'])
                $limit = $this->mrClean->paranoid($this->params['form']['limit']);
            else
                $limit = 5;

            $end = min($start + $limit, sizeof($results));

            $pubs = array();
            for ($i=$start; $i < $end; $i++) {
                $pub = $results[$i];

                $pub[0]['Title'] = utf8_encode($pub[0]['Title']);
                $pub[0]['PTitle'] = utf8_encode($pub[0]['PTitle']);
                $pubs[] = $pub[0];
            }

            $out['pubs'] = $pubs;
            $out['totalCount'] = count($results);
            $this->set('json', $out);
        
        }
        else return null;
    }

    function listpubsbylogin() {
        
        $publik = $this->Conf->get('Organization.publications');
        if ($publik == 1)    {
            Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
            $this->layout = 'ajax';
            
            $login = $this->params['url']['login'] or die(json_encode(array('pubs'=>array())));

            $login = Sanitize::paranoid($login);

            $author_id = $this->Publik->getauthorbylogin($login);
            
            $results = $this->Publik->listpubsbyid($author_id);

            $pubs = array();
            foreach ($results as $pub) {
                $pub[0]['Title'] = utf8_encode($pub[0]['Title']);
                $pub[0]['PTitle'] = utf8_encode($pub[0]['PTitle']);
                $pubs[] = $pub[0];
            }

            $out['pubs'] = $pubs;
            $this->set('json', $out);
        } else
            $this->set('json', '');
    }
}
?>
