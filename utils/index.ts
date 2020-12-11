import { lines } from './lines';
import { Direction, Position } from './types';
import { combinations } from './combinations';

export { lines };
export { Direction, Position };
export { combinations };

export const toChars = (value:string): string[] => [...value];
export const countDigits = (input: number): number => toChars(String(input)).length;
export const isValidYear = (input: number, min: number, max: number): boolean => countDigits(input) === 4 && input >= min && input <= max;
export const hasAllValuesFrom = (input:any[], target:any[]): boolean => target.every((v:any) => input.includes(v));
export const range = (max:number):number[] => [...Array(max).keys()];
export const unique = <U>(input: U[]): U[] => Array.from(new Set(input));
export const sum = (a: number, b: number): number => a + b;
export const subtract = (a: number, b: number): number => a - b;
export const intify = (input: string[]): (string | number)[] => input.map(s => isNaN(Number(s)) ? s : Number(s));

export const pairs = (array: number[]): number[][] => Array.from(combinations(array, 2));
export const triplets = (array:number[]): number[][] => Array.from(combinations(array, 3));

export const sumPositions = (p1: Position, p2: Position): Position => ({ x: p1.x + p2.x, y: p1.y + p2.y });
