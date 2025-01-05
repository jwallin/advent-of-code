import { getInput } from '../../utils';

async function partOne() {
  const { left, right } = await getLists();
  console.log(left.reduce((p,c,i) => {
    return p + Math.abs(right[i] - c);
  }, 0));
}

async function getLists() {
  const input = (await getInput())
    .map(x => x.split('   ').map(Number));
  const left = input.map(x => x[0]).sort();
  const right = input.map(x => x[1]).sort();
  return { left, right };
}

async function partTwo() {
  const { left, right } = await getLists();
  const occurences = right.reduce<Map<number, number>>((p: Map<number, number>, c: number): Map<number, number> => {
    if (p.has(c)) {
      p.set(c, p.get(c)! + 1);
    } else {
      p.set(c, 1);
    }
    return p;
  }, new Map<number, number>())
  console.log(left.reduce((p, c) => {
    const occ = occurences.get(c) || 0;
    return p + occ * c;
  }, 0));
}
  
partOne();
partTwo();