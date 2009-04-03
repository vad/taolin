<?php
########################################################################
#
# Project: libical
# URL: http://www.nabber.org/projects/
# E-mail: webmaster@nabber.org
#
# Copyright: (C) 2003-2007, Neil McNab
# License: GNU General Public License Version 2
#   (http://www.gnu.org/copyleft/gpl.html)
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA
#
# Filename: $URL$
# Last Updated: $Date$
# Author(s): Neil McNab
#
# Description:
#   This file is a PHP implementation of RFC 2445.
#
########################################################################

/**
 * This file is a PHP implementation of RFC 2445 (ical).
 * @author Neil McNab <webmaster@nabber.org>
 * @version 0.3
 * @package libical
 */

# Constants
/**
 * Max length of a line in the iCal file
 * @global integer $LINE_FOLD_LENGTH
 */
define(LINE_FOLD_LENGTH, 75);
/**
 * Date format string
 * @global string $DATE_FORMAT
 */
$DATE_FORMAT = "Ydm\THis";

/**
 * This is the class that everyone should start with to open an existing file or create a new one.
 * @package libical
 */
class ical_File extends ical_ComponentManager {
  /**
   * Subelements allowed according to spec
   * @access private
   */
  var $allowed_subelements = array('VCALENDAR');

  /**
   * Pass a filename (existing or not) when an instance is created.
   * @param string $filename 
   */
  function ical_File($filename="") {
    $this->filename = $filename;
    
    # if file exists, open it for reading and read it in
    if (file_exists($filename)) {
      $filearray = file($filename);
      if ($filearray !== FALSE) {
        $this->load_ical($filearray);
        //return 0;
      }
    }

    # else create new empty calendar object
    //return 1;
  }

  /**
   * Dump ical data to text string
   * Slightly modified from parent class because this isn't really an RFC defined object
   * @param string $text 
   * @return string
   */
  function ical_dump($text = "") {
    foreach ($this->components as $key => $value) {
      for ($i = 0 ; $i < sizeof($this->components[$key]); $i++) {
        # check if this method exists before calling
        //print_r($this->components[$key][$i]);
        if (method_exists($this->components[$key][$i], 'ical_dump')) {
          $text .= $this->components[$key][$i]->ical_dump();
        }
        else {
          //print "<p>ERROR: Could not dump object data to iCal file.</p>\n";
	  trigger_error("Could not dump object data to iCal file.");
        }
      }
    }
    return $text;
  }

  /**
   * Write out calendar(s) in this object to a file
   * Returns 0 on sucess, -1 on failure
   * @param string $filename 
   * @return integer
   */
  function write($filename = "") {
    
    if ($filename != "") {
      $this->filename = $filename;
    }
    
    $handle = fopen($this->filename, "w");
    if ($handle !== FALSE) {
      fwrite($handle, $this->ical_dump());
      fclose($handle);
      return 0;
    }
    return -1;
  }

  /**
   * download method -- outputs the appropriate headers
   * then outputs the results of ical_dump
   * 
   * this method  added by C. R. Dick http://wazzuplocal.com
   *
   * @param string $filename
   */
  function download($filename='myical.ics')
  { 
        header("Content-Type: text/x-vCalendar");
        header("Content-Disposition: inline; filename=$filename");
        echo $this->ical_dump();
  }

}

/**
 * Base class for any values that we need to handle.
 */
class ical_Property {
  /**
   * Property parameters
   * @access private
   */
  var $params = array();

  /**
   * Init function, set known variables
   * @param string $value
   * @param string $params
   */
  function ical_Property($value, $params="") {
    $this->set_value($value);
    $this->set_params($params);
  }

  /**
   * Returns the value stored in this property
   * @return string
   */
  function get_value() {
    return $this->value;
  }
  
  /**
   * Sets the value stored in this property
   * @param string $value
   */
  function set_value($value) {
    $this->value = $value;
  }

  /**
   * Returns the params (semicolon separated)stored in this property
   * @return string
   */
  function get_params() {
    $output = "";
    foreach ($this->params as $key => $value) {
      $output .= ";$key=$value";
    }
    return $output;
  }

  /**
   * Sets the params (semicolon separated) stored in this property
   * @param string $paramstring
   */
  function set_params($paramstring) {
    $list = explode(";", $paramstring);
    for($i = 0; $i < sizeof($list); $i++) {
      list($key, $value) = explode("=", $list[$i], 2);
      $this->set_param($key, $value);
    }
  }

