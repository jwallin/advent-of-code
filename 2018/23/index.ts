import { getInput } from '../../utils';

type Position3D = {
  x: number,
  y: number,
  z: number,
}

type Nanobot = {
  pos: Position3D,
  radius: number
};

const zero:Position3D = {x: 0, y: 0, z: 0};

const manhattanDistance = (a: Position3D, b: Position3D = zero): number => Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
const radiusOrder = (a:Nanobot, b:Nanobot) => Math.sign(b.radius - a.radius);
const max = (input:Position3D[]):Position3D => input.reduce((prev, curr) => ({ x: Math.max(prev.x, curr.x), y: Math.max(prev.y, curr.y), z: Math.max(prev.z, curr.z) }));
const min = (input:Position3D[]):Position3D => input.reduce((prev, curr) => ({ x: Math.min(prev.x, curr.x), y: Math.min(prev.y, curr.y), z: Math.min(prev.z, curr.z) }));

function parseNanobot(i: string): Nanobot {
  const f = i.match(/pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)/);
  const pos = f?.slice(1, 5).map(Number) as number[];
  return {
    pos: {
      x: pos[0],
      y: pos[1],
      z: pos[2],
    },
    radius: Number(f?.[4])
  }
}

async function partOne() {
  const bots = (await getInput()).map(parseNanobot);
  const strongest = bots.sort(radiusOrder)[0];
  const inRange = bots.filter(x => manhattanDistance(strongest.pos, x.pos) <= strongest.radius);
  
  console.log(inRange.length);
}



async function partTwo() {
  const bots = (await getInput()).map(parseNanobot);

  let minP = min(bots.map(p => p.pos));
  let maxP = max(bots.map(p => p.pos));

  let gridSize = maxP.x - minP.x;
  let bestGrid: Position3D = zero;

  while (gridSize > 0) {
    let maxCount = 0;
    for (let x = minP.x; x <= maxP.x; x += gridSize ) {
      for (let y = minP.y; y <= maxP.y; y += gridSize ) {
        for (let z = minP.z; z <= maxP.z; z += gridSize ) {
          const curPos = {x, y, z};
          const botsInRange = bots.filter(b => manhattanDistance(curPos, b.pos) - b.radius < gridSize).length;
          
          if (botsInRange > maxCount) {
            console.log(gridSize, curPos, botsInRange)
            maxCount = botsInRange;
            bestGrid = curPos;
          } else if (botsInRange === maxCount && manhattanDistance(curPos) < manhattanDistance(bestGrid)) {
            bestGrid = curPos;
          }
        }
      }  
    }
    minP = {x: bestGrid.x - gridSize, y: bestGrid.y - gridSize, z: bestGrid.z - gridSize};
    maxP = {x: bestGrid.x + gridSize, y: bestGrid.y + gridSize, z: bestGrid.z + gridSize};
    console.log(gridSize, bestGrid)
    gridSize = Math.floor(gridSize / 2);
  }
  
  console.log(bestGrid)
  console.log(manhattanDistance(bestGrid))
}
  
  
partTwo();