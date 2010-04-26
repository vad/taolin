<?php 
/*
 * ConfComponent: DB based configuration
 * @author: othman ouahbi aka CraZyLeGs
 * @website: http://www.devmoz.com/blog/
 * @license: MIT
 * @version: 0.9.1
 * */
class ConfComponent extends Object
{
    var $data = array();
    
    var $getStrBool = false; // convert string values 'false' 'true' to boolean or not when reading
    var $setStrBool = false; // convert string values 'false' 'true' to boolean or not when writing
    
    var $setBoolToStr = false; // convert bool values to str when setting.
    
    var $cacheActive = true;
    var $cacheTime   = '+1 day';
    
    var $cacheFile = 'conf.component.data.php';
    
    // gets value even if empty ''. If set to false, the default value will be returned
    var $getEmpty    = true; 
    
    var $started = false;
    
    function startup(&$controller) {
        if($controller) {
            $controller->set('conf', $this); // make this component available from the views
        }
        
        // To be able to use the component in beforeFilter, but startup() should be called manually
        // This test will prevent it from running twice.
        if(!$this->started) {
            
            $this->started = true;
            
            App::import('Model', 'ConfigCategory');

            // create the model first so we can use set even if the cache is active
            $this->ccModel = & new ConfigCategory();
            
            if($this->cacheActive) {
                
                $cacheData = cache('persistent'.DS.$this->cacheFile, null, $this->cacheTime);
                // cache file didn't expire and file isn't empty
                if(($cacheData !== false) && ($cacheData != null)) {
                    
                    /* skip <?php die(); ?> */
                    $cacheData = substr($cacheData,strpos($cacheData,'>')+1);
                    $this->data = unserialize($cacheData);
                    return true;
                }
            }
            
            $ccs = $this->ccModel->find('all');
            
            if(!empty($ccs)) {
                
                $strToBool = array('true'=>true,'false'=>false);
                // setup for easy/fast access
                foreach($ccs as $cc) {
                    
                    $name = $cc['ConfigCategory']['name'];
                    $cfg    = $cc['Config'];
                    
                    $this->data[$name]['id'] = $cc['ConfigCategory']['id'];
                    $this->data[$name]['cfg'] = array();
                    
                    foreach($cfg as $c) {
                        
                        // convert 'true','false' to boolean true, false
                        if($this->getStrBool && in_array($c['value'],array('true','false'))) {
                            
                            $c['value'] = $strToBool[ $c['value'] ];
                        }
                        $this->data[$name]['cfg'][$c['key']] = array('id'=>$c['id'],'value'=>$c['value']);
                    }
                }
                
                if($this->cacheActive) {
                    
                    // hide it from stalkers.
                    $cacheData = '<?php die(); ?>'.serialize($this->data);
                    cache('persistent'.DS.$this->cacheFile, $cacheData, $this->cacheTime);
                }
            }

        }
    }
    
    
    function get($key, $default = '',$strRealBool = false) {
        
        list($cat,$key) = explode('.',strtolower($key));
        /*
        if(!array_key_exists($cat,$this->data)) {
            return false;
        }
        */
        // return all keys for the specified category
        if($key == '*') {
            return $this->data[$cat]['cfg'];
        }
        
        if(isset($this->data[$cat]['cfg'][$key]['value'])) {
            
            $strToBool = array('true'=>true,'false'=>false);
            // convert 'true','false' to boolean true, false
            if($strRealBool && in_array($this->data[$cat]['cfg'][$key]['value'],array('true','false'))) {
                $this->data[$cat]['cfg'][$key]['value'] = $strToBool[ $this->data[$cat]['cfg'][$key]['value'] ];
            }
            if($this->getEmpty || !empty($this->data[$cat]['cfg'][$key]['value'])) {
                return $this->data[$cat]['cfg'][$key]['value'];
            }
        }
        
        if($default !== '') {
            return $default;
        }
        
        return false;
    }
    
