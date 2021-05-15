"use strict";

const CLASS_PLAYED = "played";
const CLASS_WINNER = "winner";
const CLASS_LOSER = "loser";
const CLASS_CURSOR = "cursor";

const playerSkins = [
  ["X", "O"],
  ["🥧", "🍰"],
  ["🐶", "🐱"],
  ["😂", "😭"],
  ["🦈", "🦑"],
  ["👍", "👎"],
  ["❌", "✔️"],
  ["😎", "🥸"],
  ["🕷️", "🕸️"],
  ["👶", "🧷"],
  ["😇", "😈"],
  ["🐲", "🦄"],
  ["🐇", "🍀"],
  ["📪", "📫"],
  ["🥛", "🧋"],
  ["🔪", "🪚"],
  ["🔒", "🔓"],
  ["📁", "📂"]
];

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];

const board = document.querySelector(".board");
const cells = Array.from(board?.querySelectorAll("div") || []);

let players = playerSkins[1];
let activePlayer = 0;
let startWithLastPlayer = false;

/**
 * Select the next skin in the array.
 */
function rotateSkin() {
  let index = playerSkins.indexOf(players) + 1;
  index %= playerSkins.length;
  updateSkins(index);
}

/**
 * Apply a new skin to the board.
 * @param {Number} index Index of new player skins
 */
function updateSkins(index) {
  const newSkins = playerSkins[index];
  if (newSkins) {
    // Mapping old to new skins, for quick lookup.
    const mapSkins = new Map(players.map((s, i) => [s, newSkins[i]]));
    cells.forEach((el) => {
      const oldPlayer = el.dataset.player;
      if (oldPlayer) {
        el.dataset.player = mapSkins.get(oldPlayer);
      }
    });
    players = newSkins;
    const list = document.querySelectorAll(".score .skin");
    list.forEach((el, n) => (el.dataset.skin = players[n]));
    setActivePlayer(activePlayer);
  }
}

/**
 * Enable or disable pointer events on the board.
 * @param {Boolean} enabled
 */
function allowPointerEvents(enabled) {
  if (board instanceof HTMLElement) {
    board.style.pointerEvents = enabled ? "" : "none";
  }
}

/**
 * Display the winner.
 * @param {Number[]} [winningCombo]
 * @param {String} [player]
 */
function gameOver(winningCombo, player) {
  allowPointerEvents(false);
  if (winningCombo && player) {
    cells.forEach((el, n) =>
      el.classList.add(winningCombo.includes(n) ? CLASS_WINNER : CLASS_LOSER)
    );
    startPointUpdate(player);
  } else {
    cells.forEach((el) => el.classList.add(CLASS_LOSER));
  }
  setTimeout(clearBoard, 1000);
}

/**
 * Start update score board.
 * @param {String} playerSkin Character for the current player.
 */
function startPointUpdate(playerSkin) {
  const player = ["X", "O"][players.indexOf(playerSkin)];
  const selector = `.js-player-${player}.points`;
  const score = document.querySelector(selector);
  if (score instanceof HTMLElement) {
    score.classList.add(CLASS_WINNER);
    setTimeout(updatePointFor.bind(null, score), 300);
  }
}

/**
 * Finish update score board.
 * @param {HTMLElement} score
 */
function updatePointFor(score) {
  const points = +(score.dataset.points || 0);
  score.dataset.points = String(points + 1);
  score.classList.remove(CLASS_WINNER);
}

/**
 * Intermediate step in resetting the board.
 */
function clearBoard() {
  cells.forEach((el) => (el.className = "cell"));
  setTimeout(resetBoard, 250);
}

/**
 * Remove player data from board.
 */
function resetBoard() {
  cells.forEach((el) => (el.dataset.player = ""));
  if (!startWithLastPlayer) setActivePlayer(0);
  allowPointerEvents(true);
}

/**
 * Switch active player.
 * @param {Number} [current] If defined, set active player.
 */
function setActivePlayer(current) {
  if (current !== undefined) {
    activePlayer = current;
  } else {
    activePlayer ^= 1;
  }
  // Swap the active cursor.
  if (activePlayer) {
    board?.classList.add(CLASS_CURSOR);
  } else {
    board?.classList.remove(CLASS_CURSOR);
  }
  // Show next turn.
  const nextPlayer = document.querySelector(".js-active-player");
  if (nextPlayer) {
    nextPlayer.textContent = players[activePlayer];
  }
}

/**
 * Check for winning combinations.
 */
function checkWinners() {
  for (let [x, y, z] of winningCombos) {
    const thisPlayer = cells[x].dataset.player;
    if (
      thisPlayer &&
      thisPlayer === cells[y].dataset.player &&
      thisPlayer === cells[z].dataset.player
    ) {
      gameOver([x, y, z], thisPlayer);
      return true;
    }
  }
  // Is the board filled?
  if (cells.every((el) => el.dataset.player)) {
    gameOver();
  }
  return false;
}

/**
 * Assign current player to a cell.
 * @param {HTMLElement} cell
 */
function updateBoard(cell) {
  if (cell.dataset.player) {
    return; // This cell is already occupied.
  }
  cell.classList.add(CLASS_PLAYED);
  cell.dataset.player = players[activePlayer];
  setActivePlayer();
  setTimeout(checkWinners, 250);
}

// Attach event listeners
cells.forEach((el) => {
  /** @type {EventListener} */
  function play(evt) {
    if (evt.target instanceof HTMLElement) {
      updateBoard(evt.target);
      evt.stopPropagation();
    }
  }
  el.addEventListener("touchend", play);
  el.addEventListener("click", play);
  el.addEventListener("keypress", (evt) => {
    if (evt.key === " ") play(evt);
  });
});

document
  .querySelector(".js-reset-button")
  ?.addEventListener("click", clearBoard);

document
  .querySelector(".js-skin-button")
  ?.addEventListener("click", rotateSkin);

document
  .querySelector(".js-loser-starts-checkbox")
  ?.addEventListener("change", (event) => {
    const checkbox = event.target;
    if (checkbox instanceof HTMLInputElement) {
      startWithLastPlayer = checkbox.checked;
    }
  });

updateSkins(1);
