import { HighlightSpanKind } from 'typescript';
import { Position } from './types';

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

  get rows(): any[] {
    return this._matrix;
  }

  set(pos: Position, value: any) {
    this._getOrSetRow(pos.y)[pos.x] = value;
  }

  get(x: number, y:number): any {
    return this._getOrSetRow(y)[x];
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
    return this.asArray().map(({x, y}) => this.get(x, y));
  }
}