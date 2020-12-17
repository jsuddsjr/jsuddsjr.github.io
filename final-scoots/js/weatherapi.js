(function (d) {
  /** Source: https://openweathermap.org/api */

  /**
   * @typedef {Object} CurrentData
   * @property {Number} clouds
   * @property {Number} dew_point
   * @property {Number} dt
   * @property {Number} feels_like
   * @property {Number} humidity
   * @property {Number} pressure
   * @property {{1h:Number}} rain
   * @property {Number} sunrise
   * @property {Number} sunset
   * @property {Number} temp
   * @property {Number} uvi
   * @property {Number} visibility
   * @property {Array<WeatherData>} weather
   * @property {Number} wind_deg
   * @property {Number} wind_speed
   */

  /**
   * @typedef {Object} DailyData
   * @property {Number} clouds
   * @property {Number} dew_point
   * @property {Number} dt
   * @property {FeelsLikeData} feels_like
   * @property {Number} humidity
   * @property {Number} pop
   * @property {Number} pressure
   * @property {Number} rain
   * @property {Number} sunrise
   * @property {Number} sunset
   * @property {TempData} temp
   * @property {Number} uvi
   * @property {Array<WeatherData>} weather
   * @property {Number} wind_deg
   * @property {Number} wind_speed
   */

  /**
   * @typedef {Object} FeelsLikeData
   * @property {Number} day
   * @property {Number} eve
   * @property {Number} morn
   * @property {Number} night
   */

  /**
   * @typedef {Object} TempData
   * @property {Number} day
   * @property {Number} eve
   * @property {Number} max
   * @property {Number} min
   * @property {Number} morn
   * @property {Number} night
   */

  /**
   * @typedef {Object} AlertData
   * @property {String} description
   * @property {Number} end
   * @property {String} event
   * @property {String} sender_name
   * @property {Number} start
   */

  /** @typedef {Object} OneCall
   * @property {Array<AlertData>} alerts
   * @property {CurrentData} current
   * @property {Array<DailyData>} daily
   * @property {Number} lat
   * @property {Number} lon
   * @property {String} timezone
   * @property {Number} timezone_offset
   */

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
   * Construct URL for weather API.
   * @param {string} townId
   * @param {"weather"|"forecast"} endpoint
   * @param {"imperial"|"metric"} units
   */
  const getUrl = (townId, endpoint = "onecall", units = "imperial") => {
    const apiKey = "5d50935bc3ce8aa3de4654aabf285ea8";
    return `https://api.openweathermap.org/data/2.5/${endpoint}?${townId}&units=${units}&exclude=hourly,minutely&appid=${apiKey}`;
  };

  /**
   * A lookup for location data.
   */
  const loc = {
    // 20.494950, -86.951089
    cozumel: "lat=20.494950&lon=-86.951089",
  };

  if (!String.toInitialCap) {
    String.prototype.toInitialCap = function () {
      return this[0].toUpperCase() + this.substring(1);
    };
  }

  /**
   * Local representation for easy mapping to HTML.
   * @typedef {Object} WeatherInfo
   * @property {String} name         Name of the location
   * @property {String} weekday      Day of the week
   * @property {number} currentTemp  Current temperature
   * @property {string} conditions   Brief description of weather
   * @property {string} icon         URL path to weather symbol
   * @property {number} high         High temperature
   * @property {number} low          Low temperature
   * @property {number} humidity     Humidity percentage
   * @property {number} windSpeed    Wind speed
   */

  /**
   * @param {DailyData} daily
   * @returns {WeatherInfo}
   */
  const normalizeData = (daily) => ({
    // Convert date to weekday name.
    weekday: new Date(daily.dt * 1000).toLocaleDateString("default", {
      weekday: "short",
    }),
    currentTemp: Math.trunc(daily.temp.day),
    conditions: daily.weather[0].description.toInitialCap(),
    icon: "https://openweathermap.org/img/w/" + daily.weather[0].icon + ".png",
    high: daily.temp.max,
    low: daily.temp.min,
    humidity: daily.humidity,
    windSpeed: daily.wind_speed,
  });

  const weatherDiv = d.querySelector(".weather");
  if (weatherDiv) {
    fetch(getUrl(loc.cozumel))
      .then((response) => response.json())
      .then(
        /** @param {OneCall} data */ (data) => {
          data.daily
            .slice(0, 4)
            .map(normalizeData)
            .forEach((info) => {
              const div = d.createElement("DIV");
              div.className = "day";

              const dayName = d.createElement("DIV");
              dayName.innerHTML = `${info.weekday} ~ ${info.currentTemp}&deg;`;
              dayName.className = "detail";
              div.appendChild(dayName);

              const iconImage = d.createElement("IMG");
              iconImage.src = info.icon;
              iconImage.alt = info.conditions;
              iconImage.title = info.conditions;
              div.appendChild(iconImage);

              const conditions = d.createElement("DIV");
              conditions.textContent = info.conditions;
              conditions.className = "conditions";
              div.appendChild(conditions);

              weatherDiv.appendChild(div);
            });

          const currentTemp = d.getElementById("current-temp");
          if (currentTemp)
            currentTemp.innerHTML = data.current.temp + "&deg;<sup>F</sup>";

          const humidity = d.getElementById("humidity");
          if (humidity) humidity.textContent += data.current.humidity + "%";

          const sunrise = d.getElementById("sunrise");
          if (sunrise)
            sunrise.textContent += new Date(
              data.current.sunrise * 1000
            ).toLocaleTimeString();

          const sunset = d.getElementById("sunset");
          if (sunset)
            sunset.textContent += new Date(
              data.current.sunset * 1000
            ).toLocaleTimeString();

          if (!data.alerts && Math.random() > 0.6) {
            data.alerts = [
              {
                sender_name: "John Sudds",
                description: "This random weather alert can be ignored.",
                event: "Final Project Banner Test",
                start: new Date().getTime() / 1000,
                end: undefined,
              },
            ];
          }

          if (data.alerts) {
            const warnings = d.querySelector(".weather-warning");
            if (warnings) {
              warnings.innerHTML += data.alerts
                .map((a) => {
                  const start = a.start
                    ? new Date(a.start * 1000).toLocaleDateString()
                    : "start unknown";
                  const end = a.end
                    ? new Date(a.end * 1000).toLocaleDateString()
                    : "end unknown";
                  return `<div class="warning-dates">(${start} - ${end})</div>
                  <div class="warning-title">${a.event}</div>
                  <div class="warning-description">${a.description} - ${a.sender_name}</div>`;
                })
                .join("");
              warnings.classList.remove("hidden");
              warnings.addEventListener("click", (e) =>
                warnings.classList.add("hidden")
              );
            }
          }
        }
      )
  }
})(document);
