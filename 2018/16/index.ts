import { Stream } from 'stream';
import { arrayMatch, getInput } from '../../utils';

enum OpCode {
  addr,
  addi
}

type Instruction = {
  opcode: number,
  a:number,
  b:number,
  c:number
};

type InstructionFn = {
  (input: number): boolean;
}

type Quadruple<T> = [T, T, T, T];

type SampleInstruction = {
  before: Quadruple<number>,
  instruction: Quadruple<number>,
  after: Quadruple<number>
}

class Device {
  private _registers:number[];
  private _inputStream:Stream;
  private _outputStream:Stream;

  constructor(inputStream:Stream, outputStream:Stream) {
    this._registers = [];
    this._inputStream = inputStream;
    this._outputStream = outputStream;


  }
}

type Primitive = string | number | boolean | undefined | bigint | symbol | null;

function arrayEquals<T>(a:T[], b:T[]) {
  if (a.length !== b.length) {
    return false;
  }

  for(let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

function arrayIndexOf<T>(arr:T[], value:T[]):number | undefined {
  for (let i = 0; i < arr.length; i++) {
    if (arrayEquals(arr.slice(i, i + value.length), value)) {
      return i;
    }
  }
  return undefined;
}

function splitArrayBy<T>(arr:T[], val: T): T[][] {
  const arrs:T[][] = [];
  let currArr:T[] = [];
  while (arr.length) {
    const v = arr.shift() as T;
    if (v === val) {
      arrs.push(currArr);
      currArr = [];
    } else {
      currArr.push(v);
    }
  }
  arrs.push(currArr);
  return arrs.filter(x => x.length > 0);

}

function parseSample(input:string[]): SampleInstruction {
  const r = /\w+:\s+\[(.+)\]$/
  return {
    before: (input[0].match(r))?.[1].split(', ').map(Number) as Quadruple<number>,
    instruction: input[1].split(' ').map(Number) as Quadruple<number>,
    after: (input[2].match(r))?.[1].split(', ').map(Number) as Quadruple<number>
  };
}

function isReg(v : number) {
  return v >= 0 && v < 4;
}

const OpCodes = {
  addr: (r: Quadruple<number>, a:number, b:number, c:number) => {
    if (!isReg(a) || !isReg(b)) throw new Error('not registry');
    r[c] = r[a] + r[b];
  },
  addi: (r: Quadruple<number>, a:number, b:number, c:number) => {
    if (!isReg(a)) throw new Error('not registry');
    r[c] = r[a] + b;
  },

  mulr: (r: Quadruple<number>, a:number, b:number, c:number) => {
    if (!isReg(a) || !isReg(b)) throw new Error('not registry');
    r[c] = r[a] *  r[b];
  },
  muli: (r: Quadruple<number>, a:number, b:number, c:number) => {
    if (!isReg(a)) throw new Error('not registry');
    r[c] = r[a] * b;
  },

  banr: (r: Quadruple<number>, a:number, b:number, c:number) => {
    if (!isReg(a) || !isReg(b)) throw new Error('not registry');
    r[c] = r[a] & r[b];
  },
  bani: (r: Quadruple<number>, a:number, b:number, c:number) => {
    if (!isReg(a)) throw new Error('not registry');
    r[c] = r[a] & b;
  },

  borr: (r: Quadruple<number>, a:number, b:number, c:number) => {
    if (!isReg(a) || !isReg(b)) throw new Error('not registry');
    r[c] = r[a] | r[b];
  },
  bori: (r: Quadruple<number>, a:number, b:number, c:number) => {
    if (!isReg(a)) throw new Error('not registry');
    r[c] = r[a] | b;
  },
  
  setr: (r: Quadruple<number>, a:number, b:number, c:number) => {
    if (!isReg(a)) throw new Error('not registry');
    r[c] = r[a];
  },
  setti: (r: Quadruple<number>, a:number, b:number, c:number) => {
    r[c] = a;
  },

  gtir: (r: Quadruple<number>, a:number, b:number, c:number) => {
    if (!isReg(b)) throw new Error('not registry');
    r[c] = a > r[b] ? 1 : 0;
  },
  gtri: (r: Quadruple<number>, a:number, b:number, c:number) => {
    if (!isReg(a)) throw new Error('not registry');
    r[c] = r[a] > b ? 1 : 0;
  },
  gtrr: (r: Quadruple<number>, a:number, b:number, c:number) => {
    if (!isReg(a) || !isReg(b)) throw new Error('not registry');
    r[c] = r[a] > r[b] ? 1 : 0;
  },
  
  eqir: (r: Quadruple<number>, a:number, b:number, c:number) => {
    if (!isReg(b)) throw new Error('not registry');
    r[c] = a === r[b] ? 1 : 0;
  },
  eqri: (r: Quadruple<number>, a:number, b:number, c:number) => {
    if (!isReg(a)) throw new Error('not registry');
    r[c] = r[a] === b ? 1 : 0;
  },
  eqrr: (r: Quadruple<number>, a:number, b:number, c:number) => {
    if (!isReg(a) || !isReg(b)) throw new Error('not registry');
    r[c] = r[a] = r[b] ? 1 : 0;
  }
};

type op = (r: Quadruple<number>, a:number, b:number, c:number) => void;

function callOp(registers:Quadruple<number>, fn:op, a:number, b:number, c:number) {
  const newRegisters = [...registers] as Quadruple<number>;
  fn(newRegisters, a, b, c);
  return newRegisters;
}

function behavesLike(instruction: Quadruple<number>, before:Quadruple<number>,  after: Quadruple<number>) {
  Object.values(OpCodes).forEach((fn) => {
    const registers = before.slice();
    
  })
}

function getPossibleOps(before: Quadruple<number>, after: Quadruple<number>, instructions: Quadruple<number>) {
  return Object.entries(OpCodes).filter(([opCode, fn]) => {
    const registers = before;
    const [code, ...args] = instructions;
    const [a, b, c] = instructions.slice(1);
    const newRegs = callOp(before, fn, a, b, c);
    return arrayMatch(newRegs, after); 
  }).length;
}

async function partOne() {
  const input = (await getInput());
  // Split into two sections
  const splitValue = ['', '', ''];
  const i = arrayIndexOf(input, splitValue) || input.length;
  const [samples, ] = [splitArrayBy(input.slice(0, i), '').map(parseSample), input.slice(i + splitValue.length)]
  let samplesWithThreeOrMore = 0;
  
  samples.forEach(s => {
    const a = getPossibleOps(s.before, s.after, s.instruction);
    if (a >= 3) {
      samplesWithThreeOrMore++;
    }
  });
  console.log(samplesWithThreeOrMore)
}

async function partTwo() {
  const input = (await getInput()).map(Number);
}
  

partOne();