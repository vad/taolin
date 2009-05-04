<?php // ex: set ts=2 softtabstop=2 shiftwidth=2: ?>

<?php
  $base = $this->base;
  $items = array('Admin' => 'admin',
    'Users' => 'admin/users',
    'Widgets' => 'admin/widgets'
  );
?>
<div id="header">
  <h1><a href="<? echo $this->base ?>/admin/">Taolin administration site</a></h1>
  <div id="main-navigation">
    <ul>
<?
  $maybe_first = 'first';
  foreach ($items as $name => $url){
    $maybe_active = '';
    if (trim($this->params['url']['url'], '/') == $url)
      $maybe_active = 'active';
    echo "<li class='$maybe_first $maybe_active'><a href='$base/$url'>$name</a>";
    $maybe_first = '';
  }
?>
    </ul>
    <div class="clear"></div>
  </div>
</div>
