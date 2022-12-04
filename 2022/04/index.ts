import { getInput } from '../../utils';

type Range = [number, number];
type ElfPair = [Range, Range];

const within = (a:Range, b:Range) => a[0] >= b[0] && a[1] <= b[1];
const overlap = (a:Range, b:Range) => within([a[0], a[0]], b) || within([a[1], a[1]], b);

async function parseInput() {
  return (await getInput()).map<ElfPair>(x => x.split(',').map<Range>(y => y.split('-').map(z => Number(z)) as Range) as ElfPair);
}

async function partOne() {
  const input = await parseInput();
  const total = input.filter(([a,b]) => within(a, b) || within(b, a)).length;
  
  console.log(total);
}

async function partTwo() {
  const input = await parseInput();
  const total = input.filter(([a,b]) => overlap(a, b) || overlap(b, a)).length;

  console.log(total);
}

partOne();
partTwo(); 