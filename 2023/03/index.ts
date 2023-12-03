import { getInput, multiply, sum, unique } from '../../utils';
import { Matrix } from '../../utils/matrix';

interface WrappedNumber {
  n: number
}

async function partOne() {
  const input = (await getInput()).map(x => x.split(''));
  const q = new Matrix(input);
  const re = /\d+/g;
  const f = q.rows.map(x => x.join('')).reduce<number>((acc, r, y) => {
    let s;
    let sum = acc;
    while (true) {
      s = re.exec(r);
      if (s === null) {
        break;
      }

      for (let x = s.index; x < s.index + s[0].length; x++) {
        if (q.adjacentAndDiagonalValues({x, y}).some(v => v?.match(/[^0-9.]/))) {
          sum += Number(s[0]);
          break;
        }
      }
    }
    return sum;
  }, 0);
  console.log(f)
}

async function partTwo() {
  const input = (await getInput()).map(x => x.split(''));
  const q = new Matrix(input);

  const a = new Matrix<WrappedNumber>();
  const re = /\d+/g;
  q.rows.forEach((r, y) => {
    const rStr = r.join('');
    let s;
    while (true) {
      s = re.exec(rStr);
      if (s === null) {
        break;
      }
      for (let x = s.index; x < s.index + s[0].length; x++) {
        a.set({x, y}, {n: Number(s[0])});
      }
    }
  });
  
  const z = q.positionsWithValue('*')
    .map(p => unique(a.adjacentAndDiagonalValues(p)))
    .filter(x => x.length === 2)
    .map(f => f.map(x => x.n).reduce(multiply))
    .reduce(sum);
  console.log(z)
}

partOne();
partTwo();