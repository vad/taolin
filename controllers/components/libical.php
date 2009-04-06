<?php
/*
 * Libical CakePHP Component
 * Copyright (c) 2008 Fondazione Bruno Kessler
 * www.fbk.eu
 *
 * @author      Davide Setti <davide.setti@gmail.com>
 * @license     AGPL v3.0
 *
 */
class LibicalComponent extends Object{
    var $cache_dir;
    var $cache_minutes;

    function __construct(){
        $this->cache_dir = CACHE . 'ics' . DS;
        $this->cache_minutes = 10;
    }


    function fetch_file($url, $localfile){
        $contents=file_get_contents($url); //fetch RSS feed
        $fp=fopen($localfile, "w");
        fwrite($fp, $contents); //write contents of feed to cache file
        fclose($fp);
    }


    function cache_file($url){
        //make the cache dir if it doesn't exist
        if (!file_exists($this->cache_dir)) {
            $folder = new Folder($this->cache_dir, true);
        }
        
        //download $url to cache_dir encoding the name with md5
        $localfile = $this->cache_dir . md5($url);
        if (!file_exists($localfile)){ //if cache file doesn't exist
            touch($localfile); //create it
            chmod($localfile, 0666);
            $this->fetch_file($url, $localfile); //then populate cache file with contents of RSS feed
        }
        else if (((time() - filemtime($localfile))/60)>$this->cache_minutes) //if age of cache file great than cache minutes setting
            $this->fetch_file($url, $localfile);

        return $localfile;
    }


    function get_calendar($url){
        App::import('Vendor', 'libical/ical');
       
        $localfile = $this->cache_file($url);
        $calendar = new ical_File($localfile);
        
        return $calendar;
    }

    
    function merge_calendars($c1, $c2){
        App::import('Vendor', 'libical/ical');

        return merge_icalobjects($c1, $c2);
    }
}
?>
