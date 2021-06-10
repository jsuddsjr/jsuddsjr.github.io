/**
 * @typedef {Object} Person
 * @property {String} name
 * @property {String} height
 * @property {String} mass
 * @property {String} hair_color
 * @property {String} skin_color
 * @property {String} eye_color
 * @property {String} birth_year
 * @property {String} gender
 * @property {String} homeworld
 * @property {String[]} films
 * @property {String[]} species
 * @property {String[]} vehicles
 * @property {String[]} starships
 * @property {String} created
 * @property {String} edited
 * @property {String} url
 */

/**
 * @typedef {Object} PersonData
 * @property {Number} count
 * @property {String} next
 * @property {String} previous
 * @property {Person[]} results
 */

const baseUrl = "https://swapi.dev/api/people";
getPersonData(baseUrl);

function setButtonUrl(buttonId, url) {
  /** @type {HTMLButtonElement} */
  const button = document.getElementById(buttonId);
  if (url) {
    button.disabled = false;
    button.onclick = () => getPersonData(url);
  } else {
    button.disabled = true;
  }
}

/**
 * Get Star Wars info from API
 * @param {string} url
 */
async function getPersonData(url) {
  const PAGE_SIZE = 10;
  const page = url.split("page=")[1];
  const pageNumber = parseInt(page) || 1;
  const startNumber = (pageNumber - 1) * PAGE_SIZE + 1;

  /** @type {PersonData} */
  const personData = await fetch(url).then((response) => response.json());

  const main = document.querySelector("#main");
  main.innerHTML = "";

  const ol = main.appendChild(document.createElement("ol"));

  const listItems = personData.results.map((p) => `<li><a href="${p.url}">${p.name}</a></li>`);

  ol.innerHTML = listItems.join("");
  ol.start = startNumber;

  [...ol.querySelectorAll("a")].forEach((a) => a.addEventListener("click", handleClick));

  setButtonUrl("next", personData.next);
  setButtonUrl("prev", personData.previous);
}

async function getPersonDetails(url) {
  /** @type {PersonData} */
  const person = await fetch(url).then((response) => response.json());

  const modal = document.querySelector("#main");
  main.innerHTML = "";

  main.textContent = JSON.stringify(person);
}

/**
 * @param {Event} event
 */
function handleClick(event) {
  /** @type {HTMLAnchorElement} */
  const anchor = event.target;
  event.preventDefault();
  getPersonDetails(anchor.href);
}
