import { getInput } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { max, min, Position, sum } from '../../utils/position';

function arrayBetween(n:number, m:number) {
  return Array.from({length: m - n + 1}, (_v,k) => k + n);
}

function parseInput(s:string):Position[] {
  const r = s.match(/(x|y)=(\d+), (x|y)=(\d+)..(\d+)/);
  if (!r) {
    throw new Error('Failed parsing input ' + s);
  }
  const [a,b] = r.slice(4).map(Number);
  return arrayBetween(a,b).map(a => {
    return { 
      [r[1]]: Number(r[2]),
      [r[3]]: a
    } as Position
  });
}


function isBucket(m: Matrix<string>, p: Position) {
  const { left, right } = getBucket(m, p);
  if (left === -1 || right === -1) {
    return false;
  }
  const bucket = m.getRow(p.y).slice(left + 1, right);
  return !bucket.includes('.');
}


function getBucket(m: Matrix<string>, p: Position) {
  const row = m.getRow(p.y);
  const left = row.lastIndexOf('#', p.x - 1);
  const right = row.indexOf('#', p.x + 1);
  return { left, right };
}

function flow(m:Matrix<string>, p:Position) {
  const belowPos = sum(p, {x:0, y:1});

  if (m.get(belowPos) === '.') {
    m.set(belowPos, '|');
    flow(m, belowPos);
  }

  if (m.get(belowPos) === '#' || m.get(belowPos) === '~') {
    const leftRight = [sum(p, {x: -1, y:0}), sum(p, {x: 1, y:0})];
    leftRight.forEach(x => {
      if (m.get(x) === '.') {
        m.set(x, '|');
        flow(m, x);
      }
    })
  }

  if (isBucket(m, p)) {
    const { left, right } = getBucket(m, p);
    arrayBetween(left + 1, right - 1).forEach(x => m.set({x, y: p.y}, '~'));  
  }
}

async function partOne() {
  const input = (await getInput()).map(parseInput).flat();
  const m = new Matrix<string>();
  const spring = { x:500, y: 0 };

  const minY = min(input).y;
  const maxY = max(input).y;
  
  m.fill(sum(min(input.concat(spring)), {x: -1, y: 0}), sum(max(input), {x: 1, y: 0}), '.');
  input.forEach(i => m.set(i, '#'));
  
  flow(m, spring);

  const v = m.rows.slice(minY, maxY + 1).reduce((acc, x) => acc + x.filter(x => x === '|' || x === '~').length, 0);
  console.log(v)
}

async function partTwo() {
  const input = (await getInput()).map(Number);
}

partOne();
