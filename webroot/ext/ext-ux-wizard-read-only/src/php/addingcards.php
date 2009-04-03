<?php

$formConfig = array(
	"labelAlign" => "right",
	"labelWidth" => 80,	
	'defaults' => array(
		'msgTarget' => 'side',
		'labelSeparator' => ''
	)
);

$pages = array(
 	array(
 		'index' => 0,
 		'trailText' => 'Just Added',
 		'html' => '<h1>This page just got added from the server</h1><p>Yeah you can now conditionally load and add more pages.</p>'
 	),
 	array(
 		'index' => 1,
 		'trailText' => 'Added with last XHR too',
 		'html' => 'Must commend KRaVEN for this feature, and his other contributions :)'
 	),
 	array(
 		'index' => 2,
 		'trailText' => 'Finally',
 		'html' => 'No more pranks, this is the last page for real :)'
 	)
);

$config = array(
    "success"=>true,
    "metaData"=>array(
        "pages"=>$pages,
        "formConfig"=>$formConfig
    ),
    'data' => array()
);

echo json_encode($config);

// end of file
?> 