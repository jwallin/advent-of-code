import { getInput, pairs, triplets } from '../utils';

async function partOne() {
  const numbers:number[] = (await getInput()).map(Number);
  const val = pairs(numbers).filter(([x, y]) => x + y === 2020).map(([x, y]) => x * y);
  console.log(val);
}

async function partTwo() {
  const numbers:number[] = (await getInput()).map(Number);
  const val = triplets(numbers).filter(([x, y, z]) => x + y + z === 2020).map(([x, y, z]) => x * y * z);
  console.log(val);
}

partOne();