  /**
   * Add a param stored in this property
   * @param string $name
   * @param string $value
   */
  function set_param($name, $value) {
    if ($value != "") {
      $key = strtoupper(trim($name));
      $this->params[$key] = $value;
    }
  }
  /**
   * Returns this property in ical text format
   * @param string $text
   * @return string
   */
  function text_dump($text = "") {
    $text .= $this->get_params() . ":" . $this->value;
    return $text;
  }

}

/**
 * RFC Sections 4.4 - 4.6
 * This is a base class for just about everything and shouldn't be 
 * created directly
 */
class ical_ComponentManager {
  /**
   * This is where we store subelements
   * @var array
   */
  var $components = array();
  
  /**
   * These values are allowed to appear only once
   * @access private
   * @var array
   */
  var $onlyonce = array();
  
  /**
   * These values are required, they cannot be removed, only set
   * @access private
   * @var array
   */
  var $required = array();

  /**
   * subelements allowed according to spec
   * @access private
   * @var array
   */
  var $allowed_subelements = array();
  
  /**
   * subelements allowed according to spec
   * @access private
   * @var array
   */
  var $toggle = array();
  
  /**
   * This should probably be a private function, it doesn't need to be called directly by anyone.
   * @access private
   * @param string $component
   * @return string
   */
  function cleanup_component($component) {
    
    # We don't need to mess with objects, only strings
    if (is_string($component)) {
      $component = trim($component);
      $component = strtoupper($component);
    }
    return $component;
  }

  /**
   * Add this value if it can have multiple entries, otherwise overwrite the old one.
   * @param string $component
   * @param ical_Property $value
   * @return integer
   */
  function add($component, $value) {
    $index = "";
    
    $component = $this->cleanup_component($component);
    
    if (array_search($component, $this->toggle) !== FALSE) {
      # This value can occur only by itself, remove the old ones
      foreach($this->toggle as $key => $value){
        $this->remove($value);
      }
    }

    if (array_search($component, $this->onlyonce) !== FALSE) {
      # This value can occur only once per RFC, overwrite the old one
      $this->components[$component][0] = $value;
      return 0;
    }
    else {
      # Append to already existing array
      $this->components[$component][] = $value;
      return 1;
    }
    return 2;
  }

  /**
   * This is only used for adding additional items.
   * @param string $component
   * @param ical_Property $value
   */
  function add_new($component, $value) {
    $component = $this->cleanup_component($component);
    $params = $this->cleanup_component($params);

    # Append to already existing array
    $this->add($component, new ical_Property($value, $params));
  }

  /**
   * Set all values for this component type in this array return 0 on success, 1 otherwise. 
   * This is really silly to use for single entries only, it is the same as using add, but probably more cumbersome.
   * @param string $component
   * @param array $arrayofvalues Array of ical_Property objects
   * @return integer
   */
  function set($component, $arrayofvalues) {
    
    $component = $this->cleanup_component($component);  
    
    if ((array_search($component, $this->onlyonce) !== FALSE) && 
        (sizeof($arrayofvalues) > 1)) {
      # This condition is not allowed per RFC, not changing anything
      return -1;
    }
    
    $this->components[$component] = $arrayofvalues;
    return 0;
  }

  /**
   * Remove all of a given component.
   * Return 0 on success, -1 otherwise (required element).
   * @param string $component
   * @return integer
   */
  function remove($component) {
    
    $component = $this->cleanup_component($component);
    
    if (array_search($component, $this->required) !== FALSE) {
      # check required list, if required, do not remove!
      return -1;
    }
    
    unset($this->components[$component]);
    return 0;
  }

  /**
   * Return an array of ical_Property objects for the component.
   * @param string $component
   * @return array Array of ical_Property objects
   */
  function get($component) {
    # return a given component, array form
    $component = $this->cleanup_component($component);
    return $this->components[$component];
  }

  /**
   * Return all component values in native array form.
   * @return array
   */
  function get_all() {
      return $this->components;
  }

