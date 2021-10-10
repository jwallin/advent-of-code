export type Position = {
  x: number,
  y: number
};

export const max = (input:Position[]):Position => input.reduce((prev, curr) => ({ x: Math.max(prev.x, curr.x), y: Math.max(prev.y, curr.y) }));
export const min = (input:Position[]):Position => input.reduce((prev, curr) => ({ x: Math.min(prev.x, curr.x), y: Math.min(prev.y, curr.y) }));

export const toKey = (p:Position):string => JSON.stringify(p);
export const fromKey = (str:string):Position => JSON.parse(str);

export const sum = (p1: Position, p2: Position): Position => ({ x: p1.x + p2.x, y: p1.y + p2.y });
export const multiply = (p1: Position, p2: Position): Position => ({ x: p1.x * p2.x, y: p1.y * p2.y });

export const manhattanDistance = (p1: Position, p2: Position): number => Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);

export const area = (p1: Position, p2: Position): number => Math.abs(p1.x - p2.x) * Math.abs(p1.y - p2.y);

export const equals = (p1: Position, p2: Position): boolean => p1.x === p2.x && p1.y === p2.y;