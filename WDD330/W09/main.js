const btn = document.getElementById("rainbow");
const rainbow = ["red", "orange", "yellow", "green", "blue", "rebeccapurple", "violet"];
function change() {
  document.body.style.background = rainbow[Math.floor(rainbow.length * Math.random())];
}
btn.addEventListener("click", change);

const form = document.forms[0];
form.addEventListener("submit", factorize, false);

function factorize(event) {
  // prevent the form from being submitted
  event.preventDefault();
  const number = Number(form.number.value);
  if (window.Worker) {
    document.getElementById("output").innerHTML = "<p>ENJOY the rainbow. <small>This could take a while...</small></p>";
    const worker = new Worker("factors.js");
    if (worker) {
      worker.postMessage(number);
      worker.addEventListener(
        "message",
        (event) => {
          document.getElementById("output").innerHTML = event.data.split(",").join(", ");
        },
        false
      );
    } else {
      alert("Failed to create a worker object.");
    }
  } else {
    alert("Uh-oh. No worker object available.");
  }
}
