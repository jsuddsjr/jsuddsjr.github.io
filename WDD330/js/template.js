export const generateKey = (function () {
  const KEY_MAX = parseInt("zzzz", 36);
  const KEY_MIN = parseInt("a000", 36);
  const KEY_RND_MAX = KEY_MAX - KEY_MIN;
  return () => Math.trunc(Math.random() * KEY_RND_MAX + KEY_MIN).toString(36);
})();

/**
 * Convert text to document fragment.
 * @param {String} text
 * @param {String} key
 */
const asFragment = (text, key) => {
  text = text.replace(/{key}/g, key);
  const range = document.createRange();
  return range.createContextualFragment(text);
};

/**
 * Load template into specified element.
 * @param {HTMLElement} el
 * @param {String} template
 */
const loadTemplate = async (el, template) => {
  const response = await fetch(`${template}.template.html`);
  const text = await response.text();
  const key = generateKey();

  // Parse text as HTML
  const parser = new DOMParser();
  const html = parser.parseFromString(text, "text/html");

  const headText = html.head.innerHTML;
  if (headText) {
    document.head.appendChild(asFragment(headText, key));
  }

  const frag = asFragment(html.body.innerHTML, key);
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
