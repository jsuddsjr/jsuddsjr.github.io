(function (d) {
  const FRIDAY = 5;
  const DECEMBER = 11;

  let showBanner = false;

  /** @type {HTMLDivElement} */
  const banner = document.querySelector(".banner-box");
  if (banner) {
    const today = new Date();
    showBanner =
      (d.body.dataset.town === "preston" && today.getDay() === FRIDAY) ||
      (d.body.dataset.town === "fish-haven" &&
        today.getMonth() === DECEMBER &&
        today.getDate() <= 12);
  }

  if (showBanner) {
    banner.style.display = "flex";
    setTimeout(() => banner.classList.add("show"), 1200);
    banner.querySelector("button").addEventListener("click", () => {
      banner.classList.remove("show");
    });
  }
})(document);
