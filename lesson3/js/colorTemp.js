(function () {

    const cities = [
        "Seattle, WA",
        "Chicago, IL",
        "San Francisco, CA",
        "New York, NY",
        "Atlanta, GA",
        "Salt Lake City, UT",
        "Orem, UT"
    ];

    const weather = [
        "Stormy", 
        "Rain",
        "Windy",
        "Foggy",
        "Partly cloudy",
        "Partly sunny",
        "Showers",
        "Sunny",
        "Overcast",
        "Hurricane",
        "Tornados",
        "Smog"
    ];

  /**
   * Generate a random number.
   * @param {number} low The bottom of range
   * @param {number} high The top of range
   */
  const randomDouble = (low, high) => Math.random() * (high - low) + low;

  const t = document.getElementById("temperature");
  const c = document.getElementById("city");
  const w = document.getElementById("conditions");
  const h = document.getElementById("high");
  const l = document.getElementById("low");

  document.getElementById("weather").addEventListener("click", (e) => {
    const newTemp = randomDouble(-30, 120);
    const colorTemp = 270 - (Math.max(30, newTemp) / 120) * 270;

    t.innerHTML = newTemp.toFixed(1) + "&deg;";
    t.style.textShadow = `2px 2px 5px hsl(${colorTemp} 90% 30%)`;

    c.textContent = cities[Math.trunc(randomDouble(0, cities.length))];
    w.textContent = weather[Math.trunc(randomDouble(0, weather.length))];

    h.innerHTML = (newTemp + randomDouble(1, 10)).toFixed(0) + "&deg;";
    l.innerHTML = (newTemp - randomDouble(1, 10)).toFixed(0) + "&deg;";
  });
  
})();
