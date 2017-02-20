/***********************************************
* Website: The Word Game
* Version: 1.0
* Created: 2017-02-18
* Last updated: 2017-02-20
* Developer: Niclas Hjulström : www.nhmdev.se
* Comments:
    This game is part of examination
    for the course "Webbklientprogrammering"
    for the education "Systemutveckling .NET"
    by Lernia Yrkesutbildning.

    This is the javascript game code

    TODO:
        
***********************************************/
var questions = ['sax','noll','jolt','omega','sommar','celcius','Tjena mors','thq','atari','cloud'];
var counterWrongChar = 0;	// Counter for wrong chars
var isGameOn = false;	// If we are in a game

// Array with different game Modes
var gameModes = [
	{name: 'A to Z', code: 'AtoZ', questionArray: false, question: 'abcdefghijklmnopqrstuvwxyz', answerGenerator : function(question) {return answerAtoZ(question)}},
	{name: 'Z to A', code: 'ZtoA', questionArray: false, question: 'zyxwvutsrqponmlkjihgfedcba', answerGenerator : function(question) {return answerZtoA(question)}},
	{name: 'A to Ö', code: 'AtoZ', questionArray: false, question: 'abcdefghijklmnopqrstuvwxyzåäö', answerGenerator : function(question) {return answerAtoOe(question)}},
	{name: 'Ö to A', code: 'ZtoA', questionArray: false, question: 'öäåzyxwvutsrqponmlkjihgfedcba', answerGenerator : function(question) {return answerOetoA(question)}},
	{name: 'The Robber Language', code: 'TheRobberLanguage', questionArray: true, answerGenerator : function(question) {return answerTheRobberLanguage(question)}},
	];

// Empty object for current game
var currentGame = {gameMode: '', answer: ''};

function createGameDOMElements(){
// Function to create the game DOM elements.

	// Create DOM Elements
	var textAreaElement = document.createElement("div");
	var userInputAreaElement = document.createElement("div");
	var userInputTextfieldElement = document.createElement("input");
	var gameClock = document.createElement("div");

	// Let the new elements get some Id's
	textAreaElement.id = "textArea";
	userInputAreaElement.id = "userInputArea";
	userInputTextfieldElement.id = "userInputTextfield";
	gameClock.id = "gameClock";

	// Add attribute to elements
	userInputTextfieldElement.setAttribute("type","text");

	// Make the text input field disabled at start
	userInputTextfieldElement.disabled = true;

	// Add event listener to textfield
	userInputTextfieldElement.addEventListener("keyup",gameUserInput);

	// Add default text to gameClock
	gameClock.innerHTML = '0 seconds';

	// Insert elements to HTML document
	userInputAreaElement.appendChild(userInputTextfieldElement);
	userInputAreaElement.appendChild(gameClock);
	document.getElementById("gameArea").insertAdjacentElement('beforeend',textAreaElement);
	document.getElementById("gameArea").insertAdjacentElement('beforeend',userInputAreaElement);
	
	
}

function createGameModeButtons(){
	// Function to create game buttons
	// Create chooseGameLabel DOM Element
	var chooseGameLabelElement = document.createElement('div');
	// Set id of chooseGameLabel
	chooseGameLabelElement.id = 'chooseGameLabel';
	// Insert text to chooseGameLabel
	chooseGameLabelElement.innerHTML = 'Choose a game mode:';
	// Add chooseGameLabel to html document
	document.getElementById('textArea').insertAdjacentElement('beforeend',chooseGameLabelElement);

	// For each gameModes
	for(var i = 0; i < gameModes.length; i++){
		// Create new DOM Element of type button
		var button = document.createElement("button");
		// Set the id of the button
		button.id = 'btn_' + gameModes[i].code;
		// Set a value to the button
		button.value = gameModes[i].code;
		// Set the button text
		button.innerHTML = gameModes[i].name;
		// Set a class name for the button
		button.className = 'gameModeButton';
		// Add an event listener to the button
		button.addEventListener("click",startGame);
		// Add attribute for gameModeIndex to the button
		button.setAttribute('data-gameModeIndex',i);
		// Add the button to the html page
		document.getElementById('textArea').insertAdjacentElement('beforeend',button);
	}
}

function removeGameModeButtons(){
	// Function to remove the game buttons
	// Find the textArea DOM element
	var textAreaElement = document.getElementById('textArea');
	// As long as textArea has child nodes...
	while(textAreaElement.hasChildNodes()){
		// Delete the last child
		textAreaElement.removeChild(textAreaElement.lastChild);
	}
}

function createGameShowQuestion(text){
	// Function to create the text that shows the question
	// Create a new DOM element for textToTranslate
	var questionElement = document.createElement('div');
	// Set the id of the new element
	questionElement.id = "showQuestion";
	// Set the text
	questionElement.innerHTML = text;
	// Add the new element to html page
	document.getElementById('textArea').insertAdjacentElement('beforeend',questionElement);
}

