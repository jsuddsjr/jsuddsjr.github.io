(function (d) {
  const temp = d.querySelector('[itemprop="temperature"]');
  const wSpeed = d.querySelector("[itemprop='windSpeed']");
  const wChill = d.querySelector("[itemprop='windChill']");

  // Wind chill = 35.74 + 0.6215T – 35.75 (V^0.16) + 0.4275T (V^0.16)
  // T = Temperature in degrees Fahrenheit
  // V = Wind velocity in miles per hour

  // Custom event dispatched by weather control.
  d.getElementById("weather").addEventListener("weatherUpdated", () => {
    const t = parseFloat(temp.textContent);
    const ws = parseFloat(wSpeed.textContent);

    let wc = "N/A";
    if (t <= 50 && ws >= 3) {
      wsp = Math.pow(ws, 0.16);
      wcv = 35.74 + 0.6215 * t - 35.75 * wsp + 0.4275 * t * wsp;
      wc = wcv.toFixed(1) + "&deg;";
    }

    wChill.innerHTML = wc;
  });
})(document);
