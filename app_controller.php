<?php
class AppController extends Controller
{
    function checkSession()
    {
        // If the session info hasn't been set...
        if (!$this->Session->check('id'))
        {
            // Force the user to login
            $this->redirect('/login');
            exit();
        }
    }

    function beforeFilter()
    {
        $action = $this->action;
        $id = $this->Session->read('id');
        $this->params['user_agent'] = $_SERVER['HTTP_USER_AGENT'];
        $log = $action.': '.$id.': '.serialize($this->params);

        App::import('Controller','Logs');
        $logContr = new LogsController;
        $logContr->constructClasses();
        $logContr->write($log);

        $log = str_replace("\n", " ", $log);
        $this->log($log, 'stat');

        //set json view as default
        $this->view = 'Json';
    }
    
    function addtotimeline($param, $date_now = null, $type_name = null){

        // If $date_now is not defined, save this event with current datetime
        if($date_now == null) 
            $date_now = date('Y-m-d H:i:s');

        if($type_name == null)
            // Check for requesting controller and action
            $type_name = $this->params['controller']."-".$this->action;

        //Importing TimelinesController
        App::import('Controller','Timelines');
        $controller = new TimelinesController;
        $controller->constructClasses();
        // Invoking addtimeline() method in TimelinesController
        $controller->add($param, $date_now, $type_name);

    }
}
?>
