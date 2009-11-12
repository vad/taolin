<?php

class TimelineFilters extends FilterCollection {

    static function userify($user, $timelineid){
        $str = sprintf('<a href="javascript:void(0)" onclick="showUserInfo(%d, null, \'{&quot;source&quot;: &quot;timeline&quot;, &quot;timeline_id&quot;: &quot;%d&quot;}\')">%s %s</a>', $user['id'], $timelineid, $user['name'], $user['surname']);
        return $str;
    }

}

h2o::addFilter(array('TimelineFilters'));
?>
