import { getInput, sortDescending } from '../../utils';

const OFFSET = 10000;
const matrix: number[][][] = [];

const crossSections: [number, number, number][] = [];

function set(xVal: number, yVal: number, line: number, totalSteps: number) {  
  
  const x = xVal + OFFSET;
  const y = yVal + OFFSET;
  if (matrix[x] === undefined) {
    matrix[x] = [];
  }
  if (matrix[x][y] === undefined) {
    matrix[x][y] = [];
  }
  if (matrix[x][y][line] === undefined) {
    matrix[x][y][line] = totalSteps;
  }
  
  if(Object.keys(matrix[x][y]).length > 1) {
    const sumSteps = matrix[x][y].reduce((a, b) => a + b, 0)
    crossSections.push([x - OFFSET, y - OFFSET, sumSteps]);
    //console.log(x-OFFSET,y-OFFSET)
    //console.log(Math.abs(x - OFFSET) + Math.abs(y - OFFSET))
  }
  
}

let curX: number;
let curY: number;
let totalSteps: number;
//matrix[curX] = [];
//matrix[curX][curY] = 0;

function move(x: number, y: number, line: number) {
  const newX = curX + x;
  const newY = curY + y;
  
  if (x > 0) {
    for (;curX < newX; curX++) {
      set(curX, curY, line, totalSteps++);
    }  
  } else if (x < 0) {
    for (;curX > newX; curX--) {
      set(curX, curY, line, totalSteps++);
    }  
  }
  if (y > 0) {
    for (;curY < newY; curY++) {
      set(curX, curY, line, totalSteps++);
    }  
  } else if (y < 0) {
    for (;curY > newY; curY--) {
      set(curX, curY, line, totalSteps++);
    }  
  }

}

function calc(lines: string[][]) {
  for(let l = 0; l < lines.length; l++) {
    console.log('new line')
    curX = 0;
    curY = 0;
    totalSteps = 0;
    for (let i = 0; i < lines[l].length; i++) {
      const op = lines[l][i];
      const dir = op.slice(0, 1);
      let val = parseInt(op.slice(1));
    
      if (dir === 'L' || dir === 'U') {
        val = val * -1;
      }

      if (dir === 'R' || dir == 'L') {
        move(val, 0, l);
      } else {
        move(0, val, l);
      }
    
    }
  }

  crossSections.sort((a,b) => sortDescending(a[2], b[2]))
  
  crossSections.forEach((p) => {
    console.log(p, Math.abs(p[0]) + Math.abs(p[1]), p[2])
  })  
}

async function partTwo() {
  const lines = (await getInput()).map(x => x.split(','));
  calc(lines);
}

partTwo();