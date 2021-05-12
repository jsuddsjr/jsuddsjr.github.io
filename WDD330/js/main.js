import { insertTemplate } from "./template.js";

/**
 * @typedef {Object} LinkEntry
 * @property {String} url     Relative path to resource
 * @property {String} label   Description of resource
 * @property {String} [info]    Optional HTML to explain link
 */

/**
 * @typedef {Object} WeeklyReport
 * @property {String} [title]
 * @property {LinkEntry[]} links
 * @property {String[]} questions
 */

Number.prototype[Symbol.iterator] = function* () {
  // const self = this;
  // let value = 0;
  // return {
  //   next: function() {
  //     const result = { value, done: false}
  //     result.done = ++value >= self;
  //     return result;
  //   }
  // }
  for (let i = 0; i < this; i++) {
    yield i;
  }
};

Number.prototype.pad = function (size) {
  var s = String(this);
  return "0".repeat(size - s.length) + s;
};

(async function (d) {
  "use strict";

  /**
   * Attempts to open the _index.json_ file for the specified week.
   * If the file cannot be opened, a default set of data is returned.
   * This code reads the _data-weeks_ attr set on the parent OL element
   * to determine how many default weeks to return.
   * @returns {Promise<WeeklyReport>}
   */
  const getWeeklyReport = async () => {
    const week = location.search.substr(1);
    if (week) {
      try {
        const request = await fetch(`./${week}/index.json`);
        /** @type WeeklyReport */
        const report = await request.json();
        const title = d.querySelector(".report-title");
        if (title) title.innerHTML = report.title || `Report for ${week}`;
        return report;
      } catch (error) {
        // Ignore error.
      }
    }

    const data = d.body.dataset["weeks"];
    const weeks = data ? parseInt(data) : 1;
    return {
      links: [...weeks].map((n) => {
        return { url: "index.html?W" + (n + 1).pad(2), label: `Week ${n + 1}` };
      }),
      questions: [],
    };
  };

  const report = await getWeeklyReport();

  if (report.links?.length && (await insertTemplate("#links"))) {
    const ol = d.querySelector(".js-links");
    if (ol) {
      // Create list item for each link.
      for (let entry of report.links) {
        const li = d.createElement("li");
        const a = d.createElement("a");
        a.href = entry.url;
        a.innerHTML = entry.label;
        li.appendChild(a);
        if (entry.info) {
          li.innerHTML += `<div class="info">${entry.info}</div>`;
        }
        ol.appendChild(li);
      }
    }
  }

  // Append questions, if any.
  if (report.questions?.length && (await insertTemplate("#questions"))) {
    const olq = d.querySelector(".js-questions");
    if (olq) {
      for (let q of report.questions) {
        const li = d.createElement("li");
        li.innerHTML = q;
        olq.appendChild(li);
      }
    }
  }
})(document);
