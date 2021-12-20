import { getInput, splitArray } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { Position, readingOrder } from '../../utils/position';

function enhancePixel(p:Position, img:Matrix<string>, algo: string[]): string {
  const bin = [p, ...Matrix.adjacentAndDiagonalPositions(p)].sort(readingOrder).map(x => img.get(x) === '#' ? '1' : '0').join('');
  const dec = parseInt(bin, 2);
  return algo[dec];
}

function enhanceImage(input: string[], steps: number) {
  const [algoInp, imgInp] = splitArray(input, '');
  const algo = algoInp.join('').split('');
  let img = new Matrix(imgInp.map(x => x.split('')));
  img = img.pad('.', 2 * steps);

  for (let i = 0; i < steps; i++) {
    const newImg = new Matrix<string>();
    for (let y = 1; y < img.rows.length - 1; y++) {
      for (let x = 1; x < img.rows[x].length - 1; x++) {
        newImg.set({ x: x - 1, y: y - 1 }, enhancePixel({ x, y }, img, algo));
      }
    }
    img = newImg;
  }
  return img;
}

async function partOne() {  
  const img = enhanceImage(await getInput(), 2);
  console.log(img.values().filter(x => x === '#').length)
}

async function partTwo() {
  const img = enhanceImage(await getInput(), 50);
  console.log(img.values().filter(x => x === '#').length)
}
  
partTwo();