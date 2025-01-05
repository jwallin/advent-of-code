import { getInput } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { Position, sum, toKey } from '../../utils/position';
import { KeyVal } from '../../utils/types';

const DIRECTIONS:KeyVal<Position> = {
  '^': {x: 0, y: -1},
  '>': {x: 1, y: 0},
  'v': {x: 0, y: 1},
  '<': {x: -1, y: 0}
};

async function partOne() {
  const input = (await getInput()).map(x => x.split(''));
  const m = new Matrix(input);
  let direction = '^';
  let guard = m.positionsWithValue('^')[0];
  const dir =  Object.keys(DIRECTIONS);

  const visited = new Set<string>();
  visited.add(toKey(guard))

  while (m.has(guard)) {
    //Traverse 
    let view = sum(guard, DIRECTIONS[direction]);
    while (m.has(view) && m.get(view) === '#') {
      console.log((dir.indexOf(direction) + 1) % dir.length)
      direction = dir[(dir.indexOf(direction) + 1) % dir.length];
      
      view = sum(guard, DIRECTIONS[direction]);
    }
    m.set(guard, '.');
    if (m.has(view)) {
      m.set(view, direction);
      visited.add(toKey(view));
    }
    guard = view;
  }
  console.log(visited.size)
}

async function partTwo() {
  const input = (await getInput()).map(Number);
}
  

partOne();