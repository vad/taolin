<?php

class TimelineFilters extends FilterCollection {

    static function userify($user, $timelineid, $suffix = null){
        
        if(!$user['deleted'])
            return sprintf('<a href="javascript:void(0)" onclick="showUserInfo(%d, null, {source: \'timeline\', timeline_id: %d})">%s %s</a>',
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
