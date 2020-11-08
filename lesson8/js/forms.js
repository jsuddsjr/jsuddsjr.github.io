(function (d) {
    // Show value for all range sliders.
    d.querySelectorAll("input[type='range']").forEach(
        /** @param {HTMLInputElement} el */
        el => {
            const valueSpan = d.getElementById(`${el.id}-value`);
            if (valueSpan) {
                el.addEventListener('change', () => {
                    valueSpan.textContent = el.value;
                });
            }
        }
    );

    [...d.getElementsByTagName('textarea')].forEach(el => {
        el.addEventListener('keypress', () => {
            el.style.height = "";
            el.style.height = (15 + el.scrollHeight) + "px";
        })
    });

    const dateInputs = d.querySelectorAll("input[type='date']");
    if (dateInputs.length) {
        // Custom formatter for date input.
        const script = d.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js';
        script.addEventListener('load', e => {
            // Set minimum date input to today.
            const dateNow = moment(Date.now()).format().substring(0, 10);
            dateInputs.forEach(
                /** @param {HTMLInputElement} el */
                el => {
                    el.addEventListener('change', () => {
                        el.dataset.date = moment(el.value, "YYYY-MM-DD")
                            .format(el.dataset.dateFormat || moment.localeData().longDateFormat('L'))
                    });
                    el.min = el.value = dateNow;
                    el.dispatchEvent(new Event('change'));
                }
            );
        });

        d.body.append(script);
    }

})(document);