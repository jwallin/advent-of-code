import { Position } from './types';
import { sumPositions as sum } from './index';

const DIRECTIONS: Position[] =[
  { x: 0, y: -1 },  // N
  { x: 1, y: -1 },  // NE
  { x: 1, y: 0 },   // E
  { x: 1, y: 1 },   // SE
  { x: 0, y: 1 },   // S
  { x: -1, y: 1 },  // SW
  { x: -1, y: 0 },  // W
  { x: -1, y: -1 }, // NW
];

export class Matrix<T> {
  private _matrix: T[][];

  constructor(matrix: T[][] = []) {
    this._matrix = matrix;
  }

  private _getOrSetRow(y: number) {
    let row = this._matrix[y];
    if (row === undefined) {
      row = this._matrix[y] = [];
    }
    return row;
  }

  get rows(): T[][] {
    return this._matrix;
  }

  set(pos: Position, value: T) {
    this._getOrSetRow(pos.y)[pos.x] = value;
  }

  get(pos: Position): T {
    if (!this.has(pos)) {
      throw new Error(`Item not found ${pos}`);
    }
    return this._matrix[pos.y][pos.x];
  }

  draw(): string {
    return this._matrix.map(x => x.map(y => y === undefined ? '' : y).join(' ')).join('\n');
  }

  has(p: Position) {
    return this._matrix[p.y] && this._matrix[p.y][p.x] !== undefined;
  }

  hasValue(value: T): boolean {
    return !!this.values().find(x => x === value);
  }

  *iterator(): Generator<Position> {
    for (let y = 0; y < this._matrix.length; y++) {
      if (!this._matrix[y]) {
        continue;
      }
      for (let x = 0; x < this._matrix[y].length; x++) {
        yield { x, y };
      }
    }
  }

  asArray() {
    return [...this.iterator()];  
  }

  values(): (T)[] {
    return this.asArray().filter(p => this.has(p)).map((p:Position) => this.get(p));
  }

  clone(): Matrix<T> {
    return new Matrix(JSON.parse(JSON.stringify(this._matrix)));
  }

  adjacentValues(p: Position): (T)[] {
    return DIRECTIONS.map(d => sum(p, d)).filter(x => this.has(x)).map(p => this.get(p));
  }

  equals(m: Matrix<T>): boolean {
    return JSON.stringify(this.rows) === JSON.stringify(m.rows);
  }

  visibleValues(pos: Position, predicate: (x: T) => boolean): T[] {
    //Walk in each direction, until unvalid pos
    return DIRECTIONS.reduce((acc: T[], d) => {
      let newPos = sum(pos, d);
      while(this.has(newPos)) {
        const val = this.get(newPos);
        if (predicate(val)) {
          return [...acc, val];
        }
        newPos = sum(newPos, d);
      }
      return acc;
    }, []);
  }
}