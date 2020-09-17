(function(d) {
    document.getElementById("copyright-year").innerText = d.getFullYear();
})(new Date);

(function(className) {
    document.getElementsByClassName(className)[0].tabIndex = -1;
})('active');

(function(startId, endId) {
    let endInput = document.getElementById(endId);
    let startInput = document.getElementById(startId);
    const toDateOnly = (d) => d.toISOString().substring(0, 10);

    if (endInput && startInput) {
        startInput.setAttribute("min", toDateOnly(new Date()))
        startInput.addEventListener('input', (e) => {
            let dt = new Date(e.target.value);
            dt.setDate(dt.getDate() + 1);
            endInput.setAttribute("min", toDateOnly(dt))
            endInput.disabled = false;
        });
        endInput.addEventListener('input', (e) => {
            let dt = new Date(e.target.value);
            dt.setDate(dt.getDate() - 1);
            startInput.setAttribute("max", toDateOnly(dt))
        })
    }

})('CheckIn', 'CheckOut');
