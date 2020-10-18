(function () {
  const FRIDAY = 5;

  const banner = document.querySelector(".banner-box");
  if (new Date().getDay() === 6) {
    banner.style.display = "block";

    setTimeout(() => banner.classList.toggle("show"), 2000);

    banner.querySelector("button").addEventListener("click", () => {
      banner.classList.toggle("show");
    });

    document.addEventListener("scroll", () => {
      banner.style.top =
        (document.documentElement.scrollTop + 16).toFixed(1) + "px";
    });
  }
})();
