import { fillArray, getInput } from '../../utils';

async function partOne() {
  const input = (await getInput()).map(x => x.split('').map(Number))[0];
  let f = '';
  let id = 0;
  const disk = [];

  for (let i = 0; i < input.length; i++) {
    const isFileBlock = i % 2 === 0;
    const fillLength = input[i];
    const fillChar = isFileBlock ? String(id) : '.';
    f = f + fillArray(fillLength, fillChar).join('');
    disk.push(...fillArray(fillLength, fillChar));
    if (isFileBlock) {
      id++;
    }
  }

  let canMove = true;
  while (canMove) {
    // Find num to move
    let b = -1;
    for (let i = disk.length - 1; i > 0; i--) {
      if (disk[i] !== '.') {
        b = i;
        break;
      }
    }

    // Find pos to move to
    const a = disk.indexOf('.');

    // Move
    if (b > a) {
      disk[a] = disk[b];
      disk[b] = '.';
    } else {
      canMove = false;
    }
  }

  // Checksum
  
  const checksum = disk.reduce((acc, v, i) => {
    const n = Number(v);
    if (isNaN(n)) {
      return acc;
    }
    return acc + (n * i);
  }, 0);
  console.log(checksum)
}

async function partTwo() {
  const input = (await getInput()).map(x => x.split('').map(Number))[0];
  
}

partOne();
partTwo();