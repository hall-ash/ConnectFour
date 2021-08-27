/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */


// default board dimensions
const DEFAULT_WIDTH = 7;
const DEFAULT_HEIGHT = 6;
const MIN_SIZE = 4; // min size for board width and height

let currPlayer; // active player: 1 or 2
let board; // array of rows, each row is array of cells  (board[y][x])
let maxMoves; // max moves from both players until board is completely filled
let numMoves; // current total number of moves from both players 
let gameWon;

const initGame = (restartGame = false, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) => {
  currPlayer = 1;
  board = makeBoard(width, height); 
  maxMoves = width * height; 
  numMoves = 0;
  gameWon = false;
  
  if (restartGame) {
    const endMsg = document.getElementById('end-msg');
    endMsg.remove();
  
    clearHtmlBoard(); // clear html board if game had already been played
  }
  else {
    makeHtmlBoard();
  }
 
} 

const clearHtmlBoard = () => {
  const playerPieces = document.querySelectorAll('.player1, .player2')
  for (piece of playerPieces) {
    piece.className = '';
  }
}


/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 *    Each cell in the board is initialized to null.
 *    The default values for board width and height are 7 and 6, respectively.
 *    Arguments for width and height must be positive integers to modify 
 *    board dimensions. 
 */

const validateBoardDimension = (dimension, type) => {
  dimension = parseInt(dimension);

  if (!dimension) return type === 'width' ? DEFAULT_WIDTH : DEFAULT_HEIGHT; 
  if (dimension < MIN_SIZE) return MIN_SIZE; 

  return dimension; 
}

const makeBoard = (width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) => {
// TODO: set "board" to empty HEIGHT x WIDTH matrix array
  width = validateBoardDimension(width, 'width');
  height = validateBoardDimension(height, 'height'); 
  
  return Array.from({ length: height }, () => 
    Array.from({ length: width }, () => null)
  );
}

/** makeHtmlBoard: make HTML table and row of column tops. */

const makeHtmlBoard = () => {
  const htmlBoard = document.querySelector('#board'); // html board

  // create the board's column-top where players can 'drop in' pieces
  // and have it listen for click events
  const top = document.createElement('tr');
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
 

  // create each 'drop in' cell for the top of the board
  for (let x = 0; x < board[0].length; ++x) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);


  // create the playable cells for the board
  for (let y = 0; y < board.length; ++y) {
    const row = document.createElement("tr");
    row.setAttribute('class', 'playable');
    for (let x = 0; x < board[0].length; ++x) {
      const cell = document.createElement("td");
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}


/** findSpotForCol: given column x, return top empty y (null if filled) */
// filled cells are given the value of currPlayer (1 or 2)
// empty cells have value of null
const findSpotForCol = (x) => {

  // check if all cells have been filled for column x
  if (board[0][x]) return null;
  
  const bottomRow = board.length - 1;
  // find the empty row starting from the bottom row
  for (let row = bottomRow; row >= 0; --row) {
    // cell row-x is empty
    if (!board[row][x]) return row; 
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */

const placeInTable = (y, x) => {
  // create a div for the game piece
  const gamePiece = document.createElement('div');
  gamePiece.setAttribute('class', 'piece');
  currPlayer === 1 ? gamePiece.classList.add('player1') : gamePiece.classList.add('player2');

  // add it to the table cell
  const tableCell = document.getElementById(`${y}-${x}`);

  tableCell.append(gamePiece);
}


/** endGame: announce game end */

const endGame = (msg) => {
  const endMsg = document.createElement('div');
  endMsg.setAttribute('id', 'end-msg');
  endMsg.innerText = msg;
  endMsg.append(document.createElement('br'));
  const newGameBtn = document.createElement('button');
  newGameBtn.innerText = 'New Game';
  newGameBtn.addEventListener('click', () => {
    initGame(true);
  });
  endMsg.append(newGameBtn);
 
  document.getElementById('game').append(endMsg);
  

}

/** handleClick: handle click of column top to play piece */

const handleClick = (evt) => {
  if (gameWon || evt.target.id === 'column-top') return; // don't allow players to add additonal pieces if game has been won

  // get x from ID of clicked cell
  const x = evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(y, x);
  board[y][x] = currPlayer;
  numMoves++; 

  // check for win
  if (checkForWin()) {
    gameWon = true;
    return endGame(`Player ${currPlayer} won!`);
  }

  // TODO: check if all cells in board are filled; if so call, call endGame
  if (numMoves === maxMoves) return endGame('Tie game!');

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1; 
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

const checkForWin = () => {

  const _win = (cells) => {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < board.length &&
        x >= 0 &&
        x < board[0].length &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  // check each cell in the board 
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[0].length; x++) {
      // find the 3 cells adjacent to it in the horizontal, vertical, and both diagonal directions
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // if any group of 4 adjacent cells all match the currPlayer, declare a win
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

// initialize a new game
initGame();
