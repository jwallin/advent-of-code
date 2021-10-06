import { X_OK } from 'constants';
import { getInput } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { Position, min, max, sum } from '../../utils/position';

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

function draw(input:Position[]) {
  const maxP = max(input);

  const a:string[][] = [];
  for (let y = 0; y <= maxP.y; y++) {
    a[y] = [];
    for (let x = 0; x <= maxP.x; x++) {
      a[y][x] = '';
    }
  }
  input.forEach(p => {
    a[p.y][p.x] = '#';
  });
  const m = new Matrix(a);
  return m.draw();
}

async function partOne() {
  const input = (await getInput()).map(parseInput);
  const m = new Matrix<string>();
  input.forEach(i => m.set(i.position, '#'))
  const topLeft = min(input.map(i => i.position))
  const coords = input.map(x => ({
    position: sum(x.position, topLeft),
    velocity: x.velocity
  }));
  draw(coords.map(c => c.position))
}

async function partTwo() {
  const input = (await getInput()).map(Number);
}
  

partOne();