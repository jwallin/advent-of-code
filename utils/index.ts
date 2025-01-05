import { lines } from './lines';
import { KeyVal } from './types';

export const toChars = (value:string): string[] => [...value];
export const countDigits = (input: number): number => toChars(String(input)).length;
export const isValidYear = (input: number, min: number, max: number): boolean => countDigits(input) === 4 && input >= min && input <= max;
export const hasAllValuesFrom = <T>(input:T[], target:T[]): boolean => target.every((v:T) => input.includes(v));
export const range = (length:number, min:number = 0):number[] => [...Array(length - min).keys()].map(k => k + min);
export const unique = <U>(input: U[]): U[] => Array.from(new Set(input));
export const sum = (a: number, b: number): number => a + b;
export const subtract = (a: number, b: number): number => a - b;
export const multiply = (a: number, b: number): number => a * b;
export const intify = (input: string[]): (string | number)[] => input.map(s => isNaN(Number(s)) ? s : Number(s));
export const fillArray = <T>(length: number, value: T): T[] => Array.from<T>({ length }).fill(value);
export const lastValue = <T>(arr: T[]) => arr[arr.length - 1];
export const arrayEquals = <T>(a: T[], b: T[]): boolean => a.every((v, i) => v === b[i]);
export const pairs = <T>(array: T[]): T[][] => Array.from(combinations(array, 2));
export const triplets = <T>(array:T[]): T[][] => Array.from(combinations(array, 3));
export const cloneArray = <T>(a: T[]) => [...a];
export const spliceAndReturn = <T>(a: T[], start: number, deleteCount: number) => {
  const r = cloneArray(a);
  r.splice(start, deleteCount);
  return r;
}

export const getInput = async (filename:string = 'input.txt'):Promise<string[]> => await lines(filename);

export const prependZeros = (input: string, length: number): string[] => [...Array(Math.max(length - input.length + 1, 0)).join('0'), ...toChars(input)];

export function* nestedLoops(range:number, n:number): Generator<number[]> {
  const max = Math.pow(range, n);
  for (let i = 0; i < max; i++) {
    const g = Number(i).toString(range);
    yield prependZeros(g, n).map(Number)
  }
}

export const allEnumNames = <Enum extends Record<string, string | number>>(inp: Enum):string[] => (Object.values(inp)).filter(x => typeof x === 'string') as string[]

export function splitArray<T>(input:T[], splitter:T):T[][] {
  const res:T[][] = [];
  while(input.includes(splitter)) {
    const end = input.indexOf(splitter);
    const removed = input.splice(0, end + 1);
    res.push(removed.slice(0, removed.length - 1));
  }
  res.push(input);
  return res;
}

export const arrayMatch = <T>(a: T[], b: T[]): boolean => JSON.stringify(a) === JSON.stringify(b); //a.length === b.length && a.every((x,i) => b[i] === x);
export const intersection = <T>(...a:T[][]):T[] => a.reduce((a, b) => a.filter(x => b.includes(x)));

export const cartesian = (...a:any[]) => a.reduce((a:any[], b:any[]):any[] => a.flatMap((d:any) => b.map((e:any) => [d, e].flat())));

export function* combinations<T>(array: T[], k:number, start:number = 0): Generator<T[]> {
  if (k === 1 || start == array.length) {
    for(let i = start; i < array.length; i++) {
      yield [array[i]];
    }
  } else {
    for (let i = start; i < array.length; i++) {
      const permutations = combinations(array, k - 1, i + 1);
      for(const x of permutations) {
        yield [array[i], ...x];  
      }
    }
  }
}

export function arrayIndexOf<T>(arr:T[], value:T[]):number | undefined {
  for (let i = 0; i < arr.length; i++) {
    if (arrayMatch(arr.slice(i, i + value.length), value)) {
      return i;
    }
  }
  return undefined;
}

export function splitArrayBy<T>(arr:T[], val: T): T[][] {
  const arrs:T[][] = [];
  let currArr:T[] = [];
  while (arr.length) {
    const v = arr.shift() as T;
    if (v === val) {
      arrs.push(currArr);
      currArr = [];
    } else {
      currArr.push(v);
    }
  }
  arrs.push(currArr);
  return arrs.filter(x => x.length > 0);

}

export function flipObject(o: KeyVal<any>): KeyVal<string> {
  return Object.keys(o).reduce<KeyVal<string>>((ret, key) => {
    ret[o[key]] = key;
    return ret;
  }, {});
}

export const sortDescending = (a: number, b: number): 1 | -1 | 0 => {
  if (a < b) {
    return 1;
  } else if (a > b) {
    return -1;
  }
  return 0;
};

export const sortAscending = (a: number, b: number): 1 | -1 | 0 => {
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  }
  return 0;
};

export const chunkArray = <T>(arr:T[], size: number): T[][] => {
  return arr.reduce<T[][]>((acc, item, i) => {
    const c = Math.floor(i / size);
    if (acc[c] === undefined) {
      acc[c] = [];
    }
    acc[c].push(item);
    return acc;
  }, []);
}

export function between(a:number, b:number, inclusive:boolean = true):number[] {
  const start = Math.min(a, b);
  const end = Math.max(a, b);
  const arr = [...Array(end - start + 1).keys()].map(k => k + start);
  if (!inclusive) {
    arr.shift();
    arr.pop();
  }
  return arr;
}

// Function to calculate the greatest common divisor (GCD) of two numbers
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

// Function to calculate the least common multiple (LCM) of two numbers
function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

// Function to calculate the least common denominator of an array of numbers
export function lcd(numbers: number[]) {
  if (numbers.length < 2) {
    throw new Error('Array must contain at least two numbers.');
  }

  return numbers.reduce((prev, curr) => lcm(prev, curr));
}