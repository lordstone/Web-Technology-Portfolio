<?php
session_start();
?>
<!DOCTYPE HTML>
<html>




<?php if(!(isset($_SESSION["submit"]))):
// define variables and set to empty values
$street_address = $city = $state = $degree = "";

?> 

    <head>
        <title>Forecast Research</title>
    <style>
            #container{
                margin: 0 auto;
                width: 420px;
            }
            #result_container{
                margin:0 auto;
                width: 420px;
                margin-top: 15px;
            }
            h1{
                text-align: center;
            }
            table.form_table{
                align-content: center; 
                margin: auto;
                text-align: center;
                border: 1px solid black;
                padding: 10px;
                padding-right: 80px;
                width: 420px;
                border-width: 2px;
            }
            .input_area{
                width: 170px;
            }
            td.keep_left{
                text-align: left;
            }
            .keep_center{
                text-align: center;
            }
            span.italic_text{
                font-style: italic;
            }
            table.result_table{
                align-content: center; 
                margin: auto;
                text-align: center;
                border: 1px solid black;
                padding-top: 10px;
                padding-left: 50px;
                padding-right: 50px;
                padding-bottom: 30px;
                width: 420px;
                border-width: 2px;
            }td.left_column{
                text-align: left;
            }td.right_column{
                text-align: left;
            }
            .header_1{
                text-align: center;
                font-size: 24px;
                font-weight: bold;
            }
    </style>
        <script type="text/javascript">
            function func_clear(){
                location.reload();
            }//to clear all the forms
            function func_validate(){
                var execFlag = true;
                if(myform.street_address.value=="" || myform.street_address.value==null){
                    alert("Please enter value for Street Address");
                    execFlag = false;
                }
                if(myform.city.value=="" || myform.city.value==null){
                    alert("Please enter value for City");
                    execFlag = false;   
                }
                if(myform.state.value=="" || myform.state.value==null ||myform.state.value=="Select your state..."){
                    alert("Please enter value for State");
                    execFlag = false;    
                }
                return execFlag;
            }//end func_validate
            
            function clear_form(){
                //alert("jiji");
                
                myform.reset();
                myform.street_address.value = "";
                myform.city.value = "";
                myform.state.selectedIndex = 0;
                document.getElementById("fahrenheit").checked = true;
                document.getElementById("celsius").checked = false;
                
                    var my_obj = document.getElementById("result_container");
                    my_obj.parentNode.removeChild(my_obj);
                
            }//end func clear form
        </script>
    </head>
    <body>
        <div id = "container">
            <h1>Forecast Search</h1>
            <form name="myform" method="post" action="<?php echo $_SERVER['PHP_SELF'];?>" >
                <table class="form_table">
                    <tr>
                        <td class="keep_left">Street Address:*</td>
                        <td class="keep_left">
                            <input type="text" class="input_area" name="street_address" value = "<?php echo isset($_POST['street_address']) ? $_POST['street_address'] : ''?>"</input>
                        </td>
                    </tr>
                    <tr>
                        <td class="keep_left">City:*</td>
                        <td class="keep_left"><input type="text" class="input_area" name="city" value = "<?php echo isset($_POST['city']) ? $_POST['city'] : ''?>"></td>
                    </tr>
                    <tr>
                        <td class="keep_left">State:*</td>
                        <td class="keep_left">
                            <select name="state" >
                                <option <?php echo !isset($_POST['state']) ? 'selected' : '' ?> disabled>
                                    Select your state...
                                </option>
                                <option value="AL" <?php echo ($_POST['state']=='AL') ? 'selected' : '' ?>>Alabama</option>
                                <option value="AK" <?php echo ($_POST['state']=='AK') ? 'selected' : '' ?>>Alaska</option>
                                <option value="AZ" <?php echo ($_POST['state']=='AZ') ? 'selected' : '' ?>>Arizona</option>
                                <option value="AR" <?php echo ($_POST['state']=='AR') ? 'selected' : '' ?>>Arkansas</option>
                                <option value="CA" <?php echo ($_POST['state']=='CA') ? 'selected' : '' ?>>California</option>
                                <option value="CO" <?php echo ($_POST['state']=='CO') ? 'selected' : '' ?>>Colorado</option>
                                <option value="CT" <?php echo ($_POST['state']=='CT') ? 'selected' : '' ?>>Connecticut</option>
                                <option value="DE" <?php echo ($_POST['state']=='DE') ? 'selected' : '' ?>>Delaware</option>
                                <option value="DC" <?php echo ($_POST['state']=='DC') ? 'selected' : '' ?>>District of Columbia</option>
                                <option value="FL" <?php echo ($_POST['state']=='FL') ? 'selected' : '' ?>>Florida</option>
                                <option value="GA" <?php echo ($_POST['state']=='GA') ? 'selected' : '' ?>>Georgia</option>
                                <option value="HI" <?php echo ($_POST['state']=='HI') ? 'selected' : '' ?>>Hawaii</option>
                                <option value="ID" <?php echo ($_POST['state']=='ID') ? 'selected' : '' ?>>Idaho</option>
                                <option value="IL" <?php echo ($_POST['state']=='IL') ? 'selected' : '' ?>>Illinois</option>
                                <option value="IN" <?php echo ($_POST['state']=='IN') ? 'selected' : '' ?>>Indiana</option>
                                <option value="IA" <?php echo ($_POST['state']=='IA') ? 'selected' : '' ?>>Iowa</option>
                                <option value="KS" <?php echo ($_POST['state']=='KS') ? 'selected' : '' ?>>Kansas</option>
                                <option value="KY" <?php echo ($_POST['state']=='KY') ? 'selected' : '' ?>>Kentucky</option>
                                <option value="LA" <?php echo ($_POST['state']=='LA') ? 'selected' : '' ?>>Louisiana</option>
                                <option value="ME" <?php echo ($_POST['state']=='ME') ? 'selected' : '' ?>>Maine</option>
                                <option value="MD" <?php echo ($_POST['state']=='MD') ? 'selected' : '' ?>>Maryland</option>
                                <option value="MA" <?php echo ($_POST['state']=='MA') ? 'selected' : '' ?>>Massachusetts</option>
                                <option value="MI" <?php echo ($_POST['state']=='MI') ? 'selected' : '' ?>>Michigan</option>
                                <option value="MN" <?php echo ($_POST['state']=='MN') ? 'selected' : '' ?>>Minnesota</option>
                                <option value="MS" <?php echo ($_POST['state']=='MS') ? 'selected' : '' ?>>Mississippi</option>
                                <option value="MO" <?php echo ($_POST['state']=='MO') ? 'selected' : '' ?>>Missouri</option>
                                <option value="MT" <?php echo ($_POST['state']=='MT') ? 'selected' : '' ?>>Montana</option>
                                <option value="NE" <?php echo ($_POST['state']=='NE') ? 'selected' : '' ?>>Nebraska</option>
                                <option value="NV" <?php echo ($_POST['state']=='NV') ? 'selected' : '' ?>>Nevada</option>
                                <option value="NH" <?php echo ($_POST['state']=='NH') ? 'selected' : '' ?>>New Hampshire</option>
                                <option value="NJ" <?php echo ($_POST['state']=='NJ') ? 'selected' : '' ?>>New Jersey</option>
                                <option value="NM" <?php echo ($_POST['state']=='NM') ? 'selected' : '' ?>>New Mexico</option>
                                <option value="NY" <?php echo ($_POST['state']=='NY') ? 'selected' : '' ?>>New York</option>
                                <option value="NC" <?php echo ($_POST['state']=='NC') ? 'selected' : '' ?>>North Carolina</option>
                                <option value="ND" <?php echo ($_POST['state']=='ND') ? 'selected' : '' ?>>North Dakota</option>
                                <option value="OH" <?php echo ($_POST['state']=='OH') ? 'selected' : '' ?>>Ohio</option>
                                <option value="OK" <?php echo ($_POST['state']=='OK') ? 'selected' : '' ?>>Oklahoma</option>
                                <option value="OR" <?php echo ($_POST['state']=='OR') ? 'selected' : '' ?>>Oregon</option>
                                <option value="PA" <?php echo ($_POST['state']=='PA') ? 'selected' : '' ?>>Pennsylvania</option>
                                <option value="RI" <?php echo ($_POST['state']=='RI') ? 'selected' : '' ?>>Rhode Island</option>
                                <option value="SC" <?php echo ($_POST['state']=='SC') ? 'selected' : '' ?>>South Carolina</option>
                                <option value="SD" <?php echo ($_POST['state']=='SD') ? 'selected' : '' ?>>South Dakota</option>
                                <option value="TN" <?php echo ($_POST['state']=='TN') ? 'selected' : '' ?>>Tennessee</option>
                                <option value="TX" <?php echo ($_POST['state']=='TX') ? 'selected' : '' ?>>Texas</option>
                                <option value="UT" <?php echo ($_POST['state']=='UT') ? 'selected' : '' ?>>Utah</option>
                                <option value="VT" <?php echo ($_POST['state']=='VT') ? 'selected' : '' ?>>Vermont</option>
                                <option value="VA" <?php echo ($_POST['state']=='VA') ? 'selected' : '' ?>>Virginia</option>
                                <option value="WA" <?php echo ($_POST['state']=='WA') ? 'selected' : '' ?>>Washington</option>
                                <option value="WV" <?php echo ($_POST['state']=='WV') ? 'selected' : '' ?>>West Virginia</option>
                                <option value="WI" <?php echo ($_POST['state']=='WI') ? 'selected' : '' ?>>Wisconsin</option>
                                <option value="WY" <?php echo ($_POST['state']=='WY') ? 'selected' : '' ?>>Wyoming</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td class="keep_left">Degree:*</td>
                        <td class="keep_left">
                            <input type="radio" name="degree" value="fahrenheit" id="fahrenheit" <?php echo ($_POST['degree']!='fahrenheit') ? '' : 'checked' ?> checked>Fahenheit
                            <input type="radio" name="degree" value="celsius" id="celsius" <?php echo ($_POST['degree']=='celsius') ? 'checked' : '' ?>>Celsius
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td class="keep_left">
                            <input type="submit" name="submit" value="Search" onclick="return func_validate();">
                            <input type="button" value="Clear" onclick="return clear_form();">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" class="keep_left"><span class="italic_text">* - Mandatory fields.</span></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td class="keep_center">
                            <a href="http://forecast.io/">Powered by Forecast.io</a>
                        </td>
                    </tr>
                </table>
            </form>
        </div>
      

