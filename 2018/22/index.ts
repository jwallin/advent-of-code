import { getInput } from '../../utils';
import { equals, NEIGHBORS, Position, sum, toKey } from '../../utils/position';
import { KeyVal } from '../../utils/types';

const PADDING = 50;

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

type Node = {
  tool: Tool,
  position: Position,
};

type Edge = {
  node: Node,
  weight: number
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

  get target() {
    return this._target;
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

  const start:Node = { position: {x:0, y:0}, tool: Tool.TORCH };
  const dest:Node = { position: target, tool: Tool.TORCH};
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

function getNeighborsFunction(s: Scanner): (((p: Node) => Edge[])) {
  return function neighbors(p: Node): Edge[] {    
    const positions = NEIGHBORS
      .map(x => sum(x, p.position))
      .filter(z => z.y >= 0 && z.x >= 0)
      .filter(z => z.x < s.target.x + PADDING && z.y < s.target.y + PADDING);

    const currentPossibleTools = getPossibleTools(getType(s.getErosionLevel(p.position)));

    const g:Edge[] = positions
      .filter(q=> getPossibleTools(getType(s.getErosionLevel(q))).includes(p.tool))
      .map(position => ({node: {position, tool: p.tool}, weight: 1}))
      .concat({node: { position: p.position, tool: currentPossibleTools.find(x => x !== p.tool) as Tool}, weight: 7});
    
    return g;
  }
}

export const toToolAndPosKey = (p:Node):string => JSON.stringify(p);
export const fromToolAndPosKey = (str:string):Node => JSON.parse(str);

function dijkstra3d(start: Node, dest: Node, neighborsFn: (n: Node) => Edge[]): number | undefined {
  const nodes = new Set([toToolAndPosKey(start)]);
  const seenNodes = new Set([toToolAndPosKey(start)]);
  const distances = new Map<string, number>();

  const minBy = (cb: { (n: string): number; (arg0: string): number; }) => (a: string, b: string) => (cb(b) < cb(a) ? b : a);
  const getDist = (key: string): number => (distances.has(key) ? distances.get(key) as number : Infinity);

  distances.set(toToolAndPosKey(start), 0);

  while (nodes.size) {
    const closest = [...nodes].reduce(minBy((n:string) => getDist(n)));
    //console.log(fromToolAndPosKey(closest))
    if (dest && closest === toToolAndPosKey(dest)) {
      return distances.get(toToolAndPosKey(dest));
    }
    nodes.delete(closest);
    const neighbors = neighborsFn(fromToolAndPosKey(closest));
    neighbors.forEach((e:Edge) => {
      const k:string = toToolAndPosKey(e.node);
      if (!seenNodes.has(k)) {
        seenNodes.add(k);
        nodes.add(k);
      }

      //const cost = fromToolAndPosKey(closest).tool === n.tool ? 1 : 7;
      const alt = getDist(closest) + e.weight;
      if (alt < getDist(k)) {
        distances.set(k, alt);
      }
    });
  }
  return undefined;
}

partTwo();