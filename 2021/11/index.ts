import { getInput } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { equals, Position } from '../../utils/position';

async function partOne() {
  const input = (await getInput()).map(x => x.split('').map(Number));
  const m = new Matrix(input);
  const steps = 100;

  let totalFlashses = 0;

  for (let i = 0; i < steps; i++) {
    const flashes = step(m);
    totalFlashses += flashes;
  }
  
  console.log(totalFlashses)
}

async function partTwo() {
  const input = (await getInput()).map(x => x.split('').map(Number));
  const m = new Matrix(input);
  const maxSteps = 1000;
  const size = m.values().length;

  for (let i = 0; i < maxSteps; i++) {
    const flashes = step(m);
    if (flashes === size) {
      console.log(`Step ${i + 1}`)
      console.log(m.draw())
      break;
    }
  }
}

function step(m: Matrix<number>) {
  // Increase all
  m.asArray().forEach(p => m.set(p, m.get(p) + 1));
  
  const flashed = m.asArray().filter(n => m.get(n) > 9);
  const queue = flashed.slice();
  while (queue.length > 0) {
    const f = queue.shift() as Position;
    // Increase adjacent
    const adj = Matrix.adjacentAndDiagonalPositions(f).filter(x => m.has(x));
    adj.forEach(a => m.set(a, m.get(a) + 1));
    //If any new flashers, add to queue
    const found = adj
      .filter(n => m.get(n) > 9)
      .filter(x => !flashed.some(s => equals(s, x)))
      .filter(x => !queue.some(s => equals(s, x)));
    queue.push(...found);
    if (!flashed.some(s => equals(s, f))) {
      flashed.push(f);
    }
  }
  flashed.forEach(f => m.set(f, 0));
  return flashed.length;
}

partOne();
partTwo();