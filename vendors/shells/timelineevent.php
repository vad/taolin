<?
class TimelineEventShell extends Shell {
    var $uses = array('Timeline','User');
    
    function main() {
        
        $birthFilter = array('COALESCE(User.mod_date_of_birth, User.date_of_birth)::text LIKE \'%'.date('m-d').'\' AND User.deleted = 0');
        $newusersFilter = array('User.created::text LIKE \''.date('Y-m-d').'%\' AND User.deleted = 0');

        $birthdays = $this->User->find('all', array( 'conditions' => $birthFilter, 'fields' => array('User.id', 'User.login'), 'order' => null, 'recursive' => 0));
        $newusers = $this->User->find('all', array( 'conditions' => $newusersFilter, 'fields' => array('User.id', 'User.login'), 'order' => null, 'recursive' => 0));

        $counter = 0;
        
        foreach($newusers as $newuser){
            $data[$counter]['user_id'] = $newuser['User']['id'];
            $data[$counter]['login'] = $newuser['User']['login'];
            $data[$counter]['template_id'] = 10;
            $data[$counter]['date'] = date('Y-m-d').' 08:00:00';
            $counter++;
        }

        foreach($birthdays as $birthday){
            $data[$counter]['user_id'] = $birthday['User']['id'];
            $data[$counter]['login'] = $birthday['User']['login'];
            $data[$counter]['template_id'] = 9;
            $data[$counter]['date'] = date('Y-m-d').' 08:30:00';
            $counter++;
        }
        
        if($counter > 0)
            $this->Timeline->saveAll($data);
    }
}
?>
