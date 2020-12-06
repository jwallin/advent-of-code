import { lines, toChars } from '../utils';

async function partOne() {
  const groups: string[] = (await lines('input.txt')).join(' ').split('  ');;
  const totalCount = groups.map(x => x.split(' ').map(y => toChars(y)).flat())
                            .map(z => new Set(z).size)
                            .reduce((a, b) => a + b, 0);
  console.log(totalCount)
}

partOne()