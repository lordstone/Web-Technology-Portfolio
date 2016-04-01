//facebook



 var mapDefined = false;
var mytimezone;
function fbHandler()
{
		
		FB.ui({
			method: 'feed',
			description: (String($('.my_summary1').html() + ',' + $('.right_now_temperature_text').html() + $('.right_now_temperature_sign').html())),
              
			name:'Current Weather in ' + $('#city').val()  + ", " + $("#state option:selected").val(),
			link: 'http://forecast.io/',
			picture: ('http://www-scf.usc.edu/~chengxis/Abdq122r89h/hw8/' + $('#right_now_weather_image').attr('src')),
			caption: 'WEATHER INFORMATION FROM FORCAST.IO',
		}, function(response){
            if (response && response.post_id) {
               alert('Posted Successfully');
             } else {
               alert('Not Posted');
             }
            
        });
	
}

var map;
function setupMap(lon, lat){
    
    if(mapDefined == false){
    //setupMap
        
        
    
   map = new OpenLayers.Map("basicMap");
    var mapnik = new OpenLayers.Layer.OSM();
    var layer_cloud = new OpenLayers.Layer.XYZ(
        "clouds",
        "http://${s}.tile.openweathermap.org/map/clouds/${z}/${x}/${y}.png",
        {
            isBaseLayer: false,
            opacity: 0.5,
            sphericalMercator: true
        }
    );

    var layer_precipitation = new OpenLayers.Layer.XYZ(
        "precipitation",
        "http://${s}.tile.openweathermap.org/map/precipitation/${z}/${x}/${y}.png",
        {
            isBaseLayer: false,
            opacity: 0.5,
            sphericalMercator: true
        }
    );

    map.addLayers([mapnik,  layer_cloud ,layer_precipitation]);
        
    mapDefined = true;
    }
        
    map.setCenter(new OpenLayers.LonLat(lon,lat).transform(new OpenLayers.Projection("EPSG:4326"),         map.getProjectionObject()
    ), 10);
}

function getRightTime(mytime){
    return moment.tz(mytime*1000, mytimezone).format("hh:mm A");
    /*
    var ampm = "";
    var mydate = new Date(mytime * 1000);
    var minutes = String(mydate.getMinutes());
    var hours = mydate.getHours();
    var str = "";
    if(hours == 0){
        hours = 12;
        ampm = ' AM'
    }
    else if(hours > 12) {
        ampm = ' PM';
        hours -= 12;
    }else if(hours == 12){
        ampm = ' PM';
    }else{
        ampm = ' AM';
    }
    if(minutes.length == 1) minutes = '0' + minutes;
    str = hours + ":" + minutes + ampm;
    return str;
    */
}

function getPrecip(precipintensity){
    var precipitation = "";
    if($('#fahrenheit').is(':checked')){
        if(precipintensity == 0)
            precipitation = "None";
        else if(precipintensity < 0.002)
            precipitation = "None";
        else if(precipintensity < 0.017)
            precipitation = "Very Light";
        else if(precipintensity < 0.1)
            precipitation = "Light";
        else if(precipintensity < 0.4)
            precipitation = "Moderate";
        else
            precipitation = "Heavy";
    }else{
        if(precipintensity == 0)
            precipitation = "None";
        else if(precipintensity < 0.002 * 25.4)
            precipitation = "None";
        else if(precipintensity < 0.017 * 25.4)
            precipitation = "Very Light";
        else if(precipintensity < 0.1 * 25.4)
            precipitation = "Light";
        else if(precipintensity < 0.4 * 25.4)
            precipitation = "Moderate";
        else
            precipitation = "Heavy";
    }
    return precipitation;
}

