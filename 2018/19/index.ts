import { arrayMatch, getInput, arrayIndexOf, splitArrayBy, intersection } from '../../utils';
import { KeyVal } from '../../utils/types';

type Instruction = {
  op: OpFunction,
  arguments: number[]
}

type OpFunction = (r: number[], a:number, b:number, c:number) => void

const OPERATIONS:KeyVal<OpFunction> = {
  addr: (r: number[], a:number, b:number, c:number) => {
    r[c] = r[a] + r[b];
  },
  addi: (r: number[], a:number, b:number, c:number) => {
    r[c] = r[a] + b;
  },

  mulr: (r: number[], a:number, b:number, c:number) => {
    r[c] = r[a] *  r[b];
  },
  muli: (r: number[], a:number, b:number, c:number) => {
    r[c] = r[a] * b;
  },

  banr: (r: number[], a:number, b:number, c:number) => {
    r[c] = r[a] & r[b];
  },
  bani: (r: number[], a:number, b:number, c:number) => {
    r[c] = r[a] & b;
  },

  borr: (r: number[], a:number, b:number, c:number) => {
    r[c] = r[a] | r[b];
  },
  bori: (r: number[], a:number, b:number, c:number) => {
    r[c] = r[a] | b;
  },
  
  setr: (r: number[], a:number, b:number, c:number) => {
    r[c] = r[a];
  },
  seti: (r: number[], a:number, b:number, c:number) => {
    r[c] = a;
  },

  gtir: (r: number[], a:number, b:number, c:number) => {
    r[c] = a > r[b] ? 1 : 0;
  },
  gtri: (r: number[], a:number, b:number, c:number) => {
    r[c] = r[a] > b ? 1 : 0;
  },
  gtrr: (r: number[], a:number, b:number, c:number) => {
    r[c] = r[a] > r[b] ? 1 : 0;
  },
  
  eqir: (r: number[], a:number, b:number, c:number) => {
    r[c] = a === r[b] ? 1 : 0;
  },
  eqri: (r: number[], a:number, b:number, c:number) => {
    r[c] = r[a] === b ? 1 : 0;
  },
  eqrr: (r: number[], a:number, b:number, c:number) => {
    r[c] = r[a] === r[b] ? 1 : 0;
  }
};

function callOp(registers:number[], fn:OpFunction, ...args:number[]) {
  //const newRegisters = [...registers];
  const [a, b, c] = args;
  fn(registers, a, b, c);
  //return newRegisters;
}

async function partOne() {
  const input = (await getInput());
  let ipIndex:number = -1;
  //let ip = 0;
  if (input[0].startsWith('#')) {
    ipIndex = Number(input.shift()?.match(/#ip\s(\d+)/)?.[1]);
  }
  const instructions = input
    .map(x => x.split(' '))
    .map(x => {
      const opName = x.shift() as string;
      const op = OPERATIONS[opName];
      if (!op) { throw new Error('Unknown operation ' + opName)}
      return {
        op,
        arguments: x.map(Number)
      }
    });
  
  const registers:number[] = [1, 0, 0, 0, 0, 0];
  while (registers[ipIndex] < instructions.length) {
    // Load instruction
    const instr = instructions[registers[ipIndex]];
    const p  = registers.slice();
    //Run
    callOp(registers, instr.op, ...instr.arguments);
    console.log(p, instr, registers);
    //Update ip
    registers[ipIndex] = registers[ipIndex] + 1;
  }
  console.log(registers);
}

function partTwo(n: number) {
  const sqrt = Math.sqrt(n);
  let res = (n % sqrt) === 0 ? sqrt : 0;
  for (let i = 1; i < sqrt; i++) {
    if (n % i === 0) {
      res += i + Math.floor(n / i);
    }
  }
  console.log(res);
}

partTwo(10551320);

