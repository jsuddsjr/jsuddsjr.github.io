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

        const listItems = pokemonList.results.map((p) => `<li><a href="${p.url}">${p.name}</a></li>`);

        const main = d.querySelector("#main");
        main.innerHTML = "";
        const ol = main.appendChild(d.createElement("ol"));
        ol.innerHTML = listItems.join("");
        ol.start = startNumber;

        [...ol.querySelectorAll("a")].forEach((a) =>
          a.addEventListener("click", openDetails.bind(null, getPokemonDetails))
        );
      }
    }

    /**
     * @param {function(string, HTMLElement): Promise<void>} cb
     * @param {Event} event
     */
    function openDetails(cb, event) {
      /** @type {HTMLAnchorElement} */
      const anchor = event.target;
      event.preventDefault();
      cb(anchor.href, anchor);
    }

    /**
     * Fetch the details from selected url.
     * @param {String} url
     * @param {HTMLElement} triggerElement
     */
    async function getPokemonDetails(url, triggerElement) {
      /** @type {import('./pokemon.types.js').PokemonData} */
      const pokemon = await fetchData(url);
      const imageSrc = pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default;

      const div = document.createElement("div");
      div.className = "pokemon";

      const spinner = div.appendChild(document.createElement("div"));
      spinner.className = "spinner";
      spinner.style.display = "none";

      const image = div.appendChild(new Image());
      image.src = imageSrc;
      image.alt = pokemon.name;

      setTimeout(() => {
        if (!image.complete) {
          spinner.style.display = "block";
          image.onload = (e) => {
            spinner.style.display = "none";
            image.onload = null;
          };
        }
      }, 200);

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
          return Promise.reject(response.statusText);
        }
      } catch (error) {
        return Promise.reject(String(error));
      }
    }

    getPokemonData(baseUrl).catch((reason) => modal.show("Error", reason));
  }
)(document);
