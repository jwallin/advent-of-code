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
  const input = (await getInput()).map(x => x.split(''));
  const matrix = new Matrix(input);
  const dir =  Object.keys(DIRECTIONS);

  const candidateObstacles = matrix.asArray().filter(x => matrix.has(x) && matrix.get(x) === '.');
  let count = 0;
  candidateObstacles.forEach(c => {

    const m = matrix.clone();
    let direction = '^';
    let guard = m.positionsWithValue('^')[0];

    const visited = new Set<string>();
    visited.add(direction + toKey(guard))

    m.set(c, '#')
    
    let isLoop = false;
    while (m.has(guard) && isLoop === false) {
      
      //Traverse 
      let view = sum(guard, DIRECTIONS[direction]);
      while (m.has(view) && m.get(view) === '#') {
        direction = dir[(dir.indexOf(direction) + 1) % dir.length];
        view = sum(guard, DIRECTIONS[direction]);
      }

      m.set(guard, direction);
      const visitedKey = direction + toKey(view);
      if (visited.has(visitedKey)) {
        count++;
        isLoop = true;
        break;
      }
      if (m.has(view)) {
        visited.add(visitedKey);
      }
      guard = view;
    }
  });
  console.log(count)
}

partOne();
partTwo();