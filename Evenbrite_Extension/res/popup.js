/*
 * Find Cool Events Nearby
 * By Chengxi (Chen) Shi
 * For Eventbrite internship test
 * Powered by Eventbrite
 * 
 * Part 0: Intros and Notes
 *
 * This is the version without JS minification, 
 * the version with JS minification may be provided as well for light-weighted purpose
 * 
 * Please read all the comments carefully before doing any further change of extension of the 
 * current functionality
 *
 * Please read the readme.txt for detailed information for the extension itself
 * about this extension
 *
 * Variable Convention: 
 *
 * for .js file
 * 1: for all global variables, put a "my" prefix
 * 2: for all variables, connect words directly. the capital the first letter starting from the second
 *    word
 *
 * for .html and .css file
 * 3: for all id, class, connect words by '_', no capitalization
 *
 * Functions summary
 *
 * There are in total 6 individual functions in this '.js' script:
 *
 * processHours
 * loadEvents
 * ajaxSuccess
 * askEventbrite
 * mainProcess
 * document.addEventListener('DOMContentLoaded')
 *
 * Among those functions:  
 * 
 * "document.addEventListener('DOMContentLoaded')" is the default loading function when extension 
 * gets clicked and loaded by the brower.
 * 
 * "mainProcess" is used to perform a new search
 *
 * "askEventbrite" is used to get a new AJAX request to Eventbrite
 *
 * "ajaxSuccess" is to process AJAX response from Eventbrite
 *
 * "loadEvents" is to load a single page on the popup window from loaded data
 *
 * "processHours" is a utility function that process raw hour input and produce proper string duration
 *
 * There are also other nested functions binded to buttons and other events within those major functions
 * Detailed information can be found inside the function comment blocks.
 *
 * Thank you and enjoy the extension and its codes.
 *
 * Please let me know if you found any bugs, my email address is chengxis@usc.edu
*/

// Part 1: Global Variables

// Those variables are for search criteria storage
// All four variables for search needed to be initialized at the beginning
// to perform the ad hoc search when the user starts the extension
// The default location is set to be where the user is located now.
// Note that address will not be stored

// myKeyword: for the keyword of the events user wants, blank for any public events
var myKeyword = '';

// myDistance: the maximum number of miles from the events to be searched 
// from where the address or the user is located
// the possible values are 
//    5, 10, 15, 25 miles
//    0: for all events, regardless of distance
//    default value: 5
var myDistance = '5';

// myTime: the time range that the events can be
// possible value: 
//    1, 2, 7, 30: the number of days  from now that events will be searched
//    weekend: events happening the coming weekend
//             Note that this does not include any weekdays in-between now and weekend.
//    0: all events
var myTime = 'weekend';

// myPrice: whether the events should be free, paid, or both
// possible value:
//    f: free, p: paid, 0: all
var myPrice = '0';

// myAddress: the address of the center that events should be located around
// Note: this is optional, empty for using geolocation of the brower
var myAddress = '';

// Store JSON object as a global variable
// store this as global var for pagination
// we set 10 events for each page
var myJsonObject; 

// variables for pagination

// myPageNum is the index number of the current pagination
// Usually we have 50 events per AJAX request
// Noted that we may get fewer than 50
// Then, we set 10 events or fewer per page in this extension
// So, usually we will get 5 pages for each request.
// the myPageNum will range from 0 - 4, or lower for fewer event in the current pagination
// Note that myPageNum starts from 0
var myPageNum = 0; 

// myPaginationNum: the index of the pagination in the whole request
// Note that myPaginationNum starts from 1 as the Evenbrite API defines
// If we gets equals to or fewer than 50 events, myPaginationNum will stay at 1
var myPaginationNum = 1; 

// myPageSize: the number of objects per AJAX request return
// The default setting for this variable designated by Eventbrite is 50
var myPageSize = 50; 

// myEventCount: number of objects in total per this search in total
var myEventCount = 0;

// myPageLimit: number of pagination pages available per this search
// by default, if returned number of events is equals to or fewer than 50, it should be 1
var myPageLimit = 1;

// store lat, lon for user in case user execute another search without a designated 
// init those variables with undefined
// we set these two to be undefined
// we will make use of undefined for checking whether it is the first time user opens it
var myLat; // intentionally undefined
var myLon; // intentionally undefined


// Part 2: Functions
// The rest of the JS file is all for functions

