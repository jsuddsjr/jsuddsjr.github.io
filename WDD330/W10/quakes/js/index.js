import QuakesController from "./QuakesController.js";
import Router from "./Router.js";
import { createDiv, createLink } from "./utilities.js";

const router = new Router("#content");
// Register the templates.
router.addTemplate("template1", (myDiv) => {
  const link1 = createLink("view1", "Go to view1", "#/view1");
  const link2 = createLink("view2", "Go to view2", "#/view2");
  myDiv.appendChild(link1);
  myDiv.appendChild(link2);
});

router.addTemplate("template-view1", (myDiv) => {
  const link1 = createDiv("view1", "<div><h1>This is View 1 </h1><a href='#/'>Go Back to Index</a></div>");
  myDiv.appendChild(link1);
});

router.addTemplate("template-view2", (myDiv) => {
  const link2 = createDiv("view2", "<div><h1>This is View 2 </h1><a href='#/'>Go Back to Index</a></div>");
  myDiv.appendChild(link2);
});

// Define the mappings route->template.
router.createRoute("/", "template1");
router.createRoute("/view1", "template-view1");
router.createRoute("/view2", "template-view2");

// const quakes = new QuakesController("#quakeList", "#quakeCount");
// quakes.init().then((location) => (document.getElementById("location").value = location));

// const settings = document.forms.namedItem("settings");

// settings.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const location = settings.elements.namedItem("location").value;
//   if (await quakes.setPosFromLocation(location)) {
//     const start = settings.elements.namedItem("startDate").value;
//     const end = settings.elements.namedItem("endDate").value;
//     quakes.setDateRange(start, end);

//     const radius = parseInt(settings.elements.namedItem("radiusKm").value) || 100;
//     const minmagnitude = parseInt(settings.elements.namedItem("minmagnitude").value) || 0;
//     quakes.getQuakesByRadius(radius, minmagnitude);
//   }
// });
