(function (d) {
  /** @typedef {Object} WeatherData
   * @property {String} description
   * @property {String} icon
   * @property {Number} id
   * @property {String} main
   */

  /** @typedef {Object} MainData
   * @property {Number} feels_like
   * @property {Number} grnd_level
   * @property {Number} humidity
   * @property {Number} pressure
   * @property {Number} sea_level
   * @property {Number} temp
   * @property {Number} temp_kf
   * @property {Number} temp_max
   * @property {Number} temp_min
   */

  /** @typedef {Object} SysData
   * @property {String} country
   * @property {Number} id
   * @property {Number} sunrise
   * @property {Number} sunset
   * @property {Number} type
   */

  /** @typedef {Object} ForecastData
   * @property {{all: Number}} clouds
   * @property {Number} dt
   * @property {String} dt_txt
   * @property {MainData} main
   * @property {Number} pop
   * @property {SysData} sys
   * @property {Number} visibility
   * @property {Array<WeatherData>} weather
   * @property {{speed: Number, deg: Number}} wind
   */

  /** @typedef {Object} CityData
   * @property {{lat: Number, lon: Number}} coord
   * @property {String} country
   * @property {Number} id
   * @property {String} name
   * @property {Number} population
   * @property {Number} sunrise
   * @property {Number} sunset
   * @property {Number} timezone
   */

  /** @typedef {Object} RawData
   * @property {CityData} city
   * @property {Number} cnt
   * @property {String} cod
   * @property {Array<ForecastData>} list
   * @property {Number} message
   */

  /**
   * @typedef {Object} WeatherInfo
   * @property {String} weekday
   * @property {number} currentTemp
   * @property {string} conditions
   * @property {string} icon
   * @property {number} high
   * @property {number} low
   * @property {number} humidity
   * @property {number} windSpeed
   */

  const townId = "5604473";
  const apiKey = "5d50935bc3ce8aa3de4654aabf285ea8";
  const units = "imperial";

  const apiURL = `https://api.openweathermap.org/data/2.5/{{endpoint}}?id=${townId}&units=${units}&appid=${apiKey}`;

  if (!String.toInitialCap) {
    String.prototype.toInitialCap = function () {
      return this[0].toUpperCase() + this.substring(1);
    };
  }

  /**
   * @param {ForecastData} d
   * @returns {WeatherInfo}
   */
  const normalizeData = (d) => ({
    // Convert date to weekday name.
    weekday: new Date(d.dt * 1000).toLocaleDateString("default", {
      weekday: "long",
    }),
    currentTemp: d.main.temp,
    conditions: d.weather[0].description.toInitialCap(),
    icon: "https://openweathermap.org/img/w/" + d.weather[0].icon + ".png",
    high: d.main.temp_max,
    low: d.main.temp_min,
    humidity: d.main.humidity,
    windSpeed: d.wind.speed,
  });

  const forecast = d.querySelector(".forecast div");

  fetch(apiURL.replace("{{endpoint}}", "forecast"))
    .then((response) => response.json())
    .then(
      /** @param {RawData} data */ (data) =>
        data.list
          .filter((d) => d.dt_txt.indexOf("18:00:00") > 0)
          .map(normalizeData)
          .forEach((info) => {
            // console.log(info);

            const div = d.createElement("DIV");
            div.className = "day";

            const dayName = d.createElement("SPAN");
            dayName.innerText = info.weekday;
            div.appendChild(dayName);

            const iconImage = d.createElement("IMG");
            iconImage.src = info.icon;
            iconImage.alt = info.conditions;
            iconImage.title = info.conditions;
            div.appendChild(iconImage);

            const temp = d.createElement("SPAN");
            temp.innerHTML = info.currentTemp.toFixed(0) + "&deg;";
            div.appendChild(temp);

            forecast.appendChild(div);
          })
    );

  const weather = d.getElementById("weather");

  const temp = d.querySelector("[itemprop='temperature']");
  const cond = d.querySelector("[itemprop='conditions']");
  const high = d.querySelector("[itemprop='high']");
  const low = d.querySelector("[itemprop='low']");
  const humidity = d.querySelector("[itemprop='humidity']");
  const ws = d.querySelector("[itemprop='windSpeed']");

  fetch(apiURL.replace("{{endpoint}}", "weather"))
    .then((response) => response.json())
    .then(
      /** @param {ForecastData} data */
      (data) => {
          console.log(data)
        const info = normalizeData(data);

        temp.innerHTML = info.currentTemp.toFixed(1) + "&deg;";
        cond.textContent = info.conditions;
        high.textContent = info.high.toFixed(0);
        low.textContent = info.low.toFixed(0);
        humidity.textContent = info.humidity + "%";
        ws.textContent = info.windSpeed + " mph";

        // Do side-effects, such as calculate wind chill factor.
        weather.dispatchEvent(new Event("weatherUpdated"));

        const colorTemp = 270 - (Math.max(30, info.currentTemp) / 120) * 270;
        temp.style.textShadow = `2px 2px 5px hsl(${colorTemp}, 90%, 30%)`;
      }
    );
})(document);
