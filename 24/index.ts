import { getInput, Position, sumPositions, minPosition, maxPosition } from '../utils';

const DIRECTIONS = ['e', 'se', 'sw', 'w', 'nw', 'ne'];

function isOdd(n:number):boolean {
  return n % 2 !== 0;
}

function getNextPos(dir: string, current: Position):Position {
  // Odd-row matrix layout
  switch (dir) {
    case 'e': 
      return sumPositions({ x: 1, y: 0 }, current);

    case 'w':
      return sumPositions({ x: -1, y: 0 }, current);

    case 'nw':
      return sumPositions({ x: isOdd(current.y) ? 0 : -1, y: -1 }, current);
      
    case 'sw':
      return sumPositions({ x: isOdd(current.y) ? 0 : -1, y: 1 }, current);
      
    case 'ne': 
      return sumPositions({ x: isOdd(current.y) ? 1 : 0, y: -1 }, current);

    case 'se':
      return sumPositions({ x: isOdd(current.y) ? 1 : 0, y: 1 }, current);
  }
  throw new Error(`Couldnt find direction ${dir}`);
}

function getTiles(input:string[]):string[][] {
  return input.map(x => {
    const dirs = [];
    while (x.length > 0) {
      const d = DIRECTIONS.find(d => x.startsWith(d)) as string;
      dirs.push(d);
      x = x.substr(d.length);  
    }
    return dirs;
  });
}

function toKey(p:Position):string {
  return JSON.stringify(p);
}

function fromKey(str:string):Position {
  return JSON.parse(str);
}

function walkTiles(input: string[]):Position {
  return input.reduce((acc, dir) => getNextPos(dir, acc), { x: 0, y: 0 });
}

function getNeighbors(p:Position):Position[] {
  return DIRECTIONS.map((dir) => getNextPos(dir, p));
}

type Floor = Map<string, boolean>;

function flipFloor(floor: Floor): Floor {
  const min = minPosition([...floor.keys()].map(k => fromKey(k)));
  const max = maxPosition([...floor.keys()].map(k => fromKey(k)));

  // Extrapolate floor
  for (let x = min.x - 1; x <= max.x + 1; x++) {
    for (let y = min.y - 1; y <= max.y + 1; y++) {
      const key = toKey({x, y});
      if (!floor.has(key)) {
        floor.set(key, false);
      }
    }
  }
  return [...floor.entries()].reduce((prev, [key, val]) => {
    const pos = fromKey(key);
    const neighbors = getNeighbors(pos).map(n => floor.get(toKey(n)));
    const blackNeighbours = neighbors.filter(x => x === true).length;

    let newValue = val;
    if (val && (blackNeighbours === 0 || blackNeighbours > 2)) {
      newValue = false;
    } else if (!val && blackNeighbours === 2) {
      newValue = true;
    }
    return prev.set(key, newValue);
  }, new Map<string, boolean>());
}

function getBlackTiles(tiles:string[][]) {
  return tiles.map(walkTiles).reduce((acc, t) => {
    const key = toKey(t);
    return acc.set(key, acc.has(key) ? !acc.get(key) : true);
  }, new Map<string, boolean>());
}

async function partOne() {
  const input = await getInput();
  const tiles = getTiles(input);

  const floor = getBlackTiles(tiles);
  console.log([...floor.values()].filter(x => x === true).length)
}

async function partTwo() {
  const input = await getInput();
  const tiles = getTiles(input);

  let floor = getBlackTiles(tiles);

  const DAYS = 100;
  for (let i = 0; i < DAYS; i++ ) {
    floor = flipFloor(floor);
  }

  console.log([...floor.values()].filter(x => x === true).length)
}

partTwo();