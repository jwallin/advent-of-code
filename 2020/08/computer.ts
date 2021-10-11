export type Instruction = {
  op: string,
  parameter: number,
  hasRun: boolean
}

export const INSTRUCTIONS = {
  NOP: 'nop',
  ACC: 'acc',
  JMP: 'jmp'
};

export class Computer {
  private _instructions: Instruction[];
  private _accumulator: number;
  private _pointer = 0;

  constructor(instructions: Instruction[]) {
    this._instructions = instructions;
    this._accumulator = 0;
    this.reset();
  }

  reset(): void {
    this._instructions.forEach(i => i.hasRun = false);
    this._pointer = 0;
  }

  run(): boolean {
    while(this._pointer < this._instructions.length) {
      const instruction =  this._instructions[this._pointer];
      if (instruction.hasRun) {
        return false;
      }
      let jump: number = 1;
      switch (instruction.op) {
        case INSTRUCTIONS.JMP:
          jump = instruction.parameter;
          break;

        case INSTRUCTIONS.ACC:
          this._accumulator += instruction.parameter;
          break;

        case INSTRUCTIONS.NOP:
          break;

        default:
          console.log(`Unhandled instruction ${instruction.op}`);
          break;
      }

      // Only exectue instructions once
      this._instructions[this._pointer].hasRun = true;

      this._pointer = this._pointer + jump;
    }
    return true;
  }

  get accumulator(): number {
    return this._accumulator;
  }
}