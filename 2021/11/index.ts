import { getInput } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { equals, Position } from '../../utils/position';

function increase(val: number | undefined): number  {
  return (val || 0) + 1;
}

async function partOne() {
  const input = (await getInput()).map(x => x.split('').map(Number));
  const m = new Matrix(input);
  const steps = 100;

  let totalFlashses = 0;

  for (let i = 0; i < steps; i++) {
    m.asArray().forEach(p => m.set(p, (m.get(p) as number) + 1));
    const flashed = m.asArray().filter(n => (m.get(n) as number) > 9);
    const newF = flashed.slice();
    while  (newF.length > 0) {
      const f = newF.shift() as Position;
      // incr adjacent
      const adj = m.adjacentAndDiagonalPositions(f).filter(x => m.get(x) !== undefined);
      adj.forEach(a => m.set(a, increase(m.get(a))))
      //If any new flashers, add to list
      const found = adj
        .filter(n => (m.get(n) as number) > 9)
        .filter(x => !flashed.some(s => equals(s, x)))
        .filter(x => !newF.some(s => equals(s, x)));
      newF.push(...found);
      if (!flashed.some(s => equals(s, f))) {
        flashed.push(f);
      }
      
    }
    flashed.forEach(f => m.set(f, 0));
    totalFlashses += flashed.length;
    console.log(m.draw())
    console.log('')
  }
  
  console.log(totalFlashses)
}

async function partTwo() {
  const input = (await getInput()).map(x => x.split('').map(Number));
  const m = new Matrix(input);
  const maxSteps = 1000;
  const size = m.values().length;

  for (let i = 0; i < maxSteps; i++) {
    m.asArray().forEach(p => m.set(p, (m.get(p) as number) + 1));
    const flashed = m.asArray().filter(n => (m.get(n) as number) > 9);
    const newF = flashed.slice();
    while  (newF.length > 0) {
      const f = newF.shift() as Position;
      // incr adjacent
      const adj = m.adjacentAndDiagonalPositions(f).filter(x => m.get(x) !== undefined);
      adj.forEach(a => m.set(a, increase(m.get(a))))
      //If any new flashers, add to list
      const found = adj
        .filter(n => (m.get(n) as number) > 9)
        .filter(x => !flashed.some(s => equals(s, x)))
        .filter(x => !newF.some(s => equals(s, x)));
      newF.push(...found);
      if (!flashed.some(s => equals(s, f))) {
        flashed.push(f);
      }
      
    }
    flashed.forEach(f => m.set(f, 0));
    if (flashed.length === size) {
      console.log(`Step ${i + 1}`)
      console.log(m.draw())
      break;
    }
  }
}
  

partTwo();