Find Cool Events Nearby

Ver 0.1
By Chengxi (Chen) Shi
email: chengxis@usc.edu
Powered by Eventbrite 
For Eventbrite

Introduction: 

This is a Chrome extension.
It uses Eventbrite API to get events nearby the user and help user refine the search results.

Features:

 - immediately load event information from nearby

 - layout all the event information to users

 - allow users to refine search for 

	- address other than current location

	- keywords for events

	- time range

	- distance from user

	- price for event, free or paid

 - pagination of events for users

 - display events in elegant formats

 - allow user to visit those event pages

User guide:

For general users:

Step 0: installing (Currently only support development mode):

i) if you get a .zip or .rar file, unzip it with winzip or other program.

ii) you will get a folder, save this folder to the place you want

iii) load the extension on "chrome://extensions", or click on the top right side and open the main menu of chrome, click "Settings".

iv) select "Extensions" on the left hand side.

v) select "Developer mode" on the top right side.

vi) click button "Load unpacked extension..." and select the folder from the place you saved it in ii).

vii) you will then see the extension "Find Cool Events". click the Enabled ticker on the right hand side.

viii) then you will see the icon on the chrome browser, which means it is successfully installed.

Step 1: Search by default setting:

i) click the extension icon

ii) a loading icon will appear, just be patient

iii) the default setting will appear as a popup window.

iv) then, you can browse the random events within 5 miles on the incoming weekend from your geolocation, click in to those image can direct you to the event page.

Step 2: more fun:

On the top search form you can enter the address, keyword, distance, time range, and/or price/free features for the events you are interested in by  clicking the search button.

You can also view more events if the current page cannot contain by clicking the ">>", "<<" buttons

You can view event details (name, description, time) by putting you mouse over the event image.

FAQs:

Q: What if the popup window tells me geolocation now available?
A: That is because the attempt for the first initiation of the extension failed in getting your geolocation. Don't worry. Just try again.
If the same information still exists, try to enter chrome main menu -> Setting -> Privacy -> Content settings -> location to allow the geolocation feature use.

Q: What if I want more details than the one on the popup window?
A: click on the image and see all details in the eventbrite page.

Q: Can I buy tickets on this extension for the events?
A: Sorry, but currently the extension does not support transactions between you and event holders.

Q: Can I fork your code? 
A: Sure, it is free software for Eventbrite. You can fork it, do whatever you want with the source code. However, the use of my eventbrite API key is prohibited if you are making any change and repack the extension. You must register for a new API key at Eventbrite website as a developer.

For developers:

Intro: this extension is powered by Eventbrite APIs. 

It is created through the technology of chrome extension, HTML5, jQuery, bootstrap, moment API, and AJAX. 

It includes the following files and folders:

 - manifest.json
 - popup.html
 - README.txt
 - /res/
	- popup.js
	- popup.css
	- jquery.min.js
	- moment.min.js
	- icon.png
	- loading.gif
	- missing_bg.jpg
	- no_result.jpg

manifest.json is the metadata for all the extension files. 

popup.html, popup.js, popup.css are the three files that describe the whole extension. All other .js files are the lib files. Other .png, .gif, .jpg files are to display certain information as their names.

the main control structure is in popup.js. It basically retrieves the user's geolocation(latitude and longitude) and other search criteria and make a GET httprequest to eventbrite server for the events information.
Then display them in a certain format.

Please refer to the popup.js file for more details about javascript and other APIs used in this extension

NOTE: The source code ".js" include personal Eventbrite API key, please DO NOT REUSE IT if you wanna change any of the files in the folder and repack them

NOTE: to better the size, you can use the popup.min.js to get rid of the comments and whitespace of the original popup.js. To do that, simply change the .js reference in manifest.json and popup.html to popup.min.js

If you have any questions, concerns, please email me at chengxis@usc.edu.

Thank you! And enjoy the events!

