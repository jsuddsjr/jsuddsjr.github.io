/** @type {import('./pokemon.types.js')} */

(
  function (d) {
    const baseUrl = "https://pokeapi.co/api/v2/pokemon";
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

    /**
     *
     * @param {String} buttonId
     * @param {String} url
     */
    function setNavigationUrl(buttonId, url) {
      /** @type {HTMLButtonElement} */
      const button = d.getElementById(buttonId);
      if (url) {
        button.disabled = false;
        button.onclick = () => getPokemonData(url);
      } else {
        button.disabled = true;
      }
    }

    /**
     * Get Star Wars info from API
     * @param {string} url
     */
    async function getPokemonData(url) {
      /** @type {import('./pokemon.types.js').PokemonResponse} */
      const pokemonList = await fetchCached(url);

      if (pokemonList) {
        const urlSegments = pokemonList.results[0].url.split("/");
        const startNumber = parseInt(urlSegments[urlSegments.length - 2]);

        const main = d.querySelector("#main");
        main.innerHTML = "";

        const ol = main.appendChild(d.createElement("ol"));

        const listItems = pokemonList.results.map((p) => `<li><a href="${p.url}">${p.name}</a></li>`);

        ol.innerHTML = listItems.join("");
        ol.start = startNumber;

        [...ol.querySelectorAll("a")].forEach((a) =>
          a.addEventListener("click", openDetails.bind(null, getPokemonDetails))
        );

        setNavigationUrl("next", pokemonList.next);
        setNavigationUrl("prev", pokemonList.previous);
      }
    }

    /**
     * @param {Event} event
     */
    function openDetails(cb, event) {
      /** @type {HTMLAnchorElement} */
      const anchor = event.target;
      event.preventDefault();
      cb(anchor.href, anchor);
    }

    /**
     *
     * @param {String} url
     * @param {HTMLElement} triggerElement
     */
    async function getPokemonDetails(url, triggerElement) {
      /** @type {import('./pokemon.types.js').PokemonData} */
      const pokemon = await fetchCached(url);
      const div = document.createElement("div");
      div.className = "pokemon";
      div.innerHTML = `<img src="${pokemon.sprites.other["official-artwork"].front_default}" alt="${pokemon.name}" />`;
      showModal(pokemon.name, div, triggerElement);
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
            cache: "default",
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

    getPokemonData(baseUrl);
  }
)(document);
