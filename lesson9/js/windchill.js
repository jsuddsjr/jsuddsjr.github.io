(function (d) {
  const temp = d.querySelector('[itemprop="temperature"]');
  const wSpeed = d.querySelector("#windSpeed");
  const wChill = d.querySelector("#windChill");

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
