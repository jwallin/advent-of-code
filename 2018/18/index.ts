import { getInput } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { Position } from '../../utils/position';

const OPEN = '.';
const TREES = '|';
const LUMBERYARD = '#';

function getNextValue(m:Matrix<string>, p:Position) {
  const adjacentValues = m.adjacentAndDiagonalValues(p);
  switch (m.get(p)) {
    case OPEN:
      return (adjacentValues.filter(x => x === TREES).length >= 3) ? TREES : OPEN;
    case TREES: 
      return (adjacentValues.filter(x => x === LUMBERYARD).length >= 3) ? LUMBERYARD : TREES;
    case LUMBERYARD: 
      return (adjacentValues.filter(x => x === LUMBERYARD).length >= 1 && adjacentValues.filter(x => x === TREES).length >= 1) ? LUMBERYARD : OPEN;
    default:
      throw new Error('Unexpected value');
  }
}

async function partOne() {
  const input = (await getInput()).map(x => x.split(''));
  let m = new Matrix(input);
  
  for (let i = 1; i <= 10; i++) {
    const b = new Matrix<string>();
    m.asArray().forEach(p => {
      b.set(p, getNextValue(m, p));
    });
    m = b;
  }
  
  console.log(m.draw())
  console.log('');
  const wooded = m.values().filter(x => x === TREES).length;
  const lumberyards = m.values().filter(x => x === LUMBERYARD).length;
  console.log(wooded, lumberyards, wooded * lumberyards);
}

async function partTwo() {
  const input = (await getInput()).map(x => x.split(''));
  let m = new Matrix(input);
  
  const window:number[] = [];
  const START_INDEX = 1000;
  const WINDOW_LENGTH = 28;
  for (let i = 1; i <= START_INDEX + WINDOW_LENGTH; i++) {
    const b = new Matrix<string>();
    m.asArray().forEach(p => {
      b.set(p, getNextValue(m, p));
    });
    m = b;

    // Create a window array
    if ( i >= START_INDEX )  {
      const wooded = m.values().filter(x => x === TREES).length;
      const lumberyards = m.values().filter(x => x === LUMBERYARD).length;
      const total = wooded * lumberyards;
      window[i - START_INDEX] = total;
    }
  }

  console.log(window);
  const n = 1000000000;
  console.log(n, window[(n - START_INDEX) % WINDOW_LENGTH]);
 
}
  

partTwo();