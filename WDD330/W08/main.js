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

(function (d) {
  const baseUrl = "https://swapi.dev/api/people";
  const modal = d.getElementById("modalBackground");

  [document.getElementById("close"), modal].forEach((el) =>
    el.addEventListener("click", () => (modal.style.display = "none"))
  );

  [...modal.children].forEach(
    // Clicks inside the modal do not trigger close.
    (el) => el.addEventListener("click", (e) => e.stopImmediatePropagation())
  );

  function setNavigationUrl(buttonId, url) {
    /** @type {HTMLButtonElement} */
    const button = d.getElementById(buttonId);
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
    /** @type {PersonData} */
    const personData = await fetchCached(url);

    if (personData) {
      const PAGE_SIZE = 10;
      const page = url.split("page=")[1];
      const pageNumber = parseInt(page) || 1;
      const startNumber = (pageNumber - 1) * PAGE_SIZE + 1;

      const main = d.querySelector("#main");
      main.innerHTML = "";

      const ol = main.appendChild(d.createElement("ol"));

      const listItems = personData.results.map((p) => `<li><a href="${p.url}">${p.name}</a></li>`);

      ol.innerHTML = listItems.join("");
      ol.start = startNumber;

      [...ol.querySelectorAll("a")].forEach((a) => a.addEventListener("click", personClick));

      setNavigationUrl("next", personData.next);
      setNavigationUrl("prev", personData.previous);
    }
  }

  /**
   * @param {Event} event
   */
  function personClick(event) {
    /** @type {HTMLAnchorElement} */
    const anchor = event.target;
    event.preventDefault();
    getPersonDetails(anchor.href);
  }

  /**
   *
   * @param {String} url
   */
  async function getPersonDetails(url) {
    /** @type {PersonData} */
    const person = await fetchCached(url);
    showModal(person.name, JSON.stringify(person));
  }

  /**
   * Show modal dialog with the specified content.
   * @param {String} title
   * @param {String|HTMLElement} body
   */
  function showModal(title, body) {
    modal.style.display = "flex";
    const titleElement = modal.querySelector(".modal-title h3");
    titleElement.textContent = title;
    const bodyElement = modal.querySelector(".modal-body");
    if (body instanceof HTMLElement) {
      bodyElement.innerHTML = "";
      bodyElement.appendChild(body);
    } else {
      bodyElement.textContent = String(body);
    }
  }
  /**
   * Read object from cache or URL.
   * @param {String} url
   * @returns Cached object, if it exists.
   */
  async function fetchCached(url) {
    let data = JSON.parse(localStorage.getItem(url));
    if (!data) {
      data = await fetch(url).then(
        (response) => response.json(),
        (reason) => showModal("Fetch error", reason)
      );
      if (data) {
        localStorage.setItem(url, JSON.stringify(data));
      }
    }
    return data;
  }

  getPersonData(baseUrl);
})(document);
