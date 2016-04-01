<?php
//error handling
//header('content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');  
//header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
//header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');

//error_reporting(E_ALL);
$php_data = "";

if(isset($_GET["submit"])) {
    //INIT variables
    $street = $_GET["street"];
    $city = $_GET["city"];
    $state = $_GET["state"];
    $degree = $_GET["degree"];
   
    $google_api = "AIzaSyCjwk-WodCs7apiDzAHnA0qtoZdrZASkqE";
    $xml_url = str_replace(" ","+","https://maps.googleapis.com/maps/api/geocode/xml?address=" .     $street . "," . $city. "," . $state ."&key=" . $google_api);
    
    $xml_obj = simplexml_load_file($xml_url) or die("Error: Cannot create object");
    $lattitude = $xml_obj->result[0]->geometry[0]->location[0]->lat ;
    $longitude = $xml_obj->result[0]->geometry[0]->location[0]->lng ;

    if($degree=="fahrenheit"):
        $unit = "us";
    else:
        $unit = "si";
    endif;
    
    //get weather forecast contents from forecast.io
    $json_filecontents =  file_get_contents("https://api.forecast.io/forecast/02a5178ae673e79ab0d7a1e23080fcd1/" .$lattitude ."," . $longitude . "?units=" . $unit . "&exclude=flags");

    /*
    $json_obj = json_decode($json_filecontents);
     
    $time_zone = $json_obj->{"timezone"};
    
     date_default_timezone_set($time_zone);
    
    //echo $time_zone;
    
    $mytime = date("h:i A" ,intval($json_obj->{"currently"}->{"time"}));
        $json_obj->{"currently"}->{"time"} = $mytime;
    
    for($i = 0 ; $i <= 7; $i ++){
	   
        $sunrise = date("h:i A" , intval($json_obj->{"daily"}->{"data"}[$i] ->{"sunriseTime"}));
        $json_obj->{"daily"}->{"data"}[$i] ->{"sunriseTime"} = $sunrise;
        $sunset = date("h:i A" ,intval($json_obj->{"daily"}->{"data"}[$i] ->{"sunsetTime"}));
        $json_obj->{"daily"}->{"data"}[$i] ->{"sunsetTime"} = $sunset;
    }
    
    for($i = 0 ; $i <= 24; $i ++){
        $mytime = date("h:i A" ,intval($json_obj->{"hourly"}->{"data"}[$i] ->{"time"}));
        $json_obj->{"hourly"}->{"data"}[$i] ->{"time"} = $mytime;
    }
    
    $newjson = json_encode($json_obj);
    
    echo $newjson;
    */
    echo $json_filecontents;
    
}//end of main function
?>