function getIconPath(icon){
    var icon_path = "";
    icon_path = "img/" + icon;
    icon_path = String(icon_path).toLowerCase();
    icon_path = String(icon_path).replace("partly-","");
    icon_path = icon_path.replace(" ","_");
    icon_path = icon_path.replace("-","_");
    if(icon_path == "img/cloudy_night" || icon_path == "img/cloudy_day"){
     icon_path = icon_path.replace("dy","d");
    }//end if
    if(icon_path == "img/clear_day"){
     icon_path = "img/clear";
    }//end if
    icon_path += ".png";
    //icon_path = "http://www-scf.usc.edu/~chengxis/Abdq122r89h/hw8/" + icon_path;
    //alert(icon_path);
    return icon_path;
}

function setupCurrently(result){
    
    //handling main image
    var icon_path = getIconPath(result.currently.icon);
    $('#right_now_weather_image').attr("src",icon_path);
    $('#right_now_weather_image').attr("alt",result.currently.icon);
    $('#right_now_weather_image').attr("title",result.currently.icon);
    //end of the right now img
    
    //Currently Summary Test
    var right_now_text = "";
    var right_now_text1 = "";
    right_now_text = result.currently.summary;
    right_now_text1 = "in " + $("#city").val() + ", " + $("#state option:selected").val();
    //alert(right_now_text);
    $('.my_summary1').html(right_now_text);
    $('.my_summary2').html(right_now_text1);
    var temp_sign = "";
    var temperature_text = "";
    var dew_point_text = "";
    var chance_of_rain = ""; 
    var precipintensity = result.currently.precipIntensity;
    var precipitation = "";
    var wind_speed = "";
    var visibility = "";
    var humidity = "";
    var sunrise = "";
    var sunset = "";

    var time_zone = result.timezone;

    //sunrise = result.daily.data[0].sunriseTime;
    //sunset = result.daily.data[0].sunsetTime;
    sunrise = getRightTime(result.daily.data[0].sunriseTime);
    sunset = getRightTime(result.daily.data[0].sunsetTime);
    $('.right_now_sunrise').html(sunrise);
    $('.right_now_sunset').html(sunset);
    
    if($('#fahrenheit').is(':checked')){
        temp_sign ="&#176 F";
        wind_speed = String(Math.round(result.currently.windSpeed* 100) / 100) +' mph';
        visibility = String(Math.round(result.currently.visibility* 100) / 100) + ' mi';
    }else{
        temp_sign ="&#176 C";
        wind_speed = String(Math.round(result.currently.windSpeed* 100) / 100) +' m/s';
        visibility = String(Math.round(result.currently.visibility* 100) / 100) + ' km';
    }
    
    $('.right_now_precip').html(getPrecip(precipintensity));
    $('.right_now_wind').html(wind_speed);
    $('.right_now_visibility').html(visibility);
    
    humidity  = String(Math.round(result.currently.humidity * 100)) + '%';
    $('.right_now_humidity').html(humidity);
    
    dew_point_text = String(Math.round(result.currently.dewPoint* 100) / 100) + temp_sign;
    $('.right_now_dew').html(dew_point_text);
    
    chance_of_rain = String(Math.round(result.currently.precipProbability * 100)) + '%';
    $('.right_now_rain').html(chance_of_rain);
    
    //big temperature
    var tmpstr = "";
    tmpstr = String(Math.round(result.currently.temperature));
    $('.right_now_temperature_text').html(tmpstr);
    $('.right_now_temperature_sign').html(temp_sign);
    
    //min and max temp
    
    var tmpstr1 = ""; var tmpstr2 = "";
    tmpstr1 = 'L:' + String(Math.round(result.daily.data[0].temperatureMin)) + '&#176';
    $('.right_now_min_temp_text').html(tmpstr1);
    tmpstr2 = 'H:' + String(Math.round(result.daily.data[0].temperatureMax)) + '&#176';
    $('.right_now_max_temp_text').html(tmpstr2);
    
}


