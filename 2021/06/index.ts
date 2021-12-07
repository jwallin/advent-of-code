import { getInput, sum } from '../../utils';

function simulate(input: string[], days: number) {
  const a = Array<number>(9).fill(0);
  input
    .flatMap(x => x.split(','))
    .map(Number)
    .forEach(i => {
      a[i] += 1;
    });

  for (let i = 0; i < days; i++) {
    const v = a.shift() as number;
    a[6] += v;
    a.push(v);
  }

  return a.reduce(sum);
}


async function partOne() {
  const input = await getInput();

  const totalFish = simulate(input, 80);
  console.log(totalFish);
}

async function partTwo() {
  const input = await getInput();

  const totalFish = simulate(input, 256);
  console.log(totalFish);
}
  

partTwo();