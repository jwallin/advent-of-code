import { getInput } from '../utils';
import { Instruction, INSTRUCTIONS, Computer } from './computer';

function getInstructions(input:string[]): Instruction[] {
  return input.map(x => {
    const parts = x.split(' ');
    const op = parts[0];
    const parameter = Number(parts[1]);
    return { op, parameter, hasRun: false };
  });
} 

async function partOne() {
  const instructions = getInstructions(await getInput());

  const computer = new Computer(instructions);
  computer.run()
  console.log(computer.accumulator);
}

async function partTwo() {
  const instructions = getInstructions(await getInput());
  
  instructions.forEach((x, i) => {
    if (x.op !== INSTRUCTIONS.JMP && x.op !== INSTRUCTIONS.NOP) {
      return true;
    }
    
    const modifiedInstructions = instructions.slice();
    modifiedInstructions[i] = {
      ...x,
      op: (x.op === INSTRUCTIONS.JMP) ? INSTRUCTIONS.NOP : INSTRUCTIONS.JMP
    };
    const computer = new Computer(modifiedInstructions);
    
    if (computer.run()) {
      console.log(`Acc ${computer.accumulator}`);
    } 
  });
}

partTwo()