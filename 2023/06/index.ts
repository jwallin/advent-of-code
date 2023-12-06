import { getInput, multiply } from '../../utils';

async function partOne() {
  const [times, recordDistances] = (await getInput()).map(x => x.split(' ').filter(y => y.length > 0).slice(1).map(Number));
  const wins: number[] = [];
  for (let race = 0; race < times.length; race++) {
    wins[race] = 0;
    for (let j = 0; j < times[race]; j++) {
      const dist = j * (times[race] - j);
      if (dist > recordDistances[race]) {
        wins[race]++;
      }
    }
  }
  console.log(wins.reduce(multiply))
}

async function partTwo() {
  const [time, recordDistance] = (await getInput()).map(s => s.replace(/\s/g, '').split(':').slice(1).map(Number)[0]);
  let wins = 0;
  for (let j = 0; j < time; j++) {
    const dist = j * (time - j);
    if (dist > recordDistance) {
      wins++;
    }
  }
  console.log(wins)
}

partOne();
partTwo();