import { getInput, toChars } from '../../utils';

function isOppositePolarity(a:string, b:string) {
  return a.toLowerCase() === b.toLowerCase() && a !== b;
}

function react(chars:string[]) {
  for (let i = 0; i < chars.length - 1; i++) {
    if (isOppositePolarity(chars[i], chars[i+1])) {
      chars.splice(i, 2);
      i = Math.max(i - 2, 0);
    }
  }
  return chars;
}

async function partOne() {
  const chars = (await getInput()).map(toChars)[0];
  react(chars);
  console.log(chars.length);
}

async function partTwo() {
  const chars = (await getInput()).map(toChars)[0];
  const units = Array.from(new Set(chars.map(x => x.toUpperCase()))).sort();
  const results = units.map(u => {
    const filteredChars = chars.filter(c => c.toUpperCase() !== u);
    return react(filteredChars).length;
  });
  console.log(Math.min(...results));
}
  

partTwo();