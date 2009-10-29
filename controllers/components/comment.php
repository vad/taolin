<?php
/*
 * SimplePie CakePHP Component
 * Copyright (c) 2007 Matt Curry
 * www.PseudoCoder.com
 *
 * Based on the work of Scott Sansoni (http://cakeforge.org/snippet/detail.php?type=snippet&id=53)
 *
 * @author      mattc <matt@pseudocoder.com>
 * @version     1.0
 * @license     MIT
 *
 */

class CommentComponent extends Object {

    /*
    function __construct() {
      $this->cache = CACHE . 'rss' . DS;
    }
    */

    function addComment(&$Model, $params, $user_id){
        
        $foreign_id = $params['form']['foreign_id'];
        $text = $params['form']['comment'];

        $comment = array('Comment' => array(
            'body' => $text,
            'name' => $user_id,
            'email' => 'abc@example.com'
        ));

        $Model->createComment($foreign_id, $comment);

    }

    
    // Retrieve comments for a single message with id = $b_id
    // TODO: move this into the behaviour!
    function getComments(&$Model, $foreign_id){
        $filter = array($Model->alias.'.id' => $foreign_id);
        $boardmsg = $Model->find('first', array(
            'conditions' => $filter,
            'recursive' => FALSE
        ));
        $Model->create($boardmsg);

        $comments = $Model->getComments(array(
            'options' => array(
                'conditions' => array(
                    'Comment.status' => 'pending'
                )
            )
        ));

        return $comments;
    }


    function getCommentCount(&$Model, $foreign_id) {
        $comments = $this->getComments($Model, $foreign_id);

        if(!(empty($comments)))
            return count($comments);
        else
            return 0;
    }

}
?>
