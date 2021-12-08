import { getInput } from '../../utils';
import { KeyVal } from '../../utils/types';


function subtract(a:string, ...b:string[]):string {
  return a.split('').sort().filter(x => !add(...b).split('').sort().includes(x)).join('');
}

function add(...a:string[]):string {
  const s = a.flatMap(x => x.split(''));
  return [...new Set(s)].sort().join('');
}

function hasAll(target:string[], pattern:string) {
  return pattern.split('').every(x => target.indexOf(x) !== -1);
}

async function partOne() {
  const input = (await getInput()).map(s => s.split(' | ').map(s => s.split(' ')));
  const easylengths = [2, 4, 3, 7];
  const s = input.map(x => x[1]).reduce((acc, curr) => acc + curr.filter(x => easylengths.includes(x.length)).length, 0);
  console.log(s)
}

async function partTwo() {
  const input = (await getInput()).map(s => s.split(' | ').map(s => s.split(' ')));
  
  const digits = {
    0: 'abcefg',
    1: 'cf',
    2: 'acdeg',
    3: 'acdfg',
    4: 'bcdf',
    5: 'abdfg',
    6: 'abdefg',
    7: 'acf',
    8: 'abcdefg',
    9: 'abcdfg'
  };

  const rows = input.map(x => x.map(y => y.map(z => z.split(''))))
  const sum = rows.reduce<number>((acc, [signals, output]) => {

    const segments:KeyVal<string> = {};
    const found:KeyVal<string> = {};

    // Easy ones 1, 4, 7, 8
    signals.forEach(s => {
      const poss = Object.entries(digits)
        .filter(([k, v]) => !Object.keys(found).includes(k) && v.length == s.length);
      if (poss.length === 1) {
        found[poss[0][0]] = s.sort().join('');
      }
    });
    
    found[3] = signals.filter(x => hasAll(x, found[7]) && x.length === 5)[0].sort().join('');
    found[9] = add(found[3], found[4]);
  
    segments['e'] = subtract(found[8], found[9]);
    segments['a'] = subtract(found[7], found[1]);
    segments['b'] = subtract(found[9], found[3]);
    segments['g'] = subtract(found[3], found[4], segments['a']);
    found[0] = add(found[7], segments['b'], segments['e'], segments['g']);
    segments['d'] = subtract(found[8], found[0])
    
    found[6] = signals.filter(x => Object.values(found).indexOf(x.sort().join('')) === -1 && x.length === 6)[0].join('');
    found[5] = subtract(found[6], segments['e']);
    found[2] = signals.filter(x => Object.values(found).indexOf(x.sort().join('')) === -1)[0].join('');
    
    const n = output.map(x => x.sort().join('')).reduce<string>((acc, o) => {
      return acc + Object.entries(found).find(([,v]) => v === o)?.[0];
    }, '');
    return acc + Number(n);
  }, 0);
  console.log(sum);
}

partTwo();