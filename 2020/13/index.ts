import { getInput } from '../utils';

async function partOne() {
  const timetable = await getInput();
  const timestamp = Number(timetable[0]);
  const ids = timetable[1].split(',').filter(x => x !== 'x').map(Number);

  for (let i = 0; i < 100; i++) {
    const currentTime = timestamp + i;
    const departure = ids.find(id => currentTime % id  === 0);
    if (departure !== undefined) {
      console.log(departure * i);
      break;
    }
  }
}

async function partTwo() {
  const timetable = await getInput();
  const ids = timetable[1].split(',').map(x => Number(x));

  let time = 0;
  let multiplier = ids[0];
  for (let i = 1; i < ids.length; i++) {
    if (isNaN(ids[i])) {
      continue;
    }
    while (true) {
      time += multiplier;
      if ((time + i) % ids[i] === 0) {
        multiplier *= ids[i];
        break;
      }
    }
  }
  console.log(time);
}

partTwo();