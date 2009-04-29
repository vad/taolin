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

class ThumberComponent extends Object{

    var $components = array('PhotoUtil');
    
    /* Image format of the thumb */

    var $image_formats = array(
            array('width' => 40, 'height' => 40)
            ,array('width' => 140, 'height' => 140)
            ,array('width' => 240, 'height' => 240)
            ,array('width' => 480, 'height' => 480)
            ,array('width' => 640, 'height' => 480)
        );

    /**
     * Function invoked to thumb an image
     * 
     * Params:
     * @filename: image's filename
     * @path: path to the directory containing the image
     * @savetofile: boolean, true in order to save the thumbed image on a file, false to output it directly
     * @imageformats: array containing desired size attributes, both the max desired width and the max desired height.
     * If several formats are required, they shall be putted into nested arrays
     * @quality: integer, from 0 (lower quality) to 100 (higher quality)
     * @forcetojpg: if the image has to be forced to be a jpg image or not
     *
     */

    function createthumb($filename, $path, $savetofile, $image_formats = null, $quality = 100, $forcetojpg = true){
        
        if (!$filename){
            $this->log('ERROR: filename required!');
            return false;
        }

        if(!$image_formats)
            $image_formats = $this->image_formats;

        if (!$path)
            $path = Configure::read('App.imagefolder.fs_path');

        $img = $path.$filename;

        $fill = false;

        if (!extension_loaded('gd') && !extension_loaded('gd2')) {
            $this->log('GD required');
            return false;
        }

        $img_info = getimagesize($img);

        switch ($img_info[2]) {
            case 1: $im = imagecreatefromgif($img); break;
            case 2: $im = imagecreatefromjpeg($img);  break;
            case 3: $im = imagecreatefrompng($img); break;
            case 6: $im = $this->imagecreatefrombmp($img); break;
            default:  $this->log('Unknown image type E_USER_WARNING - img: '.$img);  return false; break;
        }

        if(!is_resource($im)){
            $this->log('Unable to load image!');
            return false;
        }

        if($savetofile){

            /* If $image_formats is not a nested array, insert it into another array */
            if(!isset($image_formats[0]))
                $image_formats = array($image_formats);

            foreach($image_formats as $format){

                /* Directory where to save the image to */
                $img_dest_dir = $path.'t'.$format['width'].'x'.$format['height'].'/';

                /* If $imgDestDir does not exists, create it! */
                if(!file_exists($img_dest_dir)){
                    $folder = new Folder($img_dest_dir, true, 0777);
                }

                if($forcetojpg){
                    $file_ext = $this->PhotoUtil->getphotoext($filename);
                    
                    if($file_ext != 'jpg')
                        $dest_file = str_replace($file_ext, '.jpg', $filename);
                    else
                        $dest_file = $filename;
                }
                else
                    $dest_file = $filename;

                $img_path = $img_dest_dir.$dest_file;

                 if(!file_exists($img_path))
                     $this->thumbimage($im, $img_info, $format, $fill, $img_path, $quality, $forcetojpg);
                 else
                     $this->log("Warning! File $dest_file already exists in $img_dest_dir");
            }
        }
        else
            $this->thumbimage($im, $img_info, $image_formats, $fill, null, $quality, $forcetojpg);
        
        return true;
    }

    /**
     * This function creates a new image from $im, resized to width and height attribute
     * contained in $format array. If $new_img_dest is null or not set, the new image will
     * be automatically outputted. Otherwise it will be saved in the desired location
     *
     * Params:
     * @im: image to be resized
     * @img_info: array containing information about the iage to be resized (as its width, height and mime-type)
     * @format: array containing desired max width and height
     * @fill: boolean
     * @new_img_dest: path to save the file to
     * @quality: integer, from 0 (lower quality) to 100 (higher quality)
     * @forcetojpg: if the image has to be forced to be a jpg image or not
     *
     */

    function thumbimage($im, $img_info, $format, $fill, $new_img_dest, $quality, $forcetojpg){

        $w = $format['width'];
        $h = $format['height'];

        if ($img_info[0] <= $w && $img_info[1] <= $h && !$fill) {
            $nHeight = $img_info[1];
            $nWidth = $img_info[0];
        }else{
            if ($w/$img_info[0] < $h/$img_info[1]) {
                $nWidth = $w;
                $nHeight = $img_info[1]*($w/$img_info[0]);
            }else{
                $nWidth = $img_info[0]*($h/$img_info[1]);
                $nHeight = $h;
            }
        }

        $nWidth = round($nWidth);
        $nHeight = round($nHeight);

        $newImg = imagecreatetruecolor($nWidth, $nHeight);
    
        imagecopyresampled($newImg, $im, 0, 0, 0, 0, $nWidth, $nHeight, $img_info[0], $img_info[1]);

        if(!$new_img_dest || $new_img_dest == null)
            header("Content-type: ". $img_info['mime']);

        if($forcetojpg){
            switch ($img_info[2]) {
            case 1:
            case 2:
            case 3:
            case 6:
                imagejpeg($newImg, $new_img_dest, $quality);
                break;
            default:
                $this->log('An error occurred.');
                break;
            }
        }
        else{
            switch ($img_info[2]) {
            case 1: imagegif($newImg, $new_img_dest, $quality); break;
            case 2: imagejpeg($newImg, $new_img_dest, $quality); break;
            case 3: imagepng($newImg, $new_img_dest, $quality); break;
            case 6: imagejpeg($newImg, $new_img_dest, $quality); break;
            default:
                $this->log('An error occurred.');
                break;
            }
        }

        imagedestroy($newImg);
    }