// processHours:
// process the number of hours to the format of days and hours
// if the number of days is high enought that makes hours trivial
// it will ignore the number of hours
function processHours(hours){
    var outStr = ""; // the string to output
    var days = 0; // number of days we might use
    var hrs = hours; // number of hours
    if(hrs == 1) return '1 hour'; // return 1 hour
    if(hrs<24){ // if shorter than one day, we use number of hours
        outStr = hrs + ' hours';
    }else{
        days = parseInt(hrs / 24); // number of days from hours
        hrs = hrs % 24; // get the rest number of hours
        if(days == 1){ // attached 1 day, no plural
            outStr = '1 day';
        }else{ // more than 1 day
            outStr = days + ' days';
        }
        if(days < 7){ //  if fewer than 7 days, we will keep the hours to display
            // if equals to or more than 7 days, we will ignore the number of hours
            if(hrs > 0){
                outStr += ' ' + hrs + ' hour'; // add hours
                if(hrs > 1) outStr +='s'; // add pluralty
            }
        }
    }
    return outStr;
}

// loadEvents
// This will load the required events to the page and display it to the user
// This is different from askEventbrite or ajaxSuccess
// In order to perform a loadEvents, we need myJsonObject to be loaded with events
function loadEvents(){
    var result = myJsonObject;// we use myJsonObject
    if(result){ // if result has events
        
    try{ // try the following
        $('#div_container').empty(); // empty the div_container: get rid of previous events
        $('#div_container').css('display','none'); // disappear div_container for a fadein effect
        $('#div_container')
        .append($('<table>') // append table for event display
                .attr('class','table_header table-striped danger') // using bootstrap style
                .append($('<tbody>') 
                       .attr('id','dataContainer') // add a dataContainer for actual data display
                       )
               );
        
        // generate the startIndex and endIndex from the current myPageNum index
        // startIndex is directly from myPageNum
        // endIndex is the minimum from startIndex + 10 or the total event count
        var startIndex = myPageNum * 10;
        var endIndex = Math.min(startIndex + 10, myEventCount + 1);
        
        // Logics for forward and backward button
        // for backward button:
        //    if in the current pagination page, we have something before the current myPageNum
        //        we allow user to backward
        //    or, if the myPaginationNum is not the very first, we allow user to forward a pagination
        //        and perform another askEvenbrite for the previous pagination
        //    else, we disable the backward button
        $('#button_backward').prop('disabled', (myPageNum > 0 || myPaginationNum > 1  ) ? false : true);
        
        // for forward button (similar to backward button logic):
        //    if in the current pagination page, myPageNum is not at its maximum, meaning reaching 
        //         the maximum number of objects, i.e., the number of events in total
        //    or, if the myPaginationNum is below the myPageLimit, which is the total number of 
        //         pagination available for this search
        //    else, we disable the forward button
        $('#button_forward').prop('disabled', ((myPageNum + 1) * 10 < myEventCount || myPaginationNum < myPageLimit) ? false : true);
        
        // start the for loop using the start and end indices
        for(var i = startIndex; i < endIndex; i ++){
            
            // if the ith result events exists and valid
            if(result.events[i]){
                
                // init helpText for the help text when user has mouse over the event image
                var helpText = "";
                
                // the following block generates the event name string for display
                // init the string with missing event name in case the event name is missing
                var nameString = "missing event name";
                // check the validity of the event name text in the myJsonObject
                if(result.events[i].hasOwnProperty('name')){
                    if(result.events[i].name.hasOwnProperty('text')){
                        if(result.events[i].name.text != null){
                            if(result.events[i].name.text != ""){
                                nameString = result.events[i].name.text;
                            } 
                        } 
                    }
                }
                
                // Also add event name to help text
                helpText += "Event Name: " + nameString + "\n";
                
                // The following block is to fetch event's image, or "missing" image
                // ICON is for storing the icon url
                // init ICON with the default missing image for events without image
                var ICON = 'res/missing_bg.jpg';
                // checking validity of logo
                if(result.events[i].logo != null){
                    if(result.events[i].logo.hasOwnProperty('url')){
                        if(result.events[i].logo.url != null){
                            if(result.events[i].logo.url != ""){
                                ICON = result.events[i].logo.url;
                            }
                        }
                    }
                }    
                
                // the following block is to generate event time frame
                // It makes use of moment API
                // Note: It can be tricky
                
                // variable startTime is for storing the local start time 
                // init startTime is 'unknown' for missing startTime
                var startTime = 'Unknown';
                
                // variables start and end UTC are the UTC time for start and end
                // UTC time
                var startUTC = moment.utc();
                var endUTC = moment.utc();
                
                // init the two compare bools as false
                // if fetch from myJsonObject is successful for both time frame
                // we then do the event time frame calcumyLation
                // and attach that time frame on the event title string
                var isCompSuccess1 = false, isCompSuccess2 = false;
                
                // the following big block is checking validity of the start and end time
                // Then, we gets the start local time and start UTC time
                // of the event from the myJsonObject
                if(result.events[i].hasOwnProperty('end') ){
                    if(result.events[i].start != null){
                        if(result.events[i].start.hasOwnProperty('local')){
                            if(result.events[i].start.local != null){
                                if(result.events[i].start.local != ""){
                                    startTime = moment(result.events[i].start.local).format("dddd, MMMM Do YYYY, h:mm:ss a");  
                                }
                            } 
                        }//end local
                        if(result.events[i].start.hasOwnProperty('utc')){
                            if(result.events[i].start.utc != null){
                                if(result.events[i].start.utc != ""){
                                    startUTC = moment(result.events[i].start.utc); 
                                    isCompSuccess1 = true; // start UTC succeeds for the first part
                                }
                            } 
                        }
                    }
                }//end processing 
                
                // checking validity of end utc time
                // and gets end utc time
                if(result.events[i].hasOwnProperty('end') ){
                    if(result.events[i].end != null){
                        if(result.events[i].end.hasOwnProperty('utc')){
                            if(result.events[i].start.utc != null){
                                if(result.events[i].start.utc != ""){
                                    endUTC = moment(result.events[i].end.utc); 
                                    isCompSuccess2 = true; // end UTC succeeds for the second part
                                }
                            }
                        }
                    }
                }//end processing 
                
                //init eventTiming string
                var eventTiming = ""; 
                // if both comparisons succeeded then perform the time frame calculation
                // else, ignore the time frame and its display
                if(isCompSuccess1 && isCompSuccess2){
                    
                    // if the start time is later then current time (both in UTC)
                    // then we calculate how much time left from now to the start
                    // else if the current time is in between the start and end UTC time
                    // then we display as 'Ongoing'
                    // else if the end time is before the current time
                    // then we display as 'Passed'
                    //
                    // We also use span element to highlight the time frame to the user
                    // the designated css is in the .css file
                    if(moment(startUTC).isAfter(moment.utc())){
                        
                        //event not started
                        eventTiming = '<span class = \'timing_incoming\'>[in ' + processHours(moment(startUTC).diff(moment.utc(),'hours')) + ']</span>';
                    }else if(moment.utc().isBetween(startUTC, endUTC)){
                        
                        //started
                        eventTiming = '<span class = \'timing_started\'>[Ongoing]</span>';
                    }else if(moment(endUTC).isBefore(moment.utc())){
                        
                        //passed
                        eventTiming = '<span class = \'timing_passed\'>[Passed]</span>';
                    }
                    
                    //attached the event timing information before the event title string
                    nameString = eventTiming + '<br>' + nameString;
                }
                
                // helpText adds up the start time point in local timezone
                helpText += "Time: " + startTime + "\n";
                
                // eventDescription init with none indicator
                var eventDescription = "(none)";
                
                // checking the validity of event description from JSON object
                // then load the description text into helpText
                // Note that the maximum number of characters allowed is 500
                if(result.events[i].description != null){
                    if(result.events[i].description.hasOwnProperty('text')){
                        if(result.events[i].description.text != null){
                            if(result.events[i].description.text != ""){
                                //cut the description length to 140 if needed
                                if(result.events[i].description.text.length <= 500){
                                    eventDescription = result.events[i].description.text;
                                }else{
                                    eventDescription = result.events[i].description.text.substring(0,500) + '\n(and more...)';
                                }
                            }
                        }
                    }
                }//end processing description
                
                // attach description
                helpText += "Description: \n" + eventDescription + "\n";
                
                // init the eventURL with about:blank if we have missing link address
                // check validity and then fetch the url from myJsonObject
                var eventUrl = "about:blank";
                if(result.events[i].hasOwnProperty('url')){
                    if(result.events[i].url != null){
                        if(result.events[i].url != ""){
                            eventUrl = result.events[i].url;
                        }
                    } 
                }                      
                
                // add the formatted information
                // including event title string, helpText, eventURL, time frame
                //  with jQuery in dataContainer
                $('#dataContainer')
                .append($('<tr>') // the event title and/or event time frame information
                        .append($('<span>')
                                .attr('class','result_title') // css in .css file
                                .html(nameString)
                               )
                       )
                .append($('<tr>') // add the anchor and the image 
                        .append($('<td>')
                                .append($('<a>')
                                        .attr('href', eventUrl)
                                        .append($('<img>')
                                                .attr('src',ICON)
                                                .attr('alt',eventUrl)
                                                .attr('title',helpText)
                                                .bind('click', function(){ // and also the click handler
                                                    chrome.tabs.create({"url":this.alt,"selected":true});
                                                })
                                                )
                                        )     
                               )
                        );
                }//end if valid result.event[i]
        }//end for i
        $('#div_container').fadeIn(750);//jQuery fadein effect
    }catch(e){
        console.log("Error: " + e.toString); // output error message
    }//end try catch
    }//end big if
}

