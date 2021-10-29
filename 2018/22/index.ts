import { getInput } from '../../utils';
import { equals, Position, sum, toKey } from '../../utils/position';
import { KeyVal } from '../../utils/types';

enum RegionType {
  ROCKY = 0,
  WET = 1,
  NARROW = 2
}

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

function getType(erosionLevel:number):RegionType {
  switch (erosionLevel  % 3) {
    case 0:
      return RegionType.ROCKY;
    case 1:
      return RegionType.WET;
    case 2: 
      return RegionType.NARROW;
  }
  throw new Error('bad bad bad')
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
  const input = (await getInput()).map(Number);
}
  

partOne();