  /**
   * Prepare iCal array of lines for further processing.
   * @param string $plaintext
   * @return array Array of strings
   */
  function cleanup_array($plaintext) {
    
    for ($i = 0; $i < sizeof($plaintext); $i++) {
      # skip blank lines
      if (trim($plaintext[$i]) != "") {

        $line = ltrim(rtrim($plaintext[$i],"\r\n"));

        # Do unfolding per RFC
        while (preg_match("/^\s.*/", $plaintext[$i + 1])) {
          $i++;
          $line .= rtrim(substr($plaintext[$i], 1),"\r\n");
	}
	
	$new_plaintext[] = $line;
      }
    }

    return $new_plaintext;
  }
  /**
   * Recursive method to add ical objects from their text.
   * @param string $plaintext Text in iCal format
   */
  function load_ical($plaintext) {

    $plaintext = $this->cleanup_array($plaintext);
    
    $subelement = "";
    for ($i = 0; $i < sizeof($plaintext); $i++) {
      $line = $plaintext[$i];

      # Find beginning and store type for matching end tag
      if (preg_match("/BEGIN:(.*)/i", $line, $matches)) {
        $match = strtoupper(trim($matches[1]));
        if (array_search($match, $this->allowed_subelements) !== FALSE) {
          $subelement = $match;
        }
      }
      
      if ($subelement != "") {
        $subelementtext[] = $line;
      }
      else {
        # add value to current object
	// This needs to be modified for the RFC quotations exception
        list($temp, $value) = explode(":", $line, 2);
	
	# also need to extract semicolon params here from key!
	$temparray = "";
	$temparray = explode(";", $temp, 2);
        $this->add_new($temparray[0], $value, $temparray[1]);
      }

      if (!strcasecmp("END:" . $subelement, $line)) {
        # strip off unneed BEGIN/END pairs for element, we know what to create
        $subelementtext = array_slice($subelementtext, 1 ,-1);

	# create new subelement and add it to this element
        $element = new $subelement();
        $element->load_ical($subelementtext);
        $this->add($subelement, $element);

	# reset for next time through loop
        $subelementtext = "";
        $subelement = "";
      }
    }
    return 0;
  }

  /**
   * Dump ical data to text.
   * @param string $text
   * @return string
   */
  function ical_dump($text = "") {

    # do one last verfication of RFC compliance on the object
    if ($this->rfc_verify() < 0) {
      return "Calendar does not comply with RFC 2445\r\n";
    }
  
    $classtext = strtoupper(get_class($this));
    $text .= $this->format_line("BEGIN:" . $classtext);
    $text = $this->components_dump($text);

    $text .= $this->format_line("END:" . $classtext);

    return $text;
  }

  /**
   * Dump component values to text format.
   * @param string $text
   * @return string
   */
  function components_dump($text = "") {
    
    foreach ($this->components as $key => $value) {
      for ($i = 0 ; $i < sizeof($this->components[$key]); $i++) {
	# check if this method exists before calling
        if (method_exists($this->components[$key][$i], 'text_dump')) {
          $text .= $this->format_line($key . $this->components[$key][$i]->text_dump());
	}
	elseif (method_exists($this->components[$key][$i], 'ical_dump')) {
          $text = $this->components[$key][$i]->ical_dump($text);
        }
        else {
          //print "<p>ERROR: Could not dump object data to iCal file, $key, $i.</p>";
	  //print_r($this->components[$key][$i]);
	  trigger_error("Could not dump object data to iCal file.");
        }
      }
    }
    return $text;
  }

  /**
   * Do line folding as defined in the RFC.
   * @global integer
   * @param string $line
   * @return string
   */
  function format_line($line) {
    return rtrim(chunk_split($line, LINE_FOLD_LENGTH, "\r\n "))  . "\r\n";
  }

  /**
   * Return 0 when everything checks out, negative code otherwise.
   * @param boolean $recursive
   * @return integer
   */
  function rfc_verify($recursive = FALSE) {
    
    # check once, required, toggle, subelements list
    foreach ($this->onlyonce as $key) {
      if (sizeof($this->components[$key]) > 1) {
        return -1;
      }
    }

    foreach ($this->required as $key) {
      if (!array_key_exists($key, $this->components)) {
        return -2;
      }
    }

    # toggle check here
    $total = 0;
    for($i = 0; $i < sizeof($this->toggle); $i++) {
      for($j = 0; $j < sizeof($this->toggle); $j++) {
        if (array_search($this->toggle[$i][$j], array_keys($this->components)) !== FALSE) {
          $total += 1;
        }
      }
    }
    if ($total > 1) {
      return -3;
    }

    # find invalid properties
    # need list of valid properties first!
    #$searcharray = array_merge($onlyonce, $required, $allowed_subelements);
    //need to add toggle stuff
    #foreach($this->components as $key => $value) {
    #  if (array_search($key, $searcharray) === FALSE && substr($key, 0, 2) != "X-") {
    #    return -4;
    #  }
    #}

    # check sub components
    if ($recursive) {
      foreach($this->components as $key => $value) {
        if (!is_array($value)) {
          $code = $this->components[$key]->rfc_verify();
	  if ($code < 0) {
            return $code;
	  }
	}
      }
    }

    return 0;
  }
}