// the following function deals with successful AJAX response
// we gets the pagination information and the actual JSON object
// we aso deals with empty response with displaying a no result image
function ajaxSuccess(result){
    
    //clear the div_container for further events display
    $('#div_container').empty();
    
    // get the current pagination number
    myPaginationNum = result.pagination.page_number;////the current page num
    
    // get the page size from response, by default it should be 50
    myPageSize = result.pagination.page_size; // how many within a page
    
    // get the total pagination page number, note: this is different from myPageNum
    //    which is the page number use within each pagination/AJAX response
    myPageLimit = result.pagination.page_count; // how many pages totally
    
    //assign the result to global JSON_oobject
    myJsonObject = result;
    
    // get the event count from the lower of myPageSize (50 by default), or
    //    the total event number for this search
    myEventCount = Math.min(myPageSize,result.pagination.object_count);
    
    //handle empty response: display a no result image
    if(myEventCount == 0){
        $('#div_container')
        .append($('<img>')
                .attr('src','res/no_result.jpg')
               );
        return; // skip the loadEvents function
    }
    
    // actually load the first group of events to the page
    loadEvents();
}


// this following function generates AJAX request to Eventbrite
// It produces search parameters based on user inputs and/or current geolocation
// It makes AJAX request to the Eventbrite server
function askEventbrite(){
    // if the loading icon is not present
    // load the loading icon
    if(! $('#img_loading').length){
        $('#div_container')
        .prepend($('<img>')
                .attr('src','res/loading.gif')
                 .attr('id','img_loading')
               );
    }
    
    // generate search parameters
    // note: the following myToken variable includes personal Eventbrite API key
    // if you would like to reuse or change any of the code, please goto 
    // https://developer.eventbrite.com/
    // and apply for a new Eventbrite API key
    var myToken = "ALL7YMMJU7W33ROWD2RD"; // this is the personal Eventbrite API key
    // Please do not distribute the API key and make use of it in any means except with this extension
    // only if you don't make any changes
    
    // generate the header of the searchString address
    var searchString = "https://www.eventbriteapi.com/v3/events/search/?"; 
    
    // The following block defines search parameters we pass to Eventbrite server for event search
    // init queryData as the tokens for getting search results
    // including API key, address/location(lat,lon), distance, time frame, 
    //    price, keyword,and pagination information
    var queryData = "page=" + myPaginationNum;
    
    // if the address input is none, then use the current geolocation for search
    // else, use inputed address
    if(myAddress != ""){
        queryData += "&location.address=" + myAddress;
    }else{
        queryData += "&location.latitude=" + myLat+ "&location.longitude=" + myLon;
    }
    
    // add distance to query string
    queryData += '&location.within=' + myDistance +'mi';
    
    // if keyword is not empty, then add keyword to query string
    if(myKeyword){
        queryData+='&q=' + myKeyword;
    }
    
    // if price input is not 'all', then add it 
    if(myPrice == "f"){
        queryData += '&price=' + 'free';
    }else if(myPrice == "p"){
        queryData += '&price=' + 'paid';
    }
    
    // generate target start and end dates for search
    // init with current time
    var startDate = moment().format('YYYY-MM-DDThh:mm:ss');//get current time
    var endDate = moment().format('YYYY-MM-DDThh:mm:ss');//get the current time too
    
    // if weekend selected (by default), then directly use start date keyword
    if(myTime == 'weekend'){
         queryData += "&start_date.keyword=this_weekend";
    }else if(myTime != 0){
        endDate = moment().add(myTime,'days');
        queryData += "&start_date.range_start=" + moment(startDate).format('YYYY-MM-DDThh:mm:ss') + "&start_date.range_end=" + moment(endDate).format('YYYY-MM-DDThh:mm:ss');
    }
    
    // finally add personal Eventbrite API key
    queryData += "&token=" + myToken;

    // generate AJAX request with the parameters generated above
    $.ajax({
        url: searchString,
        crossDomain: true,
        dataType: 'json',
        data: queryData,
        type:'GET',
        // set up success function
        success:function(response){
            ajaxSuccess(response);
        },
        //report any error to console for debug
        error:function(err){
            console.log("there is error:" + err.message);
        }
    });
}

