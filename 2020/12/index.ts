import { getInput } from '../../utils';
import { Position, sum } from '../../utils/position';

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

function moveInDirection(pos: Position, dir: Position, steps: number): Position {
  return sum(pos, {x: dir.x * steps, y: dir.y * steps});
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

function applyInstructions(instructions:Instruction[], shipPos: Position, wayPoint:Position, moveWaypoint: boolean): Position {
  instructions.forEach(i => {
    if (i.direction === DIRECTION_FORWARD) {
      // Move ship forward to direction / waypoint
      shipPos = moveInDirection(shipPos, wayPoint, i.value);
    } else if (i.direction in DIRECTIONS) {
      // Move in direction withouth updating it
      const dir = DIRECTIONS[i.direction];
      if (moveWaypoint) {
        // Move waypoint in direction by x steps
        wayPoint = moveInDirection(wayPoint, dir, i.value);
      } else {
        // Move ship in direction by x steps
        shipPos = moveInDirection(shipPos, dir, i.value);
      }
    } else {
      // Rotate the waypoint / direction
      wayPoint = rotatePosition(wayPoint, LeftRight[i.direction], i.value);
    }
  });
  return shipPos;
}

async function partOne() {
  const instructions = (await getInput()).map(x => toInstruction(x));
  const currentPos: Position = { x: 0, y: 0 };
  const direction: Position = DIRECTIONS['E'];
  
  const shipPos = applyInstructions(instructions, currentPos, direction, false);
  console.log(Math.abs(shipPos.x) + Math.abs(shipPos.y));
}

async function partTwo() {
  const instructions = (await getInput()).map(x => toInstruction(x));
  const currentPos: Position = { x: 0, y: 0 };
  const wayPoint: Position = { x: 10, y: -1 };  // relative to ship
  
  const shipPos = applyInstructions(instructions, currentPos, wayPoint, true);
  console.log(Math.abs(shipPos.x) + Math.abs(shipPos.y));
}

partOne()
partTwo()