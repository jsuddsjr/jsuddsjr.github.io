(function () {
  const hamburger = document.getElementById("hamburger");
  document
    .querySelectorAll("nav a")
    .forEach((el) => el.addEventListener("click", (e) => {
        hamburger.checked = false;
    }));
})();
