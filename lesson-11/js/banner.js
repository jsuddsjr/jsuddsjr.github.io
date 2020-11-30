(function () {
  const FRIDAY = 5;

  const banner = document.querySelector(".banner-box");
  if (new Date().getDay() === FRIDAY) {
    setTimeout(() => banner.classList.add("show"), 2000);
  }
  banner.querySelector("button").addEventListener("click", () => {
    banner.classList.remove("show");
  });
})();
