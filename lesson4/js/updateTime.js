(function () {
  document.body.onload = () => {
    const dateOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    const fullDateOptions = {
      ...dateOptions,
      weekday: undefined,
      hour: "numeric",
      minute: "numeric",
    };

    const docDate = new Date(document.lastModified);

    try {
      document.getElementById("year").textContent = docDate.getFullYear();
      // document.getElementById("time").textContent = docDate.toLocaleDateString(
      //   undefined, // Varies according to browser locale.
      //   fullDateOptions
      // );

      // Get date elements from Intl object, and convert array to object keys.
      const p = new Intl.DateTimeFormat("default", dateOptions)
        .formatToParts()
        .reduce((p, c) => ((p[c.type] = c.value), p), {});

      // Format date according to homework requirements.
      document.getElementById(
        "date"
      ).textContent = `${p.weekday}, ${p.day} ${p.month}, ${p.year}`;

    } catch (err) {
      alert(err);
    }
  };
})();
