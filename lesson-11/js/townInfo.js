(function (d) {
  const towns = d.getElementById("towns");
  if (towns) {
    const townInfoUrl =
      "https://byui-cit230.github.io/weather/data/towndata.json";

    /**
     * @typedef {Object} Town
     * @property {String} name
     * @property {String} photo
     * @property {String} motto
     * @property {Number} yearFounded
     * @property {Number} currentPopulation
     * @property {Number} averageRainfall
     * @property {Array<String>} events
     */

    fetch(townInfoUrl)
      .then((request) => request.json())
      .then(
        /** @param {{towns:Town[]}} json */
        (json) => {
          json.towns.forEach((t) => {
            const id = t.name.replace(" ", "-").toLowerCase();
            const a = d.querySelector(`#${id} a`);
            if (a) {
              a.innerHTML = "";

              const h2 = d.createElement("h2");
              h2.textContent = t.name;
              a.appendChild(h2);

              const div = d.createElement("div");
              div.className = "motto";
              div.textContent = t.motto;
              a.appendChild(div);

              const year = d.createElement("p");
              year.textContent = `Year Founded: ${t.yearFounded}`;
              a.appendChild(year);

              const pop = d.createElement("p");
              pop.textContent = `Population: ${t.currentPopulation}`;
              a.appendChild(pop);

              const rain = d.createElement("p");
              rain.textContent = `Annual Rain Fall: ${t.averageRainfall}`;
              a.appendChild(rain);
            }
          });
        }
      );
  }

  const news = d.getElementById("news");
  if (news) {
    const dataUrl = "data/news.json";

    /**
     * @typedef {Object} News
     * @property {String} town
     * @property {String} imageUrl
     * @property {String} byline
     * @property {String} pubDate
     * @property {String} title
     * @property {Array<String>} text
     */

     // A filter for news stories from data-town attribute.
    const filterNews = news.dataset.town
      ? /**
         * @param {News} story
         * @param {Number} i
         */
        (story, i) => story.town === news.dataset.town
      : (story, i) => i === 0;

    fetch(dataUrl)
      .then((response) => response.json())
      .then(
        /** @param {Array<News>} data */ (data) =>
          data.filter(filterNews).forEach((story) => {
            news.querySelector(".title").textContent = story.title;
            news.querySelector(".byline").textContent = story.byline;
            news.querySelector(".published span").textContent = new Date(
              story.pubDate
            ).toLocaleString();
            news.querySelector(".text").innerHTML = story.text
              .map((p) => `<p>${p}<\p>`)
              .join("");
            news.querySelector("img").src = story.imageUrl;
          })
      );
  }
})(document);
