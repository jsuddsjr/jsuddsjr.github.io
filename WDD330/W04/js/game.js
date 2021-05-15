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
  ["😎", "🥸"],
  ["🕷️", "🕸️"],
  ["👶", "🧷"],
  ["😇", "😈"],
  ["🐲", "🦄"],
  ["🐇", "🍀"],
  ["☕", "🧋"],
  ["🔪", "🪚"],
  ["📪", "📫"],
  ["👍", "👎"],
  ["🔒", "🔓"],
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
const skinButton = document.querySelector(".js-skin-button");

let players = playerSkins[0];
let activePlayer = 0;
let startWithLastPlayer = false;
let canRotate = true;

/**
 * Select the next skin in the array.
 */
function rotateSkins() {
  let index = playerSkins.indexOf(players) + 1;
  index %= playerSkins.length;
  setTimeout(updateSkins.bind(null, index), 250);

  // Play rotation animation.
  if (canRotate) {
    const classList = skinButton.classList;
    classList.add(CLASS_PLAYED);
    setTimeout(() => {
      classList.remove(CLASS_PLAYED);
      canRotate = true;
    }, 1000);
    canRotate = false;
  }
}

/**
 * Apply a new skin to the board.
 * @param {Number} index Index of new player skins
 */
function updateSkins(index) {
  const newSkins = playerSkins[index];

  // Change skins on the board.
  const mapSkins = new Map(players.map((s, i) => [s, newSkins[i]]));
  cells.forEach((el) => {
    const oldPlayer = el.dataset.player;
    if (oldPlayer) el.dataset.player = mapSkins.get(oldPlayer);
  });

  // Replace skins everywhere else.
  players = newSkins;
  const list = document.querySelectorAll(".score .skin");
  list.forEach((el, n) => (el.dataset.skin = players[n]));
  switchActivePlayer(activePlayer);
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
  ariaAnnounce(player + " wins");
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
  score.classList.add(CLASS_WINNER);
  setTimeout(updatePointFor.bind(null, score), 300);
}

/**
 * Finish update score board.
 * @param {Element} scoreElement
 */
function updatePointFor(scoreElement) {
  const points = +(scoreElement.dataset.points || 0);
  scoreElement.dataset.points = String(points + 1);
  scoreElement.classList.remove(CLASS_WINNER);
}

/**
 * Start game from the beginning.
 */
function restartGame() {
  const points = document.querySelectorAll(".points");
  points.forEach((el) => (el.dataset.points = "0"));
  clearBoard();
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
  if (!startWithLastPlayer) switchActivePlayer(0);
  allowPointerEvents(true);
}

/**
 * Switch active player.
 * @param {Number} [current] If defined, set active player.
 */
function switchActivePlayer(current) {
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
  } else {
    switchActivePlayer();
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
  ariaAnnounce(players[activePlayer] + " played", cell);
  setTimeout(checkWinners, 250);
}

/**
 * For the enjoyment of everyone.
 * @param {String} message
 * @param {Element} element
 */
function ariaAnnounce(message, element) {
  if (element) {
    message += " in " + element.getAttribute("aria-label");
  }
  document.querySelector(".aria-announce").textContent = message;
}

/**
 * Move focus around the board with arrow keys.
 * @param {String} direction 
 * @param {Element} current 
 */
function moveFocus(direction, current) {
  if (boardDirections.has(direction)) {
    const focus = cells.indexOf(current) + boardDirections.get(direction);
    if(focus >= 0 && focus < cells.length) {
      cells[focus].focus();
    }
    else {
      ariaAnnounce("Can't move that direction.");
    }
  }
}

const boardDirections = new Map([
  ["ArrowUp", -3],
  ["ArrowDown", 3],
  ["ArrowLeft", -1],
  ["ArrowRight", 1],
]);

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
  el.addEventListener("keydown", (evt) => {
    switch (evt.code) {
      case "Space":
        play(evt);
        break;
      default:
        moveFocus(evt.code, evt.target);
        break;
    }
  });
  el.addEventListener("focusin", (evt) =>
    ariaAnnounce(evt.target.dataset.player, evt.target)
  );
});

document
  .querySelector(".js-reset-button")
  ?.addEventListener("click", restartGame);

document
  .querySelector(".js-skin-button")
  ?.addEventListener("click", rotateSkins);

document
  .querySelector(".js-loser-starts-checkbox")
  ?.addEventListener("change", (event) => {
    const checkbox = event.target;
    if (checkbox instanceof HTMLInputElement) {
      startWithLastPlayer = checkbox.checked;
    }
  });

setTimeout(rotateSkins, 500);
