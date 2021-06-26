import QuakesController from "./QuakesController.js";

const quakes = new QuakesController("#quakeList", "#quakeCount");
quakes.init().then((location) => (document.getElementById("location").value = location));

const settings = document.forms.namedItem("settings");

settings.addEventListener("submit", async (e) => {
  e.preventDefault();

  const location = settings.elements.namedItem("location").value;
  if (await quakes.setPosFromLocation(location)) {
    const start = settings.elements.namedItem("startDate").value;
    const end = settings.elements.namedItem("endDate").value;
    quakes.setDateRange(start, end);

    const radius = parseInt(settings.elements.namedItem("radiusKm").value) || 100;
    const minmagnitude = parseInt(settings.elements.namedItem("minmagnitude").value) || 0;
    quakes.getQuakesByRadius(radius, minmagnitude);
  }
});
