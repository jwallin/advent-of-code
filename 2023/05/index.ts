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
}

async function partOne() {
  const input = splitArrayBy((await getInput()), '');
  
  const seeds = input.shift()![0].split(' ').map(Number);
  seeds.shift();
  const pipeline = input.map(map => {
    map.shift(); // id
    return map.map(x => {
      const [a, b, c] = x.split(' ').map(Number);
      return new SourceDestination(a, b, c);
    });
  })
  console.log(pipeline)

  const locationNumbers = seeds.map(s => {
    console.log(`Seed ${s}`);
    let num = s;
    pipeline.forEach(p => {
      for (let i = 0; i < p.length; i++) {
        const map = p[i];
        if (map.has(num)) {
          num = map.get(num);
          break;
        }
      }
      //console.log(num)
    })
    return num;
  })

  console.log(Math.min(...locationNumbers))
}

async function partTwo() {
  const input = (await getInput()).map(Number);
}
  

partOne();