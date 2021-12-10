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

export const pairs = (array: number[]): number[][] => Array.from(combinations(array, 2));
export const triplets = (array:number[]): number[][] => Array.from(combinations(array, 3));

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

export function* combinations(array: number[], k:number, start:number = 0): Generator<number[]> {
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