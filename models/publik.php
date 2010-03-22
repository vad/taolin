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
class Publik extends AppModel
{
    //This model will work only if there is a DB called publik in config.php
    var $useDbConfig = 'publik';
    var $name = 'Publik';
    var $useTable = False;

    function search($s) {
        $s = str_replace("'", "''", $s);
        $query = "_searchPubsFullText '$s'";
        $r = $this->query($query);
        if (!$r)
            $r = array();
        return $r;
    }
    
    function getauthorbylogin($login) {
        $query = "SELECT ID FROM Authors WHERE Login='$login'";
        $res = $this->query($query);
        $author = $res[0][0]['ID'];

        return $author;
    }
    
    function listpubsbyid($author_id) {
        $query = "WEB_GET_PUBS_BY_AUTHOR $author_id";

        return $this->query($query);
    }
}

?>
