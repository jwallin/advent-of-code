import { getInput, multiply, sortDescending, splitArrayBy } from '../../utils';

class MonkeyTest {
  divider: number;
  throwToIfTrue: number;
  throwToIfFalse: number;

  constructor(divider: number, throwToIfTrue: number, throwToIfFalse: number) {
    this.divider = divider;
    this.throwToIfTrue = throwToIfTrue;
    this.throwToIfFalse = throwToIfFalse;
  }

  run(worryLevel: number) {
    if (worryLevel % this.divider === 0) {
      return this.throwToIfTrue;
    }
    return this.throwToIfFalse;
  }
  
  static parse(m: string[]): MonkeyTest {
    const divider = Number(consumeString(m).replace('Test: divisible by ', ''));
    const testTrue = Number(consumeString(m).replace('If true: throw to monkey ', ''));
    const testFalse = Number(consumeString(m).replace('If false: throw to monkey ', ''));
    return new MonkeyTest(divider, testTrue, testFalse);
  }
}

const consumeString = (m: string[]): string => (m.shift() as string).trimStart();

class Monkey {
  id: number;
  items: number[];
  op: string;
  test: MonkeyTest;
  totalInspections = 0;
  worryRelief: boolean;

  constructor(id: number, items: number[], op: string, test: MonkeyTest, worryRelief: boolean = true) {
    this.id = id;
    this.items = items;
    this.op = op;
    this.test = test;
    this.worryRelief = worryRelief;    
  }

  receiveItem(item: number) {
    this.items.push(item);
  }

  hasItems() {
    return this.items.length > 0;
  }

  inspectAndThrow(): [number, number] {
    if (!this.hasItems()) {
      throw new Error('No item to throw!');
    }
    const i = this.items.shift() as number;
    const worry = this.calcWorryLevel(i);
    const nextMonkey = this.test.run(worry);
    this.totalInspections++;
    return [worry, nextMonkey];
  }

  calcWorryLevel(item: number) {
    let w = eval(this.op.replace(/old/g, String(item)));
    if (this.worryRelief) {
      w = Math.floor(w / 3);
    }
    
    return w;
  }

  static parse(m: string[], worryRelief:boolean = true): Monkey {
    const id = Number(consumeString(m).match(/^Monkey (\d+):/)?.[1])
    const items = consumeString(m).replace('Starting items: ', '').split(', ').map(Number) as number[];
    const op =  consumeString(m).replace('Operation: new = ', '');
    const test = MonkeyTest.parse(m);
    return new Monkey(id, items, op, test, worryRelief);
  }
}

function round(monkeys: Monkey[],  lcm: number | undefined = undefined) {
  monkeys.forEach(m => {
    while (m.hasItems()) {
      let [worry, receiver] = m.inspectAndThrow();
      if (lcm !== undefined) { 
        worry = worry % lcm;
      }
      monkeys.find(m => m.id === receiver)?.receiveItem(worry);
    }
  });
}

async function partOne() {
  const input = splitArrayBy(await getInput(), '');
  const monkeys = input.map(m => Monkey.parse(m));
  for ( let i = 0; i < 20; i++) {
    round(monkeys);
  }
  monkeys.forEach(m => {
    console.log(`Monkey ${m.id}: ${m.totalInspections}`)
  });
  
  const val = monkeys.map(m => m.totalInspections).sort(sortDescending).slice(0, 2).reduce(multiply);
  console.log(val)
}

async function partTwo() {
  const input = splitArrayBy(await getInput(), '');
  const monkeys = input.map(m => Monkey.parse(m, false));
  const lcm = monkeys.map(x => x.test.divider).reduce(multiply);
  for ( let i = 0; i < 10000; i++) {
    round(monkeys, lcm);
  }
  monkeys.forEach(m => {
    console.log(`Monkey ${m.id}: ${m.totalInspections}`)
  
  })
  const val = monkeys.map(m => m.totalInspections).sort(sortDescending).slice(0, 2).reduce(multiply);
  console.log(val)
}
  

partTwo();