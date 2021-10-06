import { getInput } from '../../utils';
import { Position } from '../../utils/position';

function powerLevel(p:Position, serial:number) {
  const rackID = p.x + 10;
  let level = rackID * p.y;
  level += serial;
  level *= rackID;
  const vals = String(level).split('');
  return Number(vals[vals.length - 3] || 0) - 5;
}

async function partOne() {
  const input = (await getInput()).map(Number);
  console.log(powerLevel({x: 101, y: 153}, 71))
}

async function partTwo() {
  const input = (await getInput()).map(Number);
}
  

partOne();