function gameUserInput(event){
	// A function to check the user input
	// Check if the key pressed is a wanted char a-ö or space (\s)
	if(event.key.search(/^[a-zA-ZåäöÅÄÖ\s]$/) > -1){
		// Check if we have a game
		if(isGameOn){
			// Check if the value in textfield is correct according to game
			if(gameCheckInput(this.value)){
				// Correct char entered...
				// Check if game is finished
				if(gameFinish(this.value)){
					// The game is finished... end the game
					endGame();
				}
			}else{
				// Wrong char entered...
				// Increse counterWrongChar
				counterWrongChar++;		
				// Delete the last input char 
				this.value = this.value.substring(0,this.value.length - 1);
			}
		}
	}else{
		// If unwanted chars... delete last input char
		this.value = this.value.substring(0,this.value.length - 1);
	}
}

function gameCheckInput(textFieldValue){
	// If the answer starts with textFieldValue then return true else return false
	return getAnswer().startsWith(textFieldValue);
}

function gameFinish(textFieldValue){
	// If game is finished return true else false
	// If same length in answer and textFieldValue game is finished.
	return textFieldValue.length == getAnswer().length
}

function getAnswer(){
	// Return the answer of the currentGame
	// Check what function to use in gameModes array.
	// currentGame.gmi has gameModeIndex.
	return currentGame.answer;
}

function answerTheRobberLanguage(textString) {
	// consonants is an array with all Swedish consonants. (except for c and x that is special)
	consonants = ['b','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','z'];
	// retString is a variable that will contain the final return string
	retString = ''; 

	// For each char in the textString
	for(var i=0; i < textString.length;i++){
		// Check the current char and do the correct action
		if(consonants.indexOf(textString.charAt(i)) > -1){
			// If the current char is a consonant then add consonant + o + consonant.
			retString += textString.charAt(i) + 'o' + textString.charAt(i);
		}else if(textString.charAt(i) == 'x'){
			// If current char is x then add koksos.
			retString += 'koksos';
		}else if(textString.charAt(i) == 'c'){
			// If current char is c then add kok.
			retString += 'kok';	
		}else{
			// If none above then just add the current char to retString.
			retString += textString.charAt(i);
		}
	}
	// Return our final string
	return retString;
}

function answerAtoZ(textString) {
	return 'abcdefghijklmnopqrstuvwxyz'
}

function answerZtoA(textString) {
	return 'zyxwvutsrqponmlkjihgfedcba'
}

function answerAtoOe(textString) {
	return 'abcdefghijklmnopqrstuvwxyzåäö'
}

function answerOetoA(textString) {
	return 'öäåzyxwvutsrqponmlkjihgfedcba'
}

function endGame(){
	// When the game is finished...
	
	// Reset the isGameOn variable to false
	isGameOn = false;

	// Display a message
	var msg = 'Congratulations... you finished the game with ' + counterWrongChar + ' chars wrong.';
	alert(msg);
}

function gameTimer(){
	// Function to handle the game timer
	// startTimer_ms to get time when starting the game.
	var startTime_ms = new Date().getTime();
	// Find the gameClock DOM element
	var gameClock = document.getElementById('gameClock');
	// Make a interval timer...
	var gameTimer = setInterval(function(){
		// Check if game is running
		if(isGameOn){
			// currTime_ms gets the current time in milliseconds.
			var currTime_ms = new Date().getTime();
			// Get the time difference between current time and starttime.
			var diffTime_ms = currTime_ms - startTime_ms;
			// Convert the time difference to show seconds with tenth of a second as decimal.
			var diffTime = parseInt(diffTime_ms/100)/10;
			// Edit the html document to show the time difference with fixed decimal value.
			gameClock.innerHTML =  diffTime.toFixed(1) + ' seconds';
		}
	},100);	// Update interval every 100 milliseconds.
}

function startGame(event) {
	// When user press a gameMode button...
	// Get the index for gameModes Array
	var gameModesIndex = this.getAttribute('data-gameModeIndex');

	var question = '';
	if(gameModes[gameModesIndex].questionArray){
		// GameMode uses questionArray
		// Get a random question
		question = questions[Math.floor((Math.random() * 10))]; // 0 - 10
	}else{
		/* GameMode does not use questionArray. It has own question in
			the GameMode.
		*/
		question = gameModes[gameModesIndex].question;
	}

	var answer = gameModes[gameModesIndex].answerGenerator(question);
	
	// Initiate the current game object
	currentGame = {gameMode: gameModes[gameModesIndex].code, question: question, answer: answer};
	
	// Remove the gameMode buttons
	removeGameModeButtons();

	// Enable the textfield
	document.getElementById('userInputTextfield').disabled = false;

	// Change isGameOn to true
	isGameOn = true;

	// Create the textToTranslate DOM element
	createGameShowQuestion(question);

	// Start the game timer
	gameTimer();

}
// Create the DOM elements
createGameDOMElements();
createGameModeButtons();