function setup24hours(result, i){
    
    
    var icon_path = getIconPath(result.hourly.data[i].icon);
    //$('#right_now_weather_image').attr("src",icon_path);
    
    var that_time = getRightTime(result.hourly.data[i].time);
    //var that_time = result.hourly.data[i].time;
    var temp_sign = "";
    var temperature_text = "";
    var precipintensity = result.hourly.data[i].precipIntensity;
    var precipitation = "";
    var wind_speed = "";
    var visibility = "";
    var humidity = "";
    var tmpstr = "";
    var pressure = "";
    var cloudcover = "";
    
    if($('#fahrenheit').is(':checked')){
        temp_sign ='&#176 F';
        wind_speed = String(Math.round(result.hourly.data[i].windSpeed* 100) / 100) +' mph';
        visibility = String(Math.round(result.hourly.data[i].visibility* 100) / 100) + ' mi';
        pressure = String(Math.round(result.hourly.data[i].pressure* 100) / 100) + ' mb';
    }else{
        temp_sign ='&#176 C';
        wind_speed = String(Math.round(result.hourly.data[i].windSpeed* 100) / 100) +' m/s';
        visibility = String(Math.round(result.hourly.data[i].visibility* 100) / 100) + ' km';
        pressure = String(Math.round(result.hourly.data[i].pressure* 100) / 100) + ' hPa';
    
    }
    
    humidity  = String(Math.round(result.hourly.data[i].humidity * 100)) + '%';
    tmpstr = String(Math.round(result.hourly.data[i].temperature* 100) / 100);
    cloudcover = String(Math.round(result.hourly.data[i].cloudCover* 100)) + '%';
    
    //add the present row
    $('.next24hr_tbody')
        .attr('style','border: 0 0 0 0')
        .append($('<tr>')
                .attr('style','background-color: white; border: 0 0 0 0')
                .append($('<td>')
                       .html(that_time)
                       )
                .append($('<td>')
                        .append($('<img>')
                           .attr('src',icon_path)
                            .attr('alt',result.hourly.data[i].icon)
                                .attr('title',result.hourly.data[i].icon)
                                
                            .attr('style','height: 30px; width: 30px')
                           )
                        )
                .append($('<td>')
                        .html(cloudcover)
                        )
                .append($('<td>')
                        .html(tmpstr)
                        )
                .append($('<td>')
                        .append($('<a>')
                                .attr('class', 'glyphicon glyphicon-plus')
                                .attr('data-toggle', 'collapse')
                                .attr('href', '#divcollapse'+i)
                                .attr('aria-controls','#divcollapse'+i)
                               )
                        )   
                );
    
    //add the hidden row
    $('.next24hr_tbody')
    .append($('<tr>')
            .attr('class', 'hiddenTR')
            //.attr('style','height: 0; border: 0 0 0 0; background-color: white')
            .append($('<td>')
                    .attr('class','hiddrenRow hiddenTD')
                    .attr('style','background-color: #F9F9F9; height: 0; padding: 0 0 0 0')
                    .attr('colspan','5')
                    .append($('<div>')
                            .attr('class','accordion-body collapse hiddenDIV table-responsive')
                            .attr('id','divcollapse' + i )
                            //.attr('style','background-color: #F9F9F9; padding-left: 10px; padding-right: 10px; padding-top: 10px')
                            .append($('<table>')
                                    .attr('class','center table table-striped table-responsive hiddenTABLE')
                                    //.attr('style','background-color: #F9F9F9')
                                    .append($('<thead>')
                                           .attr('class','text-bold hiddenTHEAD')
                                           //.attr('style','background-color: white; border:0 0 0 0')
                                           .append($('<tr>')
                                                   .append($('<td>')
                                                         .html('Wind')
                                                         )
                                                   .append($('<td>')
                                                         .html('Humidity')
                                                         )
                                                   .append($('<td>')
                                                         .html('Visibility')
                                                         )
                                                   .append($('<td>')
                                                         .html('Pressure')
                                                         )
                                                  )
                                           )
                                    .append($('<tbody>')
                                           //.attr('style','background-color: #F9F9F9')
                                           .append($('<tr>')
                                                   .append($('<td>')
                                                         .html(wind_speed)
                                                         )
                                                   .append($('<td>')
                                                         .html(humidity)
                                                         )
                                                   .append($('<td>')
                                                         .html(visibility)
                                                         )
                                                   .append($('<td>')
                                                         .html(pressure)
                                                         )
                                                  )
                                           )
                                   )
                           )
                   )
            );
    
    //Below is the original html formatted, better to stick to the jquery version
    /*
    $('.next24hr_tbody')
        .append('<tr style="height: 0; border: 0 0 0 0; background-color: white"><td class="hiddenRow" style=" background-color: #F9F9F9; height: 0; padding: 0 0 0 0" colspan=5><div class="accordion-body collapse" id="divcollapse' + i + '" style="background-color: #F9F9F9; padding-left: 10px; padding-right: 10px; padding-top: 10px"><table class="center table table-striped table-responsive" style="background-color: #F9F9F9"><thead class="text-bold" style="background-color: white; border:0"><tr><td>Wind</td><td>Humidity</td><td>Visibility</td><td>Pressure</td></tr></thead><tbody style="background-color: #F9F9F9"><tr><td>' + wind_speed + '</td><td>' + humidity +'</td><td>' + visibility +'</td><td>' + pressure + '</td></tr></tbody></table></div></td></tr>');
*/
    
    //end of appending everything
    
}

