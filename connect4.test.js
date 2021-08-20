// unit tests for connect4.js



describe('makeBoard tests', () => {

  beforeAll(() => {
    const DEFAULT_WIDTH = 7;
    const DEFAULT_HEIGHT = 6;
    const MIN_WIDTH = 4;
    const MIN_HEIGHT = 4;
    const board = [];
  })

  it('should make a board with the default dimensions if no arguments are passed in', () => {
    makeBoard();

    expect(board).toHaveSize(DEFAULT_HEIGHT);

    for (const row of board) {
      expect(row).toHaveSize(DEFAULT_WIDTH);
    }
  })

  it('should make a board filled with null values', () => {
    makeBoard();

    for (const row of board) {
      for (const cell of row) {
        expect(cell).toBeNull();
      }
    }
  })

  it('should make a board with dimensions rounded down to the nearest integer if args are noninteger numbers', () => {
    const floatWidth = 7.9;
    const floatHeight = 6.9;
    
    makeBoard(floatWidth, floatHeight);

    expect(board).toHaveSize(DEFAULT_HEIGHT);

    for (const row of board) {
      expect(row).toHaveSize(DEFAULT_WIDTH);
    }
  })

  it('should make a board with dimensions rounded down to the nearest integer if args are strings of digits', () => {
    const strWidth = '7.9';
    const strHeight = '6.9';

    makeBoard(strWidth, strHeight);

    expect(board).toHaveSize(DEFAULT_HEIGHT);

    for (const row of board) {
      expect(row).toHaveSize(DEFAULT_WIDTH);
    }

  })

  describe('makeBoard tests with invalid args', () => {
    
    it('should make a board with the min width dimension if width arg is less than 4', () => {
      makeBoard(3, DEFAULT_HEIGHT);

      expect(board).toHaveSize(DEFAULT_HEIGHT);

      for (const row of board) {
        expect(row).toHaveSize(MIN_WIDTH);
      }
    })

    it('should make a board with the min height dimension if height arg is less than 4', () => {
      makeBoard(DEFAULT_WIDTH, 3);

      expect(board).toHaveSize(MIN_HEIGHT);

      for (const row of board) {
        expect(row).toHaveSize(DEFAULT_WIDTH);
      }
    })

    it('should make a board with the default size if args are not numbers or strings of digits', () => {
      makeBoard('invalid', 'arg');

      expect(board).toHaveSize(HEIGHT);

      for (const row of board) {
        expect(row).toHaveSize(WIDTH);
      }
    })

  })


})