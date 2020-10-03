(function () {
  const d = new Date(document.lastModified);
  document.getElementById("year").textContent = d.getFullYear();
  document.getElementById("time").textContent =
    d.toLocaleDateString() + " " + d.toLocaleTimeString();

  window.setInterval(
    () => (document.getElementById("date").textContent = new Date()),
    1000
  );
})();
