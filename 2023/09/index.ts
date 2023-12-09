import { getInput, sum, lastValue } from '../../utils';

async function getSequences() {
  const input = (await getInput()).map(x => x.split(' ').map(Number));
  return input.map(x => {
    const delta = [x];
    let lastDelta = x;
    while (!lastDelta.every(n => n === 0)) {
      const d1 = [];
      for (let i = 1; i < lastDelta.length; i++) {
        d1.push(lastDelta[i] - lastDelta[i - 1]);
      }
      delta.push(d1);
      lastDelta = d1;
    }

    return delta;
  });
}

async function partOne() {
  const seq = await getSequences();
  seq.forEach(s => {
    for (let i = s.length - 1; i > 0; i--) {
      const a = lastValue(s[i]);
      const b = lastValue(s[i - 1]);
      s[i - 1].push(a + b);
    }
  });
  const val = seq.map(x => lastValue(x[0])).reduce(sum);
  console.log(val)
}

async function partTwo() {
  const seq = await getSequences();
  seq.forEach(s => {
    for (let i = s.length - 1; i > 0; i--) {
      const a = s[i][0];
      const b = s[i - 1][0];
      s[i - 1].unshift(b - a);
    }
  });
  console.log(seq.map(x => x[0][0]).reduce(sum))
}
  
partOne();
partTwo();