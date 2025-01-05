import { getInput, pairs } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { diff, Position, sum } from '../../utils/position';

async function partOne() {
  const input = (await getInput()).map(x => x.split(''));
  const m = new Matrix(input);
  const antennaPairs = getAntennaPairs(m);
    
  antennaPairs.forEach(([a, b]) => {
    const antinodes = sum(a, diff(a, b));
    if (m.has(antinodes)) {
      m.set(antinodes, '#');
    }
  });
  console.log(m.values().filter(x => x === '#').length)
}

function getAntennaPairs(m: Matrix<string>) {
  const antennas = m.asArray().filter(x => m.get(x) !== '.');
  const antennaPairs = pairs(antennas)
    .filter(([a, b]) => m.get(a) === m.get(b))
    .reduce<[Position, Position][]>((acc, [a, b]) => {
      return [...acc, [a, b], [b, a]];
    }, []);
  return antennaPairs;
}

async function partTwo() {
  const input = (await getInput()).map(x => x.split(''));
  const m = new Matrix(input);
  const antennaPairs = getAntennaPairs(m);
  antennaPairs.forEach(([a, b]) => {
    const k = diff(a, b);
    let pos = a;
    while (m.has(pos)) {
      m.set(pos, '#');
      pos = sum(pos, k);
    }
  });
  console.log(m.values().filter(x => x === '#').length)
}

partOne();
partTwo();