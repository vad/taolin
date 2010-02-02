<?php

class TimelineFilters extends FilterCollection {

    static function userify($user, $timelineid, $suffix = null){
        
        if(!$user['deleted'])
            return sprintf('<span class="a" onclick="showUserInfo(%d, null, {source: \'timeline\', timeline_id: %d})">%s %s</span>',
                $user['id'], $timelineid, $user['name'], $user['surname']).$suffix;
        else
            return $user['name']." ".$user['surname'].$suffix;

    }
    
    static function user_adjectify($user, $timelineid){
        
        $is_comment = array_key_exists('commenter_id', $user);

        if($is_comment) $suffix = "'s";
        else $suffix = null;

        if(!$is_comment || $user['id'] != $user['commenter_id'])
            return TimelineFilters::userify($user, $timelineid, $suffix);
        else
            return $user['adj'];
    }

}

h2o::addFilter(array('TimelineFilters'));
?>
