/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class ConnectFour {
  // DATA FIELDS

  // default board dimensions
  DEFAULT_WIDTH = 7;
  DEFAULT_HEIGHT = 6;
  MIN_SIZE = 4; // min size for board width and height

  // current board dimensions
  height;
  width;

  // board is implemented with a 2d array, 
  // board[y][x] represents a cell at row y, column x,
  // top left-most cell = board[0][0]
  board; 

  // game status 
  currPlayer; // active player: 1 or 2
  maxMoves; // max moves from both players until board is completely filled
  numMoves; // current total number of moves from both players 
  gameWon; // boolean indicating whether game has been won
  

  // CONSTRUCTOR
  constructor(width, height) {
    // set field values
    this.width = this.validateBoardDimension(width, 'width');
    this.height = this.validateBoardDimension(height, 'height');
    this.currPlayer = 1;
    this.maxMoves = this.width * this.height;
    this.numMoves = 0;
    this.gameWon = false;
  }


  // METHODS

  // starts a new game 
  play() {
    // construct in memory game board & html game board
    this.board = this.makeBoard();
    this.makeHtmlBoard();
  }

  // Ensure board dimensions are integers greater than MIN_SIZE 
  // and return the validated dimension. 
  // Params: dimension - board dimension length
  //         type - dimension type (height or width)
  // If dimension is not a valid integer, set it to a default value (DEFAULT_WIDTH or DEFAULT_HEIGHT).
  // If the dimension is a valid integer and less than MIN_SIZE, set the dimension to MIN_SIZE.
  validateBoardDimension(dimension, type) {
    dimension = parseInt(dimension);

    if (!dimension) return type === 'width' ? this.DEFAULT_WIDTH : this.DEFAULT_HEIGHT; 
    if (dimension < this.MIN_SIZE) return this.MIN_SIZE; 

    return dimension; 
  }

  // remove player1 and player2 pieces from the html board
  clearHtmlBoard(){
    const playerPieces = document.querySelectorAll('.piece');
  
    [...playerPieces].map(piece => piece.className = '');

  }

  /** makeBoard: create in-JS board structure:
   *    board = array of rows, each row is array of cells  (board[y][x])
   *    Each cell in the board is initialized to null.
   *    The default values for board width and height are 7 and 6, respectively.
   *    Arguments for width and height must be positive integers to modify 
   *    board dimensions. 
   */
  makeBoard() {
    // build an array of height arrays, each array will have a length of width
    // and set all values to null
    return Array.from({ length: this.height }, () => 
      Array.from({ length: this.width }, () => null)
    );
  }

  /** makeHtmlBoard: make HTML table and row of column tops. */
  makeHtmlBoard() {
    const htmlBoard = document.querySelector('#board'); // html board

    // create the board's column-top where players can 'drop in' pieces
    // and have it listen for click events
    const top = document.createElement('tr');
    top.setAttribute("id", "column-top");
    top.addEventListener("click", this.handleClick.bind(this));
  

    // create each 'drop in' cell for the top of the board
    for (let x = 0; x < this.width; ++x) {
      const headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      top.append(headCell);
    }
    htmlBoard.append(top);


    // create the playable cells for the board
    for (let y = 0; y < this.height; ++y) {
      const row = document.createElement("tr");
      row.setAttribute('class', 'playable');
      for (let x = 0; x < this.width; ++x) {
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
  findSpotForCol(x) {

    // check if all cells have been filled for column x
    if (this.board[0][x]) return null;
    
    const bottomRow = this.height - 1;
    // find the empty row starting from the bottom row
    for (let row = bottomRow; row >= 0; --row) {
      // cell row-x is empty
      if (!this.board[row][x]) return row; 
    }
  }

  /** placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    // create a div for the game piece
    const gamePiece = document.createElement('div');
    gamePiece.setAttribute('class', 'piece');
    //this.currPlayer === 1 ? gamePiece.classList.add('player1') : gamePiece.classList.add('player2');
    gamePiece.classList.add(`player${this.currPlayer}`);
    
    // initial distance from top
    gamePiece.style.top = '5px';

    // calculates the final style attr 'top' value
    // y is the row
    // returns the number of pixels from top 
    const getFinalTopVal = (y) => {
      return 59 + 56.5 * y;
    };

    // function to increment the value of style attr 'top'
    const incrementTopVal = (gamePiece) => {
      let curTopVal = parseInt(gamePiece.style.top.slice(0, -2));
      gamePiece.style.top = `${++curTopVal}px`;
    } 

    // increments the 'top' value of the gamepiece every 1ms
    const intervalID = setInterval(() => {
      incrementTopVal(gamePiece);
      if (gamePiece.style.top === `${Math.floor(getFinalTopVal(y))}px`) {
        gamePiece.style.top = `${getFinalTopVal(y)}px`;
        clearInterval(intervalID);
      }
    }, 1)

    // add it to the table cell
    const tableCell = document.getElementById(`${y}-${x}`);
    tableCell.append(gamePiece);
  }

  /** endGame: announce game end and display a button to restart a new game
  */
  endGame(msg) {
    // create a div for the end game message
    // containing the msg text
    const endMsg = document.createElement('div');
    endMsg.setAttribute('id', 'end-msg');
    endMsg.innerText = msg;
    endMsg.append(document.createElement('br'));

    // create a new game button
    const newGameBtn = document.createElement('button');
    newGameBtn.innerText = 'New Game';
    // initialize a new game on click of new game button
    newGameBtn.addEventListener('click', this.restartGame.bind(this));
    endMsg.append(newGameBtn);
  
    document.getElementById('game').append(endMsg);
  }

  /** handleClick: handle click of column top to play piece */
  handleClick(evt) {
    // don't allow players to add additonal pieces if game has been won
    // or if the target is the column-top element
    if (this.gameWon) return; 

    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place currPlayer piece in board, add to HTML table, and increment numMoves
    this.placeInTable(y, x);
    this.board[y][x] = this.currPlayer;
    this.numMoves++; 
    
    // check for win, if win display end game message and restart game button
    if (this.checkForWin(y, x)) {
      this.gameWon = true;
      return this.endGame(`Player ${this.currPlayer} won!`);
    }

    // check if max number of moves have been played; if so call, call endGame
    if (this.numMoves === this.maxMoves) return this.endGame('Tie game!');

    // switch players after every turn
    this.currPlayer = this.currPlayer === 1 ? 2 : 1; 
  }

  // Helper method for checkForWin
  // Check adjacent cells to see if they're all color of current player
  //  - cells: array of 7 adjacent (y, x) cells
  //  - returns true if all are legal coordinates & at least 4 in a row match currPlayer
  checkForMatchesInRow(cells) {
    let matchesInRow = 0; // number of adjacent pieces that match currPlayer 

    for (const [y, x] of cells) {
      const matchingPiece = y >= 0 && y < this.height && x >= 0 && x < this.width && this.board[y][x] === this.currPlayer;
      matchingPiece ? matchesInRow++ : matchesInRow = 0; // reset count to 0 if not a match
      if (matchesInRow >= 4) return true;
    }

    // cells.every(
    //   y >= 0 && y < this.height && x >= 0 && x < this.width && this.board[y][x] === this.currPlayer;
    // )
    return false;
  }

  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin(y, x){
    // need at least 7 moves for a win
    if (this.numMoves < 7) return false;
  
    // given cell [y, x] create array of cells adjacent to cell [y, x] for all directions
    const horiz = Array.from({ length: 7 }, () => [y, x - 3]).map(([y, x], i) => [y, x + i]);
    const vert = Array.from({ length: 7 }, () => [y - 3, x]).map(([y, x], i) => [y + i, x]);
    const diagDR = Array.from({ length: 7 }, () => [y - 3, x - 3]).map(([y, x], i) => [y + i, x + i]);
    const diagDL = Array.from({ length: 7 }, () => [y + 3, x - 3]).map(([y, x], i) => [y - i, x + i]);

    // if at least 4 cells in a row from any direction match currPlayer, declare a win
    if (this.checkForMatchesInRow(horiz) || this.checkForMatchesInRow(vert) || this.checkForMatchesInRow(diagDR) || this.checkForMatchesInRow(diagDL)) {
      return true;
    }
  }

  // restart the game: reset game status info, create a new in-memory board, and clear the html board from the prev game
  restartGame() {
    // reset fields
    this.currPlayer = 1;
    this.numMoves = 0;
    this.gameWon = false;

    // construct a blank in-memory game board
    this.board = this.makeBoard();

     // remove the end game message after starting a new game
     const endMsg = document.getElementById('end-msg');
     endMsg.remove();

    // clear the html board from the prev game
    this.clearHtmlBoard();
  }

} // end ConnectFour class body

const connectFour = new ConnectFour();
connectFour.play();
