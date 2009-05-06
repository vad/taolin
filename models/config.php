<?php 
class Config extends AppModel {
	
	var $name = "Config";
	
	var $belongsTo = array('ConfigCategory');
}
?>