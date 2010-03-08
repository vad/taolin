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

class PhotoUtilComponent extends Object{ 

    function generaterandomfilename($length=16){
        return substr(md5(uniqid()),$length);    
    }

    function getphotoext($filename){
        return substr($filename, strrpos($filename, '.'));
    }

    /*
     * Credits: Bit Repository 
     * Source URL: http://www.bitrepository.com/web-programming/php/crop-rectangle-to-square.html
     *
     */
    function crop($img, $savetofile = false, $location = 'center', $quality = 100) {
        
        if (!$img){
            $this->log('ERROR: image required!');
            return false;
        }

        $img_info = getimagesize($img);

        $width = $img_info[0];
        $height = $img_info[1];
        $type = $img_info[2];
        
        switch ($type) {
            case 1: $im = imagecreatefromgif($img); break;
            case 2: $im = imagecreatefromjpeg($img);  break;
            case 3: $im = imagecreatefrompng($img); break;
            default:  $this->log('Unknown image type E_USER_WARNING - img: '.$img);  return false; break;
        }

        if(!is_resource($im)){
            $this->log('Unable to load image!');
            return false;
        }
 
        // Coordinates calculator

        if($width > $height){ // Horizontal Rectangle?
            if($location == 'center'){
                $x_pos = ($width - $height) / 2;
                $x_pos = ceil($x_pos);
                $y_pos = 0;
            } 
            else if($location == 'left'){
                $x_pos = 0;
                $y_pos = 0;
            }
            else if($location == 'right'){
                $x_pos = ($width - $height);
                $y_pos = 0;
            }
            $new_width = $height;
            $new_height = $height;
        }
        else if($height > $width) { // Vertical Rectangle?
            if($location == 'center'){
                $x_pos = 0;
                $y_pos = ($height - $width) / 2;
                $y_pos = ceil($y_pos);
            }
            else if($location == 'left') {
                $x_pos = 0;
                $y_pos = 0;
            }
            else if($location == 'right') {
                $x_pos = 0;
                $y_pos = ($height - $width);
            }
            $new_width = $width;
            $new_height = $width;
        }

        $newImg = imagecreatetruecolor($new_width, $new_height);

        // Crop to Square using the given dimensions
        imagecopy($newImg, $im, 0, 0, $x_pos, $y_pos, $width, $height);

        if($savetofile){
            switch ($type) {
                case 1: imagegif($newImg, $img, $quality); break;
                case 2: imagejpeg($newImg, $img, $quality); break;
                case 3: imagepng($newImg, $img, $quality); break;
                case 6: imagejpeg($newImg, $img, $quality); break;
                default:
                    $this->log('An error occurred.');
                    return false;
                    break;
            }
        }
        else
            return $newImg;
    }
}
?>
