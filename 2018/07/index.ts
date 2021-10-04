import { getInput } from '../../utils';
import { KeyVal } from '../../utils/types';

type Instruction = {
  id: string,
  dependency: string
}

class Step {
  private _name: string;
  private _dependencies: Step[]

  constructor(name: string) {
    this._name = name;
    this._dependencies = [];
  }

  addDependency(step:Step):Step {
    this._dependencies.push(step);
    return this;
  }

  hasDependency():boolean {
    return this.dependencies.length > 0;
  }

  get id(): string {
    return this._name;
  }

  get dependencies(): Step[] {
    return this._dependencies.sort(Step.sort);
  }

  static sort(a:Step, b:Step):number {
    if (a.id < b.id) {
      return -1;
    } else if (a.id > b.id) {
      return 1;
    } else {
      return 0;
    }
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

async function partOne() {
  const input = (await getInput()).map(parseInstruction);
  const steps:KeyVal<Step> = {};

  input.forEach(s => {
    if (!steps[s.id])  {
      steps[s.id] = new Step(s.id);
    }
    if (!steps[s.dependency]) {
      steps[s.dependency] = new Step(s.dependency);
    }
    
    steps[s.id].addDependency(steps[s.dependency]);
  });
  
  let finishedSteps: Step[] = [];
  const stepVals = new Set(Object.values(steps));
  while(stepVals.size > 0) {
    const nextStep = Array.from(stepVals).filter(s => !s.hasDependency() || s.dependencies.every(d => finishedSteps.includes(d))).sort(Step.sort)[0];
    finishedSteps.push(nextStep);
    stepVals.delete(nextStep);
  }
  
  console.log(finishedSteps.map(x => x.id).join(''));

}

async function partTwo(numOfWorkers: number) {
  const input = (await getInput()).map(parseInstruction);
  const steps:KeyVal<Step> = {};

  input.forEach(s => {
    if (!steps[s.id])  {
      steps[s.id] = new Step(s.id);
    }
    if (!steps[s.dependency]) {
      steps[s.dependency] = new Step(s.dependency);
    }
    
    steps[s.id].addDependency(steps[s.dependency]);
  });

  let finishedSteps: Step[] = [];
  const stepVals = new Set(Object.values(steps));
  while(stepVals.size > 0) {
    const availableSteps = Array.from(stepVals).filter(s => !s.hasDependency() || s.dependencies.every(d => finishedSteps.includes(d))).sort(Step.sort);
    const workedSteps = availableSteps.slice(0, numOfWorkers);
    finishedSteps.push(...workedSteps);
    workedSteps.forEach(s => stepVals.delete(s));
    console.log(workedSteps.map(x => x.id))
  }
  
}
  

partTwo(2);