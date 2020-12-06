import { lines, toChars, unique } from '../utils';

async function partOne() {
  const groups: string[] = (await lines('input.txt')).join(' ').split('  ');
  const totalCount = groups.map(x => x.split(' ').map(y => toChars(y)).flat())
                           .map(z => new Set(z).size)
                           .reduce((a, b) => a + b, 0);
  console.log(totalCount)
}

async function partTwo() {
  const groups: string[][] = (await lines('input.txt')).join(' ').split('  ').map(x => x.split(' '));
  const total = groups.reduce((prev, curr) => {
    const answers:string[] = unique(curr.map(y => toChars(y)).flat());
    const gm = curr.map(x => x.split(''));
    return prev + answers.filter(q => gm.every(x => x.find(y => y === q))).length;
  }, 0);
  console.log(total);
}

partTwo()