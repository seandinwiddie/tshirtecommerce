<?php
  $dir=ROOT.'/addons/pattern/';
	$pttrns=$this->getFiles($dir,'.svg');
  $pttrnLst=array();
  echo'<div id="pttrns" class="hide">';
  $i=1;
  foreach($pttrns as $pttrn){
    $svg=file_get_contents($dir.$pttrn);
    echo"<div class='swatch swatch-hover' id='swatch-".$i++."' onclick='SwatchClick( this )'>".$svg."</div>";
  }
  echo'<a class="remove-pattern disabled">remove pattern</a>';
  //echo'<button onclick="ClosePicker()">choose</button>';
  echo'<button onclick="ClosePicker()" style="display: none;">choose</button>';
  echo'</div>';
?>
