(function () {
  const FRIDAY = 5;

  /** @type {HTMLDivElement} */
  const banner = document.querySelector(".banner-box");
  if (new Date().getDay() === FRIDAY) {
    banner.style.display = "flex";
    setTimeout(() => banner.classList.add("show"), 1200);
  }
  banner.querySelector("button").addEventListener("click", () => {
    banner.classList.remove("show");
  });
})();