// the following function: mainProcess, is the one that initiates a new search
// the logics of this function was first to check whether the geolocation has been found
// if not then try getting geolocation information from browser
//      then add a loading icon, define geolocation fetch 
// if geolocation successfully found then 
//      perform an askEventbrite function to initiate a new search
// else if failed in finding geolocation
//      display failure information and allow user either to close the extension and start again
//      or manually input address
function mainProcess(){
    
    // check whether myLatis defined or address is not blank
    if(myLat=== undefined && $('#input_address').val() == ''){
        // check if there is a loading icon, if no then add one
        if(! $('#img_loading').length){
            $('#div_container')
            .prepend($('<img>')
                    .attr('src','res/loading.gif')
                     .attr('id','img_loading')
                   );
        }
        
        // try accessing navigator's geolocation object, if failed then 
        if (!navigator.geolocation) {
            $('#div_container').empty();
            $('#div_container').html('Geolocation is not supported for this Browser/OS version yet. Please Manually type in your address...');
            console.log('Geolocation is not supported for this Browser/OS version yet.');
            return;
        }
        
        // start trying to get geolocation
        var startPos;
        
        // define function for successfully returning geolocation information
        // store them in global variable
        // perform an askEventbrite
        var geoSuccess = function(position) {
            startPos = position;
            myLat= startPos.coords.latitude;
            myLon = startPos.coords.longitude;
            askEventbrite();
        };
        
        // define function for failure
        // display error information and allow address input
        var geoFailure = function(e){
            $('#div_container').empty();
            $('#div_container').html('Cannot get location. Please Manually type in your address or Reload to get the current location...');
        };
        
        // perform the geolocation lookup
        navigator.geolocation.getCurrentPosition(geoSuccess, geoFailure);
    }else{
        
        // is geolocation already stored, ask Eventbrite
        askEventbrite();
    }
}

