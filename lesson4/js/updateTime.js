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
      document.getElementById("time").textContent = docDate.toLocaleDateString(
        undefined, // Varies according to browser locale.
        fullDateOptions
      );

      document.getElementById(
        "date"
      ).textContent = new Date().toLocaleDateString(
        undefined, // Varies according to browser locale.
        dateOptions
      );
    } catch (err) {
      alert(err);
    }
  };
})();
