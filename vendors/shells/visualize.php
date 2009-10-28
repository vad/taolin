<?php
/**
 * Visualize console task
 * 
 * This task can be used to generate a graphical representation of your tables or models.
 *
 * PHP versions 4 and 5
 *
 * Copyright (c) Tomenko Yevgeny
 *
 * Licensed under The MIT License
 * Redistributions of files must retain the above copyright notice.
 *
 * @version		1.2.0
 * @modifiedby		Andy Dawson
 * @lastmodified	2007-12-20 23:39:02 +0100 (Thu, 16 Aug 2007) $
 * @license		http://www.opensource.org/licenses/mit-license.php The MIT License
 */
uses('Folder','File','model'.DS.'connection_manager');
class VisualizeShell extends Shell {

	var $DOC_DIR ;

	var $PREFIX = APP_DIR;

	var $graphToolPath = 'dot.exe'; // cake visualize -tool C:\dev\_tools_\graphviz-2.16\bin\dot.exe


	function help() {
		$this->out('CakePHP visualise, Usage examples:');
		$this->out('cake visualize help');
		$this->out('	- this text');
		$this->out('cake visualize tables');
		$this->out('	- generate graphic based on table structure');
		$this->out('cake visualize models');
		$this->out('	- generate graphic based on model association definitions');
		$this->out('cake visualise [-tool graphVizTool]');
		$this->hr();
	}

	function initialize() {
		if (DS == '/') {
			$this->graphToolPath = array(
				'dot', 
				'dot -Gmode=heir',
				'neato',
				'neato -Gmodel=subset'
			);
		}
		$this->DOC_DIR = APP . 'config' . DS . 'sql';
		$this->PREFIX= 'img_';
		if (isset($this->params['tool'])) {
			$this->graphToolPath = $this->params['tool'];
		}
		return true;
	}

	function main() {
		if (!isset($this->args[0])) {
			$this->generateDataFromTables();    
			$this->writeDotFile($this->DOC_DIR, 't');
			$this->generateDataFromModels();    
			$this->writeDotFile($this->DOC_DIR, 'm');
			return;
		} elseif ($this->args[0] == 'help') {
			$this->help();
			return;
		} elseif ($this->args[0] == 'tables') {
			$mode = 't';
			$this->generateDataFromTables();    
		} elseif ($this->args[0] == 'models') {
			$mode = 'm';
			$this->generateDataFromModels();    
		}
		$this->writeDotFile($this->DOC_DIR, $mode);
	}

	function generateDataFromModels() {
		foreach($this->getAllModels() as $model) {
			$this->out("Looking at model: {$model}");
			$model = new $model();
			if (!$model->useTable) {
				continue;
			}
			$this->data['tables'][$model->name] = $model->schema(true);
			foreach ($this->data['tables'][$model->name] as $attrname => $attr) {
				if (!empty($attr['length'])) {
					$attr['type'] .= "[{$attr['length']}]";
				}
				$this->data['nodes'][$model->name][$attrname] = $attr['type'];
				if (!empty($attr['default'])) {
					$this->data['nodes'][$model->name][$attrname] .= ", default: \\\"{$attr['default']}\\\"";
				}
			}

			foreach($model->__associations as $type) {
				foreach ($model->$type as $alias => $association) {
					$otherModel = $association['className'];
					if ($type == 'belongsTo') {
						$this->data['associations'][$model->name.$otherModel] = 
							array('label'=> $model->name . '->' . $alias, 'node1'=> $model->name, 'node2'=> $otherModel);
					} elseif (in_array($type, array('hasOne', 'hasMany'))) {
						$this->data['associations'][$otherModel.$model->name] = 
							array('label'=> $otherModel . '->' . $model->name, 'node1'=> $otherModel, 'node2'=> $model->name);
					} elseif ($type == 'hasAndBelongsToMany') {
						$names[] = $model->name;
						$names[] = $otherModel;
						sort($names);
						$modelName = implode($names, '');
						if (!isset($modelName)) {
							$DynamicModel = new Model(array('name'=> $modelName, 'table'=> $association['joinTable'])); 
							$this->data['tables'][$modelName] = $DynamicModel->schema(true);
							foreach ($this->data['tables'][$modelName] as $attrname => $attr) {
								if (!empty($attr['length'])) {
									$attr['type'] .= "[{$attr['length']}]";
								}
								$this->data['nodes'][$modelName][$attrname] = $attr['type'];
								$attrtype = $attr['type'];
								if (!empty($attr['default'])) {
									$this->data['nodes'][$modelName][$attrname] .= ", default: \\\"{$attr['default']}\\\"";
								}
							}
							$this->data['associations'][$model->name.$otherModel] = 
								array('label'=> $model->name . '->' . $modelName, 'node1'=> $model->name, 'node2'=> $modelName);
							$this->data['associations'][$otherModel.$model->name] = 
								array('label'=> $otherModel . '->' . $modelName, 'node1'=> $otherModel, 'node2'=> $modelName);
						}
					}
				}
			}
		}
	}

