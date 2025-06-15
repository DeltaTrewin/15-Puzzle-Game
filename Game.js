let board = [];
let moveCount = 0;
let timer = 0;
let timerInterval = null;

window.onload = function () {
  newGame();
};

// Starts a new randomly shuffled game
function newGame() {
  initGame(shuffleTiles());
}

// Starts a game that's one move away from winning
function tutorialGame() {
  let simpleBoard = [];
  for (let i = 1; i <= 15; i++) {
    simpleBoard.push(i);
  }
  simpleBoard.push(""); // Empty tile
  // Swap last two tiles to make it solvable in 1 move
  let temp = simpleBoard[14];
  simpleBoard[14] = simpleBoard[15];
  simpleBoard[15] = temp;
  initGame(simpleBoard);
}

// Initializes the game state
function initGame(initialBoard) {
  board = initialBoard;
  moveCount = 0;
  timer = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
  updateUI();
}

// Shuffles tiles until a solvable configuration is generated
function shuffleTiles() {
  let tiles = [];
  for (let i = 1; i <= 15; i++) {
    tiles.push(i);
  }
  tiles.push(""); // Empty tile

  let shuffled = tiles.slice();
  do {
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
  } while (!isSolvable(shuffled));

  return shuffled;
}

// Checks if the board is solvable
function isSolvable(tiles) {
  let invCount = 0;
  for (let i = 0; i < 15; i++) {
    for (let j = i + 1; j < 15; j++) {
      if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) {
        invCount++;
      }
    }
  }
  let emptyIndex = indexOfValue(tiles, "");
  let emptyRow = Math.floor(emptyIndex / 4);
  return (invCount + emptyRow) % 2 === 0;
}

// Draws the board in the table
function drawBoard() {
  let table = document.getElementById("puzzleBoard");
  table.innerHTML = "";

  for (let i = 0; i < 4; i++) {
    let row = table.insertRow();
    for (let j = 0; j < 4; j++) {
      let idx = i * 4 + j;
      let cell = row.insertCell();
      let value = board[idx];
      cell.innerText = value;
      cell.className = value === "" ? "empty" : "tile" + value;
      (function (index) {
        cell.onclick = function () {
          tryMove(index);
        };
      })(idx);
    }
  }
}

// Tries to move a tile if it's next to the empty slot
function tryMove(index) {
  let emptyIndex = indexOfValue(board, "");
  let r1 = Math.floor(index / 4), c1 = index % 4;
  let r2 = Math.floor(emptyIndex / 4), c2 = emptyIndex % 4;

  if ((Math.abs(r1 - r2) === 1 && c1 === c2) || (Math.abs(c1 - c2) === 1 && r1 === r2)) {
    // Swap
    let temp = board[index];
    board[index] = board[emptyIndex];
    board[emptyIndex] = temp;
    moveCount++;
    updateUI();
    setTimeout(checkWin, 100);
  }
}

// Updates move counter and re-renders the board
function updateUI() {
  document.getElementById("moveCounter").innerText = moveCount;
  document.getElementById("timer").innerText = timer;
  drawBoard();
}

// Increments timer each second
function updateTimer() {
  timer++;
  document.getElementById("timer").innerText = timer;
}

// Checks if the puzzle is solved
function checkWin() {
  for (let i = 0; i < 15; i++) {
    if (board[i] !== i + 1) {
      return;
    }
  }
  if (board[15] === "") {
    clearInterval(timerInterval);
    setTimeout(function () {
      alert("🎉 Congratulations!\nTime: " + timer + " seconds\nMoves: " + moveCount + "\nClick OK to start a new game!");
      newGame();
    }, 200);
  }
}

// Finds the index of a value in an array
function indexOfValue(arr, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === val) return i;
  }
  return -1;
}
