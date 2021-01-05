(function () {
  const d = new Date(document.lastModified);
  document.getElementById("year").innerText = d.getFullYear();
  document.getElementById("time").innerText = d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
})();
