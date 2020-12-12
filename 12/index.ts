import { lines, sumPositions } from '../utils';
import { Position } from '../utils/types';

const DIRECTION_FORWARD = 'F';

const LeftRight:any = {
  L: -1,
  R: 1
};

enum OrdinalDirection {
  N = 'N',
  E = 'E',
  S = 'S',
  W = 'W'
};

type NavigationDirection = {
  [key: string]: Position
};

type Bearing = {
  [key: string]: number
};

const DIRECTIONS: NavigationDirection = {
  [OrdinalDirection.N]: { x: 0, y: -1 },    // N
  [OrdinalDirection.E]: { x: 1, y: 0 },     // E
  [OrdinalDirection.S]: { x: 0, y: 1 },     // S
  [OrdinalDirection.W]:  { x: -1, y: 0 },   // W
};

const BEARINGS:Bearing = {
  [OrdinalDirection.N]: 0,    // N
  [OrdinalDirection.E]: 90,   // E
  [OrdinalDirection.S]: 180,  // S
  [OrdinalDirection.W]:  270, // W
};

type Instruction = {
  direction: string
  value: number
}

function toInstruction(input: string): Instruction {
  const value = Number(input.substring(1));
  const direction = input.substring(0, 1);
  
  return {
    direction,
    value
  }
}

async function getInput():Promise<string[]> {
  return await lines('input.txt');
}

function moveInDirection(pos: Position, dir: Position, steps: number): Position {
  return {
    x: pos.x + dir.x * steps,
    y: pos.y + dir.y * steps
  };
}

function rotateWaypoint(pos: Position, dir:number, angle: number): Position {
  switch (angle) {
    case 90:
      return { x: pos.y * dir * -1, y: pos.x * dir };
    case 180: 
      return { x: -pos.x, y: -pos.y };
    case 270:
      return rotateWaypoint(pos, dir * -1, angle - 180);
    default:
      return pos;
  }
}

async function partOne() {
  const instructions = (await getInput()).map(x => toInstruction(x));
  let currentPos: Position = { x: 0, y: 0 };
  let direction = OrdinalDirection.E;
  
  instructions.forEach(i => {
    if (i.direction === DIRECTION_FORWARD) {
      // Move forward in saved direction
      console.log(`Move forward (${direction}) ${i.value} steps`);
      currentPos = moveInDirection(currentPos, DIRECTIONS[direction], i.value);
    } else if (i.direction in OrdinalDirection) {
      // Move in direction withouth updating it
      const dir = DIRECTIONS[i.direction];
      console.log(`Move ${i.direction} ${i.value} steps`);
      currentPos = moveInDirection(currentPos, dir, i.value);
    } else {
      // Left Rigth should turn ship and calculate new direction
      const angle = i.value * LeftRight[i.direction];
      const currentBearing = BEARINGS[direction];
      let nextBearing = (currentBearing + angle);
      if (nextBearing < 0) {
        nextBearing += 360;
      }
      nextBearing = nextBearing % 360;
      const nextDirection = Object.keys(OrdinalDirection).find(x => BEARINGS[x] === nextBearing);
      if (nextDirection === undefined) {
        throw new Error('Couldnt find direction')
      }
      console.log(`Going ${direction}, turning ${angle} deg to ${nextDirection}`);
      direction = OrdinalDirection[<OrdinalDirection>nextDirection];
    }
    console.log(currentPos)
  })
  console.log(Math.abs(currentPos.x) + Math.abs(currentPos.y));
}

async function partTwo() {
  const instructions = (await getInput()).map(x => toInstruction(x));
  let currentPos: Position = { x: 0, y: 0 };
  let wayPoint: Position = { x: 10, y: -1 };  // relative to ship
  
  instructions.forEach(i => {
    if (i.direction === DIRECTION_FORWARD) {
      currentPos = moveInDirection(currentPos, wayPoint, i.value);
    } else if (i.direction in OrdinalDirection) {
      // Move in direction withouth updating it
      const dir = DIRECTIONS[i.direction];
      wayPoint = moveInDirection(wayPoint, dir, i.value);
    } else {
      wayPoint = rotateWaypoint(wayPoint, LeftRight[i.direction], i.value);
    }
    console.log('Pos', currentPos, 'Waypoint', wayPoint);
  })
  console.log(Math.abs(currentPos.x) + Math.abs(currentPos.y));
}

partOne()