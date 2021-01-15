document.addEventListener("DOMContentLoaded",() => {
	updateTemperature(2e3);
});
function CToF(c) {
	return c * 1.8 + 32;
}
function FToC(f) {
	return (f - 32) * (5 / 9);
}
function incOrDec(amt = 1) {
	return Math.random() < 0.5 ? -amt : amt;
}
function nearest10th(n) {
	return Math.round(n * 10) / 10;
}
function updateTemperature(interval = 1e3,useCelcius = false) {
	// `useCelcius` means that the temperature should increment or decrement by °C instead of °F
	let tempVal = document.getElementById("temp-val");
	if (tempVal) {
		let dataC = tempVal.getAttribute("data-c"),
			dataF = tempVal.getAttribute("data-f"),
			tempC = +dataC,
			tempF = +dataF,
			tempFill = document.getElementById("temp-fill"),
			adjustAmt = Math.round(1 + Math.random());
		// randomly increment or decrement the temperature
		if (useCelcius) {
			tempC += incOrDec(adjustAmt);
			tempVal.setAttribute("data-c",tempC);
			tempF = nearest10th(CToF(tempC));
			tempVal.setAttribute("data-f",tempF);
		} else {
			tempF += incOrDec(adjustAmt);
			tempVal.setAttribute("data-f",tempF);
			tempC = nearest10th(FToC(tempF));
			tempVal.setAttribute("data-c",tempC);
		}
		// mercury
		if (tempFill) {
			let scaleY = 0,
				scaleYMax = 0.995;

			if (useCelcius) {
				let minTempC = -53,
					maxTempC = 60;
				scaleY += (tempC - minTempC) / (Math.abs(minTempC) + maxTempC);
			} else {
				let minTempF = -60,
					maxTempF = 140;
				scaleY += (tempF - minTempF) / (Math.abs(minTempF) + maxTempF);
			}

			if (scaleY > scaleYMax)
				scaleY = scaleYMax;
			else if (scaleY < 0)
				scaleY = 0;

			tempFill.style.transform = `scaleY(${scaleY})`;
		}
		// reading to put in title
		let tempReading = `${tempC}°C, ${tempF}°F`;
		tempVal.title = tempReading;
	}
	setTimeout(updateTemperature.bind(null,interval,useCelcius),interval);
}