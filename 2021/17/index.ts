import { getInput } from '../../utils';
import { Position, sum, toKey } from '../../utils/position';

class Probe {
  public position:Position;
  public velocity:Position;
  private maxY: number;
  private from: Position;
  private to: Position;

  constructor(velocity:Position, from: Position, to: Position) {
    this.velocity = velocity;
    this.position = {x: 0, y: 0};
    this.maxY = -1;
    this.from = from;
    this.to = to;
  }

  step() {
    this.position = sum(this.position, this.velocity);
    this.velocity = sum(this.velocity, {x: -Math.sign(this.velocity.x), y: -1});
  }

  dead() {
    return this.velocity.x === 0 && (this.position.y < this.from.y || this.position.x > this.to.x || this.position.x < this.from.x)
  }

  isHit() {
    return this.position.x >= this.from.x && this.position.x <= this.to.x &&
      this.position.y >= this.from.y && this.position.y <= this.to.y;
  }
}

function getMaxY(vel: Position, from: Position, to: Position): number {
  const probe = new Probe(vel, from, to);
  let maxY = -1;
  while (!probe.dead()) {
    probe.step();
    maxY = Math.max(maxY, probe.position.y);
    if (probe.isHit()) {
      console.log('Hit!', vel.x, vel.y);
      return maxY;
    }
  }
  return -1;
}

function parseInput(s:string):[Position, Position] {
  const res = s.match(/x=(?<x1>-?\d+)..(?<x2>-?\d+), y=(?<y1>-?\d+)..(?<y2>-?\d+)/)
  if (!res?.groups) {
    throw new Error('invalid input')
  }
  const {x1,x2, y1, y2} = res.groups;
  return [
    {x: Number(x1), y: Number(y1)},
    {x: Number(x2), y: Number(y2)}
  ];
}

async function partOne() {
  const [from, to] = (await getInput()).map(parseInput)[0];
  let maxY = -1;
  
  for (let x = 1; x < to.x; x++) {
    for (let y = 0; y < 1000; y++) {
      maxY = Math.max(maxY, getMaxY({x, y}, from, to));
    } 
  }
  
  console.log(maxY)
}

async function partTwo() {
  const [from, to] = (await getInput()).map(parseInput)[0];
  const velocities = new Set<string>()
  
  for (let x = 0; x <= to.x; x++) {
    for (let y = Math.min(from.y, 0); y < 1000; y++) {
      const probe = new Probe({x, y}, from, to);
      let maxY = -1;
      while (!probe.dead()) {
        probe.step();
        maxY = Math.max(maxY, probe.position.y);
        if (probe.isHit()) {
          velocities.add(toKey({x,y}))
          break;
        }
      }
    } 
  }
  
  console.log(velocities.size)
}

partTwo();