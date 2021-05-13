const CLASS_PLAYED = "played";
const CLASS_WINNER = "winner";
const CLASS_LOSER = "loser";
const CLASS_CURSOR = "cursor";

const board = document.querySelector(".board");
const cells = Array.from(board?.querySelectorAll("div") || []);
const nextPlayer = document.querySelector(".player");
const players = ["X", "O"];
const combos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];
let activePlayer = 0;

/**
 * Display the winner.
 * @param {Number[]} [winningCombo]
 * @param {String} [player]
 */
function gameOver(winningCombo, player) {
  if (board instanceof HTMLElement) {
    board.style.pointerEvents = "none";
  }
  if (winningCombo && player) {
    cells.forEach((el, n) =>
      el.classList.add(winningCombo.includes(n) ? CLASS_WINNER : CLASS_LOSER)
    );
    addPointFor(player);
  } else {
    cells.forEach((el) => el.classList.add(CLASS_LOSER));
  }
  setTimeout(clearBoard, 1000);
}

/**
 * Update score board.f
 * @param {String} player
 */
function addPointFor(player) {
  const score = document.querySelector(`.player-${player}`);
  if (score instanceof HTMLElement) {
    const points = +(score.dataset.points || 0);
    score.dataset.points = String(points + 1);
  }
}

/**
 * Intermediate step in resetting the board.
 */
function clearBoard() {
  cells.forEach((el) => {
    el.className = "cell";
  });
  setTimeout(resetBoard, 250);
}

/**
 * Remove player data from board.
 */
function resetBoard() {
  cells.forEach((el) => (el.dataset.player = ""));
  setActivePlayer(0);
  if (board instanceof HTMLElement) {
    board.style.pointerEvents = "auto";
  }
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
  if (activePlayer) {
    board?.classList.add(CLASS_CURSOR);
  } else {
    board?.classList.remove(CLASS_CURSOR);
  }
  if (nextPlayer) {
    nextPlayer.textContent = players[activePlayer];
  }
}

/**
 * Check for winning combinations.
 */
function checkWinners() {
  for (let [x, y, z] of combos) {
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
    }
  }
  el.addEventListener("touchend", play);
  el.addEventListener("click", play);
});

document.querySelector(".reset")?.addEventListener("click", clearBoard);
