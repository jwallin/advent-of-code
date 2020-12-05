import { toChars, lines, range } from '../utils';
import { Matrix } from '../utils/matrix';

const PLANE_LENGTH = 128;
const PLANE_WIDTH = 8;

type PlaneSeat = {
  row: number,
  col: number,
  ID: number
};

const seatID = (row: number, col: number): number => row * 8 + col;

function getRowAndSeat(input: string): PlaneSeat {
  let rows = range(PLANE_LENGTH);
  let cols = range(PLANE_WIDTH);

  toChars(input).forEach(x => {
    switch(x) {
      case 'L':
        cols = cols.slice(0, cols.length / 2);
        break;
      case 'R':
        cols = cols.slice(cols.length / 2, cols.length);
        break;
      case 'F':
        rows = rows.slice(0, rows.length / 2);
        break;
      case 'B':
        rows = rows.slice(rows.length / 2, rows.length);
        break;
      default:
    }
  });

  if(cols.length !== 1 || rows.length !== 1) {
    throw new Error('Unexpected seat/ row length');
  }
  return { row: rows[0], col: cols[0], ID: seatID(rows[0], cols[0]) };
}

function getMissingSeats(seatMatrix: Matrix) {
  const missingSeats = [];
  for (let y = 0; y < PLANE_LENGTH; y++) {
    for (let x = 0; x < PLANE_WIDTH; x++) {
      let id:number = seatMatrix.get(x, y);
      if (id === undefined) {
        id = seatID(y, x);
        missingSeats.push(id);
      }
    }
  }
  return missingSeats;
}

async function partOne() {
  const seats:string[] = (await lines('input.txt'));
  const highestID = seats.reduce((acc, curr) => Math.max(acc, getRowAndSeat(curr).ID), 0);
  console.log(highestID);
}

async function partTwo() {
  const seats:string[] = (await lines('input.txt'));
  const seatMatrix = new Matrix();

  seats.forEach(x => {
    const seat = getRowAndSeat(x);
    seatMatrix.set({ x: seat.col, y: seat.row }, seat.ID);
  });

  const mySeat = getMissingSeats(seatMatrix)
                  .filter(x => seatMatrix.hasValue(x - 1) && seatMatrix.hasValue(x + 1))
  console.log(mySeat);
}

partTwo();

