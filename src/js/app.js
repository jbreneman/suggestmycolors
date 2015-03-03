"use strict";
/*jslint browser: true */

//load and save palettes
var l = {
	load: function(name) {
		return localStorage && localStorage.getItem(name) ? JSON.parse(localStorage.getItem(name)) : false;
	},
	save: function(name, data) {
		if(localStorage) {
			return localStorage.setItem(name, JSON.stringify(data));
		}
	},
	rename: function(oldName, newName) {
		this.save(newName, localStorage.getItem(oldName));
		this.del(oldName);
	},
	del: function(name) {
		if(localStorage && localStorage.getItem(name)) {
			return localStorage.removeItem(name);
		}
	},
	list: function() {
		if(localStorage) {
			var palettes = [];

			for (var i = 0; i < localStorage.length; i++) {
				palettes[i] = localStorage.key(i);
			}
			return palettes.length > 0 ? palettes : false;
		}
	}
};


//l.save('realllllly reallllllllllllllllllly long names are awesome are they not?', [1,2,3,4,5]);



























//helper functions
function $(expr, con) {
	return typeof expr === "string"? (con || document).querySelector(expr) : expr || null;
}

$.hexToRGB = function(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

	return result ? {
	    r: parseInt(result[1], 16),
	    g: parseInt(result[2], 16),
	    b: parseInt(result[3], 16),
	    rgb: parseInt(result[1], 16) + ", " + parseInt(result[2], 16) + ", " + parseInt(result[3], 16)
	} : null;
};

$.RGBToHex = function(r, g, b) {
	function componentToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

//function that changes any number to the range of 0 < x < 255. Keeps iterating until within this range
$.zeroTo255 = function(number) {
	if(number > 255) {
		number -= 255;
		if(number > 255) {
			number = $.zeroTo255(number);
		}
	}

	if(number < 0) {
		number += 255;
		if(number < 0) {
			number = $.zeroTo255(number);
		}
	}
	return number;
};

$.toggleClass = function(ref, first, second) {
	return ref.className === first ? ref.className = second : ref.className = first;
};

$.bind = function(element, opt) {
	if (element) {
		for (var event in opt) {
			var callback = opt[event];
			
			event.split(/\s+/).forEach(function (event) {
				element.addEventListener(event, callback);
			});
		}
	}
};

//the meat of the app. takes a color and returns divs
function mutateColor(color, addR, addG, addB, increment, amount, opposite) {
	//split into separate rgb channels
	var startRGB = $.hexToRGB(color);

	//save the current data in mutate, and set the mutate increment to the initial data
	var mutate = {r: addR + increment, g: addG + increment, b: addB + increment};
	var mutateBy = {r: mutate.r, g: mutate.g, b: mutate.b}; 
	var output = "";
	
	for(var i = 1; i <= amount; i++) {
		var insideColor = "";

		if(opposite === true) {
			insideColor = $.RGBToHex(addR > 0 ? 255 - startRGB.r : startRGB.r, addG > 0 ? 255 - startRGB.g : startRGB.g, addB > 0 ? 255 - startRGB.b : startRGB.b);
		} else {
			insideColor = $.RGBToHex($.zeroTo255(startRGB.r + mutate.r), $.zeroTo255(startRGB.g + mutate.g), $.zeroTo255(startRGB.b + mutate.b));
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


$.bind(document.getElementById("about-anchor"), {
	"click": function(e) {
		e.preventDefault();

		$.toggleClass(document.getElementById("about"), "hide", "show");
		$.toggleClass(document.getElementById("overlay"), "hide", "show");
	}
});

$.bind(document.getElementById("close-about"), {
	"click": function() {
		$.toggleClass(document.getElementById("about"), "hide", "show");
		$.toggleClass(document.getElementById("overlay"), "hide", "show");
	}
});

$.bind(document.getElementById("overlay"), {
	"click": function() {
		$.toggleClass(document.getElementById("about"), "hide", "show");
		$.toggleClass(document.getElementById("overlay"), "hide", "show");
	}
});

/*saved palettes*/
$.bind(document.getElementById("saved-anchor"), {
	"click": function(e) {
		e.preventDefault();
		$.toggleClass(document.getElementById("saved"), "hide", "show");
	}
});

$.bind(document.getElementById("close-saved"), {
	"click": function(e) {
		e.preventDefault();
		$.toggleClass(document.getElementById("saved"), "hide", "show");
	}
});

var paletteName = document.getElementById("palette-name");
var nameSave = '';

$.bind(paletteName, {
	'focus': function() {
		nameSave = paletteName.value;
	},
	'blur': function() {
		nameSave === "Name this palette" ? l.save(paletteName.value) : l.rename(nameSave, paletteName.value);
		refreshPalettes();
	}
});

 function refreshPalettes() {
 	var palList = l.list();
	var pal = "";
	var target = document.getElementById("saved-palettes");

	for(var i = 0; i < palList.length; ++i) {
		pal += '<li>' + palList[i] + '</li>';
	}

 	if(pal !== '') {
		target.innerHTML = pal;
	} else {
		target.innerHTML('<li>No palettes saved</li>');
	}
 }

function init() {
	refreshPalettes();
}

if (document.readyState !== "loading") {
	init();
} else {
	// Wait for it
	document.addEventListener("DOMContentLoaded", init);
}