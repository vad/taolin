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
?>
<?php
class DummyauthComponent extends Object {

    protected $defaultuser = "platone";
    protected $defaultpass = "platone";

    function startup(&$controller)
    {
        $this->controller =& $controller;        
    }


    function connecttoserver($myuser, $password) {
       if ($myuser == $this->defaultuser && $password == $this->defaultpass)
            return true;
        //else
          //  return false;
    }


public function getuserdn() {
}

public function getusergroups() {
}

}

?>
