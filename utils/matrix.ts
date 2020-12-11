import { Position } from './types';

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

function adjacentPositions(p: Position) {
  const { x, y } = p;
  return [
    { x: x - 1, y: y - 1 },
    { x, y: y - 1 },
    { x: x + 1, y: y - 1 },
    { x: x - 1, y },
    { x: x + 1, y },
    { x: x - 1, y: y + 1 },
    { x, y: y + 1 },
    { x: x + 1, y: y + 1 }
  ];
}

function goToPos(from: Position, to:Position):Position {
  return {
    x: from.x + to.x,
    y: from.y + to.y
  };
} 

export class Matrix {
  private _matrix: any[][];

  constructor(matrix: any[][] = []) {
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

  get rows(): any[] {
    return this._matrix;
  }

  set(pos: Position, value: any) {
    this._getOrSetRow(pos.y)[pos.x] = value;
  }

  get(pos: Position): any {
    if (!this._isValidPosition(pos) || this._matrix[pos.y] === undefined) {
      return undefined;
    }
    return this._matrix[pos.y][pos.x];
  }

  draw(): string {
    return this._matrix.map(x => x.map(y => y === undefined ? '' : y).join(' ')).join('\n');
  }

  hasValue(value: any): boolean {
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

  values(): any[] {
    return this.asArray().map((p:Position) => this.get(p));
  }

  clone(): Matrix {
    return new Matrix(JSON.parse(JSON.stringify(this._matrix)));
  }

  adjacent(p: Position): any[] {
    return adjacentPositions(p).map(p => this.get(p));
  }

  equals(m: Matrix): boolean {
    return JSON.stringify(this.rows) === JSON.stringify(m.rows);
  }

  visibleValues(pos: Position, predicate: (x: any) => boolean): any[] {
    //Walk in each direction, until unvalid pos
    let found:any[] = [];
    DIRECTIONS.forEach(d => {
      let newPos = { x: pos.x + d.x, y: pos.y + d.y };;
      while(this._isValidPosition(newPos) && this.get(newPos) !== undefined) {
        const val = this.get(newPos);
        if (predicate(val)) {
          found.push(val);
          break;
        }
        newPos = { x: newPos.x + d.x, y: newPos.y + d.y };
      }
    })
    return found;
  }
}