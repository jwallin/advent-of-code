export class LinkedList<T> {
    private _value: T;
    private _left: LinkedList<T> | undefined;
    private _right: LinkedList<T> | undefined;
  
    constructor(value: T, left: LinkedList<T> | undefined = undefined, right: LinkedList<T> | undefined = undefined) {
      this._value = value;
      this._left = left;
      this._right = right;
      
      if (this._left) {
          this._left.right = this;
        }
      if (this._right) {
          this._right.left = this;
      }
    }
  
    get left(): LinkedList<T> | undefined{
      return this._left;
    }
  
    set left(val: LinkedList<T> | undefined) {
      this._left = val;
    }
  
    get right(): LinkedList<T> | undefined {
      return this._right;
    }
  
    set right(val: LinkedList<T> | undefined) {
      this._right = val;
    }
  
    get value(): T {
      return this._value;
    }
  
    stepLeft(steps: number): LinkedList<T> {
      if (steps === 0) {
        return this;
      }
      if (!this._left) {
          throw new Error('Couldnt step left');
      }
      return this._left.stepLeft(steps - 1);
    }
  
    stepRight(steps: number): LinkedList<T> {
      if (steps === 0) {
        return this;
      }
      if (!this._right) {
        throw new Error('Couldnt step left');
    }
      return this._right.stepRight(steps - 1);
    }

    insertRight(v: T): LinkedList<T> {
        this.right = new LinkedList(v, this, this.right);
        return this.right;
    }
  
    remove(): LinkedList<T> | undefined {
      if (this.left) {
        this.left.right = this.right;
      }
      if (this.right) {
        this.right.left = this.left;
      }
      const r = this.right;
      return r;
    }
  
    toString(): string {
      const v = [this.value];
      let curr: LinkedList<T> | undefined = this;
      while (true) {
        curr = curr.right;
        if (curr === this || curr === undefined) {
          break;
        }
        v.push(curr.value)
      }
      return v.join(' ')
    }

    static fromArray<U>(arr: U[]):LinkedList<U> {
        const els = arr.slice();
        const first = new LinkedList(els.shift() as U);
        let curr = first;
        while (els.length > 0) {
            curr = new LinkedList(els.shift() as U, curr);
        }
        return first;
    }
  }