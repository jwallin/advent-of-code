import { Matrix } from '../../utils/matrix';
import { Position, sum } from '../../utils/position';

function powerLevel(p:Position, serial:number) {
  const rackID = p.x + 10;
  let level = rackID * p.y;
  level += serial;
  level *= rackID;
  const vals = String(level).split('');
  return Number(vals[vals.length - 3] || 0) - 5;
}

function getTotalPower(p:Position, serial:number) {
  let s = 0;
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3 ; y++) {
      s += powerLevel(sum(p, {x, y}), serial);
    }
  }
  return s;
}

async function partOne(serial: number) {
  const m = new Matrix<number>();
  let maxPower = 0;
  let maxCoord:Position = {x:-1, y: -1};
  
  for (let x = 1; x <= 300 - 3; x++) {
    for (let y = 1; y <= 300 - 3; y++) {
      const total = getTotalPower({x, y}, serial);
      
      if (total > maxPower) {
        maxPower = total;
        maxCoord = {x, y};
      }
    }
  }
  console.log(maxPower, maxCoord);
}

async function partTwo() {
  
}
  

partOne(8199);