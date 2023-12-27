import { getInput, sum } from '../../utils';

function hash(input: string) {
  return input.split('').reduce((curr, c) => (curr + c.charCodeAt(0)) * 17 % 256, 0);
}

async function partOne() {
  const input = (await getInput()).map(x => x.split(','))[0];
  const total = input.map(hash).reduce(sum);
  console.log(total);
}

async function partTwo() {
  const input = (await getInput()).map(x => x.split(','))[0];
  const boxes = new Map<number, [string, number][]>();
  const reg = /(\w+)(=|-)(\d*)/;
  input.forEach(instr => {
    const [,label, op, focalLength] = instr.match(reg)!;
    const id = hash(label);
    let b: [string, number][];
    if (boxes.has(id)) {
      b = boxes.get(id)!;
    } else {
      b = [];
      boxes.set(id, b);
    }

    const existing = b.find(([x,]) => x === label);
    if (op === '=') {
      if (existing) {
        existing[1] = Number(focalLength);
      } else {
        b.push([label, Number(focalLength)]);
      }
    } else if (existing) {
      b.splice(b.indexOf(existing), 1);
    }
  });
  
  let tot = 0;
  boxes.forEach((box, num) => {
    tot += box.reduce((acc, [, focalLength], slot) => acc + (num + 1) * (slot + 1) * focalLength, 0);
  });
  console.log(tot);
}

partOne();
partTwo();