    // alias for get
    function read($key, $default = '',$strRealBool = false) {
        
        return $this->get($key,$default,$strRealBool);
    }
    
    function find($key, $default = '')
    {
        foreach($this->data as $cat) {
            if(array_key_exists($key,$cat['cfg'])) {
                
                return $cat['cfg'][$key]['value'];
            }
        }
        
        if($default !== '') {
            return $default;
        }
        
        return false;
    }
    
    function set($key,$val,$possibleValues = null,$addCat = false,$addKey = false) {
        
        if(!is_null($possibleValues) && 
           (is_array($possibleValues)  && !in_array($val,$possibleValues)) || 
           (is_string($possibleValues) && ($val != $possibleValues))) 
        {
            return false;
        }
        if($this->setStrBool && in_array($val,array('true','false'))) {
            
            $strToBool = array('true'=>true,'false'=>false);
            $val       = $strToBool[$val];
        }
        
        list($cat,$key) = explode('.',strtolower($key));

        if(empty($cat) || empty($key)) {
            return false;
        }
        
        if(!empty($this->data[$cat]['cfg'][$key]['id'])) {
            
            $data['Config']['id']    = $this->data[$cat]['cfg'][$key]['id'];
            $data['Config']['value'] = $val;
            
            if($this->ccModel->Config->save($data)) {
                $this->clearCache();
                return true;
            }
            $this->ccModel->Config->id = false;
            $this->data[$cat]['cfg'][$key]['value'] = $val;
            return false;
        }
        
        if(!array_key_exists($cat,$this->data)) {
            if(!$addCat) {
                return false;
            }
            
            if(!$this->ccModel->save(array('ConfigCategory'=>array('name'=>$cat)))) {
                return false;
            }
            
            $this->data[$cat]['id'] = $this->ccModel->getInsertID();
            
            $this->ccModel->id = false;
            
            $this->clearCache();
        }
        
        if(!$addKey) {
            return false;
        }
        
        $c = array('Config'=>array('key'=>$key,'value'=>$val,'config_category_id'=>$this->data[$cat]['id']));
        
        if(!$this->ccModel->Config->save($c)) {
            return false;
        }
        
        $this->data[$cat]['cfg'][$key]['id']    = $this->ccModel->Config->getInsertID();
        $this->data[$cat]['cfg'][$key]['value'] = $val;
        
        $this->ccModel->Config->id = false;
        
        $this->clearCache();
        
        return true;
    }
    
    // alias for set
    function save($key,$val,$possibleValues = null,$addCat = false,$addKey = false){
        
        return $this->set($key,$val,$possibleValues,$addCat,$addKey);
    }
    
    // clears the component's cache
    function clearCache() {

        clearCache($this->cacheFile,'persistent','');
    }
    // we can merge this with set() but it'll add extra complexity and slow things down which we don't need
    function setCat($cat,$data,$addCat = false,$addKeys = false) {
        foreach($data as $k => $v) {
            // not very useful, the right way is to use a transaction
            if(!$this->set($cat.'.'.$k,$v,$addCat,$addKeys)) {
                return false;
            }
        }
        return true;
    }
    
    function setBatch($data,$addCats = false,$addKeys = false) {
        foreach($data as $cat => $catData) {
            foreach($catData as $k => $v) {
                // not very useful, the right way is to use a transaction
                if(!$this->set($cat.'.'.$k,$v,$addCats,$addKeys)) {
                    return false;
                }
            }
        }   
        return true;
    }


    //return an array containing all the categories
    function listCat() {
        return array_keys($this->data);
    }


    //return all the keys in the $cat category
    function listValue($cat) {
        if (array_key_exists($cat, $this->data)) {
            $keys = array();
            foreach ($this->data[$cat]['cfg'] as $k => $v){
                $keys[$k] = $v['value'];
            }
            return $keys;
        } else
            return null;
    }
}
?>