<?php
    
if(isset($_POST["clear"])){
    unset($_POST);
    unset($_SESSION);
    unset($street_address);
    unset($city);
    unset($state);
    unset($degree);
    session_unset();
    echo "jiji";
}
    

if(isset($_POST["submit"])) {
     //session_start();
     $_SESSION["street_address"] = $_POST["street_address"];
     $_SESSION["city"] = $_POST["city"];
     $_SESSION["state"] = $_POST["state"];
     $_SESSION["degree"] = $_POST["degree"];
    
    // $xml_url = str_replace(" ","+","http://maps.google.com/maps/api/geocode/xml?address=" . $_SESSION["street_address"] . "," . $_SESSION["city"]. "," . $_SESSION["state"]);
   
    $google_api = "AIzaSyCjwk-WodCs7apiDzAHnA0qtoZdrZASkqE";
    $xml_url = str_replace(" ","+","https://maps.googleapis.com/maps/api/geocode/xml?address=" .     $_SESSION["street_address"] . "," . $_SESSION["city"]. "," . $_SESSION["state"] ."&key=" . $google_api);
    
    
    
      //echo $_SESSION["street_address"] . ":" . $_SESSION["city"] . ":" . $_SESSION["state"];
    //echo "|URL:" . $xml_url;
     $xml_obj = simplexml_load_file($xml_url) or die("Error: Cannot create object");
 //echo #xml_obj;
     $lattitude = $xml_obj->result[0]->geometry[0]->location[0]->lat ;
        //Get lattitude
     
     $longitude = $xml_obj->result[0]->geometry[0]->location[0]->lng ;
        //Get Longitude
     /*
     echo "Lattitude:" . $lattitude;
     echo "Longitude:" . $longitude;    
     
     */   
     if($_SESSION["degree"]=="fahrenheit"):
        $unit = "us";
     else:
        $unit = "si";
     endif;
     
     $json_filecontents =  file_get_contents("https://api.forecast.io/forecast/02a5178ae673e79ab0d7a1e23080fcd1/" .$lattitude ."," . $longitude . "?units=" . $unit . "&exclude=flags");
     //get weather forecast contents from forecast.io
     
     //echo  $json_filecontents . "<br />";
     
     $json_obj = json_decode($json_filecontents);
     //parse json into json_obj
     
     $summary = $json_obj->{"currently"}->{"summary"};
     //echo $summary . "<br />";
     
     if ($_SESSION["degree"] == "fahrenheit"){
         $temperature = number_format($json_obj->{"currently"}->{"temperature"},0,'.', ',') . '&#176 F';
         $dew_point = number_format(round($json_obj->{"currently"}->{"dewPoint"}), 0 , '.', ',') . '&#176 F';
     }else{
         $temperature = number_format($json_obj->{"currently"}->{"temperature"},0,'.', ',') . '&#176 C';
         $dew_point = number_format(round($json_obj->{"currently"}->{"dewPoint"}), 0 , '.', ',') . '&#176 C';
     }
     //change the temperature to a certain format
     //echo $temperature . "<br />";
     
     //set the icon path
     //$icon_text = $json_obj->{"currently"}->{"icon"};
     $icon_path = $json_obj->{"currently"}->{"icon"};
     $icon_path = strtolower($icon_path);
     $icon_path = str_replace("partly-","", $icon_path);
     $icon_path = "/cs571hw6img/" . str_replace(" ","_", str_replace("-","_",$icon_path)) . ".png";
     if($icon_path == "/cs571hw6img/cloudy_night.png" || $icon_path == "/cs571hw6img/cloudy_day.png"){
         $icon_path = str_replace("dy","d", $icon_path);
     }//end if
     if($icon_path == "/cs571hw6img/clear_day.png"){
         $icon_path = "/cs571hw6img/clear.png";
     }//end if
    
     //echo $icon_path . "<br />";
     
     $precipintensity = $json_obj->{"currently"}->{"precipIntensity"};
      if ($_SESSION["degree"] == "fahrenheit"){
         if($precipintensity == 0):
            $precipitation = "None";
         elseif($precipintensity < 0.002):
            $precipitation = "None";
         elseif($precipintensity < 0.017):
            $precipitation = "Very Light";
         elseif($precipintensity < 0.1):
            $precipitation = "Light";
         elseif($precipintensity < 0.4):
            $precipitation = "Moderate";
         else:
            $precipitation = "Heavy";
         endif;
      }else{
          if($precipintensity == 0):
            $precipitation = "None";
         elseif($precipintensity < 0.002 * 25.4):
            $precipitation = "None";
         elseif($precipintensity < 0.017 * 25.4):
            $precipitation = "Very Light";
         elseif($precipintensity < 0.1 * 25.4):
            $precipitation = "Light";
         elseif($precipintensity < 0.4 * 25.4):
            $precipitation = "Moderate";
         else:
            $precipitation = "Heavy";
          endif;
      }
     //echo $precipitation . "<br />";
     
     $chance_of_rain = number_format(round($json_obj->{"currently"}->{"precipProbability"} * 100),0,'.', ',') . '%';
    if($unit == 'us'){
        $wind_speed = number_format(round($json_obj->{"currently"}->{"windSpeed"}), 0 , '.', ',') .' mph';
         $visibility = number_format(round($json_obj->{"currently"}->{"visibility"}), 0 , '.', ',') . ' mi';
    }else{
        $ws = $json_obj->{"currently"}->{"windSpeed"} ;
        $wind_speed = number_format(round($ws), 0 , '.', ',') .' m/s';
         $visibility = number_format(round($json_obj->{"currently"}->{"visibility"}), 0 , '.', ',') . ' km';
    }
     
     
     $humidity  = number_format(round($json_obj->{"currently"}->{"humidity"} * 100),0,'.', ',') . '%';
    
     
    $time_zone = $json_obj->{"timezone"};
    
     date_default_timezone_set($time_zone);
     $sunrise = date("h:i A" ,$json_obj->{"daily"}->{"data"}[0] ->{"sunriseTime"});
     $sunset = date("h:i A" ,$json_obj->{"daily"}->{"data"}[0] ->{"sunsetTime"});
     
     /*
         echo $chance_of_rain . "<br />";
         echo $wind_speed . "<br />";
         echo $dew_point . "<br />";
         echo $humidity . "<br />";
         echo $visibility . "<br />";
         echo $sunrise . "<br />";
         echo $sunset . "<br />";
     */
?>

        <div id="result_container">
            <table class="result_table">
                <tr>
                    <td colspan="2" class="header_1"><?php echo $summary;?></td>
                </tr>
                <tr>
                    <td colspan="2" class="header_1"><?php echo $temperature;?></td>
                </tr>
                <tr>
                    <td colspan="2" class="header_1"><img src="<?php echo $icon_path;?>" alt="<?php echo $summary ?>"/></td>
                </tr>
                <tr>
                    <td class="left_column"><span>Precipitation:</span></td>
                    <td class="right_column"><?php echo $precipitation?></td>
                </tr>
                <tr>
                    <td class="left_column"><span>Chance of Rain:</span></td>
                    <td class="right_column"><?php echo $chance_of_rain?></td>
                </tr>
                <tr>
                    <td class="left_column"><span>Wind Speed:</span></td>
                    <td class="right_column"><?php echo $wind_speed?></td>
                </tr>
                <tr>
                    <td class="left_column"><span>Dew Point:</span></td>
                    <td class="right_column"><?php echo $dew_point?></td>
                </tr>
                <tr>
                    <td class="left_column"><span>Humidity:</span></td>
                    <td class="right_column"><?php echo $humidity?></td>
                </tr>
                <tr>
                    <td class="left_column"><span>Visibility:</span></td>
                    <td class="right_column"><?php echo $visibility?></td>
                </tr>
                <tr>
                    <td class="left_column"><span>Sunrise:</span></td>
                    <td class="right_column"><?php echo $sunrise?></td>
                </tr>
                <tr>
                    <td class="left_column"><span>Sunset:</span></td>
                    <td class="right_column"><?php echo $sunset?></td>
                </tr>
            </table>
        </div>
    
<?php 
 }//end of output the contents
 if(isset($_POST["logout"])) {
     session_destroy();
     unset($_SESSION);
 } 
?> 


<?php endif; ?> 
        </body>
</html>
