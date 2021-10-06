import { getInput } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { Position, min, max, sum, multiply, area } from '../../utils/position';

type Particle = {
  position: Position,
  velocity: Position
};

function parseInput(input: string): Particle {
  const regex = /^position=<\s?(-?\d+), \s?(-?\d+)> velocity=<\s?(-?\d+), \s?(-?\d+)>/;
  const m = input.match(regex);
  if (!m) {
    throw new Error(`Couldnt parse input: ${input}`);
  }
  const [,px, py, vx, vy] = m.map(Number);
  return {
    position: {x: px, y: py},
    velocity: {x: vx, y: vy}
  };
}

function transpose(input: Position[]) {
  const topLeft = min(input);
  return input.map(i => sum(i, multiply(topLeft, { x: -1, y: -1 })));
}

function draw(input:Position[]) {
  const positions = transpose(input);
  const maxP = max(positions);
  
  const a:string[][] = [];
  for (let y = 0; y <= maxP.y; y++) {
    a[y] = [];
    for (let x = 0; x <= maxP.x; x++) {
      a[y][x] = ' ';
    }
  }
  positions.forEach(p => {
    a[p.y][p.x] = '#';
  });
  const m = new Matrix(a);
  return m.draw();
}

function getArea(positions: Position[]) {
  const maxP = max(positions);
  const minP = min(positions);
  return area(minP, maxP);
}

async function solution() {
  const coords = (await getInput()).map(parseInput);
  let prevPositions = coords.map(c => c.position);
  let prevArea = getArea(prevPositions);
  let seconds = 0;
  while(true) {
    coords.forEach(c => c.position = sum(c.position, c.velocity));
    const positions = coords.map(c => c.position);
    if (getArea(positions) > prevArea) {
      break;
    }
    prevPositions = positions;
    prevArea = getArea(positions);
    seconds++;
  }

  console.log(draw(prevPositions));
  console.log(seconds);
}

solution();