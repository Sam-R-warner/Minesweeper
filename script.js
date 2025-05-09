// Configuration for difficulty levels
const difficulties = {
  easy: { size: 8, mines: 10 },
  medium: { size: 12, mines: 20 },
  hard: { size: 16, mines: 40 },
};

let boardSize = 8;
let mineCount = 10;
let board = [];
let gameOver = false;
let startTime;
let timerInterval;

const boardElement = document.getElementById("board");
const resetButton = document.getElementById("reset");
const difficultySelect = document.getElementById("difficulty");

function init() {
  stopTimer();
  startTimer();
  const difficulty = difficultySelect.value;
  boardSize = difficulties[difficulty].size;
  mineCount = difficulties[difficulty].mines;
  board = [];
  gameOver = false;
  boardElement.innerHTML = "";

  boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 30px)`;
  boardElement.style.gridTemplateRows = `repeat(${boardSize}, 30px)`;

  // Create blank board
  for (let row = 0; row < boardSize; row++) {
    board[row] = [];
    for (let col = 0; col < boardSize; col++) {
      board[row][col] = {
        mine: false,
        revealed: false,
        flagged: false,
        adjacentMines: 0,
        element: createCell(row, col)
      };
    }
  }

  // Place mines
  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const row = Math.floor(Math.random() * boardSize);
    const col = Math.floor(Math.random() * boardSize);
    if (!board[row][col].mine) {
      board[row][col].mine = true;
      minesPlaced++;
    }
  }

  // Calculate numbers
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      board[row][col].adjacentMines = countAdjacentMines(row, col);
    }
  }

  displayLeaderboard();
}

function createCell(row, col) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.dataset.row = row;
  cell.dataset.col = col;
  cell.addEventListener("click", () => revealCell(row, col));
  cell.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    toggleFlag(row, col);
  });
  boardElement.appendChild(cell);
  return cell;
}

function toggleFlag(row, col) {
  if (gameOver) return;
  const cell = board[row][col];
  if (cell.revealed) return;

  cell.flagged = !cell.flagged;
  cell.element.textContent = cell.flagged ? "🚩" : "";
  cell.element.classList.toggle("flagged", cell.flagged);
}

function countAdjacentMines(row, col) {
  let count = 0;
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c].mine) {
        count++;
      }
    }
  }
  return count;
}

function revealCell(row, col) {
  const cell = board[row][col];
  if (cell.revealed || cell.flagged || gameOver) return;

  cell.revealed = true;
  cell.element.classList.add("revealed");

  if (cell.mine) {
    cell.element.classList.add("mine");
    cell.element.textContent = "💣";
    endGame(false);
    return;
  }

  if (cell.adjacentMines > 0) {
    cell.element.textContent = cell.adjacentMines;
  } else {
    for (let r = row - 1; r <= row + 1; r++) {
      for (let c = col - 1; c <= col + 1; c++) {
        if (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
          revealCell(r, c);
        }
      }
    }
  }

  checkWin();
}

function checkWin() {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = board[row][col];
      if (!cell.mine && !cell.revealed) return;
    }
  }
  endGame(true);
}

function endGame(won) {
  stopTimer();
  gameOver = true;

  const elapsed = Math.floor((Date.now() - startTime) / 1000);

  if (won) {
    saveToLeaderboard(elapsed);
  }

  displayLeaderboard();

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = board[row][col];
      if (cell.mine && !cell.revealed) {
        cell.element.textContent = "💣";
        cell.element.classList.add("mine");
      }
    }
  }

  setTimeout(() => {
    alert(won ? "You win!" : "Game over!");
  }, 100);
}

// Timer functions
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimerDisplay, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateTimerDisplay() {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  document.getElementById("timer").textContent = `Time: ${elapsed}s`;
}

// Leaderboard functions
function saveToLeaderboard(timeInSeconds) {
  const difficulty = difficultySelect.value;
  const record = {
    time: timeInSeconds,
    date: new Date().toLocaleString(),
    difficulty
  };

  const key = `leaderboard-${difficulty}`;
  const leaderboard = JSON.parse(localStorage.getItem(key)) || [];
  leaderboard.push(record);
  leaderboard.sort((a, b) => a.time - b.time);
  leaderboard.splice(10);
  localStorage.setItem(key, JSON.stringify(leaderboard));
}

function displayLeaderboard() {
  const difficulty = difficultySelect.value;
  const key = `leaderboard-${difficulty}`;
  const leaderboard = JSON.parse(localStorage.getItem(key)) || [];

  const container = document.getElementById("leaderboard");
  container.innerHTML = "";

  if (leaderboard.length === 0) {
    container.textContent = "No scores yet.";
    return;
  }

  const list = document.createElement("ol");
  leaderboard.forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.time}s - ${entry.date}`;
    list.appendChild(li);
  });

  container.appendChild(list);
}

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

resetButton.addEventListener("click", init);
difficultySelect.addEventListener("change", () => {
  init();
  displayLeaderboard();
});

window.onload = () => {
  init();
  displayLeaderboard();
};
