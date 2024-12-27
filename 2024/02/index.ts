import { getInput } from '../../utils';

function areAllincreasingOrDecreasing(n: number[], tolerance = 0) {
  let dir: number | undefined;
  for (let i = 1; i < n.length; i++) {
    const d = Math.sign(n[i] - n[i - 1]);
    if (i === 1) {
      dir = d;
    } else if (d !== dir) {
      if (tolerance > 0) {
        n.splice(i, 1);
        tolerance--;
        i--;
      } else {
        return false;
      }
    }
  }
  return true;
}

function isCloseDiff(n: number[], tolerance = 0) {
  for (let i = 1; i < n.length; i++) {
    const diff = Math.abs(n[i] - n[i - 1]);
    if (diff > 3) { 
      if (tolerance > 0) {
        n.splice(i, 1);
        tolerance--;
        i--;
      } else {
        return false;
      }
    }
  }
  return true;
}

async function partOne() {
  const reports = (await getInput()).map(x => x.split(' ').map(Number));
  const safeReports = reports.filter(r => areAllincreasingOrDecreasing(r) && isCloseDiff(r));
  console.log(safeReports.length)
}

async function partTwo() {
  const reports = (await getInput()).map(x => x.split(' ').map(Number));
  const safeReports = reports.filter(r => areAllincreasingOrDecreasing(r, 1) && isCloseDiff(r, 1));
  console.log(safeReports) 
}
  

partTwo();