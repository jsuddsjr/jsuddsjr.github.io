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

  // Set up click on close button and modal background to dismiss dialog.
  [document.getElementById("close"), modal].forEach((el) => el.addEventListener("click", dismissModal));

  [...modal.children].forEach(
    // Clicks inside the modal do not trigger close.
    (el) => el.addEventListener("click", (e) => e.stopImmediatePropagation())
  );

  /**
   * Show modal dialog with the specified content.
   * @param {String} title
   * @param {String|HTMLElement} body
   * @param {HTMLElement} [triggerElement]
   */
  function showModal(title, body, triggerElement) {
    modal.style.display = "flex";
    modal.triggerElement = triggerElement;

    const titleElement = modal.querySelector(".modal-title h3");
    const bodyElement = modal.querySelector(".modal-body");
    const closeButton = modal.querySelector("button");

    titleElement.textContent = title;
    if (body instanceof HTMLElement) {
      bodyElement.innerHTML = "";
      bodyElement.appendChild(body);
    } else {
      bodyElement.textContent = String(body);
    }

    closeButton.focus();
  }

  /**
   * Close dialog and return focus to prior element.
   */
  function dismissModal() {
    modal.style.display = "none";
    if (modal.triggerElement instanceof HTMLElement) {
      modal.triggerElement.focus();
    }
  }

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
    getPersonDetails(anchor.href, anchor);
  }

  /**
   *
   * @param {String} url
   * @param {HTMLElement} triggerElement
   */
  async function getPersonDetails(url, triggerElement) {
    /** @type {PersonData} */
    const person = await fetchCached(url);
    showModal(person.name, JSON.stringify(person), triggerElement);
  }

  /**
   * Read object from cache or URL.
   * @param {String} url
   * @returns Cached object, if it exists.
   */
  async function fetchCached(url) {
    let data = JSON.parse(localStorage.getItem(url));
    if (!data) {
      try {
        const response = await fetch(url, {
          headers: {
            accept: "application/json",
          },
          referrerPolicy: "no-referrer",
        });
        if (response.ok) {
          data = await response.json();
        } else {
          showModal("Response status", response.statusText);
        }
      } catch (error) {
        showModal("Error", error);
        return Promise.reject(error);
      }
      if (data) {
        localStorage.setItem(url, JSON.stringify(data));
      }
    }
    return Promise.resolve(data);
  }

  getPersonData(baseUrl);
})(document);
