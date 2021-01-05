(function () {
  const dateOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const fullDateOptions = {
    ...dateOptions,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  const docDate = new Date(document.lastModified);
  const year = document.getElementById("document-year");
  if (year) year.textContent = docDate.getFullYear();

  // Get date elements from Intl object, and convert array to object keys.
  const p = new Intl.DateTimeFormat("default", fullDateOptions)
    .formatToParts(docDate)
    .reduce((p, c) => ((p[c.type] = c.value), p), {});

  // Format date according to homework requirements.
  const date = document.getElementById("document-date");
  if (date) date.textContent = `${p.weekday}, ${p.day} ${p.month}, ${p.year}`;
})();
