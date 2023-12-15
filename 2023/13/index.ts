import { arrayEquals, getInput, splitArrayBy } from '../../utils';
import { Matrix } from '../../utils/matrix';

function findMirrorLine(arr: string[][], checkMirrorStrategy: (arr: string[][], i: number) => boolean) {
  for (let i = 0; i < arr.length - 1; i++) {
    // Find two identical rows
    if (checkMirrorStrategy(arr, i)) {
      return i + 1;
    }
  }
  return 0;
}

function arrayCopy(arr: string[][]): string[][] {
  return arr.slice().map(a => a.slice());
}

function isMirrored(arr: string[][], start: number, fixed = true) {
  let a = start;
  let b = start + 1;
  while (a >= 0 && b < arr.length) {
    if (!arrayEquals(arr[a], arr[b])) {
      if (fixed) {
        return false;
      }
      const d = arrayDiffs(arr[a], arr[b]);
      if (d.length === 1) {
        arr[a][d[0]] = arr[b][d[0]];
        fixed = true;
      } else {
        return false;
      }
    }
    a--;
    b++;
  }
  return true;
}

function arrayDiffs(a: string[], b: string[]) {
  return a.map((v, i) => i).filter(x => a[x] !== b[x]);
}

function isAlmostMirrored(arr: string[][], start: number) {
  if (isMirrored(arr, start)) {
    return false;
  }
  
  return isMirrored(arr, start, false);
}

async function calculateMirrorLineSum(checkMirrorStrategy: (arr: string[][], i: number) => boolean) {
  const input = splitArrayBy((await getInput()), '').map(x => x.map(y => y.split(''))).map(x => new Matrix(x));
  const sum = input.reduce((sum, m) => {
    sum += findMirrorLine(m.columns, checkMirrorStrategy);
    sum += findMirrorLine(m.rows, checkMirrorStrategy) * 100;
    return sum;
  }, 0);
  return sum;
}

async function partOne() {
  const sum = await calculateMirrorLineSum(((arr, i) => isMirrored(arr, i,)));
  console.log(sum)
}

async function partTwo() {
  const sum = await calculateMirrorLineSum((arr, i) => isAlmostMirrored(arrayCopy(arr), i));
  console.log(sum)
}
  
partOne();
partTwo();