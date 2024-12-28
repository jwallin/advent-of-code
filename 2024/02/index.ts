import { getInput, spliceAndReturn } from '../../utils';

function allPermutations(n: number[]) {
  return n.map((c, i) => spliceAndReturn(n, i, 1));
}

function areAllincreasingOrDecreasingAndCloseDiff(n: number[], tolerance = 0):boolean {
  const dir = Math.sign(n[0] - n[1]);
  let safe = true;
  for (let i = 1; i < n.length; i++) {
    const diff = Math.abs(n[i - 1] - n[i]);
    const d = Math.sign(n[i - 1] - n[i]);
    if (d !== dir || diff > 3 || diff < 1) {
      safe = false;
      break;
    }
  }
  if (safe) {
    return true;
  } else if (tolerance > 0) {
    return allPermutations(n).some(r => areAllincreasingOrDecreasingAndCloseDiff(r, tolerance - 1));
  }
  return false;
}

async function partOne() {
  const reports = (await getInput()).map(x => x.split(' ').map(Number));
  const safeReports = reports.filter(r => areAllincreasingOrDecreasingAndCloseDiff(r));
  console.log(safeReports.length)
}

async function partTwo() {
  const reports = (await getInput()).map(x => x.split(' ').map(Number));
  const safeReports = reports.filter(r => areAllincreasingOrDecreasingAndCloseDiff(r, 1));
  console.log(safeReports.length)
}
  
partOne();
partTwo();