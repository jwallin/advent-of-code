import { getInput } from '../../utils';

class SplitCube {
  cube: Cube;
  state: boolean;
  holes: SplitCube[]

  constructor(cube: Cube, state: boolean, holes: SplitCube[]) {
    this.cube = cube;
    this.state = state;
    this.holes = holes;
  }

  volume() {
    let vol = this.cube.volume();
    this.holes.forEach(h => {
      vol -= h.volume();
    });

    return vol;
  }
}

class Cube {
  public xmin: number;
  public xmax: number;

  public ymin: number;
  public ymax: number;

  public zmin: number;
  public zmax: number;

  constructor(xmin: number, xmax: number, ymin: number, ymax: number, zmin: number, zmax: number) {
    this.xmin = xmin;
    this.xmax = xmax;
    this.ymin = ymin;
    this.ymax = ymax;
    this.zmin = zmin;
    this.zmax = zmax;
  }

  volume() {
    return (this.xmax - this.xmin + 1) * (this.ymax - this.ymin + 1) * (this.zmax - this.zmin + 1) 
  }
}

function intersect(a: Cube, b: Cube): Cube | undefined {
  const x1 = Math.max(a.xmin, b.xmin);
  const x2 = Math.min(a.xmax, b.xmax);
  const y1 = Math.max(a.ymin, b.ymin);
  const y2 = Math.min(a.ymax, b.ymax);
  const z1 = Math.max(a.zmin, b.zmin);
  const z2 = Math.min(a.zmax, b.zmax);
  if (x1 > x2 || y1 > y2 || z1 > z2) { return undefined; }

  return new Cube(x1, x2, y1, y2, z1, z2);
}

function intersectPunched(a: SplitCube, b: Cube): SplitCube | false {
  const cube = intersect(a.cube, b);
  if (!cube) { return false; }
  const holes = a.holes.map(h => intersectPunched(h, b) as SplitCube).filter(x => x);

  return new SplitCube(cube, !a.state, holes);
}


function executeSteps(input: string[], filterFn: ((value: number, index: number) => boolean) | undefined = undefined) {
  const cubes: SplitCube[] = [];
  const steps = input
    .map(z => z.split(' '))
    .reduce<[boolean, Cube][]>((a, [state, coordStr]) => {
      const coords = coordStr.split(',').map(s => s.substring(2).split('..').map(Number)).flat();

      if (filterFn && coords.some(filterFn)) {
        return a;
      }

      const [xmin, xmax, ymin, ymax, zmin, zmax] = coords;
      a.push([state === 'on', new Cube(xmin, xmax, ymin, ymax, zmin, zmax)]);
      return a;
    }, []);

  steps.forEach(([state, cube]) => {
    const intersections = cubes.map(c => ({ c, hole: intersectPunched(c, cube) }));

    for (const { c, hole } of intersections) {
      if (!hole)
        continue;
      hole.state = false;
      c.holes.push(hole);
    }

    if (state) {
      cubes.push(new SplitCube(cube, state, []));
    }
  });
  return cubes;
}


async function partOne() {
  const input = (await getInput());

  const cubes: SplitCube[] = executeSteps(input, (v => v < -50 || v > 50));

  const tot = cubes.reduce((a, c) => a + c.volume(), 0);
  console.log(tot)
}


async function partTwo() {
  const input = (await getInput());

  const cubes: SplitCube[] = executeSteps(input);

  const tot = cubes.reduce((a, c) => a + c.volume(), 0);
  console.log(tot)
}
  
partOne();
partTwo()