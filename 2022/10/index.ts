import { getInput } from '../../utils';
import { Matrix } from '../../utils/matrix';

async function partOne() {
  const input = (await getInput()).flatMap(x => x.split(' '));
 
  let registryX = 1;
  const xVals: number[] = [];

  let currCmd: string | undefined = undefined;
  for (let i = 0; i < input.length; i++) {
    const cmd = input[i];
    if (cmd === 'noop') {
      //continue;
    } else if (cmd === 'addx') {
      currCmd = cmd;
    } else if (currCmd) {
      // execute command
      if (currCmd === 'addx') {
        registryX += Number(cmd);
      }
      currCmd = undefined;
    }
    xVals[i + 1] = registryX;
  }
  let total = 0;
  for (let i = 20; i < xVals.length; i += 40) {
    total +=  i * xVals[i-1];
  }
  console.log(total)
}

async function partTwo() {
  const input = (await getInput()).flatMap(x => x.split(' '));
 
  let registryX = 1;

  const m = new Matrix<string>();
  let currCmd: string | undefined = undefined;
  for (let i = 0; i < input.length; i++) {
    const cmd = input[i];

    //Draw pixel
    const p = {y: Math.floor(i/40), x: i % 40};
    let v = '.';
    if (Math.abs(registryX - p.x) <= 1) {
      v = '#'
    }
    m.set(p, v);

    if (cmd === 'noop') {
      //continue;
    } else if (cmd === 'addx') {
      currCmd = cmd;
    } else if (currCmd) {
      // execute command
      if (currCmd === 'addx') {
        registryX += Number(cmd)
      }
      currCmd = undefined;
    }
  }
  console.log(m.draw())
}

partOne();
partTwo();