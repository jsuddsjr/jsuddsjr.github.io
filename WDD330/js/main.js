/**
 * @typedef {Object} LinkEntry
 * @property {String} url     Relative path to resource
 * @property {String} label   Description of resource
 * @property {String} info    Optional HTML to explain link
 */

/**
 * @typedef {Object} WeeklyReport
 * @property {LinkEntry[]} links
 * @property {String[]} questions
 */

Number.prototype[Symbol.iterator] = function* () {
  for (let i = 1; i <= this; i++) {
    yield i;
  }
};

Number.prototype.pad = function (size) {
  var s = String(this);
  return "0".repeat(size - s.length) + s;
};

(async function (d) {
  /** @type HTMLOListElement */
  const ol = d.querySelector(".js-links");

  /**
   * Attempts to open the _index.json_ file for the specified week.
   * If the file cannot be opened, a default set of data is returned.
   * This code reads the _data-weeks_ attr set on the parent OL element
   * to determine how many default weeks to return.
   * @returns Fetched data
   */
  const getWeeklyReport = async () => {
    try {
      const week = location.search.substr(1);
      const request = await fetch(`./${week}/index.json`);
      /** @type WeeklyReport */
      const links = await request.json();
      return links;
    } catch (error) {
      const weeks = parseInt(ol.dataset["weeks"] || 1);
      return {
        links: [...weeks].map((n) => {
          return { url: "index.html?W" + n.pad(2), label: `Week ${n}` };
        }),
        questions: [],
      };
    }
  };

  /**
   * Convert text to document fragment
   * @param {String} text
   */
  const asFragment = (text) => {
    return d.createRange().createContextualFragment(text);
  };

  /**
   * Insert template HTML inside specified element
   * @param {String} selector
   * @param {String} template
   */
  const insertTemplate = async (selector, template = null) => {
    template = template || selector;

    /** @type Element */
    const el = d.querySelector(selector);
    if (!el) return false;

    const response = await fetch(`${template}.template.html`);
    const text = await response.text();

    // Parse text as HTML
    const parser = new DOMParser();
    const html = parser.parseFromString(text, "text/html");

    el.parentElement.replaceChild(asFragment(html.body.innerHTML), el);
    d.head.appendChild(asFragment(html.head.innerHTML));

    return true;
  };

  const report = await getWeeklyReport();

  // Create list item for each link.
  for (let entry of report.links) {
    /** @type HTMLListItemElement */
    const li = d.createElement("LI");
    /** @type HTMLAnchorElement */
    const a = d.createElement("A");
    a.href = entry.url;
    a.innerText = entry.label;
    li.appendChild(a);
    if (entry.info) {
      li.innerHTML += `<div class="info">${entry.info}</div>`
    }
    ol.appendChild(li);
  }

  // Append questions, if any.
  if (
    report.questions?.length &&
    (await insertTemplate("#questions", "questions"))
  ) {
    const olq = d.querySelector(".js-questions");
    for (let q of report.questions) {
      /** @type HTMLListItemElement */
      const li = d.createElement("LI");
      li.innerHTML = q;
      olq.appendChild(li);
    }
  }
})(document);
