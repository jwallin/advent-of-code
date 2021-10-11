import { Position, sum } from './position';

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

export class Matrix<T = any> {
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

  private _isValidPosition(p: Position) {
    return p.x >= 0 
      && p.y >= 0 
      && p.y <= this._matrix.length;
  }

  get rows(): T[][] {
    return this._matrix;
  }

  set(pos: Position, value: T) {
    this._getOrSetRow(pos.y)[pos.x] = value;
  }

  get(pos: Position): T | undefined {
    if (!this._isValidPosition(pos) || this._matrix[pos.y] === undefined) {
      return undefined;
    }
    return this._matrix[pos.y][pos.x];
  }

  draw(): string {
    return this._matrix.map(x => x.map(y => y === undefined ? '' : y).join('')).join('\n');
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
        yield {x, y};
      }
    }
  }

  asArray() {
    return [...this.iterator()];
  }

  values(): (T | undefined)[] {
    return this.asArray().map((p:Position) => this.get(p));
  }

  clone(): Matrix {
    return new Matrix(JSON.parse(JSON.stringify(this._matrix)));
  }

  adjacentPositions(p: Position): Position[] {
    return DIRECTIONS.map(d => sum(p, d));
  }

  adjacentValues(p: Position): (T | undefined)[] {
    return this.adjacentPositions(p).map(p => this.get(p));
  }

  equals(m: Matrix<T>): boolean {
    return JSON.stringify(this.rows) === JSON.stringify(m.rows);
  }

  visibleValues(pos: Position, predicate: (x: any) => boolean): T[] {
    //Walk in each direction, until unvalid pos
    return DIRECTIONS.reduce((acc: any[], d) => {
      let newPos = sum(pos, d);
      while(this._isValidPosition(newPos) && this.get(newPos) !== undefined) {
        const val = this.get(newPos);
        if (predicate(val)) {
          return [...acc, val];
        }
        newPos = sum(newPos, d);
      }
      return acc;
    }, []);
  }

  flipVertically(): Matrix {
    const clone = this.clone();
    clone.rows.reverse();
    return clone;
  }

  flipHorizontally(): Matrix {
    const clone = this.clone();
    clone.rows.forEach(r => r.reverse());
    return clone;
  }

  rotate(): Matrix {
   const a = new Matrix();
   for (let y = 0; y < this.rows.length; y++) {
    for (let x = 0; x < this.rows[y].length; x++) {
      a.set({x: y, y: x}, this.get({x, y}));
    }
   }
   return a.flipHorizontally();
  }

  getRow(i:number):T[] {
    return this.rows[i];
  }

  getCol(i:number):T[] {
    return this.rows.map(r => r[i]);
  }

  crop(from:Position, to:Position) {
    return new Matrix(this.rows.slice(from.y, to.y + 1).map(r => r.slice(from.x, to.x + 1)));
  }

  trim() {
    return this.crop({x:1, y:1}, {y: this.rows.length - 2, x: this.rows[0].length - 2});
  }

  toString() {
    return this.draw();
  }
}