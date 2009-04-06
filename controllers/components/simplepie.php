<?php
/*
 * SimplePie CakePHP Component
 * Copyright (c) 2007 Matt Curry
 * www.PseudoCoder.com
 *
 * Based on the work of Scott Sansoni (http://cakeforge.org/snippet/detail.php?type=snippet&id=53)
 *
 * @author      mattc <matt@pseudocoder.com>
 * @version     1.0
 * @license     MIT
 *
 */

class SimplepieComponent extends Object {
  var $cache;

  function __construct() {
    $this->cache = CACHE . 'rss' . DS;
  }

  
  function feed_paginate($feed_url, $start=0, $limit=5) {
    //make the cache dir if it doesn't exist
    if (!file_exists($this->cache)) {
      $folder = new Folder($this->cache, true);
    }

    //include the vendor class
    App::import('Vendor', 'simplepie/simplepie');

    //setup SimplePie
    $feed = new SimplePie();
    $feed->set_feed_url($feed_url);
    $feed->set_cache_location($this->cache);

    //retrieve the feed
    $feed->init();

    //limits
    $max = $start + $limit;

    $items['title'] = $feed->get_title();
    $items['image_url'] = $feed->get_image_url();
    $items['image_height'] = $feed->get_image_height();
    $items['image_width'] = $feed->get_image_width();
    //$items['title'] = $feed->get_title();

    //get the feed items
    $items['quantity'] = $feed->get_item_quantity();
    if ($items['quantity'] < $start) {
       $items['items'] = false;
       return $items;
    } elseif ($items['quantity'] < $max) {
        $max = $items['quantity'];
    }

    for ($i = $start; $i < $max; $i++){
        $items['items'][] = $feed->get_item($i);
    }
    //return
    if ($items) {
      return $items;
    } else {
      return false;
    }
  }
}
?>
