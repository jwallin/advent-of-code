import { getInput, pairs, sortAscending, splitArrayBy } from '../../utils';

const SCANNER_THESHOLD = 12;

type Position3D = [
  x: number,
  y: number,
  z: number,
]
function distance([ax, ay, az]: Position3D, [bx, by, bz]: Position3D) {
  return Math.sqrt(Math.pow(bx- ax, 2) + Math.pow(by - ay, 2) + Math.pow(bz - az, 2));
}

const manhattanDistance = ([ax, ay, az]: Position3D, [bx, by, bz]: Position3D): number => Math.abs(ax - bx) + Math.abs(ay - by) + Math.abs(az - bz);

const arrayEquals = <T>(a: T[], b: T[]): boolean => a.every((v, i) => v === b[i]);

class Scanner {

  public id: string;
  public position: Position3D;
  public beacons: Position3D[];
  public orientation: Position3D;
  public shifted: boolean;
  public distances: Map<string, number>;

  constructor(id: string, beacons: Position3D[]) {
    this.id = id;
    this.beacons = beacons;
    this.position = [0, 0, 0];
    this.orientation = [0, 0, 0];
    this.shifted = false;
    this.distances = new Map();

    this.calculateDistances();
  }

  calculateDistances() {
    this.beacons.forEach((b1, i) => {
      this.beacons.forEach((b2, j) => {
        const key = [i, j].sort().join('_');
        if (i !== j && !this.distances.has(key)) {
          this.distances.set(key, distance(b1, b2));
        }
      })
    });
  }

  overlapsWith(other: Scanner) {
    const matches = filterMap(this.distances, (k, v) => [...other.distances.values()].includes(v));
    const uniqueMatches = new Set([...matches.keys()].flatMap(k => k.split('_').map(s => parseInt(s))));
    
    if (uniqueMatches.size >= SCANNER_THESHOLD) {
      const otherMatches = filterMap(other.distances, (k, v) => [...matches.values()].includes(v));
      //console.log('ja', this.id, other.id, otherMatches);
      //Orient scanner
      const sortedEntries = [...matches.entries()].sort(([,a], [,b]) => sortAscending(a, b));
      const sortedOtherMatches = [...otherMatches.entries()].sort(([,a], [,b]) => sortAscending(a, b));
      this.align(sortedEntries, sortedOtherMatches, other);
    }
  }

  align(myMatches:[string, number][], otherMatches: [string, number][], other: Scanner) {
    const myKeyIndexxList = [myMatches[0]];
    const k = myKeyIndexxList[0][0].split('_')[1];
    myKeyIndexxList.push(myMatches.find(x => {
      const z = x[0].split('_');
      return z.includes(k) && x !== myKeyIndexxList[0]
    }) as [string, number]) ;
    const myFirstKeys = myKeyIndexxList.map(([k, ]) => k);

    const otherKeyIndexxList = [otherMatches[0]];
    otherKeyIndexxList.push(otherMatches.find(x => x[1] === myKeyIndexxList[myKeyIndexxList.length - 1][1]) as [string, number])
    const otherFirstKeys = otherKeyIndexxList.map(([k, ]) => k);

    const myCoordPair = findMatchingCoord(myFirstKeys, this.beacons);
    const myFirstCoord = myCoordPair[1];
    const i = myFirstKeys[0].split('_').map(x => Number(x)).find(x => x != myCoordPair[0]) as number;
    const mySecondCoord = this.beacons[i];

    const otherCoordPair = findMatchingCoord(otherFirstKeys, other.beacons);
    const otherFirstCoord = otherCoordPair[1];
    const j = otherFirstKeys[0].split('_').map(x => Number(x)).find(x => x != otherCoordPair[0]) as number;
    const otherSecondCoord = other.beacons[j];

    let myFirstDupe:Position3D = [...myFirstCoord];
    let mySecondDupe:Position3D = [...mySecondCoord];

    this.position = sumPos(otherFirstCoord, opposite(myFirstDupe));

    while (!arrayEquals(sumPos(this.position, mySecondDupe), otherSecondCoord) && this.orientation[0] < 4) {
      [myFirstDupe, mySecondDupe] = this.orientToNext([myFirstDupe, mySecondDupe]);
      this.position = sumPos(otherFirstCoord, opposite(myFirstDupe));
      void(0);
    }

    if (this.orientation[0] < 4) {
      this.beacons = this.beacons.map(x => sumPos(this.reorient(x), this.position));
      this.shifted = true;
    } else {
      this.position = [0, 0, 0];
      this.orientation = [0, 0, 0];
    }
  }

