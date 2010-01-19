<?php

if (!$_POST['url'])
    die('URL requested');
else $url = $_POST['url'];

if ($_POST['xslt'])
    $xslt_file = $_POST['xslt'];

// Allocate a new XSLT processor
$xp = new XsltProcessor();
$xsl = new DomDocument;
$xsl->load($xslt_file);

$xp->importStylesheet($xsl);

$xml_doc = new DomDocument;
$xml_doc->load($url);

if ($html = $xp->transformToXML($xml_doc)) {
      echo $html;
  } else {
      trigger_error('XSL transformation failed.', E_USER_ERROR);
  }  

?>
