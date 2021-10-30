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

export const readingOrder = (a:Position, b:Position) => (a.y !== b.y) ? Math.sign(a.y - b.y) : Math.sign(a.x - b.x);

export const NEIGHBORS: Position[] =[
  { x: 0, y: -1 },  // N
  { x: 1, y: 0 },   // E
  { x: 0, y: 1 },   // S
  { x: -1, y: 0 },  // W
];