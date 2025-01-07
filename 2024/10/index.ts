import { getInput, sum, unique } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { Position, toKey } from '../../utils/position';

async function partOne() {
  const input = (await getInput()).map(x => x.split('').map(Number));
  const m = new Matrix(input);
  const trailHeads = m.positionsWithValue(0);
  const trailEndSum = trailHeads.map(t => unique(traverse(t, m).map(x => toKey(x))).length).reduce(sum);
  console.log(trailEndSum)
}

function traverse(p:Position, m:Matrix<number>):Position[] {
  const val = Number(m.get(p));
  if (val === 9) {
    return [p];
  }
  const candidates = Matrix.adjacentPositions(p).filter(x => m.has(x) && m.get(x) === val + 1);
  return [...candidates.flatMap(x => traverse(x, m))];
}

async function partTwo() {
  const input = (await getInput()).map(Number);
}
  

partOne();