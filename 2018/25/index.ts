import { getInput } from '../../utils';

const manhattanDistance = (p1: number[], p2: number[]): number =>  {
  return p1.reduce((acc, _v, i) => {
    return acc + Math.abs(p1[i] - p2[i]);
  }, 0);
}

async function partOne() {
  const constellations = new Set<number[][]>();
  const input = (await getInput()).map(x => x.split(',').map(Number));
  input.forEach(i => {
    const close = Array.from(constellations).filter(x => x.filter(y => manhattanDistance(i, y) <= 3).length > 0);
    if (close.length === 0) {
      constellations.add([i]);
    } else if (close.length === 1) {
      close[0].push(i);
    } else {
      // Merge 
      const newConst = [...close.flat(), i];
      close.forEach(c => constellations.delete(c));
      constellations.add(newConst);
    }
  })
  console.log(constellations.size)
}

async function partTwo() {
  const input = (await getInput()).map(Number);
}
  

partOne();