<?
class SetPhotoSizeShell extends Shell {
    var $uses = array('Photo');
    
    function main() {
       
        $photo_dir = '/www/desktop/html/images_desktop/';
        
        $filter = array('width'=>NULL,'height'=>NULL);

        $photos = $this->Photo->find('all', array( 'conditions' => $filter, 'fields' => array('id', 'filename'), 'order' => null, 'recursive' => -1, 'group' => null));

        $total = 0;

        foreach($photos as $photo) {

            if($photo['Photo']['filename']){

                $photofile = $photo_dir.$photo['Photo']['filename'];

                list($width, $height) = getimagesize($photofile);
                
                $data['width'] = $width;
                $data['height'] = $height;
                $data['deleted_date'] = null;
                $data['id'] = $photo['Photo']['id'];

                $this->Photo->query('UPDATE photos SET width = '.$width.', height = '.$height.', deleted_date = null WHERE id = '.$photo['Photo']['id']);
                //$this->Photo->save($data, false, array('width','height'));

                $total += 1;
            }
            
        }
  
        $this->hr();
        //Print out total
        $this->out("Total: " . $total . "\n"); 
    }
}
?>
