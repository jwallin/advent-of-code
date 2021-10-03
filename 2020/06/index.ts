import { getInput, toChars, unique, sum } from '../utils';

async function partOne() {
  const groups: string[] = (await getInput()).join(' ').split('  ');
  const totalCount = groups.map(x => x.split(' ').map(y => toChars(y)).flat())
                           .map(z => new Set(z).size)
                           .reduce(sum, 0);
  console.log(totalCount)
}

async function partTwo() {
  const groups: string[][] = (await getInput()).join(' ').split('  ').map(x => x.split(' '));
  const total = groups.reduce((prev, curr) => {
    const answers:string[] = unique(curr.map(y => toChars(y)).flat());
    const gm = curr.map(x => x.split(''));
    return prev + answers.filter(q => gm.every(x => x.find(y => y === q))).length;
  }, 0);
  console.log(total);
}

partTwo()