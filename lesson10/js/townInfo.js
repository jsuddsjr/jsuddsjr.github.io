const townInfoUrl = "https://byui-cit230.github.io/weather/data/towndata.json";

/**
 * @typedef {Object} Town
 * @property {string} name
 * @property {string} photo
 * @property {string} motto
 * @property {number} yearFounded
 * @property {number} currentPopulation
 * @property {number} averageRainfall
 * @property {string[]} events
 */


/*

<h2>Preston</h2>
<div class="motto">Home of Napoleon Dynamite.</div>
<p>Year Founded: 1866</p>
<p>Population: 5204</p>
<p>Annual Rain Fall: 16.65</p>

*/

fetch(townInfoUrl)
    .then((request) => request.json())
    .then(
        /** @param {{towns:Town[]}} json */
        (json) => {
            json.towns.forEach(t => {
                const id = t.name.replace(" ", "-").toLowerCase();
                const a = document.querySelector(`#${id} a`);
                if (a) {
                    a.innerHTML = "";

                    const h2 = document.createElement('h2');
                    h2.textContent = t.name;
                    a.appendChild(h2);

                    const div = document.createElement('div');
                    div.className = "motto";
                    div.textContent = t.motto;
                    a.appendChild(div);

                    const year = document.createElement('p');
                    year.textContent = `Year Founded: ${t.yearFounded}`;
                    a.appendChild(year);

                    const pop = document.createElement('p');
                    pop.textContent = `Population: ${t.currentPopulation}`;
                    a.appendChild(pop);

                    const rain = document.createElement('p');
                    rain.textContent = `Annual Rain Fall: ${t.averageRainfall}`;
                    a.appendChild(rain);
                }
            })


        });