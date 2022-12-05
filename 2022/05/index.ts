import { getInput, splitArrayBy } from '../../utils';

function parseStacks(crateInput: string[]) {
  const stackMap = new Map<string, string[]>();
  const stacks: string[][] = [];

  const crates = crateInput.map(c => c.split(''));
  const ids = crates.pop();

  crates.forEach(row => {
    for (let i = 0, j = 1; j < row.length; i++, j += 4) {
      if (row[j].length > 0 && row[j] !== ' ') { //Make regex
        if (!stacks[i]) {
          stacks[i] = [];
        }
        stacks[i].push(row[j]);
      }
    }
  });

  ids?.filter(x => x.length > 0 && x !== ' ').forEach((id, i) => {
    console.log(i);
    stackMap.set(id, stacks[i]);
  });
  return stackMap;
}

function applyInstructions(instructions: string[], stackMap: Map<string, string[]>, retainOrder: boolean) {
  const regex = /^move (\d+) from (\d+) to (\d+)/;
  instructions.forEach(i => {
    const m = i.match(regex);
    if (!m) {
      throw new Error(`Couldnt parse input: ${i}`);
    }
    const [, amount, from, to] = m;
    const lift = stackMap.get(from)?.splice(0, Number(amount)) as string[];
    if (!retainOrder) {
      lift.reverse();
    }
    stackMap.get(to)?.unshift(...lift);
  });
}

async function partOne() {
  const [crateInput, instructions] = splitArrayBy(await getInput(), '');
  const stackMap = parseStacks(crateInput);
  applyInstructions(instructions, stackMap, false);

  const topCrates = [...stackMap.keys()].sort().map(k => stackMap.get(k)?.[0]).join('')
  console.log(topCrates);
}

async function partTwo() {
  const [crateInput, instructions] = splitArrayBy(await getInput(), '');
  const stackMap = parseStacks(crateInput);
  applyInstructions(instructions, stackMap, true);

  const topCrates = [...stackMap.keys()].sort().map(k => stackMap.get(k)?.[0]).join('')
  console.log(topCrates);
}

partOne();
partTwo();