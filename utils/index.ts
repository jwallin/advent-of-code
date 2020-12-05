import { lines } from './lines';
import { Direction, Position } from './types';

export { lines };
export { Direction, Position };

export const toChars = (value:string): string[] => [...value];
export const countDigits = (input: number): number => toChars(String(input)).length;
export const isValidYear = (input: number, min: number, max: number): boolean => countDigits(input) === 4 && input >= min && input <= max;
export const hasAllValuesFrom = (input:any[], target:any[]): boolean => target.every((v:any) => input.includes(v));
export const range = (max:number):number[] => [...Array(max).keys()];