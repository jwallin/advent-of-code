import { getInput, sum } from '../../utils';

const DIGITS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

async function partOne() {
  const input = (await getInput());
  const a = input.map(x => {
    const m = x.match(/^\D*(\d)(?:.*?(\d))?\D*$/)
    if (!m) {
      throw new Error(`Couldnt parse log: ${x}`);
    }
    const a = m.slice(1,3);
    if (a[1] === undefined) {
      a.push(a[0]);
    }
    return a.join('');
  })
  console.log(a.map(Number).reduce(sum))
}

async function partTwo() {
  const input = (await getInput());
  const a = input.map(x => {
    const res = []
    for (let i = 0; i < x.length; i++) {
      const n = Number(x.substring(i, i + 1));
      if (!isNaN(n)) {
        res.push(n)
        continue;
      }

      const s = x.substring(i);
      const digit = DIGITS.find(d => s.startsWith(d));
      if (digit) {
        res.push(DIGITS.indexOf(digit));
      }
    }
    return res;
  });

  const f = a.map(v => Number(`${v[0]}${v[v.length-1]}`));
  console.log(f.reduce(sum))
}
  
partOne();
partTwo();