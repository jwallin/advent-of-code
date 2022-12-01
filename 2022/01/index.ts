import { getInput, sortDescending, splitArrayBy, sum } from '../../utils';

async function partOne() {
  const input = (await getInput());
  const vals = splitArrayBy(input, '').map(x => x.map(y => Number(y)).reduce(sum));
  console.log(Math.max(...vals));
}

async function partTwo() {
  const input = (await getInput());
  const vals = splitArrayBy(input, '').map(x => x.map(y => Number(y)).reduce(sum));
  vals.sort(sortDescending);
  console.log(vals.slice(0, 3).reduce(sum));
}
  
partOne();
partTwo();