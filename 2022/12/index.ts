import { getInput } from '../../utils';
import { weightedDijkstra } from '../../utils/dijkstra';
import { Matrix } from '../../utils/matrix';
import { Position } from '../../utils/position';

function findShortest(start: Position, dest: Position, m: Matrix<string>) {
  return weightedDijkstra(start, dest, (node) => {
    return Matrix.adjacentPositions(node).filter(x => {
      if (!m.has(x)) {
        return false;
      }

      return m.get(x).charCodeAt(0) - m.get(node).charCodeAt(0) <= 1;
    }).map(x => [x, 1]);
  });
}

async function partOne() {
  const input = (await getInput()).map(x => x.split(''));
  const m = new Matrix(input);
  const start = m.asArray().find(p => m.get(p) === 'S') as Position;
  const dest = m.asArray().find(p => m.get(p) === 'E') as Position;

  m.set(start, 'a');
  m.set(dest, 'z');

  const shortest = findShortest(start, dest, m);
  console.log(shortest)
}

async function partTwo() {
  const input = (await getInput()).map(x => x.split(''));
  const m = new Matrix(input);
  const start = m.asArray().find(p => m.get(p) === 'S') as Position;
  const dest = m.asArray().find(p => m.get(p) === 'E') as Position;

  m.set(start, 'a');
  m.set(dest, 'z');

  const possibleStarts = m.asArray().filter(p => m.get(p) === 'a');
  const q = possibleStarts.reduce((acc, s) => {
    const shortest = findShortest(s, dest, m);

    if (shortest !== undefined && shortest < acc) { 
      return shortest;
    }
    return acc;
  }, Infinity);
  console.log(q)
}

partOne();
partTwo();