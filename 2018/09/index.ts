import { getInput } from '../../utils';

class LinkedList {
  private _value: number;
  private _left: LinkedList;
  private _right: LinkedList;

  constructor(value: number, left: LinkedList | undefined = undefined, right: LinkedList | undefined = undefined) {
    this._value = value;
    this._left = left || this ;
    this._right = right || this;
    
    this._left.right = this;
    this._right.left = this;
  }

  set left(val: LinkedList) {
    this._left = val;
  }

  set right(val: LinkedList) {
    this._right = val;
  }

  get left(): LinkedList {
    return this._left;
  }

  get right(): LinkedList {
    return this._right;
  }

  get value(): number {
    return this._value;
  }

  stepLeft(steps: number): LinkedList {
    if (steps === 0) {
      return this;
    }
    return this._left.stepLeft(steps - 1);
  }

  stepRight(steps: number): LinkedList {
    if (steps === 0) {
      return this;
    }
    return this._right.stepRight(steps - 1);
  }

  remove(): LinkedList {
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
    let curr: LinkedList = this;
    while (true) {
      curr = curr.right;
      if (curr === this) {
        break;
      }
      v.push(curr.value)
    }
    return v.join(' ')
  }
  
}

function parseInput(input: string) {
  const regex = /^(\d+) players; last marble is worth (\d+) points/;
  const m = input.match(regex);
  if (!m) {
    throw new Error(`Couldnt parse input: ${input}`);
  }
  const [,players, maxMarble] = m;
  return [players, maxMarble].map(Number)
}

function play(numPlayers: number, maxMarble: number): number {
  const players = new Array(numPlayers).fill(0);
  let currentMarble: LinkedList = new LinkedList(0);
  currentMarble.left = currentMarble;
  currentMarble.right = currentMarble;
  for (let i = 1; i <= maxMarble; i++) {
    const currPlayer = i % numPlayers;
    if (i % 23 === 0) {
      const toRemove = currentMarble.stepLeft(7);
      players[currPlayer] += i + toRemove.value;
      currentMarble = toRemove.remove();
    } else {
      const toLeft = currentMarble.right;
      const toRight = toLeft.right;
      currentMarble = new LinkedList(i, toLeft, toRight);
    }
  }
  return Math.max(...players);
}

async function partOne() {
  const [numPlayers, maxMarble] = (await getInput()).map(parseInput)[0];
  const highScore = play(numPlayers, maxMarble);

  console.log(highScore);
}

async function partTwo() {
  const [numPlayers, maxMarble] = (await getInput()).map(parseInput)[0];
  const highScore = play(numPlayers, maxMarble * 100);

  console.log(highScore);
}

partTwo();