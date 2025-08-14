// App

const gameboard = function () {
  const LENGTH = 9;
  let board = ["", "", "", "", "", "", "", "", ""];

  function makeMove(player, index) {
    board[index] = player;
  }

  function getBoard() {
    return board;
  }

  function clearBoard() {
    board = [];
    for (let i = 0; i < LENGTH; i++) {
      board.push("");
    }
  }

  function printBoard() {
    console.clear();
    console.log(`
    | ${board[0]} | ${board[1]} | ${board[2]} |
    | ${board[3]} | ${board[4]} | ${board[5]} |
    | ${board[6]} | ${board[7]} | ${board[8]} |
    `);
  }

  return { makeMove, printBoard, getBoard, clearBoard };
};

const gamecontrol = function () {
  const board = gameboard();

  let currentPlayer = "✕";

  function switchPlayer() {
    currentPlayer = currentPlayer === "✕" ? "◯" : "✕";
  }

  function isValidMove(index) {
    return !board.getBoard()[index] ? true : false;
  }

  function checkWinner() {
    const winnerPattern = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // horizontal pattern
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // vertical pattern
      [0, 4, 8],
      [2, 4, 6], // diagonal pattern
    ];

    for (pattern of winnerPattern) {
      const [a, b, c] = pattern;

      if (
        board.getBoard()[a] !== "" &&
        board.getBoard()[a] === board.getBoard()[b] &&
        board.getBoard()[b] === board.getBoard()[c]
      ) {
        return true;
      }
    }

    if (!board.getBoard().includes("")) return "draw";
    return false;
  }

  function checkDraw() {
    for (item of board.getBoard()) {
      if (item === "") return false;
    }

    return true;
  }

  let gameOver = false;

  function gameResult() {
    let score = checkWinner();
    if (score === true) {
      console.log(`${currentPlayer} Win`);
      gameOver = true;
    } else if (score === "draw") {
      console.log("no winner");
      gameOver = true;
    }
  }

  function resetGame() {
    gameOver = false;

    board.clearBoard();
    board.printBoard();
  }

  function getAvailableMoves(board) {
    return board
      .map((cell, index) => (cell === "" ? index : ""))
      .filter((index) => index !== "");
  }

  function evaluate(b) {
    const wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let [a, b1, c] of wins) {
      if (b[a] !== "" && b[a] === b[b1] && b[a] === b[c]) {
        return b[a] === "◯" ? 1 : -1;
      }
    }

    if (!b.includes("")) return 0; // draw
    return null; // game still going
  }

  function minimax(b, depth, isMaximizing) {
    let score = evaluate(b);
    if (score !== null) return score;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let move of getAvailableMoves(b)) {
        b[move] = "◯";
        let result = minimax(b, depth + 1, false);
        b[move] = "";
        bestScore = Math.max(bestScore, result);
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let move of getAvailableMoves(b)) {
        b[move] = "✕";
        let result = minimax(b, depth + 1, true);
        b[move] = "";
        bestScore = Math.min(bestScore, result);
      }
      return bestScore;
    }
  }

  function AIMove(currentPlayer) {
    let bestScore = -Infinity;
    let moveChosen = null;

    for (let move of getAvailableMoves(board.getBoard())) {
      board.getBoard()[move] = "◯"; // AI move
      let score = minimax(board.getBoard(), 0, false);
      board.getBoard()[move] = ""; // undo
      if (score > bestScore) {
        bestScore = score;
        moveChosen = move;
      }
    }

    board.makeMove("◯", moveChosen);
    board.printBoard();
    gameResult();

    if (!gameOver) switchPlayer();
  }

  function playRound(index) {
    if (gameOver) return;

    if (!isValidMove(index)) {
      console.log("invalid move try again");
      return;
    }
    console.log(game.getAvailableMoves(game.board));
    board.makeMove(currentPlayer, index);
    board.printBoard();
    gameResult();

    if (gameOver) return;

    switchPlayer();
    AIMove(currentPlayer);
  }

  return { getAvailableMoves, playRound, resetGame, board: board.getBoard() };
};

const game = gamecontrol();
// DOM

const container = document.querySelector(".grid-container");

for (item of game.board) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  container.appendChild(cell);
}

const cells = document.querySelectorAll(".cell");

function updateDisplay() {
  cells.forEach((cell, index) => {
    cell.textContent = game.board[index];
    if (cell.textContent === "✕") {
      cell.style.color = "green";
    } else {
      cell.style.color = "red";
    }
  });
}

updateDisplay();

cells.forEach((cell, index) => {
  cell.addEventListener("click", function () {
    game.playRound(index);
    updateDisplay();
    console.log(game.getAvailableMoves(game.board));
  });
});
