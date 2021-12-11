import { getInput } from '../../utils';
import { Matrix } from '../../utils/matrix';

type Claim = {
  id: number,
  x: number,
  y: number,
  width: number,
  height: number
}

function parseClaim(input: string):Claim {
  // #5 @ 65,785: 13x15
  const [id, data] = input.split(' @ ');
  const [coords, size] = data.split(': ');
  const [x, y] = coords.split(',').map(Number);
  const [width, height] = size.split('x').map(Number);
  return {
    id: Number(id.split('#')[1]),
    x, y, width, height
  };
}

async function partOne() {
  const claims = (await getInput()).map(String).map(parseClaim);
  const matrix = new Matrix<number>();
  claims.forEach(c => {
    for(let x = c.x; x < c.x + c.width; x++) {
      for (let y = c.y; y < c.y + c.height; y++) {
        const v = matrix.get({x, y}, 0);
        matrix.set({x, y}, v + 1);
      }
    }
  });
  const numOfInches = matrix.values().filter(x => x && x >= 2).length;
  console.log(numOfInches)
}

async function partTwo() {
  const claims = (await getInput()).map(String).map(parseClaim);
  const matrix = new Matrix<number>();
  claims.forEach(c => {
    for(let x = c.x; x < c.x + c.width; x++) {
      for (let y = c.y; y < c.y + c.height; y++) {
        const v = matrix.get({x, y}, 0);
        matrix.set({x, y}, v + 1);
      }
    }
  });

  const intactClaims:Claim[] = [];
  claims.forEach(c=> {
    let intact = true;
    for(let x = c.x; x < c.x + c.width; x++) {
      for (let y = c.y; y < c.y + c.height; y++) {
        if ((matrix.get({x, y}, 0)) > 1) {
          intact = false;
        }
      }
    }
    if (intact) {
      intactClaims.push(c);
    }
  });
  console.log(intactClaims.map(c => c.id));
}
  

partTwo();