function getMyDay(result){
    
    return moment.tz(result*1000, mytimezone).format("dddd");
    
   /*
    var foo = new Date(result * 1000);
    var daynum = 0;
    daynum = foo.getDay();
    switch(daynum){
        case 0:
        return 'Sunday';
        break;
        case 1:
 return 'Monday';
        break;
        case 2:
 return 'Tuesday';
        break;
        case 3:
 return 'Wednesday';
        break;
        case 4:
 return 'Thursday';
        break;
        case 5:
 return 'Friday';
        break;
        case 6:
 return 'Saturday';
        break;
            
    }
    */
}

function getMyDayColor(i){
    var bg_color = "";
    switch (i) { 
            case 0:
                bg_color = "rgb(54,125,181)";
                break;
            case 1:
                bg_color = "rgb(236,68,68)";
                break;
            case 2:
                bg_color = "rgb(230,142,79)";
                break;
            case 3:
                bg_color = "rgb(167,164,57)";
                break;
            case 4:
                bg_color = "rgb(151,112,167)";
                break;
            case 5:
                bg_color = "rgb(243,124,126)";
                break;
            default:
                bg_color = "rgb(206,69,113)";
        }//end switch color
    return bg_color;
}

function setup24hrsHeader(result){
    
    $('.my24hrtable').empty();//remove all children
    
    if($('#fahrenheit').is(':checked')){
        $('.next24hr_temp_hd').html("Temp \( &#176 F \)");
    }else{
        $('.next24hr_temp_hd').html("Temp \( &#176 C \)");
    }
}

function getMyMonth(result){
    return moment.tz(result*1000, mytimezone).format("MMM DD");
    /*
    var foo = new Date(result * 1000);
    var month = new Array();
month[0] = "Jan";
month[1] = "Feb";
month[2] = "Mar";
month[3] = "Apr";
month[4] = "May";
month[5] = "Jun";
month[6] = "Jul";
month[7] = "Aug";
month[8] = "Sept";
month[9] = "Oct";
month[10] = "Nov";
month[11] = "Dec";
var myMonth = month[foo.getMonth()];
    var myDate = foo.getDate();
    var mystr = "";
    mystr = myMonth + ' ' + myDate;
    return mystr;
    */
}

function getvisibility(input, fah){
    if(isNaN(input)){
        return 'N.A.';
    }else{
        if(fah.is(':checked')){
            return String(Math.round(input * 100) / 100) + ' mi';
        }else{
            return String(Math.round(input * 100) / 100) +  ' km';
        }
    }
}

