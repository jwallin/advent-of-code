import { getInput } from '../../utils';
import { KeyVal } from '../../utils/types';

type Instruction = {
  id: string,
  dependency: string
}

class Step {
  private _name: string;
  private _dependencies: Step[]
  private _cyclesLeft: number; 
  private _started: boolean;

  constructor(name: string) {
    this._name = name;
    this._dependencies = [];
    this._cyclesLeft = Step.getCost(name);
    this._started = false;
  }

  addDependency(step:Step): Step {
    this._dependencies.push(step);
    return this;
  }

  hasDependency(): boolean {
    return this.dependencies.length > 0;
  }
  
  run(): boolean {
    this._started = true;
    this._cyclesLeft--;
    return this.isComplete();
  }
  
  isComplete(): boolean {
    return this._cyclesLeft < 1;
  }

  isStarted(): boolean {
    return this._started;
  }

  complete(): void {
    this._cyclesLeft = 0;
  }

  get id(): string {
    return this._name;
  }

  get dependencies(): Step[] {
    return this._dependencies.sort(Step.sort);
  }

  static sort(a:Step, b:Step):number {
    if (a.isStarted() && !b.isStarted()) {
      return -1;
    } else if (b.isStarted() && !a.isStarted()) {
      return 1;
    }

    if (a.id < b.id) {
      return -1;
    } else if (a.id > b.id) {
      return 1;
    } else {
      return 0;
    }
  }

  private static getCost(id: string): number {
    return 60 + id.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
  }
}

function parseInstruction(instr: string):Instruction {
  const regex = /^Step ([A-Z]) must be finished before step ([A-Z]) can begin./;
  const m = instr.match(regex);
  if (!m) {
    throw new Error(`Couldnt parse instruction: ${instr}`);
  }
  const [,dependency, id] = m;
  return {
    dependency, id
  }
}

async function getSteps():Promise<Set<Step>> {
  const input = (await getInput()).map(parseInstruction);
  
  const steps = input.reduce<KeyVal<Step>>((steps, s) => {
    if (!steps[s.id]) {
      steps[s.id] = new Step(s.id);
    }
    if (!steps[s.dependency]) {
      steps[s.dependency] = new Step(s.dependency);
    }

    steps[s.id].addDependency(steps[s.dependency]);
    return steps;
  }, {});

  return new Set(Object.values(steps));
}

function getAvailableSteps(stepVals: Set<Step>) {
  return Array
    .from(stepVals)
    .filter(s => !s.isComplete())
    .filter(s => !s.hasDependency() || s.dependencies.every(d => d.isComplete()))
    .sort(Step.sort);
}

async function partOne() {
  const steps = await getSteps();

  const finishedSteps: string[] = [];
  while (steps.size > 0) {
    const nextStep = getAvailableSteps(steps)[0];
    nextStep.complete();
    finishedSteps.push(nextStep.id);
    steps.delete(nextStep);
  }
  
  console.log(finishedSteps.join(''));
}

async function partTwo(numOfWorkers: number) {
  const steps = await getSteps();

  let seconds = 0;
  
  while (steps.size > 0) {
    const availableSteps = getAvailableSteps(steps);
    const workedSteps = availableSteps.slice(0, numOfWorkers);
    workedSteps.forEach(s => {
      if (s.run()) {
        steps.delete(s);
      }
    });
    seconds++;
  }
  
  console.log(seconds);
}

partTwo(5);