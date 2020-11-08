(function (d) {
  const table = d.querySelector("table.debug");
  if (table) {
    const toCell = (v) => `<td>${unescape(v.replace('+',' '))}</td>`;
    const toRow = (v) => `<tr>${v}</tr>`;

    const htmlValues = window.location.search
      .substring(1)
      .split("&")
      .map((kvp) => toRow(kvp.split("=").map(toCell).join('')))
      .join('');
    table.innerHTML += htmlValues;
  }
})(document);
