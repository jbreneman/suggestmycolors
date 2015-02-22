"use strict";
/*jslint browser: true */

function grabPalette(name) {
	if(localStorage && localStorage.getItem(name)) {
		return JSON.parse(localStorage.getItem(name));
	} else {
		return false;
	}
}

function savePalette(name, data) {
	if(localStorage) {
		localStorage.setItem(name, JSON.stringify(data));
		return localStorage.getItem(name) ? true : false;
	} else {
		return false;
	}
}


var test = savePalette('lol', [1, 2, 3, 4, 5]);

console.log(test);







































function hex2rgb(hex) {
var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
    rgb: parseInt(result[1], 16) + ", " + parseInt(result[2], 16) + ", " + parseInt(result[3], 16)
	} : null;
}

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

//function that changes any number to the range of 0 < x < 255. Keeps iterating until within this range
function zeroTo255(number) {
	if(number > 255) {
		number -= 255;
		if(number > 255) {
			number = zeroTo255(number);
		}
	}

	if(number < 0) {
		number += 255;
		if(number < 0) {
			number = zeroTo255(number);
		}
	}
	return number;
}

//the meat of the app. takes a color and returns divs
function mutateColor(color, addR, addG, addB, increment, amount, opposite) {
	//split into separate rgb channels
	var startRGB = hex2rgb(color);

	//save the current data in mutate, and set the mutate increment to the initial data
	var mutate = {r: addR + increment, g: addG + increment, b: addB + increment};
	var mutateBy = {r: mutate.r, g: mutate.g, b: mutate.b}; 
	var output = "";
	
	for(var i = 1; i <= amount; i++) {
		var insideColor = "";

		if(opposite === true) {
			insideColor = rgbToHex(addR > 0 ? 255 - startRGB.r : startRGB.r, addG > 0 ? 255 - startRGB.g : startRGB.g, addB > 0 ? 255 - startRGB.b : startRGB.b);
		} else {
			insideColor = rgbToHex(zeroTo255(startRGB.r + mutate.r), zeroTo255(startRGB.g + mutate.g), zeroTo255(startRGB.b + mutate.b));
		}

		output += "<div class=\"color\" style=\"background: " + insideColor + "\"><a href=\"index.html" + insideColor + "\">" + insideColor + "</a></div>";
		mutate = {r: mutate.r + mutateBy.r, g: mutate.g + mutateBy.g, b: mutate.b + mutateBy.b};

	}
	return output;
}

//this returns divs of mutated colors based on global var hex that gets passed around more than a football in the superbowl
//above analogy may be wrong, i hate sports
function printColors() {
	return  "<div class=\"column\"><h2>Opposites</h2>" + mutateColor(hex, 255, 0, 0, 0, 1, true) + mutateColor(hex, 0, 255, 0, 0, 1, true) + mutateColor(hex, 0, 0, 255, 0, 1, true) + mutateColor(hex, 255, 255, 0, 0, 1, true) + mutateColor(hex, 0, 255, 255, 0, 1, true) + mutateColor(hex, 255, 0, 255, 0, 1, true) + mutateColor(hex, 255, 255, 255, 0, 1, true) + "</div>" +
			"<div class=\"column\"><h2>Half Opposites</h2>" + mutateColor(hex, 128, -32, 0, 0, 1, false) + mutateColor(hex, 0, 128, -32, 0, 1, false) + mutateColor(hex, -32, 0, 128, 0, 1, false) + mutateColor(hex, 128, 128, 0, 0, 1, false) + mutateColor(hex, 0, 128, 128, 0, 1, false) + mutateColor(hex, 128, 0, 128, 0, 1, false) + mutateColor(hex, 128, 128, 128, 0, 1, false) + "</div>" +
			"<div class=\"column\"><h2>Red Shift</h2>" + mutateColor(hex, 32, 0, 0, 0, 7, false) + "</div>" +
			"<div class=\"column\"><h2>Green Shift</h2>" + mutateColor(hex, 0, 32, 0, 0, 7, false) + "</div>" +
			"<div class=\"column\"><h2>Blue Shift</h2>" + mutateColor(hex, 0, 0, 32, 0, 7, false) + "</div>";
}

function isValidHex(hex) {
	var valid = /^#[0-9A-F]{6}$/i.test(hex);
	return valid ? hex : "#577d06";
}

var hex = isValidHex(window.location.hash);
var color = document.getElementById("color");
var pick = document.getElementById("pick");
var header = document.getElementById("headwrap");
var headAnchor = header.getElementsByClassName("head-anchor");
var slider = document.getElementById("slider");
var picker = document.getElementById("picker");
var output = document.getElementById("outputs");
var sliderIndicator = document.getElementById("slider-indicator");
var pickerIndicator = document.getElementById("picker-indicator");

color.innerHTML = "";

ColorPicker.fixIndicators(sliderIndicator, pickerIndicator);

var cp = new ColorPicker(slider, picker, function(cpHex, hsv, rgb, pickerCoordinate, sliderCoordinate) {
	ColorPicker.positionIndicators(document.getElementById("slider-indicator"), document.getElementById("picker-indicator"), sliderCoordinate, pickerCoordinate);
    color.innerHTML = "<p>" + cpHex + "</p>";
	//color.textContent = cpHex;
	//color.style.backgroundColor = cpHex;
	header.style.backgroundColor = cpHex;

	for(var i = 0; i < headAnchor.length; ++i) {
		(hsv.v > 0.6 && hsv.s < 0.6) ? headAnchor[i].style.color = "#000" : headAnchor[i].style.color = "#fff";
	}

	pick.style.backgroundColor = cpHex;
	hex = cpHex;
	output.innerHTML = printColors();
});

cp.setHex(hex);

picker.addEventListener("mouseup", function() {
	window.location.hash = hex;
});

//watch for the hash change and make sure the colorpicker stays updated. Only needed due to being able to click on mutated colors
window.addEventListener("hashchange", function() {
	hex = isValidHex(window.location.hash);
	output.innerHTML = printColors();

	cp.setHex(hex);
});

function toggleClass(ref, first, second) {
	return ref.className === first ? ref.className = second : ref.className = first;
}
var about = document.getElementById("about");
var overlay = document.getElementById("overlay");

document.getElementById("about-anchor").addEventListener("click", function(e) {
	e.preventDefault();

	toggleClass(about, "hide", "show");
	toggleClass(overlay, "hide", "show");
});

document.getElementById("close").addEventListener("click", function() {
	toggleClass(about, "hide", "show");
	toggleClass(overlay, "hide", "show");
});

document.getElementById("overlay").addEventListener("click", function() {
	toggleClass(about, "hide", "show");
	toggleClass(overlay, "hide", "show");
});


