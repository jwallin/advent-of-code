import { arrayMatch, getInput, arrayIndexOf, splitArrayBy, intersection } from '../../utils';
import { KeyVal } from '../../utils/types';

type Quadruple<T> = [T, T, T, T];

type SampleInstruction = {
  before: Quadruple<number>,
  instruction: Quadruple<number>,
  after: Quadruple<number>
}

type OpFunction = (r: Quadruple<number>, a:number, b:number, c:number) => void

function parseSample(input:string[]): SampleInstruction {
  const r = /\w+:\s+\[(.+)\]$/
  return {
    before: (input[0].match(r))?.[1].split(', ').map(Number) as Quadruple<number>,
    instruction: mapInstruction(input[1]),
    after: (input[2].match(r))?.[1].split(', ').map(Number) as Quadruple<number>
  };
}

const operations:KeyVal<OpFunction> = {
  addr: (r: Quadruple<number>, a:number, b:number, c:number) => {
    r[c] = r[a] + r[b];
  },
  addi: (r: Quadruple<number>, a:number, b:number, c:number) => {
    r[c] = r[a] + b;
  },

  mulr: (r: Quadruple<number>, a:number, b:number, c:number) => {
    r[c] = r[a] *  r[b];
  },
  muli: (r: Quadruple<number>, a:number, b:number, c:number) => {
    r[c] = r[a] * b;
  },

  banr: (r: Quadruple<number>, a:number, b:number, c:number) => {
    r[c] = r[a] & r[b];
  },
  bani: (r: Quadruple<number>, a:number, b:number, c:number) => {
    r[c] = r[a] & b;
  },

  borr: (r: Quadruple<number>, a:number, b:number, c:number) => {
    r[c] = r[a] | r[b];
  },
  bori: (r: Quadruple<number>, a:number, b:number, c:number) => {
    r[c] = r[a] | b;
  },
  
  setr: (r: Quadruple<number>, a:number, b:number, c:number) => {
    r[c] = r[a];
  },
  setti: (r: Quadruple<number>, a:number, b:number, c:number) => {
    r[c] = a;
  },

  gtir: (r: Quadruple<number>, a:number, b:number, c:number) => {
    r[c] = a > r[b] ? 1 : 0;
  },
  gtri: (r: Quadruple<number>, a:number, b:number, c:number) => {
    r[c] = r[a] > b ? 1 : 0;
  },
  gtrr: (r: Quadruple<number>, a:number, b:number, c:number) => {
    r[c] = r[a] > r[b] ? 1 : 0;
  },
  
  eqir: (r: Quadruple<number>, a:number, b:number, c:number) => {
    r[c] = a === r[b] ? 1 : 0;
  },
  eqri: (r: Quadruple<number>, a:number, b:number, c:number) => {
    r[c] = r[a] === b ? 1 : 0;
  },
  eqrr: (r: Quadruple<number>, a:number, b:number, c:number) => {
    r[c] = r[a] === r[b] ? 1 : 0;
  }
};

function mapInstruction(input: string): Quadruple<number> {
  return input.split(' ').map(Number) as Quadruple<number>;
}

function callOp(registers:Quadruple<number>, fn:OpFunction, a:number, b:number, c:number) {
  const newRegisters = [...registers] as Quadruple<number>;
  fn(newRegisters, a, b, c);
  return newRegisters;
}

function getPossibleOps(s: SampleInstruction) {
  return Object.entries(operations).filter(([, fn]) => {
    const [, ...args] = s.instruction;
    const newRegs = callOp(s.before, fn, ...args);
    return arrayMatch(newRegs, s.after); 
  }).map(([key,]) => key);
}

function getSamplesAndInstructions(input:string[]):[SampleInstruction[], Quadruple<number>[]] {
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
  const registers:Quadruple<number> = [0, 0, 0, 0];
  instructions.forEach(i => {
    const [code , ...args] = i;
    const fn = operations[opCodes[code]];
    fn(registers, ...args);
  });
  console.log(registers)
}

partTwo();

