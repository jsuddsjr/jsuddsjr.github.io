(function (d) {
  // Show value for all range sliders.
  d.querySelectorAll("input[type='range']").forEach(
    /** @param {HTMLInputElement} el */
    (el) => {
      const valueSpan = d.getElementById(`${el.id}-value`);
      if (valueSpan) {
        el.addEventListener("change", () => {
          valueSpan.textContent = el.value;
          const colorTemp = 240 - Number(el.value) * 24;
          valueSpan.style.color = `hsl(${colorTemp}, 90%, 30%)`;
          valueSpan.style.backgroundColor = `hsla(${colorTemp}, 90%, 30%, .2)`;
        });
        el.dispatchEvent(new Event("change"));
      }
    }
  );

  // Allow full selection when opening datalist drop-down
  d.querySelectorAll("input[list]").forEach(
    /** @param {HTMLInputElement} el */
    (el) => el.addEventListener("mousedown", (e) => (el.value = ""))
  );

  // Constrain text area height by its content.
  [...d.getElementsByTagName("textarea")].forEach((el) => {
    el.addEventListener("keypress", () => {
      el.style.height = "";
      el.style.height = 15 + el.scrollHeight + "px";
    });
  });

  // Load custom formatter for date input.
  const dateInputs = d.querySelectorAll("input[type='date']");
  if (dateInputs.length) {
    const script = d.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js";
    script.addEventListener("load", (e) => {
      dateInputs.forEach(
        /** @param {HTMLInputElement} el */
        (el) => {
          el.addEventListener("change", () => {
            // Format date according to data-date-format.
            el.dataset.date = moment(el.value, "YYYY-MM-DD").format(
              el.dataset.dateFormat || moment.localeData().longDateFormat("L")
            );
          });
          const today = moment(Date.now()).format().substring(0, 10);
          el.value = el.min = today;
          el.dispatchEvent(new Event("change"));
        }
      );
    });

    d.body.append(script);
  }

  /** @type {HTMLSelectElement} */
  const stormType = d.getElementById("stype");
  /** @type {HTMLTextAreaElement} */
  const moreInfo = d.getElementById("info");
  if (stormType && moreInfo) {
    stormType.addEventListener("change", (e) => {
      moreInfo.required = stormType.value === "Other";
    });
  }
})(document);
