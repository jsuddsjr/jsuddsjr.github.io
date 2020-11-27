(function (d) {
  const table = d.querySelector("table.debug");
  if (table) {
    /** @param {string} v */
    const toCell = (v) => `<td>${unescape(v.replace(/\+/g, " "))}</td>`;
    const toRow = (v) => `<tr>${v}</tr>`;

    const htmlString = window.location.search
      .substring(1)
      .split("&")
      .map((kvp) => toRow(kvp.split("=").map(toCell).join("")))
      .join("");

    table.innerHTML += htmlString;
  }
})(document);
