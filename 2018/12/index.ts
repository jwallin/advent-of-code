import { getInput } from '../../utils';
import { KeyVal } from '../../utils/types';

function getRules(input: string[]) {
  const rules: KeyVal<string> = {};
  input.forEach(i => {
    const [key, val] = i.split(' => ');
    rules[key] = val;
  });
  return rules;
}

function sumOfPlantIndexes(state: string[], shiftCount: number) {
  return state.reduce((acc, curr, i) => {
    if (curr === '#') {
      return acc + i - shiftCount;
    }
    return acc;
  }, 0);
}

async function partOne() {
  const input = (await getInput());
  let state = (input.shift() || '').split(': ')[1].split('');
  input.shift();
  
  const rules: KeyVal<string> = getRules(input);

  let shiftCount = 0;
  for (let g = 1; g <= 20; g++) {
    state = generation(state, rules);
    shiftCount += 3;
  }

  const total = sumOfPlantIndexes(state, shiftCount);
  
  console.log(total);
}

function generation(state: string[], rules: KeyVal<string>) {
  const newState: string[] = [];
  const f = ['.', '.', '.', ...state, '.', '.', '.'];
  for (let i = 0; i < f.length; i++) {
    const pots = f.slice(i - 2, i + 3);
    newState[i] = rules[pots.join('')] || '.';;
  }
  return newState;
}

async function partTwo() {
  const input = (await getInput());
  let state = (input.shift() || '').split(': ')[1].split('');
  input.shift()
  
  const rules: KeyVal<string> = getRules(input);

  let shiftCount = 0;
  let prevTotal = 0;
  for (let g = 1; g <= 200; g++) {
    state = generation(state, rules);
    shiftCount += 3;
    const total = sumOfPlantIndexes(state, shiftCount);
    
    console.log(g, total, total - prevTotal);
    prevTotal = total;
  }

  const total = sumOfPlantIndexes(state, shiftCount);
  
  console.log(total);

  console.log((50000000000 - 200) * 59 + total);
}

partTwo();

