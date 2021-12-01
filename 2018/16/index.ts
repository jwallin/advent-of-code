import { arrayMatch, getInput, arrayIndexOf, splitArrayBy, intersection } from '../../utils';
import { KeyVal } from '../../utils/types';

type SampleInstruction = {
  before: number[],
  instruction: number[],
  after: number[]
}

type OpFunction = (r: number[], a:number, b:number, c:number) => void

function parseSample(input:string[]): SampleInstruction {
  const r = /\w+:\s+\[(.+)\]$/
  return {
    before: (input[0].match(r))?.[1].split(', ').map(Number) as number[],
    instruction: mapInstruction(input[1]),
    after: (input[2].match(r))?.[1].split(', ').map(Number) as number[]
  };
}

const operations:KeyVal<OpFunction> = {
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
  setti: (r: number[], a:number, b:number, c:number) => {
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

function mapInstruction(input: string): number[] {
  return input.split(' ').map(Number);
}

function callOp(registers:number[], fn:OpFunction, ...args:number[]) {
  const newRegisters = [...registers];
  const [a, b, c] = args;
  fn(newRegisters, a,b,c);
  return newRegisters;
}

function getPossibleOps(s: SampleInstruction) {
  return Object.entries(operations).filter(([, fn]) => {
    const [, ...args] = s.instruction;
    const newRegs = callOp(s.before, fn, ...args);
    return arrayMatch(newRegs, s.after); 
  }).map(([key,]) => key);
}

function getSamplesAndInstructions(input:string[]):[SampleInstruction[], number[][]] {
  // Split into two sections
  const splitValue = ['', '', ''];
  const i = arrayIndexOf(input, splitValue) || input.length;
  return [splitArrayBy(input.slice(0, i), '').map(parseSample), input.slice(i + splitValue.length).map(mapInstruction)]
}

function mapOpCodes(a: [number, string[]][]) {
  const candidates = a.reduce<KeyVal<string[]>>((acc, [code, candidates]) => Object.assign({}, acc, {[code]: acc[code] ? intersection(candidates, acc[code]) : candidates}), {});

  const totalOps = new Set(Object.keys(candidates)).size;

  const known: KeyVal<string> = {};
  while (Object.keys(known).length < totalOps) {
    Object.entries(candidates)
      .map<[string, string[]]>(([code, candidates]) => [code, candidates.filter(c => !Object.values(known).includes(c))])
      .filter(([, candidates]) => candidates.length === 1)
      .map(([code, candidates]) => [code, candidates[0]])
      .forEach(([code, candidate]) => { known[code] = candidate; });
  }
  return known;
}

async function partOne() {
  const input = (await getInput());
  
  const [samples,] = getSamplesAndInstructions(input);
  const samplesWithThreeOrMore = samples.reduce<number>((acc, s) => (getPossibleOps(s).length >= 3) ? acc + 1 : acc, 0)
  
  console.log(samplesWithThreeOrMore)
}

async function partTwo() {
  const input = (await getInput());
  const [samples, instructions] = getSamplesAndInstructions(input);  
  const possibleOps = samples.map<[number, string[]]>(s => [s.instruction[0], getPossibleOps(s)]);
  const opCodes: KeyVal<string> = mapOpCodes(possibleOps);
  const registers:number[] = [0, 0, 0, 0];
  instructions.forEach(i => {
    const [code , ...args] = i;
    const fn = operations[opCodes[code]];
    const [a, b, c] = args;
    fn(registers, a, b, c);
  });
  console.log(registers)
}

partTwo();

