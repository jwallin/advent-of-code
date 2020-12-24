import { range } from '../utils';

class Cup {
  private _value: number;
  private _next: Cup | undefined;

  constructor(value:number) {
    this._value = value;
    this._next = undefined;
  }

  get value(): number {
    return this._value;
  }

  get next(): Cup {
    return this._next as Cup;
  }

  set next(c:Cup) {
    this._next = c;
  }
}

function playGame(input: string, numberOfMoves:number, numberOfCups:number):Map<number, Cup> {
  let inputValues = input.split('').map(Number);
  const cupValues = inputValues.concat(range(numberOfCups + 1, Math.max(...inputValues) + 1));
  const cups = cupValues.reduce((acc, n) => acc.set(n, new Cup(n)), new Map<number, Cup>());
  const maxVal = cupValues[cupValues.length  - 1];
  
  let prev:(Cup | undefined);
  cups.forEach(c => {
    if (prev) {
      prev.next = c;
    }
    prev = c;
  });

  // Close circle
  const first = cups.get(cupValues[0]) as Cup;
  const last = cups.get(cupValues[cupValues.length - 1]) as Cup;
  last.next = first;
  
  let current = first;
  for (let i = 0; i < numberOfMoves; i++) {
    let pick1 = current.next;
    let pick2 = pick1.next;
    let pick3 = pick2.next;
    const picked = [pick1, pick2, pick3];
    let next = pick3.next;

    let destVal = current.value - 1;
    while (destVal < 1 || picked.some(x => x.value === destVal)) {
      destVal = destVal - 1;
      if (destVal < 1) {
        destVal = maxVal;
      }
    }

    const dest = cups.get(destVal) as Cup;
    if (!dest) {
      console.error('Dest not found:', destVal);
    }
    const destNext = dest.next
    current.next = next;
    dest.next = pick1;
    pick3.next = destNext;
    current = next;
  }
  return cups;
}

function partOne() {
  const input = '614752839';
  const cups = playGame(input, 100, input.length);

  const allVals:number[] = [];
  var p = cups.get(1) as Cup;
  for (let j = 0; j < input.length - 1; j++) {
    p = p.next;
    allVals.push(p.value);
  }
  console.log(allVals.join(''))
}

function partTwo() { 
  const cups = playGame('614752839',10000000, 1000000);
  const oneCup = cups.get(1) as Cup;
  console.log(oneCup.next.value * oneCup.next.next.value);
}

partOne()