  findCoords(keys: string[]) {
    const indices = keys.flatMap(k => k.split('_').map(v => Number(v)));
    const coords = indices.map(i => this.beacons[i]);
    return [indices, coords];
  }

  orientToNext(coords: Position3D[]) {
    let nextRotation: Position3D = [...this.orientation];
    this.rotateScanner();
    nextRotation = diffPos(nextRotation, this.orientation);
    nextRotation.forEach((v, i) => {
      if (v === -3) { 
        nextRotation[i] = 1;
      }
    })
    for (let i = 0; i < coords.length; i++) {
      coords[i] = rotate(coords[i], nextRotation);
    }

    return coords;
  }

  rotateScanner() {
    this.orientation[2] += 1;

    if (this.orientation[2] > 3) {
      this.orientation[1] += 1;
      this.orientation[2] = 0;
    }

    if (this.orientation[1] > 3) {
      this.orientation[0] += 1;
      this.orientation[1] = 0;
    }
  }

  reorient(p: Position3D): Position3D {
    let [ox, oy, oz] = this.orientation;
    let [x, y, z] = p;

    while (ox > 0) {
      ox--;
      [x, y, z] = rotate([x, y, z], [1, 0, 0]);
    }

    while (oy > 0) {
      oy--;
      [x, y, z] = rotate([x, y, z], [0, 1, 0]);
    }

    while (oz > 0) {
      oz--;
      [x, y, z] = rotate([x, y, z], [0, 0, 1]);
    }

    return [x, y, z];
  }
}

const sumPos = (p1: Position3D, p2: Position3D): Position3D => [p1[0] + p2[0], p1[1] + p2[1], p1[2] + p2[2]];
const opposite = (p: Position3D): Position3D => p.map(x => x * -1) as Position3D;
const diffPos = (p1: Position3D, p2: Position3D): Position3D => sumPos(p2, opposite(p1));

function filterMap<K,V>(map: Map<K, V>, fn: (key: K, value: V) => boolean ): Map<K, V> {
  const filtered = new Map<K, V>();
  map.forEach((v, k) => {
    if (fn(k, v)) {
      filtered.set(k, v);
    }
  });
  return filtered;
}

function rotate(p: Position3D, [rotX, rotY, rotZ]: Position3D): Position3D {
  let [x, y, z] = p;

  if (rotZ === 1) {
    const tmp = y;
    y = x;
    x = tmp;
    y *= -1;
  }

  if (rotY === 1) {
    const tmp = x;
    x = z;
    z = tmp;
    x *= -1;
  }

  if (rotX === 1) {
    const tmp = z;
    z = y;
    y = tmp;
    z *= -1;
  }

  return [x, y, z];
}

function findMatchingCoord(keys: string[], beacons: Position3D[]): [number, Position3D] {
  const indices = keys.flatMap(x => x.split('_')).map(x => Number(x));
  const coords = indices.map(x => beacons[x]);

  const i = [...filterMap(eachCount(indices), (k, v) => v > 1).keys()][0];
  const c = [...filterMap(eachCount(coords), (k, v) => v > 1).keys()][0];

  return [i, c];
}

function eachCount<T>(arr: T[]): Map<T, number> {
  const m = new Map<T, number>();
  arr.forEach(x => {
    if (!m.has(x)) {
      m.set(x, 1);
    } else {
      m.set(x, m.get(x) as number + 1);
    }
  });
  return m;
}

function alignScanners(scanners: Scanner[]) {
  scanners[0].shifted = true;
  const shifted = [scanners[0] as Scanner];
  const unshifted = new Set([...scanners.slice(1)]);

  while (unshifted.size > 0) {
    unshifted.forEach(s => {
      shifted.forEach(s2 => {
        if (s !== s2 && !s.shifted) {
          s.overlapsWith(s2);
        }
      });
    });

    const newShifts = [...unshifted].filter(x => x.shifted);
    shifted.push(...newShifts);
    newShifts.forEach(x => unshifted.delete(x));
  }
}

async function parseScanners() {
  return splitArrayBy(await getInput(), '').map<Scanner>(s => {
    const id = s.shift() || '';
    const beacons = s.map(i => i.split(',').map(Number)).map<Position3D>(([x, y, z]) => ([x, y, z]));
    return new Scanner(id, beacons);
  });
}

async function partOne() {
  const scanners = await parseScanners();
  alignScanners(scanners);

  console.log(new Set(scanners.flatMap(x => x.beacons).map(x => x.join(',')).sort()).size)
}

async function partTwo() {
  const scanners = await parseScanners();
  alignScanners(scanners);

  console.log(Math.max(...pairs(scanners).map(([s1, s2]) => manhattanDistance(s1.position, s2.position))));
}

partOne();
partTwo()

