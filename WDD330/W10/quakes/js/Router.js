// Based on source: https://medium.com/@fro_g/routing-in-javascript-d552ff4d2921

// Both set of different routes and template generation functions
/** @type {Route[]} */
const routes = [];

/** @type {Object<string, function>} */
const namedTemplates = {};

export class Route {
  constructor(path, routeFunction) {
    this.path = path;
    this.routeFunction = routeFunction;
  }

  /**
   * @param {String} path
   * @returns True if path matched
   */
  test(path) {
    if (this.path instanceof RegExp) {
      return this.path.test(path);
    }
    return this.path === path;
  }

  /**
   * Render route into container using url path
   * @param {String} path
   * @param {HTMLElement} div
   */
  invoke(path, div) {
    if (this.path instanceof RegExp) {
      const groups = path.match(this.rgx).groups;
      return this.routeFunction(div, groups);
    }
    return this.routeFunction(div);
  }
}

export default class Router {
  /**
   * Constructor.
   * @param {String} appDiv The element that will host the views.
   */
  constructor(appDiv) {
    this.appDiv = document.querySelector(appDiv);

    if (!this.appDiv) {
      throw new Error("Specificed application container element not found!");
    }

    // For first load or when routes are changed in browser url box.
    window.addEventListener("load", this.router.bind(this));
    window.addEventListener("hashchange", this.router.bind(this));
  }

  /**
   * Register a template (this is to mimic a template engine)
   * @param {string} name
   * @param {function} templatefunction
   * @returns Template function.
   */
  addTemplate = (name, templatefunction) => {
    return (namedTemplates[name] = templatefunction);
  };

  /**
   * Define the routes. Each route is described with a route path & a template to render
   * when entering that path. A template can be a string (file name), or a function that
   * will directly create the DOM objects.
   * @param {string} path
   * @param {string|function} template  Name of previously defined template, or new template func.
   * @throws Error if template type is not string or function.
   */
  createRoute = (path, template) => {
    if (typeof template == "function") {
      routes.push(new Route(path, template));
    } else if (typeof template == "string") {
      routes.push(new Route(path, namedTemplates[template]));
    } else {
      throw new Error("Template must be string or function");
    }
  };

  /**
   * Give the correspondent route (template) or fail
   * @param {string} url
   * @returns Route function
   * @throws Error if route is not defined
   */
  resolveRoute = (url) => {
    return routes.find((r) => r.test(url));
  };

  /**
   * The actual router, get the current URL and generate the corresponding template
   * @param {Event} evt
   */
  router = (evt) => {
    evt.preventDefault();
    const url = window.location.hash.slice(1) || "/";
    const route = this.resolveRoute(url);
    if (route) {
      this.appDiv.innerHTML = "";
      return route.invoke(url, this.appDiv);
    }
  };
}
