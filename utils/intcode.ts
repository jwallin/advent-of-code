import { KeyVal } from './types';

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

export class IntCode {

  private _instructions:Instruction[];
  private _registers:number[];
  private _ip:number = -1;

  constructor(registers: number[], instructions:string[]) {
    this._registers = registers;

    if (instructions[0].startsWith('#')) {
      this._ip = Number(instructions.shift()?.match(/#ip\s(\d+)/)?.[1]);
    }

    this._instructions = instructions
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
  }

  run() {
    while (this._registers[this._ip] < this._instructions.length) {
      // Load instruction
      const instr = this._instructions[this._registers[this._ip]];
  
      //Run
      this.callOp(instr.op, ...instr.arguments);
      //console.log(p, instr, registers);
  
      //Update ip
      this._registers[this._ip] += 1;
    }
  }

  callOp(fn:OpFunction, ...args:number[]) {
    const [a, b, c] = args;
    fn(this._registers, a, b, c);
  }
}