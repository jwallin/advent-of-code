import { getInput, Position, toChars } from '../utils';
import { Matrix } from '../utils/matrix';

const SEAT_OCCUPIED = '#';
const SEAT_EMPTY = 'L';

const isOccupied = (seat: string): boolean => seat === SEAT_OCCUPIED;
const isEmpty = (seat: string): boolean => seat === SEAT_EMPTY;
const isSeat = (val: string): boolean => isOccupied(val) || isEmpty(val);

const countOccupiedSeats = (input: string[]): number => input.filter(isOccupied).length;

async function getMatrix():Promise<Matrix> {
  const seats:string[] = await getInput();
  return new Matrix(seats.map(toChars));
}

function applyRules(matrix: Matrix, updateSeat: (matrix: Matrix, p: Position) => string):Matrix {
  const newMatrix = matrix.clone();
  matrix.asArray().forEach((p: Position) => {
    newMatrix.set(p, updateSeat(matrix, p));
  });
  return newMatrix;
}

async function run(updateSeat: (matrix: Matrix, p: Position) => string): Promise<Matrix> {
  let matrix = await getMatrix();
  let oldMatrix;
  let i = 0;

  while(!oldMatrix || !matrix.equals(oldMatrix)) {
    oldMatrix = matrix;
    matrix = applyRules(matrix, updateSeat);
  }
  return matrix;
}

async function partOne() {
  const matrix = await run((matrix: Matrix, p: Position) => {
    const seat = matrix.get(p);
    const adjacent = matrix.adjacentValues(p);
    
    if (isEmpty(seat) && countOccupiedSeats(adjacent) === 0) {
      return SEAT_OCCUPIED;
    } else if (isOccupied(seat) && countOccupiedSeats(adjacent) >= 4) {
      return SEAT_EMPTY;
    }
    return seat;
  });
  console.log(countOccupiedSeats(matrix.values()));
}

async function partTwo() {
  const matrix = await run((matrix: Matrix, p: Position) => {
    const seat = matrix.get(p);
    const visibleSeats = matrix.visibleValues(p, (x:string) => isSeat(x));
  
    if (isEmpty(seat) && countOccupiedSeats(visibleSeats) === 0) {
      return SEAT_OCCUPIED;
    } else if (isOccupied(seat) && countOccupiedSeats(visibleSeats) >= 5) {
      return SEAT_EMPTY;
    }
    return seat;
  });
  console.log(countOccupiedSeats(matrix.values()));
}

partTwo();