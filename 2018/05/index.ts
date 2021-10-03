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

async function partOne() {
  const chars = (await getInput()).map(toChars)[0];
  let currentWord = chars.join('');

  while (true) {
    for (let i = 0; i < chars.length - 1; i++) {
      if (isOppositePolarity(chars[i], chars[i+1])) {
        //Remove char, exit
        chars.splice(i, 2);
        break;
      }
    }
    
    if (currentWord === chars.join('')) {
      break;
    }  
    currentWord = chars.join('');
  }
  console.log(chars.length);
}

async function partTwo() {
  const input = (await getInput()).map(Number);
}
  

partOne();