<?php 
	header("Access-Control-Allow-Origin: *");
?>

<?php
	function getJson() {
		if ($_GET["stAddress"] !== "" && $_GET["city"] !== "" && $_GET["state"] !== "") {
			$api_key2 = "AIzaSyDaWbKyLfVK0vNk1w0rHSOEz8bJHmcEShE"; //This is the key for google maps
			$url = "https://maps.googleapis.com/maps/api/geocode/xml?address=";
			$url .= urlencode($_GET["stAddress"]) . ",";
			$url .= "+" . urlencode($_GET["city"]) . ",";
			$url .= "+" . urlencode($_GET["state"]);
			$url .= "&key=" . $api_key2;
			$url;
			$xml = simplexml_load_file($url);
			//var_dump($xml);
			$lat = $xml -> result -> geometry -> location -> lat;
			$lng = $xml -> result -> geometry -> location -> lng;
			if ($_GET["temperature"] === "Fahrenheit") {
				$units_value = "us";
			} else {
				$units_value = "si";
			}
			$api_key =  "7cb8420d223e059c1ada3d50d1cd6d92";
			$url1 = "https://api.forecast.io/forecast/";
			$url1 .= $api_key . "/";
			$url1 .= $lat . ",";
			$url1 .= $lng . "?";
			$url1 .= "units=" . $units_value . "&amp";
			$url1 .= "exclude=flags";
			$json = file_get_contents($url1);
			$json = json_decode($json, true);
			//$json = json_encode($json);
			//var_dump($json);
			//echo $json;
			return $json;
		} else {
			//echo "PHP load failed. Please reload the website.";
			//echo "There is something wrong in your form";
		}
	}

	function getPostfix($json) {
		//$temperature = intval($json["currently"]["temperature"]);
		if ($_GET["temperature"] === "Fahrenheit") {
			$postPrefix = "°F";
		} else {
			$postPrefix = "°C";
		}
		return $postPrefix;
	}

	function getIcon($json) {
		if ($json["currently"]["icon"] === "clear-day") {
			$pic_url = "images/clear.png"; 
		}
		elseif ($json["currently"]["icon"] === "clear-night") {
			$pic_url = "images/clear_night.png"; 
		}
		elseif ($json["currently"]["icon"] === "rain") {
			$pic_url = "images/rain.png"; 
		}
		elseif ($json["currently"]["icon"] === "snow") {
			$pic_url = "images/snow.png"; 
		}
		elseif ($json["currently"]["icon"] === "sleet") {
			$pic_url = "images/sleet.png"; 
		}
		elseif ($json["currently"]["icon"] === "wind") {
			$pic_url = "images/wind.png"; 
		}
		elseif ($json["currently"]["icon"] === "fog") {
			$pic_url = "images/fog.png"; 
		}
		elseif ($json["currently"]["icon"] === "cloudy") {
			$pic_url = "images/cloudy.png"; 
		}
		elseif ($json["currently"]["icon"] === "partly-cloudy-day") {
			$pic_url = "images/cloud_day.png"; 
		}
		elseif ($json["currently"]["icon"] === "partly-cloudy-night") {
			$pic_url = "images/cloud_night.png"; 
		} else {
			$pic_url = "";
		}
		//$header = array("{$json["currently"]["summary"]}", 
						//"{$temperature}", 
						//"{$pic_url}"); 
		//print_r($Header);
		return $pic_url;
	}

	function getIcon1($json) {
		if ($json["currently"]["icon"] === "clear-day") {
			$pic_url = "clear.png"; 
		}
		elseif ($json["currently"]["icon"] === "clear-night") {
			$pic_url = "clear_night.png"; 
		}
		elseif ($json["currently"]["icon"] === "rain") {
			$pic_url = "rain.png"; 
		}
		elseif ($json["currently"]["icon"] === "snow") {
			$pic_url = "snow.png"; 
		}
		elseif ($json["currently"]["icon"] === "sleet") {
			$pic_url = "sleet.png"; 
		}
		elseif ($json["currently"]["icon"] === "wind") {
			$pic_url = "wind.png"; 
		}
		elseif ($json["currently"]["icon"] === "fog") {
			$pic_url = "fog.png"; 
		}
		elseif ($json["currently"]["icon"] === "cloudy") {
			$pic_url = "cloudy.png"; 
		}
		elseif ($json["currently"]["icon"] === "partly-cloudy-day") {
			$pic_url = "cloud_day.png"; 
		}
		elseif ($json["currently"]["icon"] === "partly-cloudy-night") {
			$pic_url = "cloud_night.png"; 
		} else {
			$pic_url = "";
		}
		//$header = array("{$json["currently"]["summary"]}", 
						//"{$temperature}", 
						//"{$pic_url}"); 
		//print_r($Header);
		return $pic_url;
	}



	function getPresipitation ($json) {
		if ($json["currently"]["precipIntensity"] >= 0 && $json["currently"]["precipIntensity"] < 0.002) {
			$precipitation = "None";
		}
		elseif ($json["currently"]["precipIntensity"] >= 0.002 && $json["currently"]["precipIntensity"] < 0.017) {
			$precipitation = "Very Light";
		}
		elseif ($json["currently"]["precipIntensity"] >= 0.017 && $json["currently"]["precipIntensity"] < 0.1) {
			$precipitation = "Light";
		}
		elseif ($json["currently"]["precipIntensity"] >= 0.1 && $json["currently"]["precipIntensity"] < 0.4) {
			$precipitation = "Moderate";
		}
		elseif ($json["currently"]["precipIntensity"] >= 0.4) {
			$precipitation = "Heavy";
		}
		else {
			$precipitation = "";
		}
		return $precipitation;
	}

	function getChance_of_Rain($json) {
		$chance_of_Rain = $json["currently"]["precipProbability"] * 100;
		$chance_of_Rain .= "%";
		return $chance_of_Rain;
	}

	function getWind_Speed($json) {
		$wind_Speed = $json["currently"]["windSpeed"];
		if ($_GET["temperature"] === "Fahrenheit") {
			$wind_Speed .= " mph";
		} else {
			$wind_Speed .= " m/s";
		}
		//$wind_Speed .= "mph";
		return $wind_Speed;
	}

	function getDew_Point($json) {
		$dew_Point = $json["currently"]["dewPoint"];
		if ($_GET["temperature"] === "Fahrenheit") {
			$dew_Point .= "°F";
		} else {
			$dew_Point .= "°C";
		}
		return $dew_Point;
	}

	function getHumidity($json) {
		$humidity = $json["currently"]["humidity"] * 100;
		$humidity .= "%";
		return $humidity;
	}

	function getVisibility($json) {
		$visibility = $json["currently"]["visibility"];
		if ($_GET["temperature"] === "Fahrenheit") {
			$visibility .= " mi";
		} else {
			$visibility .= " km";
		}
		//$visibility .= " mi";
		return $visibility;
	}

	function getSunrise($json) {
		$timestamp = intval($json["daily"]["data"][0]["sunriseTime"]);
		$timezone = $json["timezone"];
		date_default_timezone_set($timezone);
		$sunrise = date("h:i A", $timestamp);
		return $sunrise;
	}

	function getSunset($json) {
		$timestamp = intval($json["daily"]["data"][0]["sunsetTime"]);
		$timezone = $json["timezone"];
		date_default_timezone_set($timezone);
		$sunset = date("h:i A", $timestamp);
		return $sunset;
	}

	function getHourlyTime($json, $a) {
		$timestamp = intval($a["time"]);
		$timezone = $json["timezone"];
		date_default_timezone_set($timezone);
		$time = date("h:i A", $timestamp);
		return $time;
	}

	function getHourlyIcon($a) {
		if ($a["icon"] === "clear-day") {
			$pic_url = "images/clear.png"; 
		}
		elseif ($a["icon"] === "clear-night") {
			$pic_url = "images/clear_night.png"; 
		}
		elseif ($a["icon"] === "rain") {
			$pic_url = "images/rain.png"; 
		}
		elseif ($a["icon"] === "snow") {
			$pic_url = "images/snow.png"; 
		}
		elseif ($a["icon"] === "sleet") {
			$pic_url = "images/sleet.png"; 
		}
		elseif ($a["icon"] === "wind") {
			$pic_url = "images/wind.png"; 
		}
		elseif ($a["icon"] === "fog") {
			$pic_url = "images/fog.png"; 
		}
		elseif ($a["icon"] === "cloudy") {
			$pic_url = "images/cloudy.png"; 
		}
		elseif ($a["icon"] === "partly-cloudy-day") {
			$pic_url = "images/cloud_day.png"; 
		}
		elseif ($a["icon"] === "partly-cloudy-night") {
			$pic_url = "images/cloud_night.png"; 
		} else {
			$pic_url = "";
		}
		return $pic_url;
	}

	function getHourlyCloudCover ($a) {
		$cloudCover = $a['cloudCover'] * 100;
		$cloudCover .= "%";
		return $cloudCover;
	}

	function getHourlyTemp ($a) {
		$hourlyTemp = $a['temperature'];
		return $hourlyTemp;
	}

	function getHourlyWind ($a) {
		$wind = $a['windSpeed'];
		if ($_GET["temperature"] === "Fahrenheit") {
			$wind .= " mph";
		} else {
			$wind .= " m/s";
		}
		return $wind;
	}

	function getHourlyHumidity ($a) {
		$humidity = $a['humidity'] * 100;
		$humidity .= "%";
		return $humidity;
	}

	function getHourlyVisibility ($a) {
		$visibility = $a['visibility'];
		if ($_GET["temperature"] === "Fahrenheit") {
			$visibility .= " mi";
		} else {
			$visibility .= " km";
		}
		return $visibility;
	}

	function getHourlyPressure ($a) {
		$pressure = $a['pressure'];
		if ($_GET["temperature"] === "Fahrenheit") {
			$pressure .= " mb";
		} else {
			$pressure .= " hPa";
		}
		return $pressure;
	}

	function getDailyDay ($json, $a) {
		$timestamp = intval($a["time"]);
		$timezone = $json["timezone"];
		date_default_timezone_set($timezone);
		$day = date("l", $timestamp);
		return $day;
	}

	function getMonthDate ($json, $a) {
		$timestamp = intval($a["time"]);
		$timezone = $json["timezone"];
		date_default_timezone_set($timezone);
		$monthDate = date("M d", $timestamp);
		return $monthDate;
	}

	function getDailyIcon($a) {
		if ($a["icon"] === "clear-day") {
			$pic_url = "images/clear.png"; 
		}
		elseif ($a["icon"] === "clear-night") {
			$pic_url = "images/clear_night.png"; 
		}
		elseif ($a["icon"] === "rain") {
			$pic_url = "images/rain.png"; 
		}
		elseif ($a["icon"] === "snow") {
			$pic_url = "images/snow.png"; 
		}
		elseif ($a["icon"] === "sleet") {
			$pic_url = "images/sleet.png"; 
		}
		elseif ($a["icon"] === "wind") {
			$pic_url = "images/wind.png"; 
		}
		elseif ($a["icon"] === "fog") {
			$pic_url = "images/fog.png"; 
		}
		elseif ($a["icon"] === "cloudy") {
			$pic_url = "images/cloudy.png"; 
		}
		elseif ($a["icon"] === "partly-cloudy-day") {
			$pic_url = "images/cloud_day.png"; 
		}
		elseif ($a["icon"] === "partly-cloudy-night") {
			$pic_url = "images/cloud_night.png"; 
		} else {
			$pic_url = "";
		}
		return $pic_url;
	}

	function getMinTemp ($a) {
		$minTemp = intval($a['temperatureMin']);
		$minTemp .= "°";
		return $minTemp;
	}

	function getMaxTemp ($a) {
		$maxTemp = intval($a['temperatureMax']);
		$maxTemp .= "°";
		return $maxTemp;
	}

	function getDailyHeader ($a, $b) {
		$header = "Weather in ";
		$header .= $_GET['city'];
		$header .= ' on ';
		$header .= $b;
		return $header;
	}

	function getSummary ($a) {
		$summary = $a['summary'];
		return $summary;
	}

	function getDailySunRise($json, $a) {
		$timestamp = intval($a["sunriseTime"]);
		$timezone = $json["timezone"];
		date_default_timezone_set($timezone);
		$sunrise = date("h:i A", $timestamp);
		return $sunrise;
	}

	function getDailySunSet ($json, $a) {
		$timestamp = intval($a["sunsetTime"]);
		$timezone = $json["timezone"];
		date_default_timezone_set($timezone);
		$sunset = date("h:i A", $timestamp);
		return $sunset;
	}

	function getDailyHumidity ($a) {
		$humidity = $a['humidity'] * 100;
		$humidity .= "%";
		return $humidity;
	}

	function getDailyWindSpeed ($a) {
		$wind = $a['windSpeed'];
		if ($_GET["temperature"] === "Fahrenheit") {
			$wind .= " mph";
		} else {
			$wind .= " m/s";
		}
		return $wind;
	}

	function getDailyVisibility ($a) {
		foreach ($a as $value => $test) {
			if ($value == "visibility") {
				$visibility1 = $a['visibility'];
			    if ($_GET["temperature"] === "Fahrenheit") {
					$visibility1 .= " mi";
				} else {
					$visibility1 .= " km";
				}
				return $visibility1;
			} 
		}
		return "N.A";
	}

	function getDailyPressure ($a) {
		$pressure = $a['pressure'];
		if ($_GET["temperature"] === "Fahrenheit") {
			$pressure .= " mb";
		} else {
			$pressure .= " hPa";
		}
		return $pressure;
	}

