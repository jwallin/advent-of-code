import { getInput } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { Position, sum } from '../../utils/position';

function move(m:Matrix<string>, toMove: string, move:Position): Matrix<string> {

  const nextM = m.clone();

  m.asArray().forEach(p => {
    const v = m.get(p);

    if (v !== toMove) {
      return;
    }

    const newPos = sum(p, move);

    if (newPos.x > m.maxPos().x) {
      newPos.x = 0;
    }
    if (newPos.y > m.maxPos().y) {
      newPos.y = 0;
    }

    if (m.get(newPos) === '.') {
      // Move 
      nextM.set(p, '.');
      nextM.set(newPos, v);
    }
  });

  return nextM;
}

function step(m:Matrix<string>):Matrix<string> {
  let nextM = move(m, '>', {x: 1, y: 0});
  nextM = move(nextM, 'v', {x: 0, y: 1});
  return nextM;
}

async function partOne() {
  const input = (await getInput()).map(x => x.split(''));
  const m = new Matrix(input);

  let nextM = m;
  let prevM;

  for (let i = 1; i < 5000; i++) {
    prevM = nextM;
    nextM = step(nextM);
    if (nextM.equals(prevM)) {
      console.log(`Cucumbers stopped moving after ${i} steps`);
      break;
    }
  }
}

partOne();