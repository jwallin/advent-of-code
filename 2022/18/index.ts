import { getInput } from '../../utils';

type Position3D = [
  x: number,
  y: number,
  z: number,
]

const sumPos = (p1: Position3D, p2: Position3D): Position3D => [p1[0] + p2[0], p1[1] + p2[1], p1[2] + p2[2]];

const ADJ: Position3D[] = [
  [-1, 0, 0],
  [1, 0, 0],
  [0, -1, 0],
  [0, 1, 0],
  [0, 0, -1],
  [0, 0, 1]
];

const tk = (p: Position3D): string => JSON.stringify(p);
const arrayEquals = <T>(a: T[], b: T[]): boolean => a.every((v, i) => v === b[i]);

async function partOne() {
  const input = (await getInput()).map<Position3D>(x => x.split(',').map(Number) as Position3D);
  const n = input.reduce((acc, cube) => {
    return acc + ADJ.map(x => sumPos(cube, x)).filter(x => !input.some(y => arrayEquals(x, y))).length;
  }, 0);
  console.log(n)
}
async function partTwo() { 
  const droplets = (await getInput()).map<Position3D>(x => x.split(',').map(Number) as Position3D);

  const [minPos, maxPos] = droplets.reduce<[Position3D, Position3D]>(([minAcc, maxAcc],  p) => {
    return [
      [Math.min(minAcc[0], p[0] - 1), Math.min(minAcc[1], p[1] - 1), Math.min(minAcc[2], p[2] - 1)],
      [Math.max(maxAcc[0], p[0] + 1), Math.max(maxAcc[1], p[1] + 1), Math.max(maxAcc[2], p[2] + 1)]
    ];
  }, [[Infinity, Infinity, Infinity], [0, 0, 0]]);

  const seen = new Set<string>();
  const q = [minPos];
  let val = 0;
  while (q.length) {
    const p = q.pop() as Position3D;
    if (seen.has(tk(p))){
      continue;
    }
    seen.add(tk(p));
    const neighbours = ADJ.map(x => sumPos(p, x)).filter(x => !seen.has(tk(x)));
    neighbours.forEach(nb => {
      if (nb[0] < minPos[0] || nb[1] < minPos[1] || nb[2] < minPos[2] || nb[0] > maxPos[0] || nb[1] > maxPos[1] || nb[2] > maxPos[2]) {
        return;
      }
      if (droplets.some(d => arrayEquals(d, nb))) {
        val++;
      } else {
        q.push(nb);
      }
    })
  }
console.log(val)
}

partOne();
partTwo();