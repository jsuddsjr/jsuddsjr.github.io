(function (d) {
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

  insertTemplate("header");
  insertTemplate("div.overlay", "weather");
  insertTemplate("footer");
})(document);