function setup7days(result){
    //test
    /*
    var foo = new Date(result.daily.data[7].time * 1000);
    var daynum = 0;
    daynum = foo.getDay();
    alert('i=0 day:' + daynum );
    */
    
    //end test
    
    
    for(var i=0;i<7;i++){
        
        //USE i+1 !!
        
        var bg_color = getMyDayColor(i);
        //start
        
        var myday = "";
        var mymonthday = "";
        
        myday = getMyDay(result.daily.data[i+1].time);
        mymonthday = getMyMonth(result.daily.data[i+1].time);
        
        var dailysummary = result.daily.data[i+1].summary;
        var icon_path = getIconPath(result.daily.data[i+1].icon);
        var tempMin = String(Math.round(result.daily.data[i+1].temperatureMin)) + '&#176';
        var tempMax = String(Math.round(result.daily.data[i+1].temperatureMax)) + '&#176';
        var textHeader = 'Weather in ' + $("#city").val() +' on ' + mymonthday;
        var precipintensity = result.daily.data[i+1].precipIntensity;
        var precipitation = "";
        var wind_speed = "";
        var visibility = "";
        var humidity = "";
        var tmpstr = "";
        var pressure = "";
        var cloudcover = "";
        var mysunrise = "";
        var mysunset = "";
        
        mysunrise = getRightTime(result.daily.data[i+1].sunriseTime);
        mysunset = getRightTime(result.daily.data[i+1].sunsetTime);
        //mysunrise =result.daily.data[i+1].sunriseTime;
        //mysunset = result.daily.data[i+1].sunsetTime;
        visibility = getvisibility(result.daily.data[i+1].visibility, $('#fahrenheit') );
        if($('#fahrenheit').is(':checked')){
            temp_sign ='&#176 F';
            wind_speed = String(Math.round(result.daily.data[i+1].windSpeed* 100) / 100) +' mph';      
            pressure = String(Math.round(result.daily.data[i+1].pressure* 100) / 100) + ' mb';
        }else{
            temp_sign ='&#176 C';
            wind_speed = String(Math.round(result.daily.data[i+1].windSpeed* 100) / 100) +' m/s';
            pressure = String(Math.round(result.daily.data[i+1].pressure* 100) / 100) + ' hPa';
        }

        
        
        humidity  = String(Math.round(result.daily.data[i+1].humidity* 100)) + '%';
        tmpstr = String(Math.round(result.daily.data[i+1].temperature* 100) / 100);
        cloudcover = String(Math.round(result.daily.data[i+1].cloudCover* 100)) + '%';
        
        var toAppend = "";
        
        if(i == 0){
            toAppend += '<div class="col-xs-12 col-md-1 col-md-offset-2 my7daysbar1" style="background-color:' + bg_color +'; margin-top: 10px;" data-toggle="modal" data-target="#myModal'+i+'">';
        }else{
            toAppend += '<div class=" col-xs-12 col-md-1  my7daysbar" style="background-color:' + bg_color +'; margin-top: 10px; " data-toggle="modal" data-target="#myModal'+i+'">';
        }
        //end of start of first div
        
        //toAppend += '<div class="row">';
        
            toAppend += '<div class="col-xs-12 text-center mytile" style="margin-top:10px; padding: 0">';
            toAppend += '<span class="text_white">' + myday + '</span></div>';

            toAppend += '<div class="col-xs-12 text-center mytile" style="margin-top:10px; padding: 0">';
            toAppend += '<span class="text_white">' + mymonthday + '</span></div>'; 

            toAppend += '<div class="col-xs-12 text-center mytile" style="margin-top:10px; padding: 0">';
            toAppend += '<img class="my7daysimg" src="' + icon_path +'"  alt="' + result.daily.data[i+1].icon +'"  title="' + result.daily.data[i+1].icon +'"></img></div>'; 

            toAppend += '<div class="col-xs-12 text-center mytile" style="margin-top:10px; padding: 0">';
            toAppend += '<span class="text_white">Min</span><br /><span class="text_white">Temp</span></div>'; 

            toAppend += '<div class="col-xs-12 text-center mytile" style="margin-top:10px; padding: 0">';
            toAppend += '<span class="text_white big_temp">' + tempMin + '</span></div>'; 

            toAppend += '<div class="col-xs-12 text-center mytile" style="margin-top:10px; padding: 0">';
            toAppend += '<span class="text_white">Max</span><br /><span class="text_white">Temp</span></div>'; 

            toAppend += '<div class="col-xs-12 text-center mytile" style="margin-top:10px; padding: 0">';
            toAppend += '<span class="text_white big_temp">' + tempMax + '</span></div></div>';  


            //creating modal i

            toAppend += '<div id="myModal' + i + '" class="modal fade" role="dialog">';

                toAppend += '<div class="modal-dialog">';

                    toAppend += '<div class="modal-content">';

                        toAppend += '<div class="modal-header">';

                            toAppend += '<h4 class="modal-title">' + textHeader + '</h4>';

                        toAppend += '</div>';

                        toAppend += '<div class="modal-body my_modal_body">';

                            //image
                            toAppend += '<div class ="col-sm-12 col-xs-12 text-center"><div class="row"></div><div class="row"><img src = "' + icon_path + '" title = "' + result.daily.data[i+1].icon + '" alt = "' + result.daily.data[i+1].icon + '" class = "modal_image" /></div><div class="row"></div></div>';    

                            //summary
                            toAppend += '<div class= "col-sm-12 col-xs-12 text-center"><span class="text_black modal_day">' + myday + ': </span><span class="modal_summary">' +  dailysummary + '</span></div>';

                            //table

                            toAppend += '<div class= "col-sm-12 col-xs-12 text-center">';//main div

                            toAppend += '<div class = "row">';//row

                            toAppend += '<div class = "col-md-4" ><span class="boldones">Sunrise Time</span><br />';
                            toAppend += '<span>' + mysunrise + '</span></div>';

                            toAppend += '<div class = "col-md-4" ><span class="boldones">Sunset Time</span><br />';
                            toAppend += '<span>' + mysunset + '</span></div>';

                            toAppend += '<div class = "col-md-4" ><span class="boldones">Humidity</span><br />';
                            toAppend += '<span>' + humidity + '</span></div>';

                            toAppend += '</div>';//end row


                            toAppend += '<div class = "row">';//row

                            toAppend += '<div class = "col-md-4" ><span class="boldones">Wind Speed</span><br />';
                            toAppend += '<span>' + wind_speed + '</span></div>';

                            toAppend += '<div class = "col-md-4" ><span class="boldones">Visibility</span><br />';
                            toAppend += '<span>' + visibility + '</span></div>';

                            toAppend += '<div class = "col-md-4" ><span class="boldones">Pressure</span><br />';
                            toAppend += '<span>' + pressure + '</span></div>';

                            toAppend += '</div>';//end row

                            toAppend += '</div>';//end main div

                        toAppend += '</div>';// end of modal body

                        //modal footer
                        toAppend +='<div class="modal-footer" style="max-height: 100px"><button type="button" class="btn btn-default" data-dismiss="modal">Close</button></div>';

                    toAppend += '</div>';// end of modal content

                toAppend += '</div>';// end of modal-dialog

            toAppend += '</div>';// end of mymodal
            
        toAppend += '</div>';//end the first div for every 7 days
        
        //end of modal i
        
        
        /*
        if(i == 6){
            
            toAppend += '</div>'
        }
        */

        
        $('.my7daystab').append(toAppend);
        
        
    }//end for i
}

