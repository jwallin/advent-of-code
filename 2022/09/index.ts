import { fillArray, getInput } from '../../utils';
import { ADJACENT_AND_DIAGONAL } from '../../utils/matrix';
import { equals, Position, sum, toKey } from '../../utils/position';

async function parseInput() {
  return (await getInput()).flatMap<Position>(x => {
    const [dir, dist] = x.split(' ');

    const p = parseDir(dir);
    const d = Number(dist);
    return fillArray(d, p);
  });
}

function parseDir(dir: string) {
  switch(dir) {
    case 'R':
      return {x: 1, y: 0};
    case 'U':
      return {x: 0, y: -1};
    case 'L':
      return {x: -1, y: 0};
    case 'D':
      return {x: 0, y: 1};
    default:
      throw new Error(`Could not parse direction ${dir}`);
  }
}

function nextTail(h: Position, t: Position): Position {
  const dist = {x: h.x - t.x, y: h.y - t.y};
  if (equals(h, t) || ADJACENT_AND_DIAGONAL.map(a => sum(a, t)).some(x => equals(h, x)))  {
    // Close enough, don't move
    return t;
  }
  if (Math.abs(dist.x) === 2 && dist.y === 0) {
    return {x: t.x + Math.sign(dist.x), y: t.y};
  } else if (Math.abs(dist.y) === 2 && dist.x === 0) {
    return {x: t.x, y: t.y + Math.sign(dist.y)};
  } else {
    // Move diagonally
    return {x: t.x + Math.sign(dist.x), y: t.y + Math.sign(dist.y)};
  }
}

function simulateRope(input: Position[], ropeLength: number) {
  const knots: Position[] = fillArray(ropeLength, { x: 0, y: 0 });

  return input.reduce((acc, d) => {
    let prevKnot: Position | undefined;
    for (let i = 0; i < knots.length; i++) {
      if (!prevKnot) {
        knots[i] = sum(knots[i], d);
      } else {
        knots[i] = nextTail(prevKnot, knots[i]);
      }
      prevKnot = knots[i];
    }
    return acc.add(toKey(knots[knots.length - 1]));
  }, new Set<string>());
}

async function partOne() {
  const input = await parseInput();

  const visited = simulateRope(input, 2);

  console.log(visited.size);
}


async function partTwo() {
  const input = await parseInput();

  const visited = simulateRope(input, 10);

  console.log(visited.size);
}
  
partOne();
partTwo();