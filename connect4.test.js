// unit tests for connect4.js


describe('makeBoard unit tests', () => {

  it('should make a board with the default dimensions if no arguments are passed in', () => {
    const board = makeBoard();
   
    expect(board.length).toEqual(DEFAULT_HEIGHT);

    for (const row of board) {
      expect(row.length).toEqual(DEFAULT_WIDTH);
    }
  })

  it('should make a board filled with null values', () => {
    const board = makeBoard();

    for (const row of board) {
      for (const cell of row) {
        expect(cell).toBeNull();
      }
    }
  })

  it('should make a board with dimensions rounded down to the nearest integer if args are noninteger numbers', () => {
    const floatWidth = 7.9;
    const floatHeight = 6.9;
    
    const board = makeBoard(floatWidth, floatHeight);

    expect(board.length).toEqual(DEFAULT_HEIGHT);

    for (const row of board) {
      expect(row.length).toEqual(DEFAULT_WIDTH);
    }
  })

  it('should make a board with dimensions rounded down to the nearest integer if args are strings of digits', () => {
    const strWidth = '7.9';
    const strHeight = '6.9';

    const board = makeBoard(strWidth, strHeight);

    expect(board.length).toEqual(DEFAULT_HEIGHT);

    for (const row of board) {
      expect(row.length).toEqual(DEFAULT_WIDTH);
    }

  })

  describe('makeBoard tests with invalid args', () => {
    
    it('should make a board with the min width dimension if width arg is less than 4', () => {
      const board = makeBoard(3, DEFAULT_HEIGHT);

      expect(board.length).toEqual(DEFAULT_HEIGHT);

      for (const row of board) {
        expect(row.length).toEqual(MIN_SIZE);
      }
    })

    it('should make a board with the min height dimension if height arg is less than 4', () => {
      const board = makeBoard(DEFAULT_WIDTH, 3);

      expect(board.length).toEqual(MIN_SIZE);

      for (const row of board) {
        expect(row.length).toEqual(DEFAULT_WIDTH);
      }
    })

    it('should make a board with the default size if args are not numbers or strings of digits', () => {
      const board = makeBoard('invalid', 'arg');

      expect(board.length).toEqual(DEFAULT_HEIGHT);

      for (const row of board) {
        expect(row.length).toEqual(DEFAULT_WIDTH);
      }
    })
  })

})

//makeHtmlBoard Unit Tests ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
describe('makeHtmlBoard unit tests', () => {
  beforeAll(() => {
    board = makeBoard();
  })

  it('should make an htmlBoard with a column-top of width td elements', () => {
    makeHtmlBoard();

    const boardWidth = board[0].length;

    expect(document.querySelector('#column-top').cells.length).toEqual(boardWidth);
  }) 

  it('should give each drop-in cell in column-top the id of its column number indexed at 0', () => {
    makeHtmlBoard();

    const dropInCells = [...document.querySelectorAll('#column-top td')];
    
    dropInCells.map((td, col) => expect(parseInt(td.id)).toEqual(col));
  })

  it('should create height rows with width playable cells each', () => {
    makeHtmlBoard();

    const boardRows = document.querySelectorAll('.playable');
    expect(boardRows.length).toEqual(board.length);

    for (row of boardRows) {
      expect(row.cells.length).toEqual(board[0].length);
    }
  })

  it('should create an id for each playable cell where id = <row>-<col>', () => {
    makeHtmlBoard();

    const playable = document.querySelectorAll('.playable td');

    let cell = 0;
    for (let row = 0; row < board.length; ++row) {
      for (let col = 0; col < board[0].length; ++col) {
        expect(playable[cell++].id).toBe(`${row}-${col}`);
      }
    }
  })
  
  afterEach(() => {
    document.querySelector('#board').innerHTML = '';
  })
})