?>
<?php 
	$json = getJson();
	//echo json_encode($json);
	$json1['rightNow']['pic_url'] = getIcon($json);
	$json1['rightNow']['pic_alt'] = getIcon1($json);
	$json1['rightNow']['weatherDes'] = $json['currently']['summary'] . ", " . intval($json["currently"]["temperature"]) . getPostfix($json);
	$json1['rightNow']['weatherCondition'] = $json["currently"]["summary"] . " in " . $_GET['city'] . ", " . $_GET['state'];
	$json1['rightNow']['temperature'] = intval($json["currently"]["temperature"]);
	$json1['rightNow']['lowTemperature'] = intval($json["daily"]["data"][0]["temperatureMin"]);
	$json1['rightNow']['highTemperature'] = intval($json["daily"]["data"][0]["temperatureMax"]);
	$json1['rightNow']['postPrefix'] = getPostfix($json);
	$json1['rightNow']['precipitation'] = getPresipitation($json);
	$json1['rightNow']['chanceOfRian'] = getChance_of_Rain($json);
	$json1['rightNow']['windSpeed'] = getWind_Speed($json);
	$json1['rightNow']['dewPoint'] = getDew_Point($json);
	$json1['rightNow']['humidity'] = getHumidity($json);
	$json1['rightNow']['visibility'] = getVisibility($json);
	$json1['rightNow']['sunrise'] = getSunrise($json);
	$json1['rightNow']['sunset'] = getSunset($json);

	for ($i = 0; $i < 24; $i++) {
		$hourly = $json["hourly"]["data"][$i+1];
		$json1['next24Hours'][$i]['hourlyTime'] = getHourlyTime($json, $hourly);
		$json1['next24Hours'][$i]['hourlySummary'] = getHourlyIcon($hourly);
		$json1['next24Hours'][$i]['hourlyCloudCover'] = getHourlyCloudCover($hourly);
		$json1['next24Hours'][$i]['hourlyTemp'] = getHourlyTemp($hourly);
		$json1['next24Hours'][$i]['hourlyWind'] = getHourlyWind($hourly);
		$json1['next24Hours'][$i]['hourlyHumidity'] = getHourlyHumidity($hourly);
		$json1['next24Hours'][$i]['hourlyVisibility'] = getHourlyVisibility($hourly);
		$json1['next24Hours'][$i]['hourlyPressure'] = getHourlyPressure($hourly);
	}

	for ($i = 0; $i < 7; $i++) {
		$daily = $json["daily"]["data"][$i+1];
		$date = getMonthDate($json, $daily);
		$json1['next7Days'][$i]['day'] = getDailyDay($json, $daily);
		$json1['next7Days'][$i]['monthDate'] = getMonthDate($json, $daily);
		$json1['next7Days'][$i]['icon'] = getDailyIcon($daily);
		$json1['next7Days'][$i]['minTemp'] = getMinTemp($daily);
		$json1['next7Days'][$i]['maxTemp'] = getMaxTemp($daily);
		$json1['next7Days'][$i]['header'] = getDailyHeader($daily, $date);
		$json1['next7Days'][$i]['summary'] =  getSummary($daily);
		$json1['next7Days'][$i]['sunrise'] = getDailySunRise($json, $daily);
		$json1['next7Days'][$i]['sunset'] = getDailySunSet($json, $daily);
		$json1['next7Days'][$i]['humidity'] = getDailyHumidity($daily);
		$json1['next7Days'][$i]['windSpeed'] = getDailyWindSpeed($daily);
		$json1['next7Days'][$i]['dailyvisibility'] = getDailyVisibility($daily);
		$json1['next7Days'][$i]['pressure'] = getDailyPressure($daily);
	}

	$json1['longitude'] = $json['longitude'];
	$json1['latitude'] = $json['latitude'];
	
	//echo json_encode($json);
	echo json_encode($json1);

	/*if($_GET['hello'] === '123'){
		echo 'hehe'
	}*/

?>