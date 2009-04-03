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
 		'trailText' => 'Welcome',
 		'html' => '<h1>Welcome To Wizard Test </h1><p>This is our test bed for this component, click next to proceed.</p>'
 	),
 	array(
 		'index' => 1,
 		'layout' => 'form',
 		'trailText' => 'Bio Data',
 		"defaults"=>array(
	        "width"=>130			
	    ),
	    'sequenceCtrl' => array(
	    	array(
	    		'key' => 'gender',
	    		'values' => array(
	    			'm' => 3,
	    			'f' => 4
	    		)
	    	)
	    ),	    
		'items' => array(
 			array(
 				'xtype' => 'textfield',
 				'fieldLabel' => "Full Name",
		        "name" => "fname",		        
		        "allowBlank" => false
		    ),
		    array(
		    	'xtype' => 'textfield',
		    	'fieldLabel' => 'Email',
		        'name' => 'email',		         
		        'allowBlank' => false,
		    	'vtype' => 'email'
		    ),
		    array(
		    	"xtype" => "datefield",
		        "name" => "birth-date",
		        "fieldLabel" => "Date of Birth",		        
	            "format" => "M d, Y"
		    ),
		    array(
		    	'hiddenName' => 'gender',
		    	'fieldLabel' => 'Gender',
		    	'width' => 110,
	    		'allowBlank' => true,
	    		'xtype' => 'combo',
		    	'emptyText' => ' --- choose ---',
		    	'store' => array(array('m', 'Male'), array('f', 'Female'))
		    ),
		    array(
		    	'xtype' => 'textarea',
		    	'fieldLabel' => 'Comments',
		    	'name' => 'comments',
		    	'width' => 250
		    )
 		)
 	),
 	array(
 		'index' => 2,
		'items' => array(
	 		array(
	 			'xtype' => 'fieldset',
	 			'title' => 'Phone Number',
	 			'collapsible' => true,
	 			'autoHeight' => true,
	 			'defaults' => array(
	 				'width' => 220
	 			),
	 			'defaultType' => 'textfield',
	 			'items' => array(
		 			array(
		 				'fieldLabel' => 'Home',
		 				'name' => 'home',
		 				'value' => '(888) 555-1212'
		 			),
		 			array(
		 				'fieldLabel' => 'Business',
		 				'name' => 'business'
		 			),
		 			array(
		 				'fieldLabel' => 'Fax',
		 				'name' => 'fax'
		 			)
	 			)	 			
	 		),
	 		array(
	 			'xtype' => 'tabpanel',
	 			'plain' => true,
	 			'activeTab' => 0,
	 			'height' => 100,
				'defaults' => array(
	 				'bodyStyle' => array(
	 					'padding' => '10px'
	 				)
	 			),
	 			'items' => array(
	 				array(
	 					'title' => 'Personal Details',
	 					'layout' => 'form',
	 					'defaultType' => 'textfield',
	 					'defaults' => array(
	 						'width' => 210
	 					),
	 					'items' => array(
				 			array(
				 				'fieldLabel' => 'Name',
				 				'name' => 'name'
				 			),
				 			array(
				 				'fieldLabel' => 'Occupation',
				 				'name' => 'job'
				 			),
				 			array(
				 				'fieldLabel' => 'Nationality',
				 				'name' => 'nation'
				 			)
			 			)
	 				),	 				
	 				array(
	 					'title' => 'Contact Details',
	 					'layout' => 'form',
	 					'defaultType' => 'textfield',
	 					'defaults' => array(
	 						'width' => 210
	 					),
	 					'items' => array(
				 			array(
				 				'fieldLabel' => 'Home',
				 				'name' => 'home1',
				 				'value' => '(888) 555-1212'
				 			),
				 			array(
				 				'fieldLabel' => 'Business',
				 				'name' => 'business1'
				 			),
				 			array(
				 				'fieldLabel' => 'Fax',
				 				'name' => 'fax1'
				 			)
			 			)
	 				)
	 			)
	 		)
 		)
 	),
 	array(
 		'index' => 3,
		'html' => '<h1>Index 3, You Selected Male ?</h1>'
 	),
 	array(
 		'index' => 4,
		'html' => '<h1>Index 4, You Selected Female ?</h1>'
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