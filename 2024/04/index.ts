import { getInput } from '../../utils';
import { ADJACENT_AND_DIAGONAL, Matrix } from '../../utils/matrix';
import { multiply, Position, sum } from '../../utils/position';



async function partOne() {
  const CANDIDATE_POSITIONS = ADJACENT_AND_DIAGONAL.map(p => 
    [0, 1, 2, 3].map(i => multiply(p, { x: i, y: i }))
  );

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
  const XMAS_COORDS: Position[][] = [
    [{ x: -1, y: -1 }, { x: 0, y: 0 }, { x: 1, y: 1 }],
    [{ x: -1, y: 1 }, { x: 0, y: 0 }, { x: 1, y: -1 }],
  ];
  
  const input = (await getInput()).map(x => x.split(''));
  const q = new Matrix(input);
  const startPositions = q.positionsWithValue('A');

  const xmasPositions = startPositions.filter(p => {
    const d = XMAS_COORDS.map(x => x.map(y => sum(y, p)));
    if (!d.every(x => x.every(y => q.has(y)))) {
      return false;
    }
    
    return d
      .flatMap(x => x.map(y => q.get(y)).join(''))
      .every(d => d === 'MAS' || d === 'SAM')
  })
  console.log(xmasPositions.length)
}
  
partOne();
partTwo();