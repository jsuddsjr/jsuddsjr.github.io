(function () {
  document.body.onload = (e) => {
    const d = new Date();
    document.getElementById("year").innerHTML = d.getFullYear();
    document.getElementById("time").innerHTML =
      d.toLocaleDateString() + " " + d.toLocaleTimeString();
    console.log(d);
  };
})();
