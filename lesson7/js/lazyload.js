(function () {
  /** @param {HTMLImageElement} image */
  const loadImage = (image) => {
    if (image.dataset.src) {
      image.loading = "lazy";
      image.src = image.dataset.src;
      // Remove data-src to apply new CSS rules.
      image.addEventListener("load", () => image.removeAttribute("data-src"), {
        once: true,
      });
    }
    return image;
  };

  // if ("loading" in HTMLImageElement.prototype) {
  //   document.querySelectorAll("img[data-src]").forEach(load);
  // } else
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            imageObserver.unobserve(loadImage(entry.target));
          }
        });
      },
      {
        threshold: 0.25,
      }
    );
    document
      .querySelectorAll("img[data-src]")
      .forEach((image) => imageObserver.observe(image));
  } else {
    let throttleTimeout;

    function lazyload() {
      clearTimeout(throttleTimeout);

      throttleTimeout = setTimeout(() => {
        // Get a new list, in case elements have been added dynamically.
        const lazyloadImages = document.querySelectorAll("img[data-src]");
        if (lazyloadImages.length) {
          const pageTop = window.pageYOffset;
          const pageBottom = window.innerHeight + pageTop;

          lazyloadImages.forEach(
            /** @param {HTMLImageElement} image */
            (image) => {
              if (
                image.offsetTop + image.clientHeight >= pageTop &&
                image.offsetTop < pageBottom
              ) {
                loadImage(image);
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
