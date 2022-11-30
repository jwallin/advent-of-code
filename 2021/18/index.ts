import { getInput, sum } from '../../utils';

type snailfish = (snailfish | number)[]

function explode(s:string):string {
  let open = 0;

  // Check for explosions
  for (let i = 0; i < s.length - 4; i++) {
    const m = s.substr(i).match(/^\[(\d+),(\d+)\]/);
    if (open >= 4 && m) {
      // explode
      const first = addLast(s.substr(0, i), m[1]);
      const last = addFirst(s.substr(i + m[0].length), m[2]);

      return [first, ['0'], last].join('');
      
    } else {
      if (s.charAt(i) === '[') {
        open++;
      } else if (s.charAt(i) === ']') {
        open--;
      }
    }
  }
  return s;
}

const sumStr = (...f:string[]):string => {
  return f.map(Number).reduce(sum).toString();
}

function addLast(s:string, v:string) {
  const f = s.match(/\d+/g)?.pop();
  if (f) {
    const q = s.lastIndexOf(f);
    const arr = s.split('');
    arr.splice(q, f.length, sumStr(f, v));
    return arr.join('');
  }
  return s;
}

function addFirst(s:string, v:string) {
  const k = s.match(/\d+/g)?.shift();
  if (k) {
    const r = s.indexOf(k);
    const arr = s.split('');
    arr.splice(r, k.length, sumStr(k, v));
    return arr.join('');
  }
  return s;
}

function split(s:string):string {
  const m = s.match(/\d\d+/g)?.shift();
  if (m) {
    const i = s.indexOf(m);
    const arr = s.split('');
    const numVal = Number(m) / 2;
    arr.splice(i, m.length, `[${Math.floor(numVal)},${Math.ceil(numVal)}]`);
    return arr.join('');
  }
  return s;
}

function magnitude(s:snailfish | number):number {
  if (typeof s === 'number') {
    return s;
  }
  const [a, b] = s;
  return 3 * magnitude(a) + 2 * magnitude(b)
}

function add(a: string, b: string):string {
  let sum = `[${a},${b}]`;
  while (true) {
    const exploded = explode(sum);
    if (exploded !== sum) {
      sum = exploded;
      continue;
    }

    const splitted = split(sum);
    if (splitted !== sum) {
      sum = splitted;
      continue;
    }

    break;
  }

  return sum;
}

const toSnailFish = (s:string):snailfish => eval(s) as snailfish;

async function partOne() {
  const input = (await getInput()).reduce(add);
  const a = magnitude(toSnailFish(input) as snailfish)
  console.log(a)
  
}

async function partTwo() {
  const input = (await getInput());
  let maxMag = -1;
  input.forEach(a => input.forEach(b => {
      if (a === b) {
        return;
      }
      maxMag = Math.max(magnitude(toSnailFish(add(a, b)) as snailfish), maxMag);
    }));
  console.log(maxMag)
} 

partTwo();