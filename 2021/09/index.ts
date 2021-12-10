import { getInput, multiply, sum } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { equals, Position } from '../../utils/position';

function getLowPoints(m: Matrix<number>) {
  return m.asArray().filter(x => {
    const val = m.get(x) as number;
    if (val === undefined) {
      return false;
    }

    const adj = m.adjacentValues(x).filter(v => v !== undefined) as number[];
    return adj.every(v => v > val);
  });
}

function unique(p: Position[]): Position[] {
  return p.filter((x, i) => p.findIndex(y => equals(x, y)) === i);
}

async function partOne() {
  const input = (await getInput()).map(x => x.split('').map(Number));
  const m = new Matrix(input);
  const lowPoints = getLowPoints(m);
  console.log(lowPoints.map(x => 1 + (m.get(x) as number)).reduce(sum))
}

async function partTwo() {
  const input = (await getInput()).map(x => x.split('').map(Number));
  const m = new Matrix(input);
  const lowPoints = getLowPoints(m);
  
  const basinSizes = lowPoints.map(l => {
    const basin:Position[] = [l];
    
    let newLocations = basin;
    while (newLocations.length > 0) {
      const adj = basin.flatMap(x => m.adjacentPositions(x)).filter(x => m.get(x) !== undefined && m.get(x) !== 9);
    
      newLocations = unique(adj.filter(x => !basin.some(y => equals(x, y))));
      basin.push(...newLocations);
    }
    return basin.length;
  });
  const total = basinSizes.sort((a, b) => b - a).slice(0,3).reduce(multiply);
  console.log(total);
}

partTwo();