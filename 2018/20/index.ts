import { getInput } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { sum } from '../../utils/position';


async function partOne() {
  const input = (await getInput())[0].split('');
  let p = {x: 10, y: 10};
  input.shift();
  input.pop();
  const m = new Matrix<string>();
  m.set(p, 'X');
  input.forEach(x => {
    switch(x) {
      case 'W':
        p = sum(p, {x: -1, y: 0});
        m.set(p, '|');
        p = sum(p, {x: -1, y: 0});
        m.set(p, '.');
        break;
      case 'N':
        p = sum(p, {x: 0, y: -1});
        m.set(p, '-');
        p = sum(p, {x: 0, y: -1});
        m.set(p, '.');
        break;
      case 'E':
        p = sum(p, {x: 1, y: 0});
        m.set(p, '|');
        p = sum(p, {x: 1, y: 0});
        m.set(p, '.');
        break;
      case 'A':
        p = sum(p, {x: 0, y: 1});
        m.set(p, '-');
        p = sum(p, {x: 0, y: 1});
        m.set(p, '.');
        break;
    }
  });

  console.log(m.draw())
}

async function partTwo() {
  const input = (await getInput()).map(Number);
}
  

partOne();