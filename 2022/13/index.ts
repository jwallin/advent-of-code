import { getInput, multiply, splitArrayBy } from '../../utils';

type ValueOrArray<T> = T | ValueOrArray<T>[];
type NestedNumberArray = ValueOrArray<number>;

type Comparison = boolean | undefined; 

function isInRightOrder(left:  NestedNumberArray, right: NestedNumberArray): Comparison {
  if (typeof left === 'number' && typeof right === 'number') {
    if (left === right) {
      return undefined;
    }
    return left < right;
  }

  const leftArr = [left].flat();
  const rightArr = [right].flat();
  
  for (let i = 0; i < leftArr.length; i++) {
    if (i >= rightArr.length) {
      return false;
    }
    const corr = isInRightOrder(leftArr[i], rightArr[i]);
    if (corr === undefined) {
      continue;
    }
    return corr;
  }
  if (leftArr.length < rightArr.length) {
    return true;
  }
  return undefined;
}

function bubbleSort(a: NestedNumberArray[]) {
  let swapped: boolean;
  do {
    swapped = false;
    for (let i = 0; i < a.length - 1; i++) {
      if (!isInRightOrder(a[i], a[i + 1])) {
        //Swap
        const tmp = a[i];
        a[i] = a[i + 1];
        a[i + 1] = tmp;
        swapped = true;
      }
    }
  } while (swapped);
}

async function partOne() {
  const input = splitArrayBy(await getInput(), '').map(x => x.map(y => JSON.parse(y))) as [NestedNumberArray, NestedNumberArray][];
  const sum = input.reduce((acc, [left, right], i) => {
    if (isInRightOrder(left, right)) {
      return acc + i + 1;
    }
    return acc;
  }, 0);
  console.log(sum)
}

async function partTwo() {
  const input = (await getInput()).filter(x => x.length > 0).map(y => JSON.parse(y)) as NestedNumberArray[];
  const dividers = [[[2]],  [[6]]];
  input.push(...dividers)
  bubbleSort(input);
  console.log(dividers.map(d => input.indexOf(d) + 1).reduce(multiply))
}

partOne();
partTwo();