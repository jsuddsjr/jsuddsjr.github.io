(function () {
  if ("loading" in HTMLImageElement.prototype) {
    document.querySelectorAll("img[data-src]").forEach(
      /** @param {HTMLImageElement} image */
      (image) => {
        image.loading = "lazy";
        image.src = image.dataset.src;
        image.removeAttribute("data-src");
      }
    );
  } else if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          /** @type HTMLImageElement */
          var image = entry.target;
          image.src = image.dataset.src;
          image.removeAttribute("data-src");
          imageObserver.unobserve(image);
        }
      });
    });
    document.querySelectorAll("img[data-src]").forEach(imageObserver.observe);
  } else {
    let throttleTimeout;

    function lazyload() {
      clearTimeout(throttleTimeout);

      throttleTimeout = setTimeout(() => {
        const pageTop = window.pageYOffset;
        const pageBottom = window.innerHeight + pageTop;

        // Get a new list, in case elements have been added dynamically.
        const lazyloadImages = document.querySelectorAll("img[data-src]");
        if (lazyloadImages.length) {
          lazyloadImages.forEach(
            /** @param {HTMLImageElement} image */
            (image) => {
              if (
                getComputedStyle(image).display !== "none" &&
                image.offsetHeight >= pageTop &&
                image.offsetTop < pageBottom
              ) {
                image.src = image.dataset.src;
                image.removeAttribute("data-src");
              }
            }
          );
        } else {
          document.removeEventListener("scroll", lazyload);
          window.removeEventListener("resize", lazyload);
          window.removeEventListener("orientationChange", lazyload);
        }
      }, 50);
    }

    document.addEventListener("scroll", lazyload);
    window.addEventListener("resize", lazyload);
    window.addEventListener("orientationChange", lazyload);

    lazyload();
  }
})();
