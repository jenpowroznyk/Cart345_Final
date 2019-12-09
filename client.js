

//----------UI setup----------//
//gets canvas
var canvas = document.getElementById('canv');

//RGBA canvas background (takes values between 0 and 255 for RGB, and between 0 and 1 for alpha)
var R = 255;
var G = 255;
var B = 255;
var A = 1;


//----------JSON Stuff-----------//

//{"message":"John"};

var jsonString;
var jsonTestObj = {"message":"Hello Jen"};

var messageArray = [];


//--------Json API Stuff -------//




function AppendtoCurrentData(addressResponse)
{

}

//----------Other Vars----------//

//canvas context setup
var ctx = canvas.getContext('2d');

//global variables for cursor location
var cursorX;
var cursorY;

var charCount = 8000;
var dots = new Array(charCount);

var currentMessage = " ";

var charArray = ["A", "B", "C", "D", "E", "F","G","H","I","J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

//set canvas background color
canvas.style.background = "rgba(" + R + ", " + G + ", " + B + ", " + A + ")";

//----------functions----------//


//fits canvas to container
function fitToContainer() {
	canvas.style.width = '100%';
	canvas.style.height = '100%';
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
}

//normalizes coordinates to 0-100 range
function normalizeCoord(x, maxX) {
	return Math.round(x / maxX * 127);
}

//calculates distance between two coordinates
function calculateDistance(point1X, point1Y, point2X, point2Y) {
	return Math.sqrt((point1X - point2X)*(point1X - point2X) + (point1Y - point2Y)*(point1Y - point2Y));
}

//random float generator
function getRandomFloat(min, max) {
	return Math.random() * (max - min) + min;
}

//----------draw functions----------//


function textPrint(x, y){
    this.x = x;
	this.y = y;
    


	this.letter = Math.floor(Math.random() * Math.floor(26));
	this.size = '12';
	this.fillStyle = "black";


	this.draw = function()
	 {
		//this.size = calculateDistance(this.x, this.y, cursorX, cursorY) / 200;
		var randomLetter = charArray[this.letter];
		//console.log(randomLetter);
		var fontStyle = this.fillStyle == "#dfff80" ? "bold " : "";
		ctx.font = fontStyle + Math.floor(this.size) + "px Arial";
		ctx.fillStyle = this.fillStyle;
		ctx.textAlign = "center";
		ctx.fillText(randomLetter, this.x, this.y);

		
		//ctx.fill()
	}
}

function saveMessage()
{
    var messageToPush = {"message" : currentMessage};
	var messageArrayToS;
	
	
	messageArray.push(messageToPush);
    messageArrayToS = JSON.stringify(messageArray);

    getMessageDataFromBin();
    
}


function getMessageDataFromBin()
{

//getJSON('https://api.myjson.com/GET/bins/p48f2',
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() 
	{

		var currentMessageData = " ";
		// this refers to the instance we ar using, the "xhttp" variable
        //asks if the state change was recieved (4) and if the status is okay (200)
        if (this.readyState == 4 && this.status == 200) 
        {

        	 var messageToPush = {"message" : currentMessage};
			 currentMessageData = this.responseText;
			 currentMessageData = JSON.parse(currentMessageData);
			 //array of json objects

			 if(currentMessage != " ")
			 {
			 currentMessageData.push(messageToPush);	
			 }

console.log(currentMessageData);

			 updateMessageBin(currentMessageData);
			 displayMessages(currentMessageData);
	    }
	};

// asking for json data
	xhttp.open("GET", "https://api.myjson.com/bins/mfl92", true);
	xhttp.send();
}

//function necessary for udating bin
function updateMessageBin(currentMessageData)
{
	var messageDataToString = JSON.stringify(currentMessageData); 
	var xhttp = new XMLHttpRequest();
	xhttp.open("PUT", "https://api.myjson.com/bins/mfl92");
	xhttp.setRequestHeader("Content-type", "application/json; charset=utf-8");
	xhttp.send(messageDataToString);
}


function displayMessages(currentMessageData)
{
	for(var index = 0; index < 5; index++)
	{
		var randomIndex = Math.floor(Math.random() * (currentMessageData.length -1));
		
		var elementId = "myspan" + (index + 1);
		console.log(elementId);
		document.getElementById(elementId).textContent = currentMessageData[randomIndex].message;
	}
}


function clearText()
{

	currentMessage = " ";

}

function addSpace()
{

	currentMessage += " ";

}

//----------runtime----------//

function setup() {
	//fit canvas to container, ready to draw
	fitToContainer();

	var row = 0;
	var col = 0;
	var spacing = 20;

	for (var i = 0; i < charCount; i++) {
		if (col > canvas.width) {
			col = 0;
			row += spacing;
		}
		dots[i] = new textPrint(col, row);
		col += spacing;
    }

    getMessageDataFromBin();
	//call draw function to start animation loop
	window.requestAnimationFrame(draw);
}


function draw() 
{
	//fit canvas to container
	fitToContainer();

	//clear canvas for next frame
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//get X Y mouse / touch positions
	//mouse position on mouse move (desktop)
	document.onmousemove = function (event) {
		cursorX = event.pageX;
		cursorY = event.pageY;
	}

	document.onclick = function(event)
	{	

		var bestDot = dots[0];
		var closestX = 10000;
		var closestY = 10000;

		if(event.clientX > 230){
		
			for (var i = 0; i < dots.length; i++) 
			{
				if(Math.abs(event.clientX - dots[i].x) <= closestX && Math.abs(event.clientY - dots[i].y) <= closestY)
				{
					bestDot = dots[i];
				
					closestX = Math.abs(event.clientX - dots[i].x);
					closestY = Math.abs(event.clientY - dots[i].y);
				}
			}

			//bestDot.size = '30';
			//console.log(bestDot.size);
			bestDot.fillStyle = "#dfff80";
			var bestDotLetter = charArray[bestDot.letter]
			//console.log(charArray[bestDot.letter]);
			currentMessage += bestDotLetter;
			

		}
		

	}
		//ctx.font = "30px Arial";
	
		document.getElementById("myspan").textContent= currentMessage;

	//touch position on touch start and touch move (mobile)
  	document.addEventListener('touchstart', function(e) {
        cursorX = e.targetTouches[0].pageX;
		cursorY = e.targetTouches[0].pageY;
    }, false);
	document.addEventListener('touchmove', function(e) {
        cursorX = e.targetTouches[0].pageX;
	    cursorY = e.targetTouches[0].pageY;
    }, false);

	//draw cross at mouse position;
	//drawCross(cursorX, cursorY);


	


	//display dots

    for (var i = 0; i < charCount; i++) {
		dots[i].draw();
	}

	

	//loop animation
	window.requestAnimationFrame(draw);
}

//output coordinates intermittently through socket event


//on page load, call setup to start animation
window.addEventListener("DOMContentLoaded", function () {
	setup();
});