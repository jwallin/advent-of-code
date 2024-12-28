import { getInput } from '../../utils';
import { ADJACENT_AND_DIAGONAL, Matrix } from '../../utils/matrix';
import { multiply, sum } from '../../utils/position';

const CANDIDATE_POSITIONS = ADJACENT_AND_DIAGONAL.map(p => 
  [0, 1, 2, 3].map(i => multiply(p, { x: i, y: i }))
);

async function partOne() {
  const input = (await getInput()).map(x => x.split(''));
  const q = new Matrix(input);
  const startPositions = q.positionsWithValue('X');
  const f = startPositions.reduce<number>((acc, p) => 
    acc + CANDIDATE_POSITIONS
      .map(x => x.map(y => sum(y, p)))
      .filter(x => x.every(y => q.has(y)))
      .flatMap(x => x.map(y => q.get(y)).join(''))
      .filter(x => x === 'XMAS').length, 0)
  console.log(f)
}

async function partTwo() {
  const input = (await getInput()).map(Number);
}
  
partOne();