/**
 * Fetch the JSON from the url.
 * @param {RequestInfo} url
 * @returns JSON object.
 */
export function getJSON(url) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      } else {
        return response.json();
      }
    })
    .catch((error) => console.log(error));
}

/**
 * @param {PositionOptions} options
 * @returns Current position
 */
export const getLocation = (options = {}) => {
  return new Promise(
    /**
     * @param {PositionCallback} resolve
     * @param {PositionErrorCallback} reject
     */
    (resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    }
  );
};

// (async function () {
//   console.log(
//     await getJSON(
//       "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2019-01-01&endtime=2019-02-02"
//     )
//   );
// })();

// Generate DOM tree from a string
export const createDiv = (id, xmlString) => {
  let d = document.createElement("div");
  d.id = id;
  d.innerHTML = xmlString;
  return d.firstChild;
};

// Helper function to create a link.
export const createLink = (title, text, href) => {
  let a = document.createElement("a");
  let linkText = document.createTextNode(text);
  a.appendChild(linkText);
  a.title = title;
  a.href = href;
  return a;
};
