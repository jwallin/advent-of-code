import { Position, sum } from './position';

const ADJACENT: Position[] =[
  { x: 0, y: -1 },  // N
  { x: 1, y: 0 },   // E
  { x: 0, y: 1 },   // S
  { x: -1, y: 0 },  // W
];

const ADJACENT_AND_DIAGONAL: Position[] =[
  ...ADJACENT,
  { x: 1, y: -1 },  // NE
  { x: 1, y: 1 },   // SE
  { x: -1, y: 1 },  // SW
  { x: -1, y: -1 }, // NW
];

export class Matrix<T = any> {
  private _matrix: T[][];

  constructor(matrix: T[][] = []) {
    this._matrix = matrix;
  }

  private _getOrSetRow(y: number) {
    let row = this._matrix[y];
    if (!row) {
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

  get columns(): T[][] {
    return this.rotateRight().rows;
  }

  fill(from: Position, to: Position, value: T, overwrite = true) {
    for (let y = from.y; y <= to.y; y++) {
      for (let x = from.x; x <= to.x; x++) {
        if (overwrite || !this.has({x,y})) {
          this.set({x,y}, value);  
        }
      }
    }
  }

  set(pos: Position, value: T) {
    this._getOrSetRow(pos.y)[pos.x] = value;
  }

  has(pos: Position): boolean {
    return this._isValidPosition(pos) 
      && this._matrix[pos.y] !== undefined
      && this._matrix[pos.y][pos.x] !== undefined;
  }

  get(pos: Position, def?: T | undefined): T {
    if (!this.has(pos)) {
      if (def !== undefined) {
        return def;
      } else {
        throw new Error(`Invalid position x: ${pos.x}, y: ${pos.y}`);
      }
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
    return this.asArray().filter(p => this.has(p)).map(p => this.get(p));
  }

  clone(): Matrix<T> {
    const c = JSON.parse(JSON.stringify(this._matrix)).map((x:any) => x === null ? undefined : x);
    return new Matrix(c);
  }

  adjacentPositions(p: Position): Position[] {
    return ADJACENT.map(d => sum(p, d));
  }

  adjacentValues(p: Position): (T | undefined)[] {
    return this.adjacentPositions(p).filter(x => this.has(x)).map(p => this.get(p));
  }

  adjacentAndDiagonalPositions(p: Position): Position[] {
    return ADJACENT_AND_DIAGONAL.map(d => sum(p, d));
  }

  adjacentAndDiagonalValues(p: Position): (T | undefined)[] {
    return this.adjacentAndDiagonalPositions(p).filter(x => this.has(x)).map(p => this.get(p));
  }

  equals(m: Matrix<T>): boolean {
    return JSON.stringify(this.rows) === JSON.stringify(m.rows);
  }

  visibleValues(pos: Position, predicate: (x: any) => boolean): T[] {
    //Walk in each direction, until unvalid pos
    return ADJACENT_AND_DIAGONAL.reduce((acc: any[], d) => {
      let newPos = sum(pos, d);
      while (this._isValidPosition(newPos) && this.get(newPos) !== undefined) {
        const val = this.get(newPos);
        if (predicate(val)) {
          return [...acc, val];
        }
        newPos = sum(newPos, d);
      }
      return acc;
    }, []);
  }

  flipVertically(): Matrix<T> {
    return new Matrix(this.rows.slice().reverse());
  }

  flipHorizontally(): Matrix<T> {
    const clone = this.clone();
    clone.rows.filter(r => !!r).forEach(r => r.reverse());
    return clone;
  }
  
  private flipXandY(): Matrix<T> {
    const a = new Matrix<T>();
    for (let y = 0; y < this.rows.length; y++) {
      if (!this.rows[y]) {
        continue;
      }
      for (let x = 0; x < this.rows[y].length; x++) {
        if (this.has({x, y})) {
          a.set({x: y, y: x}, this.get({x, y}));
        }
      }
    }
    return a;
  }

  rotateRight(): Matrix<T> {
   return this.flipXandY().flipHorizontally();
  }

  rotateLeft(): Matrix<T> {
    return this.flipXandY().flipVertically();
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

  positionsWithValue(value: T) {
    return this.asArray().filter(x => this.get(x) === value);
  }

  maxPos(): Position {
    return {
      x: Math.max(...this.columns.map(x => x.length)) -1,
      y: this.rows.length - 1
    }
  }
}