import { getInput, sum } from '../../utils';

function countIncreases(input:number[]):number {
  let increase = 0;

  for (let i = 1; i < input.length; i++) {
    if (input[i] > input[i - 1]) {
      increase++;
    }
  }
  return increase;
}

async function partOne() {
  const input = (await getInput()).map(Number);
  console.log(countIncreases(input));
}

async function partTwo() {
  const input = (await getInput()).map(Number);
  const windows:number[] = [];
  for (let i = 0; i < input.length - 2; i++) {
    windows.push(input.slice(i, i + 3).reduce(sum));
  }
  console.log(countIncreases(windows))
} 

partTwo();