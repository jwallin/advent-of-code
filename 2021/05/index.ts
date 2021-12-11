import { getInput } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { max, min, Position, readingOrder } from '../../utils/position';

function parsePoints(s:string) {
  return s.split('->').map(x => x.split(',').map(Number)).map<Position>(([x, y]) => ({x, y}));
}

function calcIntersections(input: Position[][]) {
  const matrix = new Matrix<number>();
  matrix.fill(min(input.flat()), max(input.flat()), 0);

  input.forEach(([p1, p2]) => {
    if (p1.x === p2.x) {
      const x = p1.x;
      for (let y = p1.y; y <= p2.y; y++) {
        matrix.set({ x, y }, matrix.get({ x, y }, 0) + 1);
      }
    } else if (p1.y === p2.y) {
      const y = p1.y;
      for (let x = p1.x; x <= p2.x; x++) {
        matrix.set({ x, y }, matrix.get({ x, y }, 0) + 1);
      }
    } else {
      const k = (p2.y - p1.y) / (p2.x - p1.x);
      const m = p1.x - k * p1.y;
      for (let y = p1.y; y <= p2.y; y++) {
        const x = k * y + m;

        matrix.set({ x, y }, matrix.get({ x, y },  0) + 1);
      }
    }
  });
  return matrix.values().filter(x => x && x > 1).length;
}

async function partOne() {
  const input = (await getInput())
    .map(parsePoints)
    .map(a => a.sort(readingOrder))
    .filter(([p1, p2]) => p1.x === p2.x || p1.y === p2.y);
  
  console.log(calcIntersections(input));
}

async function partTwo() {
  const input = (await getInput())
    .map(parsePoints)
    .map(a => a.sort(readingOrder));

  console.log(calcIntersections(input));
}

partOne();