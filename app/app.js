const Gameboard = function () {
  const board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];

  const getBoard = () => board;
  const markBoard = (row, column, mark) => {
    if (board[row][column]) {
      return false;
    };
    board[row][column] = mark;
  };

  return { getBoard, markBoard };
};

function Gamecontrol() {
  const board = Gameboard();

  const coinSide = ["Tail", "Head"];

  function getRandomCoin() {
    let index = Math.floor(Math.random() * coinSide.length);
    return coinSide[index];
  }

  const coin = getRandomCoin();
  console.log(coin);

  let playerOne = coin === "Head" ? "X" : "O";
  let playerTwo = coin === "Tail" ? "X" : "O";

  let activePlayer = coin === "Head";

  const getActivePlayer = () => {
    return activePlayer ? playerOne : playerTwo;
  };

  const getTurnInfo = () => {
    if (activePlayer) {
      console.log("Player One Turn");
    } else {
      console.log("Player Two Turn");
    }
  };

  getTurnInfo();

  const playerRound = function (row, column) {
    if (board.getBoard()[row][column]) {
      console.log("This cell is marked");
      return;
    };
    board.markBoard(row, column, getActivePlayer());
    console.log(board.getBoard());
    activePlayer = !activePlayer;
    getTurnInfo();
  };

  return { playerRound };
}

const game = Gamecontrol();
