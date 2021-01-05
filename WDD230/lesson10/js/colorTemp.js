(function () {

  const randomCities = [
    "Seattle, WA",
    "Chicago, IL",
    "San Francisco, CA",
    "New York, NY",
    "Atlanta, GA",
    "Salt Lake City, UT",
    "Orem, UT"
  ];

  const randomWeather = [
    "Stormy",
    "Rain",
    "Light rain",
    "Windy",
    "Foggy",
    "Partly cloudy",
    "Partly sunny",
    "Showers",
    "Sunny",
    "Overcast",
    "Hurricane",
    "Tornados",
    "Snow flurries",
    "Heavy snow",
    "Smog"
  ];

  /**
   * Generate a random number.
   * @param {number} low The bottom of range
   * @param {number} high The top of range
   */
  const randomDouble = (low, high) => Math.random() * (high - low) + low;

  ((weather) => {
    if (!weather) return;
    
    const t = document.getElementById("temperature");
    const c = document.getElementById("city");
    const w = document.getElementById("conditions");
    const h = document.getElementById("high");
    const l = document.getElementById("low");
    const ws = document.getElementById("windSpeed");

    const weatherUpdated = new Event('weatherUpdated');

    weather.addEventListener("click", async (e) => {
      const newTemp = randomDouble(-30, 120);
      const colorTemp = 270 - (Math.max(30, newTemp) / 120) * 270;
      const {
        currentTarget
      } = e;

      await fade(currentTarget, "out");

      t.innerHTML = newTemp.toFixed(1) + "&deg;";
      t.style.textShadow = `2px 2px 5px hsl(${colorTemp}, 90%, 30%)`;

      c.textContent = randomCities[Math.trunc(randomDouble(0, randomCities.length))];
      w.textContent = randomWeather[Math.trunc(randomDouble(0, randomWeather.length))];

      h.innerHTML = (newTemp + randomDouble(1, 10)).toFixed(0) + "&deg;";
      l.innerHTML = (newTemp - randomDouble(1, 10)).toFixed(0) + "&deg;";

      ws.textContent = (randomDouble(0, 40).toFixed(0)) + " mph";

      // Let others know that the weather has been updated.
      currentTarget.dispatchEvent(weatherUpdated);

      await fade(currentTarget, "in");
    });

  })(document.getElementById("weather"));

  /**
   * Fade object in or out.
   * @param {HTMLElement} element A DOM element
   * @param {string} direction "in", "out"
   */
  async function fade(element, direction) {
    let op = Number(getComputedStyle(element).opacity);

    /**
     * Has the limit been reached?
     * @param {number} n 
     */
    const done = (n) => direction === "in" ? n >= 1.0 : n <= 0.1;

    /**
     * Calculate the new value.
     * @param {number} n 
     */
    const calc = (n) => direction === "in" ? n += n * 0.1 : n -= n * 0.1;

    while (!done(op)) {
      op = calc(op);
      element.style.opacity = op;
      // element.style.filter = `alpha(opacity=${(op * 100).toFixed(0)})`;
      await delay(10);
    };
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
})();