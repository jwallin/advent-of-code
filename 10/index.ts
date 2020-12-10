import { lines, subtract, sum } from '../utils';

async function partOne() {
  const adapters: number[] = (await lines('input.txt')).map(Number).sort(subtract);
  adapters.unshift(0);
  adapters.push(adapters[adapters.length - 1] + 3);

  const coltDifferences: number[] = [];
  for (let i = 1; i < adapters.length; i ++) {
    const diff = adapters[i] - adapters[i-1];
    if (coltDifferences[diff] === undefined) {
      coltDifferences[diff] = 1
    } else {
      coltDifferences[diff]++;
    }
  }
  const total = coltDifferences[1] * coltDifferences[3];
  console.log(total);
}

async function partTwo() {
  const adapters: number[] = (await lines('input.txt')).map(Number).sort(subtract);
  adapters.push(adapters[adapters.length - 1] + 3);

  const variations: number[] = [1];
  adapters.forEach(a => {
    variations[a] = variations.slice(Math.max(a - 3, 0), a).reduce(sum, 0);
  });
  console.log(variations.pop());
}

partTwo();