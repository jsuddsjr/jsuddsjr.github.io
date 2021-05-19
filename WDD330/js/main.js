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
  for (let i = 0; i < this; i++) {
    yield i;
  }
};

/**
 * Prefix character to create a string of specified size.
 * @param {Number} size Length of final string.
 * @param {String} char The character to duplicate. Default: 0
 */
Number.prototype.pad = function (size, char = "0") {
  var s = String(this);
  return char.repeat(Math.max(0, size - s.length)) + s;
};

(async function (d) {
  "use strict";

  /**
   * Replace tokens in string from weekly report.
   * @param {String} str
   * @param {WeeklyReport} report
   * @returns
   */
  function replaceTokens(str, report) {
    return str.replace(
      /!!(.+?)!!/g,
      /**
       * Process matches.
       * @param {String} sub
       * @param {String} capture
       * @returns
       */
      (sub, capture) => {
        const [command, ...rest] = capture.split(/\s+/);
        switch (command) {
          // Format: LINK number [#fragment] [remaining text is label]
          case "LINK": {
            const index = rest.shift();
            if (index !== undefined) {
              const link = report.links[+index];
              if (link) {
                let fragment = rest.shift() || "";
                // fragment must start with "#"
                if (fragment && fragment[0] !== "#") {
                  rest.unshift(fragment);
                  fragment = "";
                }
                const label = rest.join(" ") || link.label;
                sub = `<a href="${link.url}${fragment}">${label}</a>`;
              }
            }
          }
        }
        return sub;
      }
    );
  }

  /**
   * Insert links sections.
   * @param {WeeklyReport} report 
   * @returns
   */
  async function insertLinks(report) {
    if (report.links.length === 0) return;

    await insertTemplate("#links");

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

/**
 * Insert questions section
 * @param {WeeklyReport} report 
 * @returns 
 */
  async function insertQuestions(report) {
    if (report.questions.length === 0) return;

    await insertTemplate("#questions");

    const olq = d.querySelector(".js-questions");
    if (olq) {
      for (let q of report.questions) {
        const li = d.createElement("li");
        li.innerHTML = replaceTokens(q, report);
        olq.appendChild(li);
      }
    }
  }

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
  await Promise.all([insertLinks(report), insertQuestions(report)]);

})(document);
