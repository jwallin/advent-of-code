import { getInput } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { Position } from '../../utils/position';

const ROUND_ROCK = 'O';
const EMPTY_SPACE = '.';

function tiltNorth(m: Matrix<string>) {
  for (let y = 1; y < m.rows.length; y++) {
    const row = m.rows[y];
    for (let x = 0; x < row.length; x++) {
      const c = row[x];
      if (c !== ROUND_ROCK) {
        continue;
      }
      const newY = getNewRow(m, {x, y});
      if (y !== newY) {
        m.set({ x, y }, EMPTY_SPACE);
        m.set({ x, y: newY }, ROUND_ROCK);
      }
    }
  }
}

function getNewRow(m: Matrix<string>, {x, y}: Position) {
  let newY = y;
  for (let i = y - 1; i >= 0; i--) {
    if (m.get({ x, y: i }) !== EMPTY_SPACE) {
      break;
    }
    newY = i;
  }
  return newY;
}

async function partOne() {
  const input = (await getInput()).map(x => x.split(''));
  const m = new Matrix(input);

  tiltNorth(m);

  console.log(m.draw())

  const s = m.rows.reverse().reduce((acc, row, i) => {
    return acc + row.filter(x => x === ROUND_ROCK).length * (i + 1);
  }, 0);
  console.log(s)
}

async function partTwo() {
  const input = (await getInput()).map(x => x.split(''));
  let m = new Matrix(input);

  const vals = [];

  for (let x = 0; x < 500; x++) {
    for (let i = 0; i < 4; i++) {
      tiltNorth(m);
      m = m.rotateRight(); 
    }
    const s = m.rows.slice().reverse().reduce((acc, row, i) => {
      return acc + row.filter(x => x === ROUND_ROCK).length * (i + 1);
    }, 0);
    console.log(x, s)
    vals.push(s);
  }
 
  const WINDOW_LENGTH = 26;
  const START = WINDOW_LENGTH * 6;
  const window = vals.slice(START, START + WINDOW_LENGTH);
  console.log(window[(1000000000 - 1) % WINDOW_LENGTH])
}

partTwo();