    /*********************************************/
    /* Fonction: ImageCreateFromBMP              */
    /* Author:   DHKold                          */
    /* Contact:  admin@dhkold.com                */
    /* Date:     The 15th of June 2005           */
    /* Version:  2.0B                            */
    /*********************************************/

    function imagecreatefrombmp($filename){

        //Ouverture du fichier en mode binaire
        if (! $f1 = fopen($filename,"rb")) 
            return FALSE;

        //1 : Chargement des ent�tes FICHIER
        $FILE = unpack("vfile_type/Vfile_size/Vreserved/Vbitmap_offset", fread($f1,14));
        if ($FILE['file_type'] != 19778) 
            return FALSE;

         //2 : Chargement des ent�tes BMP
        $BMP = unpack('Vheader_size/Vwidth/Vheight/vplanes/vbits_per_pixel'.
                      '/Vcompression/Vsize_bitmap/Vhoriz_resolution'.
                      '/Vvert_resolution/Vcolors_used/Vcolors_important', fread($f1,40));
        $BMP['colors'] = pow(2,$BMP['bits_per_pixel']);
        if ($BMP['size_bitmap'] == 0) 
            $BMP['size_bitmap'] = $FILE['file_size'] - $FILE['bitmap_offset'];
        $BMP['bytes_per_pixel'] = $BMP['bits_per_pixel']/8;
        $BMP['bytes_per_pixel2'] = ceil($BMP['bytes_per_pixel']);
        $BMP['decal'] = ($BMP['width']*$BMP['bytes_per_pixel']/4);
        $BMP['decal'] -= floor($BMP['width']*$BMP['bytes_per_pixel']/4);
        $BMP['decal'] = 4-(4*$BMP['decal']);
        if ($BMP['decal'] == 4) 
            $BMP['decal'] = 0;

        //3 : Chargement des couleurs de la palette
        $PALETTE = array();
        if ($BMP['colors'] < 16777216){
             $PALETTE = unpack('V'.$BMP['colors'], fread($f1,$BMP['colors']*4));
        }

        //4 : Cr�ation de l'image
        $IMG = fread($f1,$BMP['size_bitmap']);
        $VIDE = chr(0);

        $res = imagecreatetruecolor($BMP['width'],$BMP['height']);
        $P = 0;
        $Y = $BMP['height']-1;
        while ($Y >= 0)
        {
            $X=0;
            while ($X < $BMP['width'])
            {
             if ($BMP['bits_per_pixel'] == 24)
                $COLOR = unpack("V",substr($IMG,$P,3).$VIDE);
             elseif ($BMP['bits_per_pixel'] == 16)
             { 
                $COLOR = unpack("n",substr($IMG,$P,2));
                $COLOR[1] = $PALETTE[$COLOR[1]+1];
             }
             elseif ($BMP['bits_per_pixel'] == 8)
             { 
                $COLOR = unpack("n",$VIDE.substr($IMG,$P,1));
                $COLOR[1] = $PALETTE[$COLOR[1]+1];
             }
             elseif ($BMP['bits_per_pixel'] == 4)
             {
                $COLOR = unpack("n",$VIDE.substr($IMG,floor($P),1));
                if (($P*2)%2 == 0) $COLOR[1] = ($COLOR[1] >> 4) ; else $COLOR[1] = ($COLOR[1] & 0x0F);
                $COLOR[1] = $PALETTE[$COLOR[1]+1];
             }
             elseif ($BMP['bits_per_pixel'] == 1)
             {
                $COLOR = unpack("n",$VIDE.substr($IMG,floor($P),1));
                if     (($P*8)%8 == 0) $COLOR[1] =  $COLOR[1]        >>7;
                elseif (($P*8)%8 == 1) $COLOR[1] = ($COLOR[1] & 0x40)>>6;
                elseif (($P*8)%8 == 2) $COLOR[1] = ($COLOR[1] & 0x20)>>5;
                elseif (($P*8)%8 == 3) $COLOR[1] = ($COLOR[1] & 0x10)>>4;
                elseif (($P*8)%8 == 4) $COLOR[1] = ($COLOR[1] & 0x8)>>3;
                elseif (($P*8)%8 == 5) $COLOR[1] = ($COLOR[1] & 0x4)>>2;
                elseif (($P*8)%8 == 6) $COLOR[1] = ($COLOR[1] & 0x2)>>1;
                elseif (($P*8)%8 == 7) $COLOR[1] = ($COLOR[1] & 0x1);
                $COLOR[1] = $PALETTE[$COLOR[1]+1];
             }
             else
                return FALSE;
             imagesetpixel($res,$X,$Y,$COLOR[1]);
             $X++;
             $P += $BMP['bytes_per_pixel'];
            }
            $Y--;
            $P+=$BMP['decal'];
        }

        //Fermeture du fichier
        fclose($f1);

        return $res;
    }
    /************ END FUNCTIONS *************/
}
?>

