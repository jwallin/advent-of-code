import { getInput } from '../../utils';
import { KeyVal } from '../../utils/types';

type Instruction = [string, string, string]
type Triplet = [number, number, number];

enum ModelNumberStrategy {
  HIGHEST = 9,
  LOWEST = 1
}

class ALU {
  private _instructions:Instruction[];
  private _registers:KeyVal<number>;

  constructor (instructions: Instruction[]) {
    this._instructions = instructions;
    this._registers = {};
    this.reset();
  }

  reset() {
    this._registers = {
      w: 0,
      x: 0,
      y: 0,
      z: 0
    }; 
  }

  run(input:number[]) {
    this._instructions.forEach(([instr, a, b]) => {
      const bVal = b?.match(/^-?\d+$/) ? Number(b) : this._registers[b];
      switch (instr) {
        case 'inp':
          this._registers[a] = input.shift() as number;
          break;
        case 'add':
          this._registers[a] = this._registers[a] + bVal;
          break;
        case 'mul':
          this._registers[a] = this._registers[a] * bVal;
          break;
        case 'div':
          this._registers[a] = Math.floor(this._registers[a] / bVal);
          break;
        case 'mod':
          this._registers[a] = this._registers[a] % bVal;
          break;
        case 'eql':
          this._registers[a] = this._registers[a] === bVal ? 1 : 0;
          break;
        default:
          throw Error(`operation ${instr} not supported`);
      }
    })
  }

  get registers() {
    return this._registers;
  }
}

function parseInstruction(s:string):Instruction {
  return s.split(' ') as  Instruction;
}

function findModelNumber(input: string[], strategy: ModelNumberStrategy) {
  const triplets: Triplet[] = [];
  const multiplier = strategy === ModelNumberStrategy.HIGHEST ? 1 : -1;

  for (let index = 0, i = 5, j = 15; i < input.length && j < input.length; index++, i += 18, j += 18) {
    const x = Number(input[i].split(' ')[2]);
    const y = Number(input[j].split(' ')[2]);
    triplets.push([index, x, y]);
  }

  const res: number[] = [];
  const stack: Triplet[] = [];
  triplets.forEach(t => {
    const [index, x] = t;
    if (x >= 10) {
      stack.push(t);
    } else {
      const [prevIndex, , prevY] = stack.pop() as Triplet;
      
      if ((prevY + x) * multiplier >= 0) {
        res[index] = strategy;
        res[prevIndex] = res[index] - (prevY + x);
      } else {
        res[prevIndex] = strategy;
        res[index] = res[prevIndex] + (prevY + x);
      }
    }
  });

  return res;
}

async function partOne() {
  const input = await getInput();
  const instr = input.map(parseInstruction);
  const alu = new ALU(instr);
  
  const res: number[] = findModelNumber(input, ModelNumberStrategy.HIGHEST);
  console.log(res.join(''))
  
  alu.run(res);
  console.log(alu.registers)
}


async function partTwo() {
  const input = await getInput();
  const instr = input.map(parseInstruction);
  const alu = new ALU(instr);
  
  const res: number[] = findModelNumber(input, ModelNumberStrategy.LOWEST);
  console.log(res.join(''))
  
  alu.run(res);
  console.log(alu.registers)
}
  

partOne();
partTwo();