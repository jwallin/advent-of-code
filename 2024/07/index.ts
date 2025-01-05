import { cloneArray, getInput } from '../../utils';

type Expression = {
  value: number,
  numbers: number[]
}

function parseExpression(s: string):Expression {
  const [val, nums] = s.split(': ');
  return {
    value: Number(val),
    numbers: nums.split(' ').map(Number)
  }
}

function concat(a: number, b: number) {
  return Number(`${a}${b}`);
}

function calc(val:number, remainingNumbers: number[], canUseConcatenate = false):number[] {
  const totals:number[] = [];
  if (remainingNumbers.length > 0) {
    const remaining = cloneArray(remainingNumbers);
    const num = remaining.shift()!;
    totals.push(...calc(val * num, remaining, canUseConcatenate));
    totals.push(...calc(val + num, remaining, canUseConcatenate));
    if (canUseConcatenate) {
      totals.push(...calc(concat(val, num), remaining, canUseConcatenate));
    }
    return totals;
  } 
  return [val]
}

function summarizeValidExpressions(expressions: Expression[], canUseConcatenate = false) {
  return expressions.reduce<number>((acc, e) => {
    const expNumbersCopy = cloneArray(e.numbers);
    if (calc(expNumbersCopy.shift()!, expNumbersCopy, canUseConcatenate).some(x => x === e.value)) {
      return acc + e.value;
    }
    return acc;
  }, 0);
}

async function partOne() {
  const expressions = (await getInput()).map(parseExpression);
  const f = summarizeValidExpressions(expressions);
  console.log(f)
}


async function partTwo() {
  const expressions = (await getInput()).map(parseExpression);
  const f = summarizeValidExpressions(expressions, true);
  console.log(f)
}
  
partOne();
partTwo();