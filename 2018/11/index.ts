import { sum } from '../../utils';
import { Position, sum as sumPosition } from '../../utils/position';

const SIZE = 300;

function powerLevel(p:Position, serial:number) {
  const rackID = p.x + 10;
  let level = rackID * p.y;
  level += serial;
  level *= rackID;
  const vals = String(level).split('');
  return Number(vals[vals.length - 3] || 0) - 5;
}

function getTotalPower(p:Position, serial:number, size:number) {
  let s = 0;
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size ; y++) {
      s += powerLevel(sumPosition(p, {x, y}), serial);
    }
  }
  return s;
}

function fixedKadane(a: number[], k: number) {
  let maxSum = Number.MIN_VALUE;
  let maxIndex = -1;
  for (let i = 0; i < a.length - k; i++) {
    const s = a.slice(i, i + k).reduce(sum);
    if (s > maxSum) {
      maxSum = s;
      maxIndex = i;
    }
  }
  return [maxSum, maxIndex];
}

function getMatrix(serial: number, size: number) {
  const m:number[][] = [];
  for (let y = 0; y < size; y++) {
    m[y] = [];
    for (let x = 0; x < size; x++) {
      m[y][x] = powerLevel(sumPosition({x, y}, {x:1, y:1}), serial);
    }
  }
  return m;
}

function kadane2D(a:number[][]) {
  const preSum:number[][] = a.reduce<number[][]>((acc,y) => [...acc, y.slice()], []);
  for (let i = 1; i < preSum.length; i++) {
    for (let j = 0; j < preSum.length; j++) { 
      preSum[i][j] += preSum[i - 1][j];
    }
  }

  let maxSum = 0;
  let maxPos:Position = {x:-1, y: -1};
  let maxSize = 0;
  for (let yStart = 0; yStart < preSum.length; yStart++) {
    for (let yEnd = yStart; yEnd < preSum.length; yEnd++) {
      const sums:number[] = [];
      for (let i = 0; i < preSum.length; i++) {
        if (yStart > 0) {
          sums[i] = preSum[yEnd][i] - preSum[yStart - 1][i];
        } else {
          sums[i] = preSum[yEnd][i];
        }
      }

      const size = yEnd-yStart + 1;
      const [s, xStart] = fixedKadane(sums, size);
      if (s > maxSum) {
        maxSum = s;
        maxPos = {x: xStart + 1, y: yStart + 1}
        maxSize = size; 
      }
    }
  }
  return [maxPos.x, maxPos.y, maxSize];
}

function partOne(serial: number) {
  let maxPower = Number.MIN_VALUE;
  let maxCoord:Position = {x: -1, y: -1};
  const SQUARE_SIZE = 3;
  
  for (let x = 1; x <= SIZE - SQUARE_SIZE; x++) {
    for (let y = 1; y <= SIZE - SQUARE_SIZE; y++) {
      const total = getTotalPower({x, y}, serial, SQUARE_SIZE);
      
      if (total > maxPower) {
        maxPower = total;
        maxCoord = {x, y};
      }
    }
  }
  console.log(maxPower, maxCoord);
}

function partTwo(serial: number) {
  const m = getMatrix(serial, SIZE);
  console.log(kadane2D(m).join(','))
}


partTwo(8199);