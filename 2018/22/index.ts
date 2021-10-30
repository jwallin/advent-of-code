import { getInput } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { equals, Position, readingOrder, sum, toKey } from '../../utils/position';
import { KeyVal } from '../../utils/types';

enum RegionType {
  ROCKY = 0,
  WET = 1,
  NARROW = 2
}

enum Tool {
  CLIMBING_GEAR,
  TORCH,
  NEITHER
}

type ToolAndPosition = {
  tool: Tool,
  position: Position
};

class Scanner {
  private _target: Position;
  private _depth: number
  private _erosionLevels:KeyVal<number>;

  constructor(depth: number, target: Position) {
    this._target = target;
    this._depth = depth;
    this._erosionLevels = {};
  }

  getGeologicIndex(p: Position):number {
    if (equals(p, {x: 0, y: 0})) {
      return 0;
    }
    if (equals(p, this._target)) {
      return 0;
    }
    if (p.y === 0) {
      return p.x * 16807;
    }
    if (p.x === 0) {
      return p.y * 48271;
    }
    return this.getErosionLevel(sum(p, {x: -1, y: 0})) * this.getErosionLevel(sum(p, {x: 0, y: -1}));
  }

  getErosionLevel(p:Position):number {
    if (this._erosionLevels[toKey(p)] === undefined) {
      this._erosionLevels[toKey(p)] = (this.getGeologicIndex(p) + this._depth) % 20183;
    }
    return this._erosionLevels[toKey(p)];
  }
}

function parseInput(i: string[]):[number, Position] {
  const depth = Number(i.find(x => x.startsWith('depth'))?.split(' ')[1]);
  const [x, y] = i.find(x => x.startsWith('target'))?.split(' ')[1].split(',').map(Number) as number[];
  return [depth, {x, y}];
}

function getType(erosionLevel:number): RegionType {
  return erosionLevel  % 3;
}

function typeToString(type: RegionType): string {
  switch (type) {
    case RegionType.NARROW:
      return '|';
    case RegionType.WET:
      return '=';
    case RegionType.ROCKY:
      return '.';
  }
  throw new Error('Unknown type');
}

async function partOne() {
  const [depth, target] = parseInput(await getInput());
  
  const s = new Scanner(depth, target);

  let totalRisk = 0;
  for (let y = 0; y <= target.y; y++) {
    for (let x = 0; x <= target.x; x++) {
      totalRisk += getType(s.getErosionLevel({x, y}));
    }
  }
  console.log(totalRisk)
}

async function partTwo() {
  const [depth, target] = parseInput(await getInput());
  
  const s = new Scanner(depth, target);
  /*
  const m = new Matrix<string>();
  for (let y = 0; y <= target.y; y++) {
    for (let x = 0; x <= target.x; x++) {
      m.set({x,y}, typeToString(getType(s.getErosionLevel({x, y}))));
    }
  }

  console.log(m.toString());*/

  const start:ToolAndPosition = { position: {x:0, y:0}, tool: Tool.TORCH };
  const dest:ToolAndPosition = { position: target, tool: Tool.TORCH};
  const a = dijkstra3d(start, dest, getNeighborsFunction(s));
  console.log(a)
}

function getPossibleTools(type: RegionType): Tool[] {
  switch (type) {
    case RegionType.NARROW:
      return [Tool.TORCH, Tool.NEITHER];
    case RegionType.WET:
      return [Tool.CLIMBING_GEAR, Tool.NEITHER];
    case RegionType.ROCKY:
      return [Tool.CLIMBING_GEAR, Tool.TORCH];
  }
  throw new Error('Unknown type ' + type);
}

// Move to Position.ts
const NEIGHBORS: Position[] =[
  { x: 0, y: -1 },  // N
  { x: 1, y: 0 },   // E
  { x: 0, y: 1 },   // S
  { x: -1, y: 0 },  // W
];


function getNeighborsFunction(s: Scanner): (((p: ToolAndPosition) => ToolAndPosition[])) {
  return function neighbors(p: ToolAndPosition): ToolAndPosition[] {    
    const {x, y} = p.position;
    const positions = NEIGHBORS.map(x => sum(x, p.position)).filter(z => z.y >= 0 && z.x >= 0);

    const g = positions.flatMap(p => {
      const poss = getPossibleTools(getType(s.getErosionLevel({x, y})));
      return poss.map<ToolAndPosition>(t => ({position: p, tool: t}));
    });
    return g;
  }
}

/*
function closest(from: Position, candidates: Position[], m: Matrix): Position | undefined {
  const nextDistances = candidates.map(x => {
    return dijkstra(from, x, (node) => neighbors(node).filter(p => m.get(p) === OPEN || equals(p, x))
    ) || Infinity;
  });
  const minDistance = Math.min(...nextDistances);
  if (minDistance === Infinity) {
    return undefined;
  }
  const c = nextDistances.reduce<number[]>((acc, v, i) => {
    if (v === minDistance) {
      return [...acc, i];
    }
    return acc;
  }, []).map(i => candidates[i]).sort(readingOrder);
  return c[0];
}*/

export const toToolAndPosKey = (p:ToolAndPosition):string => JSON.stringify(p);
export const fromToolAndPosKey = (str:string):ToolAndPosition => JSON.parse(str);

function dijkstra3d(start: ToolAndPosition, dest: ToolAndPosition, neighborsFn: (n: ToolAndPosition) => ToolAndPosition[]): number | undefined {
  const nodes = new Set([toToolAndPosKey(start)]);
  const seenNodes = new Set([toToolAndPosKey(start)]);
  const distances = new Map<string, number>();

  const minBy = (cb: { (n: string): number; (arg0: string): number; }) => (a: string, b: string) => (cb(b) < cb(a) ? b : a);
  const getDist = (key: string): number => (distances.has(key) ? distances.get(key) as number : Infinity);

  distances.set(toToolAndPosKey(start), 0);

  while (nodes.size) {
    const closest = [...nodes].reduce(minBy((n:string) => getDist(n)));
    console.log(fromToolAndPosKey(closest).position)
    if (dest && closest === toToolAndPosKey(dest)) {
      return distances.get(toToolAndPosKey(dest));
    }
    nodes.delete(closest);
    const neighbors = neighborsFn(fromToolAndPosKey(closest));
    neighbors.forEach((n:ToolAndPosition) => {
      const k:string = toToolAndPosKey(n);
      if (!seenNodes.has(k)) {
        seenNodes.add(k);
        nodes.add(k);
      }

      const cost = fromToolAndPosKey(closest).tool === n.tool ? 0 : 7;
      const alt = getDist(closest) + 1 + cost;
      if (alt < getDist(k)) {
        distances.set(k, alt);
      }
    });
  }
  return undefined;
}

partTwo();