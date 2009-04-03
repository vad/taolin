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
<link rel='StyleSheet' href='<?php echo $this->base ?>/css/accounts/custom.css' />

<?php
$appname = Configure::read('App.name');
$contactus = Configure::read('App.contactus');
?>

<?php
$faqs = array (
    array ("question" => "What is ".$appname."? ", "answer" => "It is an internal web platform whose goal is to increase the collaboration and knowledge sharing inside FBK."),
    array ("question" => "So, is ".$appname." visible only from inside FBK?", "answer" => "Yes, only from inside.
And only by people who have a login in FBK.
In the future, based on the feedback we receive and discussions, we might make some part of it visible on the Web (i.e. also outside FBK intranet). 
But for now, ".$appname." is accessible only from FBK."),
    array ("question" => "Who can use ".$appname."?", "answer" => "At the moment, only a small number of Champions."),
    array ("question" => "Who are the Champions?", "answer" => "We are the Champions, my friend!!! ... ehm ... ;) <br/>The Champions are a colleagues in FBK who volunteered to help improve the current version of ".$appname." with feedback and suggestions."),
    array ("question" => "Why only few Champions? Why not open it to everybody in FBK?", "answer" => "Our goal is to make ".$appname." as a useful service for people in FBK and an efficient tool for collaboration and knowledge sharing in FBK.
<br/>
As a consequence we want to create the tools for which FBK colleagues perceive a real necessity. 
The only reasonable way to do it is to ask !"),
    array ("question" => "I'm already a Champion but I would like to invite a colleague of mine as Champion. How can I do?", "answer" => "Very simple! Send an email to ".$contactus." or use the \"Feedback\" widget."),
    array ("question" => "I have a suggestion about ".$appname.". I would like to send you some feedback.", "answer" => "First of all, thanks! ".$appname." cannot live without your feedback! We want ".$appname." to be a simple tool which really fulfill your needs and so any kind of suggestion and feedback is very important! If you want to send us suggestions or feedback, you can use the \"suggestion widget\" or send us an email at ".$contactus." ."),
    array ("question" => "Which kind of feedback?", "answer" => "Every kind of feedback, really! From small suggestions such as \"change the color\" or \"move the icon a little bit to the right\" to large suggestions such as \"Why don't you integrate system xyz with feature abc in order to create a complete framework for 123\". And even criticisms such as \"The interface is totally unusable\" or \"It is impossible to understand how to use xyz\" are very imporatant to us. Whatever you think is right is perfect to us! And thanks!"),
    array ("question" => "What are widgets?", "answer" => "Small parts of the ".$appname." Web interface you can drag and drop around. They are also called sometimes portlets, or small windows. The idea of the interface ".$appname." is to be a desktop in which you can keep all the information relevant to your activity in one place. Widgets sometimes are just handy views over larger indipendent applications."),
    array ("question" => "Where are the social features?", "answer" => "We are waiting for your suggestions! ;-) Besides jokes, at the moment, ".$appname." is pretty minimal, we just lay down the foundation and the technological backend. We have of course many ideas for features. But we are waiting your suggestions so that what we create is what we at FBk really feel a need for. So please be bold, send us suggestions or requirements! We don't promise we will implement everything in few seconds but we will surely listen and make good use of your suggestions."), 
    array ("question" => "How can I access ".$appname." when I'm not physically in FBK (for example, in a conference or at home)?", "answer" => "At the moment, ".$appname." can be used only from inside FBK network. As a consequence the only way to use ".$appname." when you are not physically in FBK is to connect to FBK network in VPN."),
    array ("question" => "What is VPN?", "answer" => "VPN stands for Virtual Private Network and it is a way to connect to FBK internal network when you are not physically there. If you don't know how to connect, let us know and we'll detail the steps!"),
    array ("question" => "The first time I login I am asked to \"accept a security certificate\". What is it and what shall I do?", "answer" => "The short answer is \"accept the certificate\". The long answer is the following. The protocol we use for communication between your browser (Internet Explorer, Mozilla Firefox, Apple Safari, ...) and the server is https. It is a secure protocol so that your password and your information travel encrypted and cannot be read by other computers. However in order to be really sure that the server to which you are speaking "),
    array ("question" => "Which language should I use on ".$appname."?", "answer" => "Well, it depends. For now we have figure out English could be a good solutions in order to not exclude our colleagues who don't speak Italian. Anyway let us know your suggestions also about this, if you like. Thanks!"),
    array ("question" => "Who is working on ".$appname."?", "answer" => "Happy you asked! The answer is \"the Sonet group\", you can find info about the Sonet group on the <a href=\"http://sonet.fbk.eu\">project Web page</a>. "),
    array ("question" => "How can I contact you?", "answer" => "You can email us at the email address ".$contactus.""),
    array ("question" => "Isn't there a faster way of contacting you?", "answer" => "Sure thing! Please, phone to Paolo Massa at 311. Of course you can find the telephone number also using the \"Search users\" widget! ;-)"),
    array ("question" => "How can I make ".$appname." my homepage (the default page loaded by browser at startup)?", "answer" => ""),   
    array ("question" => "I have a question which is not in this FAQ (Frequently Asked Questions). What shall I do?", "answer" => "Please, send your question by email to ".$contactus." . We will add it here, along with an answer.")
);

?>


<a name="top"></a>
<h2>Frequently asked questions (FAQ) about <?php echo $appname ?></h2>

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
