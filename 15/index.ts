import { getInput, toChars, sum } from '../utils';


function speakNum(i:number, numbers:number[], startingNumbers:number[]):number {
  if (i < startingNumbers.length) {
    return startingNumbers[i];
  } else {
    const lastNumSpoken = numbers[i - 1];
    const lastTimeSpoken = numbers.slice(0, i - 1).lastIndexOf(lastNumSpoken);
    if (lastTimeSpoken === -1) {
      return 0;
    } else {
      return i - 1 - lastTimeSpoken;
    }
  }
}

async function partOne() {
  const startingNumbers:number[] = (await getInput())[0].split(',').map(Number);
  const MAX = 2020;
  const spokenNumbers:number[] = [];
  for (let i = 0; i < MAX; i++) {
    const n = speakNum(i, spokenNumbers, startingNumbers);
    spokenNumbers.push(n);
    console.log(`${i + 1}: ${n}`);
  }
}

partOne();