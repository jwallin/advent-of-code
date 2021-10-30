import { getInput } from '../../utils';

type Nanobot = {
  x: number,
  y: number,
  z: number,
  radius: number
};

const manhattanDistance = (a: Nanobot, b: Nanobot): number => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);

const radiusOrder = (a:Nanobot, b:Nanobot) => Math.sign(b.radius - a.radius);

function parseNanobot(i: string): Nanobot {
  const f = i.match(/pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)/);
  const pos = f?.slice(1, 5).map(Number) as number[];
  return {
    x: pos[0],
    y: pos[1],
    z: pos[2],
    radius: Number(f?.[4])
  }
}

async function partOne() {
  const bots = (await getInput()).map(parseNanobot);
  const strongest = bots.sort(radiusOrder)[0];
  const inRange = bots.filter(x => manhattanDistance(strongest, x) <= strongest.radius);
  
  console.log(inRange.length);
}

async function partTwo() {
  const input = (await getInput()).map(Number);
}
  

partOne();