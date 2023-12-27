import { fillArray, getInput, sum } from '../../utils';
  
const cache = new Map<string, number>();

function trim(seq: string[]): string[] {
  if (seq[0] !== '.') {
    return seq;
  }
  return seq.slice(seq.indexOf('.'));
}

function findArrangements(seq: string[], lengths: number[]): number {
  const key = `${seq.join('')} ${lengths.join(',')}`;
  if (cache.has(key)) {
    return cache.get(key)!;
  }

  if (lengths.length === 0) {
    return Number(!seq.includes('#'));  
  }
  if (seq.length - lengths.reduce(sum) - lengths.length + 1 < 0) { //When?
    return 0;
  }

  const damagedOrUnknown = !seq.slice(0, lengths[0]).includes(".");
  if (seq.length == lengths[0]) {
    return Number(damagedOrUnknown);
  }

  let a = 0;
  let b = 0;
  if (seq[0] !== '#') {
    a = findArrangements(trim(seq.slice(1)), lengths)
  }
  if (damagedOrUnknown && seq[lengths[0]] !== '#') {
    b = findArrangements(trim(seq.slice(lengths[0] + 1)), lengths.slice(1));
  }
  const d = a + b;
  cache.set(key, d);

  return d;
}

async function partOne() {
  const inp: [string[], number[]][] = (await getInput()).map(x => x.split(' ')).map(([s, l]) => {
    const lengths = l.split(',').map(Number);
    const seq = s.split('');
    
    return [seq, lengths];
  });

  const f = inp.reduce((acc, [seq, lengths]) => acc + findArrangements(seq, lengths), 0)
  console.log(f)
}

async function partTwo() {
  const inp: [string[], number[]][] = (await getInput()).map(x => x.split(' ')).map(([s, l]) => {
    const lengths = fillArray(5, l).join(',').split(',').map(Number);
    const seq = fillArray(5, s).join('?').split('');

    return [seq, lengths];
  });

  const f = inp.reduce((acc, [seq, lengths]) => acc + findArrangements(seq, lengths), 0)
  console.log(f)
}

partOne();
partTwo();