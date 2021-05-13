/**
 * Convert text to document fragment.
 * @param {String} text
 */
const asFragment = (text) => {
  return document.createRange().createContextualFragment(text);
};

/**
 * Insert template HTML inside specified element.
 * @param {String} selector A selector expression.
 * @param {String} template Template file name prefix (i.e. _prefix_.template.html). If not specified, the `selector` is used.
 */
export const insertTemplate = async (selector, template = "") => {
  template = template || selector.replace(/^\W/, "");

  const el = document.querySelector(selector);
  if (!el) return false;

  const response = await fetch(`${template}.template.html`);
  const text = await response.text();

  // Parse text as HTML
  const parser = new DOMParser();
  const html = parser.parseFromString(text, "text/html");

  el.parentElement?.replaceChild(asFragment(html.body.innerHTML), el);
  document.head.appendChild(asFragment(html.head.innerHTML));

  return true;
};
