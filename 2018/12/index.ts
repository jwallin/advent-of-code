import { getInput } from '../../utils';
import { KeyVal } from '../../utils/types';


async function partOne() {
  const input = (await getInput());
  let state = (input.shift() || '').split(': ')[1].split('')
  input.shift()
  
  let rules:KeyVal<string> = {};
  input.forEach(i => {
    const [key, val] = i.split(' => ');
    rules[key] = val;
  });

  let shiftCount = 0;
  console.log(0, state.join(''))
  for (let g = 1; g <= 20; g++) {
    let newState: string[] = [];
    const f = ['.', '.', '.', ...state, '.', '.', '.']
    for (let i = 0; i < f.length; i++) {
     
      const pots = f.slice(i-2, i + 3);
      const newPlant = rules[pots.join('')] || '.';
      newState[i] = newPlant;
  
    }
    console.log(g, newState.join('').substring(shiftCount))
    state = newState;
    shiftCount += 3;

  }

  const total = state.reduce((acc, curr, i) => {
    if (curr === '#') {
      return acc + i - shiftCount;
    }
    return acc;
  }, 0);
  
  console.log(total);
}

async function partTwo() {
  const input = (await getInput()).map(Number);
}
  

partOne();