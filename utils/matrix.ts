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
}