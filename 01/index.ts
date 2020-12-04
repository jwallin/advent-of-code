import { lines } from '../utils';

function* combinations(array: number[], k:number, start:number = 0): Generator<number[]> {
  if (k === 1 || start == array.length) {
    for(let i = start; i < array.length; i++) {
      yield [array[i]];
    }
  } else {
    for (let i = start; i < array.length; i++) {
      const permutations = combinations(array, k - 1, i + 1);
      for(const x of permutations) {
        yield [array[i], ...x];  
      }
    }
  }
}

function pairs(array: number[]): number[][]{
  return Array.from(combinations(array, 2));
}

function triplets(array:number[]): number[][] {
  return Array.from(combinations(array, 3));
}

async function partOne() {
  const numbers:number[] = (await lines('input.txt')).map(Number);
  const val = pairs(numbers).filter(([x, y]) => x + y === 2020).map(([x, y]) => x * y);
  console.log(val);
}

async function partTwo() {
  const numbers:number[] = (await lines('input.txt')).map(Number);
  const val = triplets(numbers).filter(([x, y, z]) => x + y + z === 2020).map(([x, y, z]) => x * y * z);
  console.log(val);
}

partTwo();