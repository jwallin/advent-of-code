import { getInput } from '../../utils';

function calc(d:any[]) {
  for (let i = 0; i < d.length; i++) {
    if (d[i] === 1) {
      const a = d[d[++i]];
      const b = d[d[++i]];
      d[d[++i]] = a + b;
    } else if (d[i] === 2) {
      const a = d[d[++i]];
      const b = d[d[++i]];
      d[d[++i]] = a * b;
    } else if (d[i] === 99) {
      break;
    }
  }
  return d[0];
}

function calcWithNounAndVerb(arr:any[], noun:any, verb:any) {
    const a = arr.slice();
    a[1] = noun; 
    a[2] = verb;
    return calc(a);
  }

async function partTwo() {
  const d = (await getInput())[0].split(',').map(Number);
  for(let i = 0; i < 100; i++) {
    for(let j = 0; j < 100; j++) {
      const val = calcWithNounAndVerb(d, i, j);
      if (val === 19690720) {
        console.log(100 * i + j);
      }
    }
  }
}

partTwo();