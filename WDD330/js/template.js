/**
 * Convert text to document fragment.
 * @param {String} text
 */
const asFragment = (text) => {
  return document.createRange().createContextualFragment(text);
};

/**
 * Load template into specified element.
 * @param {HTMLElement} el
 * @param {String} template
 */
const loadTemplate = async (el, template) => {
  const response = await fetch(`${template}.template.html`);
  const text = await response.text();

  // Parse text as HTML
  const parser = new DOMParser();
  const html = parser.parseFromString(text, "text/html");

  document.head.appendChild(asFragment(html.head.innerHTML));

  const frag = asFragment(html.body.innerHTML);
  const child = frag.children[0];

  el.parentElement.replaceChild(frag, el);
  return child;
};

/**
 * Trim leading characters from selector, if needed for template.
 * @param {String} selector
 * @param {String} template
 */
const cleanTemplate = (selector, template) =>
  template || selector.replace(/^\W/, "");

/**
 * Insert template HTML inside specified element.
 * @param {String} selector A selector expression.
 * @param {String} template Template file name prefix (i.e. _prefix_.template.html). If not specified, the `selector` is used.
 * @returns Newly inserted element.
 */
export const insertTemplate = async (selector, template = "") => {
  const el = document.querySelector(selector);
  if (!el) return null;

  return await loadTemplate(el, cleanTemplate(selector, template));
};

/**
 * Append template HTML to specified element.
 * @param {String} selector A selector expression.
 * @param {String} template Template file name prefix (i.e. _prefix_.template.html). If not specified, the `selector` is used.
 * @returns Newly inserted element.
 */
export const appendTemplate = async (selector, template) => {
  const parent = document.querySelector(selector);
  if (!parent) return null;

  const el = parent.appendChild(document.createElement("div"));
  return await loadTemplate(el, cleanTemplate(selector, template));
};
