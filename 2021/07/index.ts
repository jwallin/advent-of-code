import { getInput } from '../../utils';

async function partOne() {
  const input = (await getInput()).flatMap(x => x.split(',').map(Number));
  const minFuel = calcTotalFuel(input);
  console.log(minFuel);
}

async function partTwo() {
  const input = (await getInput()).flatMap(x => x.split(',').map(Number));
  const minFuel = calcTotalFuel(input, n => sumNaturalNumbers(n));
  console.log(minFuel);
}

function calcTotalFuel(input: number[], fuelCost: (n:number) => number = (n => n)) {
  const vals = Array.from(new Set(input));
  let minFuel = Infinity;
  for (let i = Math.min(...vals); i <= Math.max(...vals); i++) {
    const cost = input.reduce((acc, curr) => acc + fuelCost(Math.abs(curr - i)), 0);
    if (cost < minFuel) {
      minFuel = cost;
    }
  }
  return minFuel;
}

function sumNaturalNumbers(n:number) {
  return n * (n + 1) / 2;
}

partTwo();