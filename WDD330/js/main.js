/**
 * @typedef {Object} LinkEntry
 * @property {String} url     Relative path to resource
 * @property {String} label   Description of resource
 */

(function (d) {
  /** @type HTMLOListElement */
  const list = d.querySelector(".js-links-list");

  /** @type Array<LinkEntry> */
  const links = [
    {
      url: "W01/story_editor.html",
      label: "Story Editor (from Doing Stuff with Web Things)",
    },
  ];

  for (let entry of links) {
    /** @type HTMLListItemElement */
    const li = d.createElement("LI");
    /** @type HTMLAnchorElement */
    const a = d.createElement("A");
    a.href = entry.url;
    a.innerText = entry.label;
    a.target = "_blank";
    li.appendChild(a);
    list.appendChild(li);
  }

})(document);