/**
 * Calendar object class
 */
class vCalendar extends ical_ComponentManager {
  var $onlyonce = array('PRODID','VERSION','CALSCALE','METHOD');
  var $required = array('PRODID','VERSION');
  var $allowed_subelements = array('VTODO','VEVENT');

  /**
   * Set defaults
   */
  function vCalendar() {
    $prodid = new ical_Property("libical; http://www.nabber.org/projects/ical/");
    $version = new ical_Property("2.0");
    $this->components = array("PRODID" => array($prodid), "VERSION" => array($version));
  }

  /**
   * Get all events during a given period of time
   * @param integer $starttime 
   * @param integer $endtime
   * @return array
   */
  function get_events($starttime = 0, $endtime = 10000000000) {
    $temp = array();
    //loop through all events and check start/end times
    foreach ($this->components as $key => $value) {
      for ($i = 0 ; $i < sizeof($this->components[$key]); $i++) {
	# check if this method exists before calling
        if (method_exists($this->components[$key][$i], 'get_start')) {
	  if ($this->components[$key][$i]->get_start() >= $starttime and 
	  	$this->components[$key][$i]->get_end() <= $endtime) { 
            $temp[] = $this->components[$key][$i];
	  }
	}
      }
    }
    return $temp;
  }
}

/**
 * Event object class
 */
class vEvent extends ical_ComponentManager {
  var $onlyonce = array('CLASS','CREATED','DESCRIPTION','DTSTART','GEO','LAST-MOD','LOCATION','ORGANIZER','PRIORITY','DTSTAMP','SEQ','STATUS','SUMMARY','TRANSP','UID','URL','RECURID');
  var $required = array();
  var $allowed_subelements = array('VALARM');
  var $toggle = array(array('DTEND','DURATION')); 

  function gen_event_instances($starttime, $endtime) {
    $temp = array();

    // copy current element data to instance
    $tempelement = new vEventInstance();
    foreach ($this->components as $element) {
      $tempelement->components[] = $element;
    }

    $temp[] = $tempelement;

    return $temp;
  }

  function get_description(){
    if (!array_key_exists('DESCRIPTION', $this->components))
        return '';

    $v = $this->components['DESCRIPTION'][0]->get_value();
    
    $v = str_replace("\\n", "<br />", $v);
    $v = str_replace("\\t", "&nbsp;", $v);
    $v = str_replace("\\r", "<br />", $v);
    $v = str_replace('$', '&#36;', $v);
    $v = stripslashes(stripslashes($v));

    return $v;
  }
  
  function get_summary(){
    $v = $this->components['SUMMARY'][0]->get_value();

    $v = str_replace("\\n", "<br />", $v);
    $v = str_replace("\\t", "&nbsp;", $v);
    $v = str_replace("\\r", "<br />", $v);
    $v = str_replace('$', '&#36;', $v);
    $v = stripslashes(stripslashes($v));

    return $v;
  }
  
  function get_start() {
    // convert DTSTART to something meaningful here
    $v = $this->components['DTSTART'][0]->get_value();

    $v = strtotime($v);
    
    return $v; 
  }

  function get_uid() {
    $v = $this->components['UID'][0]->get_value();

    return $v; 
  }


  function get_end() {
  //convert DTEND or DURATION to something useful here
    $v = $this->components['DTEND'][0]->get_value();

    $v = strtotime($v);
    
    return $v; 

  }

}

/**
 * Event Instance object class
 */
class vEventInstance extends vEvent {

}

/**
 * Todo object class
 */
class vTodo extends ical_ComponentManager {
  var $onlyonce = array('CLASS','COMPLETED','CREATED','DESCRIPTION','DTSTAMP','DTSTART','GEO','LAST-MOD','LOCATION','ORGANIZER','PERCENT','PRIORITY','RECURID','SEQ','STATUS','SUMMARY','UID','URL');
  var $required = array();
  var $allowed_subelements = array('VALARM');
  var $toggle = array(array('DUE','DURATION')); 

}

