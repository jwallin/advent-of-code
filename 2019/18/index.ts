import { getInput } from '../../utils';
import { ADJACENT, Matrix } from '../../utils/matrix';
import { Position, sum, toKey } from '../../utils/position';

type Movement = [Position, Position];

const visited = new Set<string>();
const keys = new Set<string>();

const cache = new Map<string, number>();

function availableSteps(p: Position, m: Matrix<string>):Position[] {
  return ADJACENT.map(a => sum(p, a)).filter(x => {
    if (visited.has(toKey(x))) {
      return false;
    }

    const val = m.get(x);
    if (val === '#' || val === '-') {
      return false;
    }
    if (val.match(/[a-z]/)) {
      return true;
    }
    if (val.match(/[A-Z]/)) {
      return keys.has(val.toLowerCase());
    }

    return true;
  });
}

function allKeysPicked(m:Matrix<string>) {
  return !m.asArray().some(x => m.has(x) && m.get(x).match(/[a-z]/));
}

function move(mov: Movement, m: Matrix<string>): Matrix<string> {
  const [from, to] = mov;
  const nextM = m.clone();
  const val = m.get(from);
  nextM.set(from, '-');
  nextM.set(to, val);
  return nextM;
}

function solveRecursive(m:Matrix<string>, totalCost: number): number {
  const p = m.asArray().find(x => m.has(x) && m.get(x) === '@') as Position;

  if (allKeysPicked(m)) {
    return totalCost;
  }

  if (cache.has(JSON.stringify(m.rows))) {
    return totalCost + (cache.get(JSON.stringify(m.rows)) as number);
  }

  const available = availableSteps(p, m);
  if (available.length === 0) {
    return Number.MAX_VALUE;
  }

  const costs = available.map(a => {
    const n = move([p, a], m);
    const f = solveRecursive(n, 1);
    return f;
  });
  const minCost = Math.min(...costs);
  cache.set(JSON.stringify(m.rows), minCost);
  
  return minCost + totalCost;
}

async function partOne() {
  const input = (await getInput('input.txt')).map(x => x.split(''));
  const m = new Matrix(input);
  const f = solveRecursive(m, 0);
  console.log(f);
}

async function partTwo() {
  const input = (await getInput()).map(Number);
}
  

partOne();