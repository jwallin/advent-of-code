import { between, getInput } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { Position } from '../../utils/position';

type Movement = [Position, Position];

const HALLWAY_Y = 1;
const TARGET_X = {
  'A': 3,
  'B': 5,
  'C': 7,
  'D': 9
};

const COST = {
  'A': 1,
  'B': 10,
  'C': 100,
  'D': 1000
};

const cache = new Map<string, number>();

const isInHallway = (p: Position) => p.y === HALLWAY_Y;

function findTarget(pod: Position, m:Matrix<string>) {
  const val = m.get(pod);
  const x = TARGET_X[val as keyof typeof TARGET_X];
  
  for (let y = m.maxPos().y; y > HALLWAY_Y; y--) {
    const v = m.get({x, y});
    if (v !== '#' && v !== val) {
      return {x, y};
    }
  }

  throw new Error(`Could not find target for pod ${m.get(pod)}`);
}

function isOutsideRoom(p: Position) {
  return p.y === HALLWAY_Y && Object.values(TARGET_X).includes(p.x);
}

function canMoveToHallway(p: Position, m:Matrix<string>) {
  const tomove = between(p.y - 1, HALLWAY_Y, true).map(y => ({x: p.x, y}));
  return tomove.map(p => m.get(p)).every(v => v === '.');
}

function canReachTarget(p:Position, target: Position, m:Matrix<string>): boolean {
  if (m.get(target) !== '.') {
    return false;
  }

  if (!isInHallway(p) && !canMoveToHallway(p, m)) {
    return false;
  }

  const steps = between(p.x, target.x, false).map(x => ({x, y: HALLWAY_Y}));
  steps.push(...between(p.y, target.y, false).map(y => ({y,  x: target.x})));
  
  const vals = steps.map(p => m.get(p));
  return vals.every(v => v === '.');
}

function isInRightPlace(pod: Position, m:Matrix<string>): boolean {
  const val = m.get(pod);
  const x = TARGET_X[val as keyof typeof TARGET_X];
  if (pod.x !== x || pod.y <= HALLWAY_Y) {
    return false;
  }
  return between(pod.y, m.maxPos().y - 1)
    .map<Position>(y => ({x, y}))
    .every(p => m.get(p) === val);
}

function availableSteps(pod: Position, m:Matrix<string>): Position[] {

  if (isInRightPlace(pod, m)) {
    return [];
  }

  const t = findTarget(pod, m);

  // If can reach target, do it
  if (canReachTarget(pod, t, m)) {
    return [t];
  }
  
  if (isInHallway(pod) || !canMoveToHallway(pod,  m)) {
   return [];
  }

  // Is in room, can move upwards
  const available:number[] = [];

  for (let x = pod.x - 1; x > 0; x--) {
    if (m.get({x, y: HALLWAY_Y}) === '.') {
      available.push(x);
    } else {
      break;
    }
  }
  for (let x = pod.x + 1; x < m.maxPos().x; x++) {
    if (m.get({x, y: HALLWAY_Y}) === '.') {
      available.push(x);
    } else {
      break;
    }
  }

  return available.map(x => ({x, y: HALLWAY_Y})).filter(p => !isOutsideRoom(p));
}

function move(mov: Movement, m: Matrix<string>): Matrix<string> {
  const [from, to] = mov;
  const nextM = m.clone();
  const val = m.get(from);
  nextM.set(from, '.');
  nextM.set(to, val);
  return nextM;
}

function getStepCost(movement: Movement, m: Matrix<string>) {
  const [from, to] = movement;
  const cost = COST[m.get(from) as keyof typeof COST];
  let steps = 0;
  steps += from.y - HALLWAY_Y;
  steps += Math.abs(to.x - from.x);
  steps += to.y - HALLWAY_Y;
  return steps * cost;
}

function allPodsInPlace(pods: Position[], m:Matrix<string>) {
  return pods.every(p => isInRightPlace(p, m));
}

function solveRecursive(m:Matrix<string>, totalCost: number): number {
  const pods = m.asArray().filter(x => m.has(x) && m.get(x).match(/[A-Z]/));

  if (allPodsInPlace(pods, m)) {
    return totalCost;
  }

  if (cache.has(JSON.stringify(m.rows))) {
    return totalCost + (cache.get(JSON.stringify(m.rows)) as number);
  }

  const available = pods.flatMap<Movement>(pod => availableSteps(pod, m).map<Movement>((s => [pod, s])));
  if (available.length === 0) {
    return Number.MAX_VALUE;
  }

  const costs = available.map(a => {
    const cost = getStepCost(a, m);
    const n = move(a, m);
    const f = solveRecursive(n, cost);
    return f;
  });
  const minCost = Math.min(...costs);
  cache.set(JSON.stringify(m.rows), minCost);
  
  return minCost + totalCost;
}

async function partOne() {
  const input = (await getInput('input.txt')).map(x => x.split(''));
  const m = new Matrix(input);
  const q = solveRecursive(m, 0);
  console.log(q)
}

async function partTwo() {
  const input = (await getInput('input2.txt')).map(x => x.split(''));
  const m = new Matrix(input);
  const q = solveRecursive(m, 0);
  console.log(q)
}

//partOne();
partTwo();