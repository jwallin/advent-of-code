import { getInput } from '../../utils';

function p(x: any) {
  console.log(x);
}

const MODE_POS = 0;
const MODE_IMM = 1;

function run(d: number[]) {
  if (d[0] > 99) {
    const instructionString = d[0].toString();
    const instr = parseInt(instructionString.slice(-2));
    d[0] = instr;

    const parameterModes = instructionString
      .substring(0, instructionString.length - 2)
      .split('')
      .reverse()
      .map(x => parseInt(x))
  }
  return calc(d, 0);
}

//console.log(run([1101,100,-1,4,0]))

function getParam(param: number, d: number[], parameterModes:number[]) {
  if (parameterModes.pop() === MODE_IMM) {
    return param;
  } else {
    return d[param];
  }
}

function calc(d: number[], input: number) {
  //printArr(d, 0);
  for (let i = 0; i < d.length; i++) {
    console.log('OP ', d[i]);
    let parameterModes:number[] = [];
    const parameterPointer = 0;


    if (d[i] > 99) {
      const instructionString = d[i].toString();
      const instr = parseInt(instructionString.slice(-2));
      d[i] = instr;
  
      parameterModes = instructionString
        .substring(0, instructionString.length - 2)
        .split('')
        .map(x => parseInt(x))
    }
    
    //console.log(`#${i}: Op ${d[i]}`)
    if (d[i] === 1) {
      const a = getParam(d[++i], d, parameterModes);
      const b = getParam(d[++i], d, parameterModes);
      parameterModes.pop()
      const pos = d[++i];
      d[pos] = a + b;
      //console.log(`${a} + ${b} => ${pos}`)
    } else if (d[i] === 2) {
      const a = getParam(d[++i], d, parameterModes);
      const b = getParam(d[++i], d, parameterModes);
      parameterModes.pop()
      const pos = d[++i]
      //console.log(`${a} * ${b} => ${pos}`)
      d[pos] = a * b;
    } else if (d[i] === 99) {
      break;
    } else if (d[i] == 3) {
      // input is 1
      const val = input;
      const pos = d[++i];
      d[pos] = val;
      parameterModes.pop()
    } else if (d[i] == 4) {
      const val = getParam(d[++i], d, parameterModes);
      console.log('OUTPUT: ', val);
    } else if (d[i] == 5) { 
      const val = getParam(d[++i], d, parameterModes);
      const newPtr = getParam(d[++i], d, parameterModes);
      if (val !== 0) {
        i = newPtr-1;
      }
    } else if (d[i] == 6) {
      const val = getParam(d[++i], d, parameterModes);
      const newPtr = getParam(d[++i], d, parameterModes);
      if (val === 0) {
        i = newPtr-1;
      }
    } else if (d[i] == 7) {
      const a = getParam(d[++i], d, parameterModes);
      const b = getParam(d[++i], d, parameterModes);
      const val = (a < b) ? 1 : 0;

      const pos = d[++i];
      d[pos] = val;
      parameterModes.pop()
    } else if (d[i] == 8) {
      const a = getParam(d[++i], d, parameterModes);
      const b = getParam(d[++i], d, parameterModes);
      const val = (a === b) ? 1 : 0;

      const pos = d[++i];
      d[pos] = val;
      parameterModes.pop()
    }
  }
  //p(d[0]);
  return d;
}

//console.log(calc([3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99], 80))


async function partOne() {
  const d = (await getInput()).map(x => x.split(',').map(Number))[0];

  calc(d, 5);
}

partOne();