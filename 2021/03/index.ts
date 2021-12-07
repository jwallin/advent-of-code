import { getInput } from '../../utils';
import { KeyVal } from '../../utils/types';

function mostCommonValInArray<T>(a:T[], def: T):T {
  const vals = a.map(x => JSON.stringify(x)).reduce<KeyVal<number>>((acc, curr) => {
    acc[curr] = (acc[curr] | 0) + 1;
    return acc;
  }, {})
  return JSON.parse(Object.keys(vals).reduce((a, b) => vals[a] > vals[b] ? a : vals[a] < vals[b] ? b : JSON.stringify(def)));
}

function leastCommonValInArray<T>(a:T[], def: T):T {
  const vals = a.map(x => JSON.stringify(x)).reduce<KeyVal<number>>((acc, curr) => {
    acc[curr] = (acc[curr] | 0) + 1;
    return acc;
  }, {})
  return JSON.parse(Object.keys(vals).reduce((a, b) => vals[a] < vals[b] ? a : vals[a] > vals[b] ? b : JSON.stringify(def)));
}

async function partOne() {
  const input = (await getInput()).map(x => x.split('').map(Number));
  const mostCommon = [];
  const leastCommon = [];
  for (let i = 0; i < input[0].length; i++) {
    const vals = input.map(x => x[i]);
    mostCommon.push(mostCommonValInArray(vals, 1));
    leastCommon.push(leastCommonValInArray(vals, 1));
  }
  const gamma = toDec(mostCommon);
  const epsilon = toDec(leastCommon);

  console.log(gamma, epsilon, gamma * epsilon);
}

function getOxygenRating(input: number[][]) {
  let candidates = input.slice();
  for (let i = 0; i < input[0].length; i++) {
    const vals = candidates.map(x => x[i]);
    const bit = mostCommonValInArray(vals, 1);
    candidates = candidates.filter(c => c[i] === bit);
    if (candidates.length === 1) {
      return toDec(candidates[0]);
    }
  }
  throw new Error('No candidates left');
}

function getCO2Rating(input: number[][]) {
  let candidates = input.slice();
  for (let i = 0; i < input[0].length; i++) {
    const vals = candidates.map(x => x[i]);
    const bit = leastCommonValInArray(vals, 0);
    candidates = candidates.filter(c => c[i] === bit);
    if (candidates.length === 1) {
      return toDec(candidates[0]);
    }
  }
  throw new Error('No candidates left');
}

function toDec(n:number[]) {
  return parseInt(n.map(String).join(''), 2);
}

async function partTwo() {
  const input = (await getInput()).map(x => x.split('').map(Number));

  const a = getOxygenRating(input);
  const b = getCO2Rating(input);
  console.log(a, b, a * b);
}

partOne();
partTwo();