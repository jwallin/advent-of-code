import { getInput } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { Position, sum } from '../../utils/position';

function addPosition(m:Matrix<number>, p:Position, direction: Position) {
    const newP = sum(p, direction);
    const dist = Math.min(m.get(p) + 1, m.get(newP, Infinity));
    m.set(newP, dist);
    return newP;
}

async function partOneAndTwo() {
  const input = (await getInput())[0].split('');

  const m = new Matrix<number>();
  let p = {x: 1000, y: 1000};
  const stack:Position[] = [p];
  m.set(p, 0);

  input.forEach(x => {
    switch(x) {
      case 'W':
        p = addPosition(m, p, {x: -1, y: 0});
        break;
      case 'N':
        p = addPosition(m, p, {x: 0, y: -1});
        break;
      case 'E':
        p = addPosition(m, p, {x: 1, y: 0});
        break;
      case 'S':
        p = addPosition(m, p, {x: 0, y: 1});
        break;
      case '(':
        stack.push(p);
        break;
      case ')':
        p = stack.pop() as Position;
        break;
      case '|':
        p = stack[stack.length - 1];
        break;
      default:
        break;
    }
  });
  
  const distances = m.values().filter(x => x !== undefined).map(Number);
  console.log(Math.max(...distances));
  console.log(distances.filter(x => x >= 1000).length)
}

partOneAndTwo();