	function generateDataFromTables() {
		foreach($this->getAllTables() as $table_name) {
			$this->out("Looking at table: {$table_name}");
			$modelName=$this->_modelName($table_name);
			$this->data['tables'][$modelName] = $this->getSchemaInfo($modelName,$table_name);
		}
		foreach ($this->data['tables'] as $table => $attributes) {
			if (is_array($attributes) && count($attributes)>0) {
				foreach ($attributes as $attrname => $attr) {
					if (substr($attrname, -3) == '_id') {
						# Create an association to other table
						$otherTable = Inflector::camelize(r('_id','',$attrname));
						if (!empty($this->data['tables'][$otherTable])) {
							$other_table = $this->data['tables'][$otherTable];
							$this->data['associations'][] = array('label'=> $attrname, 'node1'=> $table, 'node2'=> $otherTable);
						}
					}
					if (!empty($attr['length'])) {
						$attr['type'] .= "[{$attr['length']}]";
					}
					$this->data['nodes'][$table][$attrname] = $attr['type'];
					$attrtype = $attr['type'];
					if (!empty($attr['default'])) {
						$this->data['nodes'][$table][$attrname] .= ", default: \\\"{$attr['default']}\\\"";
					}
				}
			}
		}
	}

	function getAllModels() {
		$Inflector =& Inflector::getInstance();
		uses('Folder');
		$folder = new Folder(MODELS);
		$models = $folder->findRecursive('.*php');
		$folder = new Folder(BEHAVIORS);
		$behaviors = $folder->findRecursive('.*php');
		$models = array_diff($models, $behaviors);
		foreach ($models as $id => $model) {
			$file = new File($model);
			$models[$id] = $file->name();
		}
		$models = array_map(array(&$Inflector, 'camelize'), $models);
		App::import('Model', $models);
		return $models;
	}

	function getAllTables($useDbConfig = 'default') {
		$db =& ConnectionManager::getDataSource($useDbConfig);
		$usePrefix = empty($db->config['prefix']) ? '': $db->config['prefix'];
		if ($usePrefix) {
			$tables = array();
			foreach ($db->listSources() as $table) {
				if (!strncmp($table, $usePrefix, strlen($usePrefix))) {
					$tables[] = substr($table, strlen($usePrefix));
				}
			}
		} else {
			$tables = $db->listSources();
		}
		$this->__tables = $tables;
		return $tables;
	}

	function getSchemaInfo($modelName,$table_name) {
		$attrs = array();
		if (App::import('model',$modelName)) {
			$model = & new $modelName();
			$attrs=$model->schema();
			return $attrs;
		} else {
			$DynamicModel = new Model(array('name'=> $modelName, 'table'=> $table_name)); 
			$attrs=$DynamicModel->schema();
			return $attrs;
		}
		return false;
	}   

	function writeDotFile($target_dir, $mode) {
	        if (!file_exists($target_dir) || !is_dir($target_dir)) {
			$this->out("Creating directory \"{$target_dir}\"…");
			$folder = & new Folder($target_dir, true);
		}
		$header = $this->PREFIX+strftime('%Y-%m-%d %H:%M:%S',time());
		$version=0;
		if ($version > 0) {
			$header .= "\\nSchema version $version";
		}
		$dotFile = $target_dir .DS. 'mode_' . $mode . '.dot';
		if (file_exists($dotFile)) {
			$f = & new File($dotFile);
			$f->delete();
		}
		$f = & new File($dotFile, true );

		// Define a graph and some global settings
		$f->append("digraph G {\n");
		$f->append("\toverlap=false;\n");
		$f->append("\tsplines=true;\n");
		$f->append("\tnode [fontname=\"Helvetica\",fontsize=9];\n");
		$f->append("\tedge [fontname=\"Helvetica\",fontsize=8];\n");
		$f->append("\tranksep=0.1;\n");
		$f->append("\tnodesep=0.1;\n");
		//    $f->append("\tedge [decorate=\"true\"];\n");
		// Write header info
		$f->append("\t_schema_info [shape=\"plaintext\", label=\"{$header}\", fontname=\"Helvetica\",fontsize=8];\n");

		$assocs = array();
		// Draw the tables as boxes
		
		foreach ($this->data['nodes'] as $table=>$attributes) {
			$f->append("\t\"{$table}\" [label=\"{{$table}|");
			foreach ($attributes as $field=>$label) {
				$f->append("{$field} : {$label}\\n");
			}
			$f->append("}\" shape=\"record\"];\n");
		}
		// Draw the relations
		foreach ($this->data['associations'] as $assoc) {
			$f->append("\t\"{$assoc['node1']}\" -> \"{$assoc['node2']}\" [label=\"{$assoc['label']}\"]\n");
		}

		// Close the graph
		$f->append("}\n");
		$f->close();        // Create the images by using dot and neato (grapviz tools)
		$this->out("Generated {$dotFile}\n");

		$this->createImgs($dotFile, $target_dir, $mode);

		// Remove the .dot file // Keep it for debugging and general info
		//$f->delete();
	}

	function createImgs($dotFile, $path, $mode) {
		if (is_string($this->graphToolPath)) {
			$commands = array($this->graphToolPath);
		} else {
			$commands = $this->graphToolPath;
		}
		uses ('Sanitize');
		foreach ($commands as $command) {
			$imgFile = $path . DS . 'schematic_' . $mode . '_' . Sanitize::paranoid($command) . ".png";
			if (file_exists($imgFile)) {
				$f = & new File($imgFile);
				$f->delete();
			}
			if ($this->createImg($command, $dotFile, $imgFile)) {
				$this->out("Generated {$imgFile}\n");
			} else {
				break;
			}
		}
	}

	function createImg($command, $dotFile, $imgFile) {
		$command = "{$command} -Tpng  -o\"{$imgFile}\" \"{$dotFile}\"";
		ob_start();
		system($command,$return);
		ob_clean();
		if ($return != 0) {
			$this->out("Command Error ($return):\n");          
			$this->out("$command\n");
			return false;
		}
		return true;
	}
}
?>