// add event listener for DOM loaded
// this function works as a driver of the entire extension
// bind functions to the buttons
document.addEventListener('DOMContentLoaded', function() {
    
    // fadein search form
    $('#form_search').fadeIn(750);
    
    // set up the function for search button
    // gets all information from the form that needs to be stored
    // Note: why bothering saving those to global vars?
    //       imagine the user goes to the edges of two pagination pages and about to cross
    //       the user accidentally changed some of the information in the search form
    //       However, by clicking the forward or backward button to go cross paginations
    //       the user actually wants the old information
    //       Therefore, we should keep the original information
    $('#button_search').click(function(){ 
        myKeyword = $('#input_keyword').val();
        myDistance = $('#select_distance').val();
        myTime = $('#select_time').val();
        myPrice = $('#select_price').val();
        myAddress = $('#input_address').val();
        myPageNum = 0; // set the myPageNum to be 0 at the beginning
        mainProcess(); // start a new search
    });
    
    // calculating the correct pagination variables
    $('#button_forward').click(function(){
        
        // if about to go across pagination
        if((myPageNum + 1) * 10 >= myPageSize){
            
            myPageNum = 0; // set the myPageNum of the new page to be 0
            myPaginationNum += 1; // increment the myPaginationNum
            askEventbrite(); // perform an ask Eventbrite to request for the information
                             // of the next pagination
            
        }else{// if not going across pagination
            myPageNum += 1; // increment myPageNum
            loadEvents(); // load events from local stored myJsonObject
        }
    });
    
    // calculating the correct pagination variables
    $('#button_backward').click(function(){
        
        // if about to go across pagination
        if(myPageNum <= 0){// set the myPageNum of the new page to be 0
            
            myPageNum = parseInt((myPageSize - 1) / 10 ); // get the bottom myPageNum of the previous pagination
            myPaginationNum -= 1; // decrement the myPaginationNum
            askEventbrite(); // perform an ask Eventbrite for the previous pagination
            
        }else{
            myPageNum -= 1; // der=crement myPageNum
            loadEvents(); // load events from local stored myJsonObject
        }
    });
    
    // start main Process for a new request for geolocation
    mainProcess();//start processing everything
});
// Here come the end of the ".js" script file