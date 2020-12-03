import { readline } from '../utils/readline';

type Direction = {
  x: number,
  y: number
};

async function getMatrix():Promise<string[][]> {
  const passwords:string[] = (await readline('input.txt'));
  return passwords.map(x => x.split(''));
}

function traverseTrees(matrix: string[][], direction:Direction):number {
  let x = 0;
  let y = 0;
  let trees = 0;
  while (y < matrix.length) {
    if (matrix[y][x % matrix[y].length] === '#') {
      trees++;
    }
    x += direction.x;
    y += direction.y;
  }
  return trees;
}

async function partOne() {
  const matrix:string[][] = await getMatrix();
  const trees = traverseTrees(matrix, {x: 3, y: 1})
  console.log(trees);
}

async function partTwo() {
  const matrix:string[][] = await getMatrix(); 
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