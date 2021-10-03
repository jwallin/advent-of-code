import { getInput, pairs, sum } from '../../utils';

function findInvalidNumber(input: number[], preambleLength: number): number | undefined {
  const allValues = input.slice(); // Copy array to avoid mutation of parameter
  const preamble: number[] = allValues.splice(0, preambleLength);
  return allValues.find(v => {
    const valid: boolean = pairs(preamble).find(([x, y]) => x + y === v) !== undefined;
    if (!valid) {
      return true;
    }
    
    preamble.shift();
    preamble.push(v);
    return false;
  });
}

async function partOne() {
  const input: number[] = (await getInput()).map(Number);
  const invalidNum = findInvalidNumber(input, 25);
  console.log(`${invalidNum} is invalid`);
}

async function partTwo() {
  const input: number[] = (await getInput()).map(Number);
  const invalidNum = findInvalidNumber(input, 25);
  if (invalidNum === undefined) {
    console.log('All values are valid')
    return;
  }

  for (let start = 0; start < input.length - 1; start++) {
    for (let end = start + 2; end < input.length + 1; end++) {
      const range = input.slice(start, end);
      const total = range.reduce(sum, 0);
      if (total < invalidNum) {
        continue;
      } else if (total > invalidNum) {
        break;
      }
      const s = Math.min(...range) + Math.max(...range);
      console.log(s);
    }
  }
}

partTwo();