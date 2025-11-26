<?php

$city = isset($_GET['city']);
urlencode($_GET['city']) : "Amritsar";

$apikey = "65b32e60b7e64195acd122704252508";

$url = "https://api.weatherapi.com/v1/current.json?key=${apikey}&q=${city}";

$response = file_get_contents($url);

header("Content-type: application/json");
echo $response;

?>