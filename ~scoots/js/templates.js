(function (d) {
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

    // Force execute script tags.
    const range = d.createRange();
    const fragment = range.createContextualFragment(text);
    el.appendChild(fragment);

    return true;
  };

  // Nav depends on header.
  insertTemplate("header").then(() => insertTemplate("nav"));
  insertTemplate("div.overlay", "weather");
  insertTemplate("footer");
})(document);
