import { getInput, toChars, unique, nestedLoops } from '../utils';

const DIM_NAMES = ['x', 'y', 'z', 'w'];
const NUM_CYCLES = 6;

interface Position {
  [key: string]: number
}

type CubeMap = Map<string, boolean>;

async function getMap(dimensions: number = 3):Promise<CubeMap> {
  const map = new Map<string, boolean>();
  const input = (await getInput()).map(toChars);
  for(let y = 0; y < input.length; y++) {
    for(let x = 0; x < input[y].length; x++) {
      const o = DIM_NAMES.slice(2, dimensions).reduce((prev, curr) => ({...prev, [curr]: 0}), {x, y});
      map.set(JSON.stringify(o), input[y][x] === '#');
    }
  }
  return map;
}

const sumPosition = (a: Position, b:Position): Position => Object.keys(a).reduce((acc, curr) => Object.assign(acc, {[curr]: a[curr] + b[curr]}), {});

function getNeighbors(pos: Position, neighborValues: Position[]): Position[] {
  return neighborValues.map(d => sumPosition(d, pos));
}

function getNeighborValues(dimensions: number):Position[] {
  const VALS = [-1, 0, 1];
  const props = [...nestedLoops(VALS.length, dimensions)].map(x => x.reduce((prev, curr, i) => ({...prev, [DIM_NAMES[i]]: VALS[curr]}), {}));
  // Remove self
  return props.filter(x => !Object.values(x).every(y => y === 0));
}

function cycle(cubes: CubeMap, dimensions:number):CubeMap {
  const newMap = new Map<string, boolean>();
  const neighbourValues = getNeighborValues(dimensions);

  // Go over all cubes + their neighbours
  const allNeighbors = unique([...cubes.keys()].map(c => JSON.parse(c)).map(pos => getNeighbors(pos, neighbourValues)).flat());
  allNeighbors.forEach(pos => {
    const posString = JSON.stringify(pos)
    const cube = cubes.get(posString);
    const neighbors = getNeighbors(pos, neighbourValues).map(x => cubes.get(JSON.stringify(x)));
    const activeNeighbors = neighbors.filter(n => n === true).length;
    if (cube) {
      if (activeNeighbors === 2 || activeNeighbors === 3) {
        newMap.set(posString, true);
      } else {
        newMap.set(posString, false);
      }
    } else if (activeNeighbors === 3) {
      newMap.set(posString, true);
    }
  });

  return newMap;
}

async function run(dimensions: number) {
  let newMatrix = await getMap(dimensions);
  for (let i = 0; i < NUM_CYCLES; i++) {
    newMatrix = cycle(newMatrix, dimensions);
    const activeCubes = [...newMatrix.entries()].filter(([pos, active]) => active === true);
    console.log(i, activeCubes.length)
  }
}

run(4);