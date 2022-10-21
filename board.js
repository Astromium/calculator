let originalBoard; // array of the content of each cell
const human = "O";
const ai = "X";
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];

const cells = document.querySelectorAll(".cell");

const startGame = () => {
  document.querySelector(".endgame").style.opacity = 0;
  // initialize the board
  originalBoard = Array.from(Array(9).keys());
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    // remove bg color
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
};

const turnClick = (e) => {
  // preventing clicking on a clicked cell
  if (typeof originalBoard[e.target.id] === "number") {
    turn(e.target.id, human);
    if (!checkTie(originalBoard)) {
      turn(bestSpot(), ai);
    }
  }
};

startGame();

const turn = (cellID, player) => {
  originalBoard[cellID] = player;
  document.getElementById(cellID).innerText = player;
  let gameWon = checkWin(originalBoard, player);
  if (gameWon) {
    gameOver(gameWon);
  }
};

const bestSpot = () => {
  return minimax(originalBoard, ai, -Infinity, Infinity).index;
};

const checkTie = (board) => {
  // all cells are clicked and no one won

  if (
    board.every((el) => typeof el !== "number") &&
    !checkWin(board, human) &&
    !checkWin(board, ai)
  ) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.background = "#48BEFF";
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie !");
    return true;
  }
  return false;
};

const declareWinner = (winner) => {
  document.querySelector(".endgame").style.opacity = 1;
  document.querySelector(".endgame .text").innerText = winner;
};

const checkWin = (board, player) => {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winningCombinations.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index, player };
      break;
    }
  }
  return gameWon;
};

const gameOver = (gameWon) => {
  // highlighting the winning combination
  for (let index of winningCombinations[gameWon.index]) {
    document.getElementById(index).style.background =
      gameWon.player === human ? "green" : "red";
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(gameWon.player === human ? "You won !" : "You lost !");
};

const emptySpots = () => {
  let arr = [];
  for (let i = 0; i < originalBoard.length; i++) {
    if (typeof originalBoard[i] === "number") arr.push(i);
  }
  return arr;
};

function minimax(newBoard, player, alpha, beta) {
  let availSpots = emptySpots();

  if (checkWin(newBoard, human)) {
    return { score: -10 };
  } else if (checkWin(newBoard, ai)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  let moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == ai) {
      let result = minimax(newBoard, human, alpha, beta);
      move.score = result.score;
      // puring
      alpha = Math.max(alpha, result.score);
      if (beta <= alpha) {
        break;
      }
    } else {
      let result = minimax(newBoard, ai, alpha, beta);
      move.score = result.score;
      // puring
      beta = Math.min(beta, result.move);
      if (beta <= alpha) {
        break;
      }
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  // searching for the move with the highest score
  let bestMove;
  if (player === ai) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}
