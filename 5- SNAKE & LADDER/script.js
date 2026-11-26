
const ladders = {
  4: 25,
  13: 46,
  33: 49,
  42: 63,
  50: 69,
  62: 81,
  74: 92
};

const snakes = {
  27: 5,
  40: 3,
  43: 18,
  54: 31,
  66: 45,
  89: 53,
  99: 41
};

let positions = [1, 1];
let currentPlayer = 0;
let gameOver = false;

const boardEl = document.getElementById("board");
const rollBtn = document.getElementById("rollBtn");
const resetBtn = document.getElementById("resetBtn");
const diceBox = document.getElementById("diceBox");
const statusEl = document.getElementById("status");
const turnLabel = document.getElementById("turnLabel");
const p1PosEl = document.getElementById("p1Pos");
const p2PosEl = document.getElementById("p2Pos");

function buildBoard() {
  boardEl.innerHTML = "";

  // Build rows from top (row 9 -> 91..100) to bottom (row 0 -> 1..10) in boustrophedon order
  for (let row = 9; row >= 0; row--) {
    const start = row * 10 + 1;
    const rowNumbers = [];
    for (let col = 0; col < 10; col++) {
      rowNumbers.push(start + col);
    }
    if (row % 2 === 1) {
      rowNumbers.reverse();
    }

    rowNumbers.forEach((num) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.cell = num;

      const topRow = document.createElement("div");
      topRow.style.display = "flex";
      topRow.style.justifyContent = "space-between";
      topRow.style.alignItems = "center";

      const numSpan = document.createElement("span");
      numSpan.textContent = num;
      topRow.appendChild(numSpan);

      if (snakes[num]) {
        cell.classList.add("snake");
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = `S→${snakes[num]}`;
        topRow.appendChild(tag);
      } else if (ladders[num]) {
        cell.classList.add("ladder");
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = `L→${ladders[num]}`;
        topRow.appendChild(tag);
      }

      const tokensDiv = document.createElement("div");
      tokensDiv.className = "tokens";
      tokensDiv.id = `tokens-${num}`;

      cell.appendChild(topRow);
      cell.appendChild(tokensDiv);
      boardEl.appendChild(cell);
    });
  }

  renderTokens();
}

function renderTokens() {
  document.querySelectorAll(".tokens").forEach((el) => (el.innerHTML = ""));

  positions.forEach((pos, idx) => {
    const container = document.getElementById(`tokens-${pos}`);
    if (container) {
      const token = document.createElement("span");
      token.className = `token p${idx + 1}`;
      token.title = `Player ${idx + 1} (Square ${pos})`;
      container.appendChild(token);
    }
  });

  p1PosEl.textContent = positions[0];
  p2PosEl.textContent = positions[1];
  turnLabel.textContent = `Player ${currentPlayer + 1}`;
}

function rollDice() {
  if (gameOver) return;

  const dice = Math.floor(Math.random() * 6) + 1;
  diceBox.textContent = `🎲 ${dice}`;

  const playerName = `Player ${currentPlayer + 1}`;
  let nextPos = positions[currentPlayer] + dice;

  if (nextPos > 100) {
    statusEl.textContent = `${playerName} rolled ${dice}, needs exact roll to reach 100.`;
    currentPlayer = 1 - currentPlayer;
    renderTokens();
    return;
  }

  let message = `${playerName} rolled ${dice} and moved to ${nextPos}.`;

  if (ladders[nextPos]) {
    const top = ladders[nextPos];
    message += ` Climbed ladder to ${top}!`;
    nextPos = top;
  } else if (snakes[nextPos]) {
    const tail = snakes[nextPos];
    message += ` Bitten by snake! Slid down to ${tail}.`;
    nextPos = tail;
  }

  positions[currentPlayer] = nextPos;
  renderTokens();

  if (nextPos === 100) {
    statusEl.textContent = `${playerName} wins the game!`;
    rollBtn.disabled = true;
    gameOver = true;
    return;
  }

  statusEl.textContent = message;
  currentPlayer = 1 - currentPlayer;
  turnLabel.textContent = `Player ${currentPlayer + 1}`;
}

function resetGame() {
  positions = [1, 1];
  currentPlayer = 0;
  gameOver = false;
  rollBtn.disabled = false;
  diceBox.textContent = "🎲 -";
  statusEl.textContent = "Game restarted. Player 1's turn!";
  buildBoard();
}

rollBtn.addEventListener("click", rollDice);
resetBtn.addEventListener("click", resetGame);

buildBoard();