//start ajax success handling function
function func_ajax_success(result) {
    
    $('#output').collapse('show');
    $('.my7daystab').empty();
    $('#next24hr_tb').empty();
    setupMap(result.longitude,result.latitude);
    //CURRENTLY:
    
    moment.tz.setDefault(result.timezone);
    //set up time zone
    mytimezone = result.timezone;
    
    setupCurrently(result);
    //currently table
     
    
    //NEXT 24 HOURS
    
    //headers
    setup24hrsHeader(result);
    
    //main 24 hrs
    for(var i=1;i<=24;i++){
        
        //set up for each hour
        setup24hours(result, i);
        
    }
    //End 
    
    //NEXT 7 days
    
    setup7days(result);
    
    
    
}
/*
function GetJSON(url){
      var xhttp;
      xhttp=new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          return xhttp;
        }
      }
      xhttp.open("GET", url, true);
      xhttp.send();        
}
*/




//start func_submitHandler()
function func_submitHandler(callback){
    php_data = $('#myform').serialize() + "&submit=submit";
    // ===========================
    // ajax starts here
    // ===========================
   $.ajax({	
        //url:'http://cs-server.usc.edu:9292/cgi-bin/index.php',
        // When implementing, change it to the one below
        url: 'http://homework8-chengxis-env.elasticbeanstalk.com/',
        crossDomain: true,
        dataType: 'json',
        data: php_data,
        type:'GET',
        success:function(response){
            func_ajax_success(response);
        },
        error:function(err){
            alert("there is error:" + err.message);
        }
    });
    //=========================
    // AJAX ends here
    //=========================
    //alert("nimabi");

    
}
//end func_submitHandler()



