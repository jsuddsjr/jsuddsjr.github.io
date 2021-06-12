import Modal from "./modal.js";
import Paginator from "./paginator.js";
/** @type {import('./pokemon.types.js')} */

(
  function (d) {
    const baseUrl = "https://pokeapi.co/api/v2/pokemon/";
    const modal = new Modal("modalBackground");
    const paginator = new Paginator("navigation", onPageClick);

    function onPageClick(page, pageSize) {
      if (page > 1) {
        const urlParams = new URLSearchParams();
        urlParams.set("offset", (page - 1) * pageSize);
        urlParams.set("limit", pageSize);
        getPokemonData(`${baseUrl}?${urlParams}`);
      } else {
        getPokemonData(baseUrl);
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
      const search = url.split("?")[1];
      const urlParams = new URLSearchParams(search);
      const startNumber = Number(urlParams.get("offset") || 1);
      const pageSize = Number(urlParams.get("limit") || 20);

      /** @type {import('./pokemon.types.js').PokemonResponse} */
      const pokemonList = await fetchData(url);
      if (pokemonList) {
        paginator.setPageParameters(pokemonList.count, pageSize);

        const main = d.querySelector("#main");
        main.innerHTML = "";

        const ol = main.appendChild(d.createElement("ol"));

        const listItems = pokemonList.results.map((p) => `<li><a href="${p.url}">${p.name}</a></li>`);

        ol.innerHTML = listItems.join("");
        ol.start = startNumber;

        [...ol.querySelectorAll("a")].forEach((a) =>
          a.addEventListener("click", openDetails.bind(null, getPokemonDetails))
        );
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
      const pokemon = await fetchData(url);
      const div = document.createElement("div");
      div.className = "pokemon";

      const imageSrc = pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default;

      div.innerHTML = `<img src="${imageSrc}" alt="${pokemon.name}" />`;
      modal.show(pokemon.name, div, triggerElement);
    }

    /**
     * Read object from cache or URL.
     * @param {String} url
     * @returns Cached object, if it exists.
     */
    async function fetchData(url) {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        if (response.ok) {
          const data = await response.json();
          return Promise.resolve(data);
        } else {
          showModal("Response status", response.statusText);
        }
      } catch (error) {
        showModal("Error", error);
        return Promise.reject(error);
      }
    }

    /**
     * Cache data under key.
     * @param {String} key
     * @param {*} data
     */
    function cacheResults(key, data) {
      localStorage.setItem(key, JSON.stringify(data));
    }

    /**
     * Get data associated with key.
     * @param {String} key
     * @returns An object.
     */
    function getCachedResults(key) {
      return JSON.parse(localStorage.getItem(key));
    }

    getPokemonData(baseUrl);
  }
)(document);
