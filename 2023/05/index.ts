import { getInput, splitArrayBy } from '../../utils';

class SourceDestination {
  dest: number;
  source: number;
  range: number;
  constructor(dest: number, source: number, range: number) {
    this.dest = dest;
    this.source = source;
    this.range = range;
  }

  has(n: number) {
    return n >= this.source && n < this.source + this.range;
  }
  
  get(n: number) {
    if (!this.has(n)) {
      return n;
    }
    return this.dest - this.source + n;
  }

  stepsAwayFromNextChange(n: number) {
    return this.source + this.range - n;
  }
}

async function parseInput() {
  const input = splitArrayBy((await getInput()), '');

  const seeds = input.shift()![0].split(' ').map(Number);
  seeds.shift();

  const pipeline = input.map(map => {
    map.shift(); // id
    return map.map(x => {
      const [a, b, c] = x.split(' ').map(Number);
      return new SourceDestination(a, b, c);
    });
  });
  return { seeds, pipeline };
}

function mapSeed(i: number, pipeline: SourceDestination[][]) {
  let num = i;
  let nextChange = Infinity;
  pipeline.forEach(p => {
    for (let j = 0; j < p.length; j++) {
      const map = p[j];
      if (map.has(num)) {
        nextChange = Math.min(nextChange, map.stepsAwayFromNextChange(num));
        num = map.get(num);
        break;
      }
    }
  });
  return { num, nextChange };
}

async function partOne() {
  const { seeds, pipeline } = await parseInput();

  const locationNumbers = seeds.map(s => {
    const { num } = mapSeed(s, pipeline);
    return num;
  });

  console.log(Math.min(...locationNumbers))
}

async function partTwo() {
  const { seeds, pipeline } = await parseInput();

  let minLocation = Infinity;

  while (seeds.length > 0) {
    const seedNum = seeds.shift()!;
    const seedRange = seeds.shift()!;
    let i = seedNum;
    while (i < seedNum + seedRange) {
      const { num, nextChange } = mapSeed(i, pipeline);
      minLocation = Math.min(minLocation, num);
      i += nextChange;
    }
  }

  console.log(minLocation)
}
  
partOne();
partTwo();