import { getInput, multiply } from '../../utils';

async function partOne() {
  const input = (await getInput()).join();
  const re = /mul\(?(\d+),?(\d+)\)/g;
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
  const input = (await getInput()).map(Number);
}
  

partOne();