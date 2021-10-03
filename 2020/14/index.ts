import { getInput, toChars, sum, prependZeros } from '../utils';

enum InstructionType {
  Mask,
  Memory
};

type MemoryAddress = {
  [key: number]: number
};

type MemoryInstruction = {
  position: number
  value: number,
  type: InstructionType
};

type MaskInstruction = {
  value: string,
  type: InstructionType
};

type Instruction = MemoryInstruction | MaskInstruction;

function toBitArray(value: number, length: number = 0): string[] {
  return prependZeros(value.toString(2), length);
}

function bitmask(val:number, mask:string, ignoreValues:string[] = ['X']): string {
  let result = toBitArray(val, mask.length);
  toChars(mask).forEach((m:string, i:number) => {
    if (ignoreValues.includes(m)) {
      return;
    }
    result[i] = m;
  });
  return result.join('')
}

function getAllValues(input: string):number[] {
  const numBits = toChars(input).filter(x => x === 'X').length;
  let values:number[] = [];
  for (let i = 0; i < Math.pow(2, numBits); i ++) {
    const bits = toBitArray(i, numBits);
    let a = toChars(input).map(c => c === 'X' ? bits.shift() : c);
    values.push(parseInt(a.join(''), 2));
  }
  return values;
}

function getInstruction(input:string): Instruction {
  let p = input.split(' = ');
  if (p[0] === 'mask') {
    return {
      value: p[1],
      type: InstructionType.Mask
    }
  } 

  return {
    position: parseInt(p[0].substring(p[0].indexOf('[') + 1, p[0].indexOf(']'))),
    value: parseInt(p[1]),
    type: InstructionType.Memory
  }
}

async function partOne() {
  const input = await getInput();
  let mask = '';
  const mem:any = [];
  input.forEach(x => {
    const instruction = getInstruction(x);
    if (instruction.type === InstructionType.Mask) {
      mask = (instruction as MaskInstruction).value;
    } else {
      const { position, value } = instruction as MemoryInstruction;
      mem[position] = parseInt(bitmask(value, mask), 2);
    }
  });
  console.log(mem.reduce(sum, 0))
}

async function partTwo() {
  const input = await getInput();
  let mask = '';
  const mem:MemoryAddress = {};
  input.forEach(x => {
    const instruction = getInstruction(x);
    if (instruction.type === InstructionType.Mask) {
      mask = (instruction as MaskInstruction).value;
    } else {
      const { position, value } = instruction as MemoryInstruction;
      getAllValues(bitmask(position, mask, ['0'])).forEach(x => {
        mem[x] = value;
      });
    }
  });
  console.log(Object.values(mem).reduce(sum, 0))
}

partOne();
partTwo();