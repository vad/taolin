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

class TaggableBehavior extends ModelBehavior {
    
    var $runtime = array();
    
	function setup(&$model, $settings = array()) {
        $className = 'ContentTag';
        if (PHP5) {
            $this->runtime[$model->alias]['model'] = ClassRegistry::init($className, 'Model');
        } else {
            $this->runtime[$model->alias]['model'] = & ClassRegistry::init($className, 'Model');
        }
        
		$model->bindModel(array('hasMany' => array('ContentTag' => array('foreignKey' => 'content_id'))), true);
		
		return true;
	}
	
    /**
     * Get instance of model for tagging
     *
     * @return object
     * @access public
     */
    function &tagModel( & $model) {
        // $model will be used to retrieve Model and table names
        $className = 'ContentTag';
       
        if (PHP5) {
            $tagModel = ClassRegistry::init($className, 'Model');
        } else {
            $tagModel = & ClassRegistry::init($className, 'Model');
        }
        return $tagModel;
    }
	
	/**
     * Run before a model is about to be find, used only fetch for non-deleted records.
     *
     * @param object $Model Model about to be deleted.
     * @param array $queryData Data used to execute this query, i.e. conditions, order, etc.
     * @return mixed Set to false to abort find operation, or return an array with data used to execute query
     * @access public
     */
    function beforeFind(&$model, $queryData) {
    	$db =& ConnectionManager::getDataSource($model->useDbConfig);
        
        //$this->log(print_r($queryData, true));
        if (!array_key_exists('fields', $queryData)){
            return $queryData;
        }

        $fields =& $queryData['fields'];
        
        $fieldName = $model->alias.'.tags';
        if (($index = array_search($fieldName, $fields)) === FALSE) {
            // we don't need to retrieve tags, no work today
            return $queryData;
        }
             
        // so we need to retrieve tags
        unset($fields[$index]);
        $this->runtime[$model->alias]['taggableBeforeFind'] = TRUE;
        		
		return $queryData;
	}
	
    /**
     * afterFind Callback
     *
     * @param array $results
     * @param boolean $primary
     * @return array Modified results
     * @access public
     */
    function afterFind( & $model, $results, $primary) {
        if (empty($results)) {
            return $results;
        }
        if (!$this->runtime[$model->alias]['taggableBeforeFind']){
            return $results;
        }
        
        $joinModel = $model->alias."ContentTag";
        $runtimeModel =& $this->tagModel($model);
        
        $newResults = array();
        foreach ($results as $row){
            $content_id = $row[$model->alias]['id'];
            
            $content_tags = $runtimeModel->find('all', array(
                'fields' => array('ContentTag.tag_id', 'ContentTag.user_id'),
                'conditions' => array('content_id' => $content_id),
                'order' => 'tag_id'
            ));
            
            foreach ($content_tags as $tag){
                $tag = $tag['ContentTag'];
                $formatted_tags[$tag['tag_id']][] = $tag['user_id'];  
            }
            $row[$model->alias]['tags'] = $formatted_tags;
            $newResults[] = $row;
        }

        return $newResults;
    }
	
    
    function addTags(&$model, $tags, $user_id, $content_id = null) {
        if (!$content_id)
            $content_id = $model->id;
        
        $runtimeModel =& $this->tagModel($model);
        
        $content_tag['user_id'] = $user_id;
        foreach ($tags as $tag) {
            $runtimeModel->create();
            
            $content_tag['content_type_id'] = 1;
            $content_tag['content_id'] = $model->id;
            $content_tag['tag_id'] = $tag;
            
            $runtimeModel->save($content_tag);
        }
    }
    
}

    class Tag extends AppModel {
        var $name = 'Tag';
        var $useTable = 'tags';
		var $hasMany = array('ContentTag');
        //var $displayField = 'field';
    }
	
	class ContentType extends AppModel {
        var $name = 'ContentType';
        var $useTable = 'content_types';
		var $hasMany = array('ContentTag');
        //var $displayField = 'field';
    }
	
	class ContentTags extends AppModel {
        var $name = 'ContentType';
        var $useTable = 'content_types';
		var $belongsTo = array('ContentType', 'Tag');
        //var $displayField = 'field';
    }

?>
