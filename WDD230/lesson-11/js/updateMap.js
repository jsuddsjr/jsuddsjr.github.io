(function(d) {
    /** @type {HTMLImageElement} */
    var img = d.querySelector('footer img');
    img.src = `images/${d.body.dataset.town || "south-idaho"}-map-500w.png`;
})(document);