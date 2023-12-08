import { getInput, lcd, multiply, splitArrayBy } from '../../utils';

type Instruction = 0 | 1;

async function parseInput() {
  const [instructionStrings, mapStrings] = splitArrayBy((await getInput()), '');
  const instructions = instructionStrings[0].split('').map<Instruction>(x => x === 'L' ? 0 : 1);
  const map = mapStrings.reduce((acc, str) => {
    const [key, nodes] = str.split(' = ');
    acc.set(key, nodes.replace(/[()\s]/g, '').split(','));
    return acc;
  }, new Map<string, string[]>());
  return { map, instructions };
}

function calcSteps(n: string, isEndNode: (curr: string) => boolean, instructions: Instruction[], map: Map<string, string[]>) {
  let i = 0;
  let curr = n;

  while (!isEndNode(curr)) {
    const instruction = instructions[i % instructions.length];
    curr = map.get(curr)![instruction];
    i++;
  }
  return i;
}

async function partOne() {
  const { map, instructions } = await parseInput();
  const steps = calcSteps('AAA', c => c === 'ZZZ', instructions, map);
  console.log(steps);
}

async function partTwo() {
  const { map, instructions } = await parseInput();
  const startingNodes = [...map.keys()].filter(x => x.endsWith('A'));
  const steps = startingNodes.map(n => calcSteps(n, c => c.endsWith('Z'), instructions, map));
  console.log(lcd(steps))
}
  
partOne();
partTwo();