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
    
    $appname = $conf->get('Site.name');
    $contactus = $conf->get('Site.admin');
?>
<link rel='StyleSheet' href='<?php echo $this->base ?>/css/accounts/custom.css' />

<?php
$faqs = array (
    array ("question" => "What is ".$appname."? ", "answer" => "System administrator can write the answer here."),
    array ("question" => "I have a question which is not in this FAQ (Frequently Asked Questions). What shall I do?", "answer" => "Please, send your question by email to ".$contactus." . We will add it here, along with an answer.")
);
?>


<a name="top"></a>
<h2>Frequently asked questions (FAQ) about <?php echo $appname ?></h2>

<div>

 <p>
 If you are the administrator and you want to customize this page, simply edit the file help.ctp in the directory views/pages/
 <br/>
 You can read the manual of Taolin at <a href="http://taolin.fbk.eu">taolin.fbk.eu</a>
 </p>

 <p>
 If you are a user of the system you might tell the system administrators to customize this page. You can contact the system administrators at <?php     echo 
 $contactus?> 
 </p>
</div>

<div class="questions-list">
<ul>
<?php foreach($faqs as $i => $faq) { ?>
    <li class="faq-question-link" id="faq-question-link-<?php echo $i; ?>">
        <a href="#question-<?php echo $i; ?>"  onclick="showItem('faq-answer-<?php echo $i; ?>');"  ><?php echo $faq['question']; ?></a>
    </li>
<?php } ?>
</ul>
</div>

<?php foreach($faqs as $i => $faq) { ?>
  <div class="faq-aq">
    <a class="back-to-top" href="#top">&uarr; Back to top &uarr;</a>
    <p class="faq-question" id="faq-question-<?php echo $i; ?>">
        <a name="question-<?php echo $i; ?>"><?php echo $faq['question']; ?></a>
    </p>
    <p class="faq-answer" id="faq-answer-<?php echo $i; ?>">
        <?php echo $faq['answer']; ?>
    </p>
  </div>
<?php } ?>

<script type="text/javascript">
    function showItem( id ) {
        Ext.get ( id ).highlight('c3daf9');
    }
</script>

<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
