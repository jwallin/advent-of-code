import { lines } from './lines';
import { Direction } from './types';
import { combinations } from './combinations';

export { Direction };
export { combinations };

export const toChars = (value:string): string[] => [...value];
export const countDigits = (input: number): number => toChars(String(input)).length;
export const isValidYear = (input: number, min: number, max: number): boolean => countDigits(input) === 4 && input >= min && input <= max;
export const hasAllValuesFrom = (input:any[], target:any[]): boolean => target.every((v:any) => input.includes(v));
export const range = (max:number, min:number = 0):number[] => [...Array(max - min).keys()].map(k => k + min);
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

export const allEnumNames = (inp:Object):string[] => Object.values(inp).filter(x => typeof x === 'string');

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

export const arrayMatch = (a: any[], b: any[]): boolean => a.length === b.length && a.every((x,i) => b[i] === x);
export const intersection = (...a:any[][]):any[] => a.reduce((a, b) => a.filter(x => b.includes(x)));

export const cartesian = (...a:any[]) => a.reduce((a:any[], b:any[]):any[] => a.flatMap((d:any) => b.map((e:any) => [d, e].flat())));
