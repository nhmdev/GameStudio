/***********************************************
* Website: NHM Game Studio
* Version: 1.0
* Created: 2017-02-13
* Last updated: 2017-02-13
* Developer: Niclas Hjulström : www.nhmdev.se
* Comments:
	This website is part of examination
	for the course "Webbklientprogrammering"
	for the education "Systemutveckling .NET"
	by Lernia Yrkesutbildning.
***********************************************/
// Find the DOM elements for date and time
var dateElement = document.getElementById("date");
var timeElement = document.getElementById("time");

// Create a interval timer that will run every second.
var clockTimer = setInterval(function(){
	// Get the current DateTime
	var clock = new Date(); 
	/* Insert a formatted DateTime string to the two
		DOM elements for date and time */
	dateElement.innerHTML = clock.toLocaleDateString();
	timeElement.innerHTML = clock.toLocaleTimeString();
},1000);