import { getInput, range, unique } from '../../utils';
import { DIR, DIRECTIONS, Matrix } from '../../utils/matrix';
import { Position, fromKey, sum, toKey } from '../../utils/position';

type PosDir = [Position, DIR];

function calcEnergizedTiles(start: PosDir, m: Matrix<string>) {
  const stack = [start];
  const energized = new Set<string>();
  while (stack.length > 0) {
    const [pos, dir] = stack.shift()!;
    if (!m.has(pos) || energized.has(JSON.stringify([pos, dir]))) {
      continue;
    }
    energized.add(JSON.stringify([pos, dir]));
    const newDirs = getNewDirs(dir, m.get(pos));
    newDirs.map<PosDir>(d => {
      return [sum(pos, DIRECTIONS[d]), d];
    }).forEach(x => stack.push(x));
  }

  return unique([...energized].map(x => JSON.parse(x) as PosDir).map(([pos,]) => toKey(pos))).map(fromKey).length;
}

function getAngle(dir: DIR, val: string): DIR {
  const rotateVal = (val === '/') ? 1 : -1
  if (dir === DIR.N) {
    return rotate(dir, 1 * rotateVal);
  } else if (dir === DIR.E) {
    return rotate(dir, -1 * rotateVal);
  } else if (dir === DIR.S) {
    return rotate(dir, 1 * rotateVal);
  } else if (dir === DIR.W) {
    return rotate(dir, -1 * rotateVal);
  }
  throw new Error('Bad dir')
}

function getNewDirs(dir: DIR, val: string) {
  if ((dir === DIR.E || dir === DIR.W) && val === '-') {
    return [dir];
  }
  if ((dir === DIR.N || dir === DIR.S) && val === '|') {
    return [dir];
  }
  if (val === '|' || val === '-') {
    return [rotate(dir, -1), rotate(dir, 1)];
  }
  if (val === '/' || val === '\\') {
    return [getAngle(dir, val)];
  }
  return [dir];
}

function rotate(currentDir: DIR, dir: number): DIR {
  return (((currentDir + dir) % 4) + 4) % 4;
}

async function partOne() {
  const input = (await getInput()).map(x => x.split(''));
  const m = new Matrix(input);

  const start: PosDir= [{x: 0, y: 0}, DIR.E];
  const energizedTiles = calcEnergizedTiles(start, m);
  console.log(energizedTiles)
}

async function partTwo() {
  const input = (await getInput()).map(x => x.split(''));
  const m = new Matrix(input);
  
  const tests:PosDir[] = [
    ...range(m.maxPos().x + 1).map<PosDir>(i => [{x: i, y: 0}, DIR.S]),
    ...range(m.maxPos().y + 1).map<PosDir>(i => [{x: 0, y: i}, DIR.E]),
    ...range(m.maxPos().x + 1).map<PosDir>(i => [{x: i, y: m.maxPos().y}, DIR.N]),
    ...range(m.maxPos().y + 1).map<PosDir>(i => [{x: m.maxPos().x, y: i}, DIR.W]),
  ];
  const maxEnergizedTiles = tests.reduce((acc, start) => {
    const energizedTiles = calcEnergizedTiles(start, m);
    return Math.max(acc, energizedTiles);
  }, 0);
  console.log(maxEnergizedTiles)
}

partOne();
partTwo();