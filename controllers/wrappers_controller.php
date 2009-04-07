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

class WrappersController extends AppController
{
	var $name = 'Wrappers';
	var $helpers = array('Html','Form','Javascript');
	var $components = array('Simplepie');

	function getrss() {
		uses('Sanitize');
		Configure::write('debug', '0');     //turn debugging off; debugging breaks ajax
		$this->layout = 'ajax';
		
        $mrClean = new Sanitize();

		$limit = 5;
		$start = 0;

		if(empty($this->params['form']['url'])) {
			die('Incorrect use');
		}
		$url = $this->params['form']['url'];
		
		if(!empty($this->params['form']['limit'])) {
			$limit = $mrClean->paranoid($this->params['form']['limit']);
		}
			
		if(!empty($this->params['form']['start'])) {
			$start = $mrClean->paranoid($this->params['form']['start']);
		}

		$feed = $this->Simplepie->feed_paginate($url, (int)$start, (int)$limit);

		$out['totalCount'] = $feed['quantity'];
		$out['title'] = $feed['title'];
		$out['image_url'] = $feed['image_url'];
		$out['image_width'] = $feed['image_width'];
		$out['image_height'] = $feed['image_height'];

		foreach($feed['items'] as $item) {
			$tmp['title'] = strip_tags($item->get_title());
			$tmp['url'] = strip_tags($item->get_permalink());
			$tmp['description'] = strip_tags($item->get_description(), '<p><br><img><a><b>');
			$tmp['date'] = strip_tags($item->get_date('d/m/Y'));
			$out['items'][] = $tmp;
		}

		$this->set('json', $out);
	}


	function index(){
	}
	
}
?>
