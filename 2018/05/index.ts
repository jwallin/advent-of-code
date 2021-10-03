import { getInput, toChars, pairs } from '../../utils';

function adjacentPairs<T>(array: T[]): T[][] {
  const p:T[][] = [];
  for (let i = 1; i < array.length; i++) {
    p.push([array[i - 1], array[i]])
  }
  return p;
}

function isOppositePolarity(a:string, b:string) {
  return a.toLowerCase() === b.toLowerCase() && a !== b;
}

function react(chars:string[]) {
  let currentLength = chars.length;
  let start = 0;
  while (true) {
    for (let i = start; i < chars.length - 1; i++) {
      if (isOppositePolarity(chars[i], chars[i+1])) {
        //Remove char, exit
        chars.splice(i, 2);
        start = Math.max(i - 3, 0);
        break;
      }
    }
    
    if (currentLength === chars.length) {
      break;
    }
    currentLength = chars.length;
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