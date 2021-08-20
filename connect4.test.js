// unit tests for connect4.js



describe('makeBoard tests', () => {

  it('should make a board with the default dimensions if no arguments are passed in', () => {
    const board = makeBoard();
    console.log(board);
    expect(board.length).toEqual(HEIGHT);

    for (const row of board) {
      expect(row.length).toEqual(WIDTH);
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

    expect(board.length).toEqual(HEIGHT);

    for (const row of board) {
      expect(row.length).toEqual(WIDTH);
    }
  })

  it('should make a board with dimensions rounded down to the nearest integer if args are strings of digits', () => {
    const strWidth = '7.9';
    const strHeight = '6.9';

    const board = makeBoard(strWidth, strHeight);

    expect(board.length).toEqual(HEIGHT);

    for (const row of board) {
      expect(row.length).toEqual(WIDTH);
    }

  })

  describe('makeBoard tests with invalid args', () => {
    
    it('should make a board with the min width dimension if width arg is less than 4', () => {
      const board = makeBoard(3, HEIGHT);

      expect(board.length).toEqual(HEIGHT);

      for (const row of board) {
        expect(row.length).toEqual(MIN_SIZE);
      }
    })

    it('should make a board with the min height dimension if height arg is less than 4', () => {
      const board = makeBoard(WIDTH, 3);

      expect(board.length).toEqual(MIN_SIZE);

      for (const row of board) {
        expect(row.length).toEqual(WIDTH);
      }
    })

    it('should make a board with the default size if args are not numbers or strings of digits', () => {
      const board = makeBoard('invalid', 'arg');

      expect(board.length).toEqual(HEIGHT);

      for (const row of board) {
        expect(row.length).toEqual(WIDTH);
      }
    })

  })

})