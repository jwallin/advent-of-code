import { getInput, toChars, Position, unique, sum } from '../utils';

type Position3D = {
  x: number,
  y: number,
  z: number
};

type CubeMap = Map<string, boolean>;

async function getMap():Promise<CubeMap> {
  const map = new Map<string, boolean>();
  const input = (await getInput()).map(toChars);
  for(let y = 0; y < input.length; y++) {
    for(let x = 0; x < input[y].length; x++) {
      map.set(JSON.stringify({x, y, z: 0}), input[y][x] === '#');
    }
  }
  return map;
}

const NEIGHBORS = (function(): Position3D[] {
  const res = [];
  const vals = [-1, 0, 1];
  for (let x = 0; x < vals.length; x++) {
    for (let y = 0; y < vals.length; y++) {
      for (let z = 0; z < vals.length; z++) {
        const v = {
          x: vals[x],
          y: vals[y],
          z: vals[z]
        };
        if (v.x === 0 && v.y === 0 && v.z === 0) {
          continue; // Skip self
        }
        res.push(v);
      }
    }
  }
  return res;
})();

function getNeighbors(pos: Position3D):Position3D[] {
  return NEIGHBORS.map(d => ({x: d.x + pos.x, y: d.y + pos.y, z: d.z + pos.z}));
}

function cycle(cubes: CubeMap):CubeMap {
  const newMap = new Map<string, boolean>();
  // Go over all cubes + their neighbours
  const allNeighbors = unique([...cubes.keys()].map(c => JSON.parse(c)).map(pos => getNeighbors(pos)).flat());
  allNeighbors.forEach(pos => {
    const posString = JSON.stringify(pos)
    const cube = cubes.get(posString);
    const neighbors = getNeighbors(pos).map(x => cubes.get(JSON.stringify(x)));
    const activeNeighbors = neighbors.filter(n => n === true).length;
    if (cube === true) {
      if (activeNeighbors === 2 || activeNeighbors === 3) {
        newMap.set(posString, true);
      } else {
        newMap.set(posString, false);
      }
    } else {
      if (activeNeighbors === 3) {
        newMap.set(posString, true);
      }
    }
  });

  return newMap;
}

async function partOne() {
  let newMatrix = await getMap();
  for (let i = 0; i < 6; i++) {
    newMatrix = cycle(newMatrix);
    const activeCubes = [...newMatrix.entries()].filter(([pos, active]) => active === true);
    console.log(i, activeCubes.length)
  }
  
}

partOne()