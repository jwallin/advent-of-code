import { getInput, splitArray } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { max, min, Position } from '../../utils/position';

function keepFolding(coords: Position[], folds: Position[]) {
  let m = new Matrix<string>();
  m.fill(min(coords), max(coords), '.');
  coords.forEach(c => m.set(c, '#'));
  folds.forEach(f => {
    if (f.x) {
      m = fold(m.rotateRight(), f.x).rotateLeft();
    } else if (f.y) {
      m = fold(m, f.y);
    }
  });
  return m;
}

function getCoordsAndFOlds(input: string[]) {
  const [coordInp, instrInp] = splitArray(input, '');
  const coords = coordInp.map(c => c.split(',').map(Number)).map<Position>(([x, y]) => ({ x, y }));

  const folds = instrInp.map(i => i.replace('fold along ', '').split('=')).map<Position>(([k, v]) => Object.assign({}, { x: 0, y: 0 }, ({ [k]: Number(v) })));
  return { coords, folds };
}

function fold(m:Matrix<string>, yVal: number):Matrix<string> {
  const above = new Matrix(m.rows.slice(0, yVal));
  above.fill({x:0, y:0}, above.maxPos(), '.', false);
  const below = new Matrix<string>(m.clone().rows.slice(yVal + 1)).flipVertically();

  const diff = above.rows.length - below.rows.length;
  below.asArray()
    .filter(x => below.get(x) === '#')
    .map(c => ({x: c.x, y: c.y + diff}))
    .forEach(c => above.set(c, '#'));
  return above;
}

async function partOne() {
  const input = (await getInput());
  const { coords, folds } = getCoordsAndFOlds(input);
  
  const m = keepFolding(coords, folds.slice(0, 1));
  console.log(m.draw());
  console.log(m.values().filter(x => x === '#').length);
}

async function partTwo() {
  const input = (await getInput());
  const { coords, folds } = getCoordsAndFOlds(input);

  const m = keepFolding(coords, folds);
  console.log(m.draw());
}
  
partTwo();