import { getInput } from '../../utils';
import { Position } from '../../utils/position';

type Instruction = [string, number];

function parse(s: string) {
  const [i, n] = s.split(' ');
  return [i, Number(n)] as Instruction;
}

async function partOne() {
  const input = (await getInput()).map(parse);
  const p: Position = {x: 0, y:0};
  input.forEach(r => {
    switch (r[0]) {
      case 'forward':
        p.x += r[1];
        break;
      case 'down':
        p.y += r[1];
        break;
      case 'up':
        p.y -= r[1];
        break;
    }
  });
  console.log(p);
  console.log(p.x * p.y)
}

async function partTwo() {
  const input = (await getInput()).map(parse);
  const p: Position = {x: 0, y:0};
  let aim = 0;
  input.forEach(r => {
    switch (r[0]) {
      case 'forward':
        p.x += r[1];
        p.y += aim * r[1];
        break;
      case 'down':
        aim += r[1];
        break;
      case 'up':
        aim -= r[1];
        break;
    }
  });
  console.log(p);
  console.log(p.x * p.y)
}
  

partTwo();