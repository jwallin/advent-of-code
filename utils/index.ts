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