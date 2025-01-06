import { fillArray, getInput } from '../../utils';

const FREE_SPACE = '.';

type File = {
  id: string,
  length: number,
  startPos: number
}

async function partOne() {
  const input = (await getInput()).map(x => x.split('').map(Number))[0];
  const [disk] = parseInput(input);

  let canMove = true;
  while (canMove) {
    // Find num to move
    let b = -1;
    for (let i = disk.length - 1; i > 0; i--) {
      if (disk[i] !== FREE_SPACE) {
        b = i;
        break;
      }
    }

    // Find pos to move to
    const a = disk.indexOf(FREE_SPACE);

    // Move
    if (b > a) {
      disk[a] = disk[b];
      disk[b] = FREE_SPACE;
    } else {
      canMove = false;
    }
  }

  // Checksum
  console.log(checkSum(disk));
}

function checkSum(disk: string[]) {
  return disk.reduce((acc, v, i) => {
    const n = Number(v);
    if (isNaN(n)) {
      return acc;
    }
    return acc + (n * i);
  }, 0);
}

function parseInput(input: number[]):[string[], File[]] {
  let id = 0;
  const disk = [];
  const files:File[] = [];
  

  for (let i = 0; i < input.length; i++) {
    const isFileBlock = i % 2 === 0;
    const fillLength = input[i];
    const fillChar = isFileBlock ? String(id) : FREE_SPACE;
    if (isFileBlock) {
      files.push({id: fillChar, length: fillLength, startPos: disk.length});
    }
    disk.push(...fillArray(fillLength, fillChar));
    
    if (isFileBlock) {
      id++;
    }
  }
  return [disk, files];
}


async function partTwo() {
  const input = (await getInput()).map(x => x.split('').map(Number))[0];
  const [disk, files] = parseInput(input);

  // Find num to move
  while (files.length > 0) {
    const file = files.pop()!;
    const newPos = disk.slice(0, file.startPos).findIndex((x, i, arr) => arr.length >= i + file.length && arr.slice(i, i + file.length).every(y => y === FREE_SPACE));
    
    if (newPos === -1) {
      //Cant find position to move to
      continue;
    }
  
    // Found something, move and break out
    for (let j = 0; j < file.length; j++) {
      disk[newPos + j] = file.id; 
      disk[file.startPos + j] = FREE_SPACE;
    }
    
   // console.log(disk.join(''))
  }
  console.log(checkSum(disk));
}

partOne();
partTwo();

