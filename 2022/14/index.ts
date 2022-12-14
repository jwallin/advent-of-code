import { getInput, between as betweenNumbers } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { Position, sum } from '../../utils/position';

const BELOW = {x: 0, y: 1};
const BELOW_LEFT = {x: -1, y: 1};
const BELOW_RIGHT = {x: 1, y: 1};

function between(a: Position, b: Position): Position[] {
  const t: Position[] = []
  const xs = betweenNumbers(a.x, b.x, true);
  const ys = betweenNumbers(a.y, b.y, true);
  for (let x = 0; x < xs.length; x++) {
    for (let y = 0; y < ys.length; y++) {
      t.push({x: xs[x], y: ys[y]});
    }  
  }
  return t;
}

function isBlocked(p: Position, m:Matrix<string>, maxY: number | undefined) {
  if (maxY !== undefined && p.y > maxY) {
    return true;
  }
  return m.has(p) && (m.get(p) === '#' || m.get(p) === 'o');
}

function draw(m: Matrix<string>) {
  const d = m.normalize().pad('.', 1);
  d.fill(d.minPos(), d.maxPos(), '.', false);
  console.log(d.draw());
}

async function parseInput() {
  const input = (await getInput()).map(x => x.split(' -> ').map(x => x.split(',').map(Number)).map<Position>(([x, y]) => ({ x, y })));
  const m = new Matrix<string>();
  input.forEach(l => {
    for (let i = 0; i < l.length - 1; i++) {
      const ps = between(l[i], l[i + 1]);
      ps.forEach(p => m.set(p, '#'));
    }
  });
  return m;
}

function dropSand(sand: Position, m: Matrix<string>, maxY: number) {
  let cand = sand;
  while (true) {
    if (!isBlocked(sum(cand, BELOW), m, maxY)) {
      cand = sum(cand, BELOW);
    } else if (!isBlocked(sum(cand, BELOW_LEFT), m, maxY)) {
      cand = sum(cand, BELOW_LEFT);
    } else if (!isBlocked(sum(cand, BELOW_RIGHT), m, maxY)) {
      cand = sum(cand, BELOW_RIGHT);
    } else {
      // Can't move
      break;
    }
  }
  m.set(cand, 'o');
}

async function partOne() {
  const sand: Position = {x: 500, y: 0};
  const m = await parseInput();
  m.set(sand, '+');
  const floor = m.maxPos().y + 1;

  // Drop sand
  for (let i = 0; i < 100000; i++) {
    dropSand(sand, m, floor);
    if (m.rows[floor] && m.rows[floor].some(x => x === 'o')) {
      console.log(i);
      break;
    }
  }

  // draw(m);
}

async function partTwo() {
  const sand: Position = {x: 500, y: 0};
  const m = await parseInput();
  m.set(sand, '+');

  const floor = m.maxPos().y + 1;

  // Drop sand
  while (m.get(sand) !== 'o') {
    dropSand(sand, m, floor)
  }
  
  // draw(m);
  console.log(m.values().filter(x => x === 'o').length)
}

partOne();
partTwo();