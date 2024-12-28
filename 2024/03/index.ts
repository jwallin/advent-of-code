import { getInput, multiply } from '../../utils';

async function partOne() {
  const input = (await getInput()).join();
  const re = /mul\(?(\d{1,3}),?(\d{1,3})\)/g;
  let v: RegExpExecArray | null = null;
  let sum = 0;
  do {
    v = re.exec(input)
    
    if (v) {
      sum += v.slice(1,3).map(Number).reduce(multiply);
    }
  } while (v);
  console.log(sum)
}

async function partTwo() {
  const input = (await getInput()).join();
  const re = /do\(\)|don't\(\)|mul\(?(\d{1,3}),?(\d{1,3})\)/g;
  let v: RegExpExecArray | null = null;
  let sum = 0;
  let enabled = true;
  do {
    v = re.exec(input)
    if (v) {
      const cmd = v[0];
      if (cmd === 'do()') {
        enabled = true;
      } else if (cmd === 'don\'t()') {
        enabled = false;
      } else {
        if (enabled) {
          sum += v.slice(1, 3).map(Number).reduce(multiply);
        }
      }
    }
  } while (v);
  console.log(sum)
}

partOne();
partTwo();