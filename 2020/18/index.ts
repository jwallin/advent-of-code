import { getInput, sum } from '../../utils';

function findMatchingParenthesis(index: number, input: string[]): number {
  let open = 0;
  for (let i = index; i < input.length; i++) {
    if (input[i] === '(') {
      open++;
    } else if (input[i] === ')') {
      open--;
    }
    if (open === 0) {
      return i;
    }
  }
  return -1;
}

function evaluate(input:string[], opPrecedence: string[]):string[] {
  let newArr = input.concat();
  while (newArr.includes('(')) {
    const start = newArr.indexOf('(');
    const end = findMatchingParenthesis(start, newArr);
    const p = newArr.slice(start + 1, end);
    newArr.splice(start, end - start+1, ...evaluate(p, opPrecedence));
  }

  opPrecedence.forEach(op => {
    while (newArr.includes(op)) {
      const opIndex = newArr.indexOf(op);
      const val = eval(newArr.slice(opIndex - 1, opIndex + 2).join(''))
      newArr.splice(opIndex - 1, 3, val);
    }  
  });
  
  while (newArr.length > 2) {
    const val = eval(newArr.slice(0, 3).join(''))
    newArr = [val, ...newArr.slice(3)];
  }
  return newArr;
}

async function run(opPrecedence: string[] = []) {
  const input = (await getInput()).map(s => s.replace(/\s/g, '').split(''));
  const val = input.map(x => Number(evaluate(x, opPrecedence)[0])).reduce(sum);
  console.log(val);
}

async function partOne() {
  run();
}

async function partTwo() {
  run(['+', '*']);
}

partOne();
partTwo();