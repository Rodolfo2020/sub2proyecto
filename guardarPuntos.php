<?php
if(isset($_POST['nickname']) && isset($_POST['puntuacion'])){
    $nick = $_POST['nickname'];
    $puntos = $_POST['puntuacion'];
    $json = array('nickname'=>$nick,'puntuacion'=>$puntos);
    $datos = json_decode(file_get_contents("puntuaciones.json"));
    array_push($datos, $json);
    file_put_contents('puntuaciones.json',json_encode($datos));
}
?>
<script type='text/javascript'>window.close()</script>