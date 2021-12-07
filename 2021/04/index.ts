import { getInput, hasAllValuesFrom, splitArray, sum } from '../../utils';
import { Matrix } from '../../utils/matrix';

function parseBingoBoards(s:string[]):[number[], Matrix<number>[]] {
  const [numbers, ...boards] = splitArray(s, '');
  const matrixes = boards
    .map(b => b.map(x => x.split(/\s+/).filter(x => x.length > 0).map(Number)))
    .map(b => new Matrix(b));

  return [
    numbers.flatMap(x => x.split(',').map(Number)),
    matrixes
  ]
}

function playBingo(numbers:number[], boards:Matrix<number>[]):[number, Matrix<number>] {
  const wonBoards:Matrix<number>[] = [];
  for (let i = 0; i < numbers.length; i++) {
    const drawnNumbers = numbers.slice(0, i + 1);
    const winningBoards = boards
      .filter(b => !wonBoards.includes(b))
      .filter(b => b.rows.concat(b.columns)
      .some(r => hasAllValuesFrom(drawnNumbers, r)));
    
    if (winningBoards.length > 0) {
      const allVals = winningBoards[0].values().filter(x => !!x) as number[];
      const s = allVals.filter(x => !drawnNumbers.includes(x)).reduce(sum);
      return [s * drawnNumbers[drawnNumbers.length - 1], winningBoards[0]];
    }
  }
  throw new Error('No winner');
}

async function partOne() {
  const [numbers, boards] = parseBingoBoards(await getInput());
  const [score] = playBingo(numbers, boards);
  console.log(score);
}

async function partTwo() {
  const [numbers, boards] = parseBingoBoards(await getInput());
  const wonBoards:Matrix<number>[] = [];
  let b;
  let score = 0;
  while(wonBoards.length < boards.length) {
    [score, b] = playBingo(numbers, boards.filter(x => !wonBoards.includes(x)));
    wonBoards.push(b);
  }
  console.log(score)
}
  
partOne();
partTwo();