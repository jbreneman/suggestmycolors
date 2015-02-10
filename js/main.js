document.addEventListener("DOMContentLoaded", function(event) { 

	//split a hex color into it's individual rgb channels
	function hex2rgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        rgb: parseInt(result[1], 16) + ", " + parseInt(result[2], 16) + ", " + parseInt(result[3], 16)
    	} : null;
	}

	//convert rgb to hex
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

	function mutateColor(color, addR, addG, addB, increment, amount, opposite) {
		//split into separate rgb channels
		var startRGB = hex2rgb(color);

		//save the current data in mutate, and set the mutate increment to the initial data
		var mutate = {r: addR + increment, g: addG + increment, b: addB + increment};
		var mutateBy = {r: mutate.r, g: mutate.g, b: mutate.b}; 

		var insideColor = "";
		var output = "";

		for(var i = 1; i <= amount; i++) {
			if(opposite === true) {
				insideColor = function() {
					var r = addR > 0 ? 255 - startRGB.r : startRGB.r;
					var g = addG > 0 ? 255 - startRGB.g : startRGB.g;
					var b = addB > 0 ? 255 - startRGB.b : startRGB.b;
					return rgbToHex(r, g, b);
				}
			} else {
				insideColor = rgbToHex(zeroTo255(startRGB.r + mutate.r), zeroTo255(startRGB.g + mutate.g), zeroTo255(startRGB.b + mutate.b));
			}

			output += "<div class=\"color\" style=\"background: " + insideColor + "\"><a href=\"index.html" + insideColor + "\">" + insideColor + "</a></div>";
			mutate = {r: mutate.r + mutateBy.r, g: mutate.g + mutateBy.g, b: mutate.b + mutateBy.b};

		}
		return "<div class=\"column\">" + output + "</div>";
	}

	function isValidHex(hex) {
		return /^#[0-9A-F]{6}$/i.test(hex);
	}

	//grab color from current url hash
	var hex = window.location.hash;

	if(hex&&isValidHex(hex)) {
		var hex = window.location.hash;
	} else {
		var hex = "#577d06";
	}

	console.log(hex);
	var color = document.getElementById("pick");
	color.innerHTML = "";
	color.textContent = hex;
	color.style.backgroundColor = hex;

	console.log("first color:");
	console.log(hex2rgb(hex));

	var output = document.getElementById("outputs");
	var divs = mutateColor(hex, 32, 0, 0, 0, 5, false) + mutateColor(hex, 0, 32, 0, 0, 5, false) + mutateColor(hex, 0, 0, 32, 0, 5, false);
	output.innerHTML = divs;




});