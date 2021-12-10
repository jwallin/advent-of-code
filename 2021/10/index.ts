import { flipObject, getInput } from '../../utils';
import { KeyVal } from '../../utils/types';

const tags:KeyVal<string> = {
  ')': '(',
  '>': '<',
  '}': '{',
  ']': '['
};

function removeBalancedStrings(line:string) {
  const r = /(\(\))|(<>)|({})|(\[\])/;
  let s = line.slice();
    let prevLength = 0;
    while (prevLength !== s.length) {
      prevLength = s.length;
      s = s.replace(r, '');
      
    }
  return s;
}

async function partOne() {
  const input = (await getInput());
  
  const tagScore:KeyVal<number> = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137
  };

  const tot = input.map(removeBalancedStrings).reduce((acc, s) => {
    const firstClosingTag = s.split('').find(x => Object.keys(tagScore).includes(x))
    if (firstClosingTag) {
      return acc + tagScore[firstClosingTag];
    }
    return acc;
  }, 0);

  console.log(tot);
}

async function partTwo() {
  const input = (await getInput());
  const openTags = flipObject(tags);

  const tagScore:KeyVal<number> = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4
  };

  const incomplete = input.map(removeBalancedStrings).filter(s => s.split('').find(x => Object.keys(tags).includes(x)) === undefined);

  const autocompleted = incomplete.map(x => x.split('').reverse().map(y => openTags[y]));
  const scores = autocompleted.map(a => {
    return a.reduce((acc, curr) => {
      return acc * 5 + tagScore[curr];
    }, 0);
  }).sort((a,b) => a - b);
  const middleScore = scores[Math.floor(scores.length / 2)];
  console.log(middleScore);
}

partOne();
partTwo();