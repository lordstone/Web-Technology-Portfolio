<?php
$xml_google = file_get_contents("http://maps.google.com/maps/api/geocode/xml?address=7123+Hollywood+Blvd,CA") or die("Error: Cannot retrieve file from Google");
echo $xml_google;

?>