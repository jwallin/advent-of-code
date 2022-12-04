import { chunkArray, getInput, intersection, sum, unique } from '../../utils';

function getPrio(item: string): number {
  if (item === item.toLowerCase()) {
    return item.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
  }
  return item.charCodeAt(0) - 'A'.charCodeAt(0) + 27;
}

async function partOne() {
  const input = (await getInput()).map<[string[], string[]]>(x => [x.substring(0, x.length / 2).split(''), x.substring(x.length / 2).split('')]);
  const duplicates = input.map(([c1, c2]) => intersection(c1, c2)).map(unique);
  console.log(duplicates.flatMap(r => r.map(getPrio)).reduce(sum))
}

async function partTwo() {
  const input = (await getInput());

  const groups = chunkArray(input.map(x => x.split('')), 3);
  const total = groups.map(g => intersection(...g)).flatMap(unique).map(getPrio).reduce(sum);
  console.log(total);
}

partOne();
partTwo();