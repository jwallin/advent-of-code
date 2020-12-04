import { lines } from './lines';
import { Direction, Position } from './types';

export { lines };
export { Direction, Position };

export function countDigits(input: number): number {
  return toChars(String(input)).length;
}

export function toChars(value:string): string[] {
  return [...value];
}

export function isValidYear(input: number, min: number, max: number) {
  return countDigits(input) === 4 && input >= min && input <= max;
}