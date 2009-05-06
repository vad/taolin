<?php 
class ConfigCategory extends AppModel {
	
	var $name = "ConfigCategory";
	
	var $hasMany = array('Config');
}
?>