/**
 * Journal object class
 */
class vJournal extends ical_ComponentManager {
  var $onlyonce = array('CLASS','CREATED','DESCRIPTION','DTSTART','DTSTAMP','LAST-MOD','ORGANIZER','RECURID','SEQ','STATUS','SUMMARY','UID','URL');
  var $required = array();
  var $allowed_subelements = array();

}

/**
 * Freebusy object class
 */
class vFreebusy extends ical_ComponentManager {
  var $onlyonce = array('CONTACT','DTSTART','DTEND','DURATION','DTSTAMP','ORGANIZER','UID','URL');
  var $required = array();

}

/**
 * Timezone object class
 */
class vTimezone extends ical_ComponentManager {
  var $onlyonce = array('TZID','LAST-MOD','TZURL');
  var $required = array('TZID');


// required standard or daylight
}

/**
 * Tzprop object class
 */
class Tzprop extends ical_ComponentManager {
  var $onlyonce = array('DTSTART','TZOFFSETTO','TZOFFSETFROM');
  var $required = array('DTSTART','TZOFFSETTO','TZOFFSETFROM');
  
}

/**
 * Standard object class
 */
class Standard extends Tzprop {
   
}

/**
 * Daylist object class
 */
class Daylight extends Tzprop {

}

/**
 * Alarm object class
 */
class vAlarm extends ical_ComponentManager {
  var $onlyonce = array('ACTION','TRIGGER','DURATION','REPEAT','ATTACH'); // These values are allowed to appear only once
  var $required = array('ACTION','TRIGGER'); // These values are required, they cannot be removed, only set

/*                ; 'duration' and 'repeat' are both optional,
		; and MUST NOT occur more than once each,
		; but if one occurs, so MUST the other
	         duration / repeat /
*/
}

##########################################

/**
 * This really shouldn't ever be needed, since according to the RFC everything needs to be within a calendar to begin with, just use load_ical in the Vcalendar class
 */
function create_from_ical($subelementext) {
  //not complete
  
  $subelementtext = array_slice($subelementtext, 1 ,-1);
  $element = new $subelement();
  $element->load_ical($subelementtext);

}

/**
 * pass in arbitrary number of icalfile objects
 * returns a new icalfile object with all calendars
 * @return ical_File
 */
function merge_icalobjects() {

  $count = func_num_args();

  $calstring = "";
  $events = array();
  for($i = 0; $i < $count; $i++) {
    $tempcal = func_get_arg($i);
    if ($tempcal->components['VCALENDAR'][0]->get('VEVENT'))
        $events += $tempcal->components['VCALENDAR'][0]->get('VEVENT');
  }
  //this is not very clean..
  $outputcal = func_get_arg(0);
  $outputcal->components['VCALENDAR'][0]->set('VEVENT', $events);

  return $outputcal;
}

/**
 * pass in arbitrary number of vcalendar objects
 * returns a new vcalendar object with all calendar items
 * @param ical_File
 * @param ical_File
 * @return ical_File
 */
function merge_calendars() {
  
  $count = func_num_args();

  $calstring = "";
  for($i = 0; $i < $count; $i++) {
    $tempcal = func_get_arg($i);
    $calstring .= $tempcal->components_dump();
  }

  //TODO - add items to calendar
  
  return 0;

}

function icaltime2epochtime($icaltime) {
  //convert ical text time to epochtime
  // if ends in Z, convert
  // otherwise this always represents local time
}

function epochtime2icaltime($icaltime) {
}

/**
 * @global string
 */
function local2utc($local, $offset) {
  global $DATE_FORMAT;
  # offset in hours
  $time = strtotime($local);
  $time = $time - $offset * 3600;
  return date($DATE_FORMAT, $time);
}

/**
 * @global string
 */
function utc2local($utc, $offset) {
  global $DATE_FORMAT;
  $time = strtotime($utc);
  $time = $time + $offset * 3600;
  return date($DATE_FORMAT, $time);
}

/**
 * convert a string into an array based on newlines
 * @param string $text
 * @return array
 */
function text_to_array($text) {
  $text = trim($text);
  $myarray = explode("\r\n", $text);
  return $myarray;
}

?>

