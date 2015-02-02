document.addEventListener("DOMContentLoaded", function(event) { 

	function hex2rgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        rgb: parseInt(result[1], 16) + ", " + parseInt(result[2], 16) + ", " + parseInt(result[3], 16)
    	} : null;
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

	function morphColor(color, addR, addG, addB, increment, amount, opposite) {
		//split into separate rgb channels
		var rgb = hex2rgb(color);
		var output = [];
		for(var i = 1; i <= amount; i++) {

		}
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
	var output = document.getElementById("output");
	output.textContent = hex;
	output.style.backgroundColor = hex;

	console.log(hex2rgb(hex));



});