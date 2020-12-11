import { lines, Direction, toChars } from '../utils';
import { Matrix } from '../utils/matrix';

async function getMatrix():Promise<Matrix> {
  const passwords:string[] = (await lines('input.txt'));
  return new Matrix(passwords.map(toChars));
}

function traverseTrees(matrix: Matrix, direction:Direction):number {
  let x = 0;
  let y = 0;
  let trees = 0;
  while (y < matrix.rows.length) {
    if (matrix.get({x: x % matrix.rows[y].length, y}) === '#') {
      trees++;
    }
    x += direction.x;
    y += direction.y;
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
  const directions:Direction[] = [
    {x: 1, y: 1}, 
    {x: 3, y: 1}, 
    {x: 5, y: 1}, 
    {x: 7, y: 1}, 
    {x: 1, y: 2}
  ];
  let totalTrees = directions.reduce<number>((prev:number, curr:Direction) => prev * traverseTrees(matrix, curr), 1);
  console.log(totalTrees)
}

partTwo();