//=========================
//start of initialization
//=========================
$(document).ready(function() {

    /*
    $('.fb_logo').click(function(){
        fbHandler();
    });
    */
    
    $( "#clear" ).click(function() {
        //alert("jiji");
        validator.resetForm();
        $('#output').collapse('hide');
        
        //$('#basicMap').empty();
        $('.my7daystab').empty();
        $(this).closest('form').find("input[type=text], textarea").val("");
        $('#fahrenheit','#myform').attr("checked",true);
        $('#defaultSel','#myform').attr("selected", true);
        $('#next24hr_tb').empty();
        /*$( "#tabFirst" ).addClass('active');
        $( "#tabSecond" ).removeClass('active');
        $( "#tabThird" ).removeClass('active');
        $( "#rightNow" ).addClass('active');
        $( "#next_24_hours" ).removeClass('active');
        $( "#next_7_days" ).removeClass('active');*/
    });//clear click

    $( "#submit" ).click(function() {
        if($("#myform").valid()){
            func_submitHandler();
        }
    });
                         
    jQuery.validator.addMethod("notBlank", function(value, element) {
        return this.optional(element) || $.trim(value) != "";
        //return $.trim(value) > 0;
    }, "Please enter non-blank street address");

    jQuery.validator.addMethod("notDefault", function(value, element) {
      return this.optional(element) || value != "Select your state...";
    }, "Please select a state");

    var validator = $( "#myform" ).validate({
        rules: {
            street: {
                required: true,
                notBlank: true
            },
            city: {
                required: true,
                notBlank: true
            },
            state:{
                required: true,
                notDefault: true
            },
            degree:{
                required: true,
            }
        },
        messages: {
            street:{
                required: "Please enter the street address",
                notBlank: "Please enter non-blank street address"
            },
            city:{
                required: "Please enter the city",
                notBlank: "Please enter non-blank city"
            },
            state:{
                required: "Please select a state",
                notDefault: "Please select a state"
            },
            degree:{
                required: "Please enter the street address"
            }
        },

        errorPlacement: function(error, element) {
              if(element.attr("name") == "street") {
                    error.appendTo( $("#helpBlock1") );
              }else if(element.attr("name") == "city"){
                  error.appendTo( $("#helpBlock2") );
              }else if(element.attr("name") == "state"){
                  error.appendTo( $("#helpBlock3") );
              }else {
                    error.insertAfter(element);
              }
        },

        submitHandler: function() {
            func_submitHandler();
        },
    })

});//end document ready
//=========================
//end of initialization
//=========================   
            
 