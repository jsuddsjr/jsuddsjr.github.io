const requestURL = 'https://byui-cit230.github.io/lessons/lesson-09/data/latter-day-prophets.json';

const buildCardFromTemplate = (p) => {
    const template = document.getElementById("template");

    /** @type {HTMLElement} card */
    const card = template.cloneNode(true);
    card.removeAttribute("id");

    Object.entries(p).forEach(([key, value]) => {
        [...card.querySelectorAll(`[data-${key}]`)].forEach(
            /** @param {HTMLElement} el */
            el => {
                const attr = el.dataset[key];
                if (attr && el.hasAttribute(attr)) el.setAttribute(attr, value)
                else el.textContent = value;
            }
        );
    });

    // Keep track of images as they load, to trigger alignment.
    imagesLoaded.push(...[...card.getElementsByTagName('img')].map(img =>
        new Promise(resolve => img.addEventListener('load', resolve, {
            once: true
        }))));

    template.parentElement.appendChild(card);
}

/**
 * Create sub-grids that align across all columns.
 * @param {HTMLElement} container
 */
const alignItems = () => {
    const container = document.querySelector('.cards');
    const columns = window.getComputedStyle(container)
        .gridTemplateColumns.split("px ").length;

    // Do not align single columns.
    if (columns === 1) {
        [...container.children].forEach(child => 
            child.style.display = "inline-block"
        );
        return;
    };

    // Slice off the template element
    chunk([...container.children].slice(1), columns).forEach(
        /** @param {HTMLElement[]} children */
        children => {
            // Compute height of all children in this row.
            const sizes = children.map(item => {
                item.style.display = "inline-block";
                return [...item.children].map(computeElementHeight);
            });

            // Create fixed row template of maximum heights.
            const rowTemplate = sizes.reduce((p, c) =>
                    c.map((n, i) => Math.max(p[i], n)),
                    sizes[0])
                .map(n => `${n.toFixed(1)}px`)
                .join(" ");

            // Apply row template to all sub-grids.
            children.forEach(item => {
                item.style.display = "grid";
                item.style.gridTemplateRows = rowTemplate;
            });
        }
    );
}

/**
 * Chunk larger array into sub-arrays.
 * @param {any[]} arr 
 * @param {number} size 
 */
const chunk = (arr, size) => Array.from({
    length: Math.ceil(arr.length / size)
}, (_, i) => arr.slice(i * size, i * size + size));

const includeAttributesInHeight = [
    'margin-top',
    'margin-bottom'
]

/**
 * Calculate height of element, including margins.
 * @param {HTMLElement} item 
 */
const computeElementHeight = (item) => {
    const style = window.getComputedStyle(item);
    const height = includeAttributesInHeight
        .map(k => parseInt(style.getPropertyValue(k)))
        .map(n => Number.isNaN(n) ? 0 : n)
        .reduce((prev, cur) => prev + cur, item.getBoundingClientRect().height);
    return height;
}

const imagesLoaded = [];

window.addEventListener('resize', alignItems);

// Fetch JSON from server and process.
fetch(requestURL)
    .then(response => response.json())
    .then(jsonObject => jsonObject['prophets'].forEach(buildCardFromTemplate))
    .then(async () => await Promise.all(imagesLoaded).then(alignItems));

/** @typedef {{name: string, lastname: string, birthday: string, death: string, length: number, order: number, birthplace: string, numofchildren: number, imageurl: string}} Prophet  */

//   {
//     "name": "Joseph",
//     "lastname": "Smith",
//     "birthdate": "23 December 1805",
//     "death": "27 June 1844",
//     "length": 14,
//     "order": 1,
//     "birthplace": "Vermont",
//     "numofchildren": 11,
//     "imageurl": "https://media.ldscdn.org/images/media-library/gospel-art/latter-day-prophets/american-prophet-joseph-smith-jr-1178035-gallery.jpg"
//   }