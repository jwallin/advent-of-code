import { getInput, toChars } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { Position as Direction, sum } from '../../utils/position';

async function getMatrix(): Promise<Matrix> {
  return new Matrix((await getInput()).map(toChars));
}

function traverseTrees(matrix: Matrix, direction: Direction):number {
  let pos = { x: 0, y: 0 };
  let trees = 0;
  while (pos.y < matrix.rows.length) {
    if (matrix.get({x: pos.x % matrix.rows[pos.y].length, y: pos.y}) === '#') {
      trees++;
    }
    pos = sum(pos, direction);
  }
  return trees;
}

async function partOne() {
  const matrix = await getMatrix();
  const trees = traverseTrees(matrix, {x: 3, y: 1})
  console.log(trees);
}

async function partTwo() {
  const matrix = await getMatrix(); 
  const directions: Direction[] = [
    {x: 1, y: 1}, 
    {x: 3, y: 1}, 
    {x: 5, y: 1}, 
    {x: 7, y: 1}, 
    {x: 1, y: 2}
  ];
  let totalTrees = directions.reduce<number>((prev: number, curr: Direction) => prev * traverseTrees(matrix, curr), 1);
  console.log(totalTrees)
}

partTwo();