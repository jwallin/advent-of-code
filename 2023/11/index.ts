import { getInput, pairs, sum } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { Position, manhattanDistance } from '../../utils/position';

async function parseInput() {
  const input = (await getInput()).map(x => x.split(''));
  return new Matrix(input);
}

function updateIndexesBeyond(i: number, values: number[], size: number) {
  for (let j = i + 1; j < values.length; j++) {
    values[j] = values[j] + size;
  }
}

function expandUniverse(m: Matrix<string>, galaxies: Position[], size: number) {
  const rows = getEmptyIndexes(m.rows);
  const cols = getEmptyIndexes(m.columns);

  for (let i = 0; i < rows.length; i++) {
    updateIndexesBeyond(i, rows, size);

    galaxies.filter(g => g.y > rows[i]).forEach(g => {
      g.y = g.y + size;
    });
  }

  for (let i = 0; i < cols.length; i++) {
    updateIndexesBeyond(i, cols, size);

    galaxies.filter(g => g.x > cols[i]).forEach(g => {
      g.x = g.x + size;
    });
  }
}

function getEmptyIndexes(values: string[][]) {
  return values.reduce<number[]>((acc, curr, i) => {
    if (!curr.some(x => x === '#')) {
      acc.push(i);
    }
    return acc;
  }, []);
}

async function calculateDistanceSum(expansionSize: number) {
  const m = await parseInput();
  const galaxies = m.positionsWithValue('#');
  expandUniverse(m, galaxies, expansionSize);
  return pairs(galaxies).map(([a, b]) => manhattanDistance(a, b)).reduce(sum);
}

async function partOne() {
  const distanceSum = await calculateDistanceSum(1);
  console.log(distanceSum);
}

async function partTwo() {
  const distanceSum = await calculateDistanceSum(1000000 - 1);
  console.log(distanceSum);
}
  
partOne();
partTwo();