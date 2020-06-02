(function(d) {
    document.getElementById("copyright-year").innerText = d.getFullYear();
})(new Date);

(function(className) {
    document.getElementsByClassName(className)[0].tabIndex = -1;
})('active');