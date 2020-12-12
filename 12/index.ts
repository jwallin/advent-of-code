import { lines } from '../utils';
import { Position } from '../utils/types';

const DIRECTION_FORWARD = 'F';

type Bearing = {
  [key: string]: 1 | -1
};

type NavigationDirection = {
  [key: string]: Position
};

type Instruction = {
  direction: string
  value: number
}

const LeftRight: Bearing = {
  L: -1,
  R: 1
};

const DIRECTIONS: NavigationDirection = {
  'N': { x: 0, y: -1 },    // N
  'E': { x: 1, y: 0 },     // E
  'S': { x: 0, y: 1 },     // S
  'W': { x: -1, y: 0 },    // W
};

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

function rotatePosition(pos: Position, dir:number, angle: number): Position {
  switch (angle) {
    case 90:
      return { x: pos.y * dir * -1, y: pos.x * dir };
    case 180: 
      return { x: -pos.x, y: -pos.y };
    case 270:
      return rotatePosition(pos, dir * -1, angle - 180);
    default:
      return pos;
  }
}

async function partOne() {
  const instructions = (await getInput()).map(x => toInstruction(x));
  let currentPos: Position = { x: 0, y: 0 };
  let direction: Position = DIRECTIONS['E'];
  
  instructions.forEach(i => {
    if (i.direction === DIRECTION_FORWARD) {
      // Move forward in saved direction
      currentPos = moveInDirection(currentPos, direction, i.value);
    } else if (i.direction in DIRECTIONS) {
      // Move in direction withouth updating it
      const d = DIRECTIONS[i.direction];
      currentPos = moveInDirection(currentPos, d, i.value);
    } else {
      // Left & Right should turn ship and calculate new direction
      direction = rotatePosition(direction, LeftRight[i.direction], i.value);
    }
  });
  console.log(Math.abs(currentPos.x) + Math.abs(currentPos.y));
}

async function partTwo() {
  const instructions = (await getInput()).map(x => toInstruction(x));
  let currentPos: Position = { x: 0, y: 0 };
  let wayPoint: Position = { x: 10, y: -1 };  // relative to ship
  
  instructions.forEach(i => {
    if (i.direction === DIRECTION_FORWARD) {
      currentPos = moveInDirection(currentPos, wayPoint, i.value);
    } else if (i.direction in DIRECTIONS) {
      // Move in direction withouth updating it
      const dir = DIRECTIONS[i.direction];
      wayPoint = moveInDirection(wayPoint, dir, i.value);
    } else {
      wayPoint = rotatePosition(wayPoint, LeftRight[i.direction], i.value);
    }
  });
  console.log(Math.abs(currentPos.x) + Math.abs(currentPos.y));
}

partOne()
partTwo()