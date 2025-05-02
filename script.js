const boardSize = 10;
const mineCount = 10;
let board = [];
let gameOver = false;

const boardElement = document.getElementById("board");
const resetButton = document.getElementById("reset");

function init() {
  board = [];
  gameOver = false;
  boardElement.innerHTML = "";

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
}

function createCell(row, col) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.dataset.row = row;
  cell.dataset.col = col;
  cell.addEventListener("click", () => revealCell(row, col));
  boardElement.appendChild(cell);
  return cell;
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
  if (cell.revealed || gameOver) return;

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
    // Reveal neighbors
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

function endGame(won) {
  gameOver = true;
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = board[row][col];
      if (cell.mine && !cell.revealed) {
        cell.element.textContent = "💣";
        cell.element.classList.add("mine");
      }
    }
  }
  alert(won ? "You win!" : "Game over!");
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

resetButton.addEventListener("click", init);

window.onload = init;

// Dark mode toggle
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    
}