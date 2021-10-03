import { getInput } from '../../utils';

function calcFuel(mass: number) {
  let fuel = Math.floor(mass / 3) - 2;
  if (fuel < 0) {
    return 0;
  }
  fuel += calcFuel(fuel);
  return fuel;
}

async function partTwo() {
  const totalFuel = (await getInput()).map(Number).reduce((acc, curr) => acc + calcFuel(curr), 0);
  console.log(totalFuel);
}

partTwo();