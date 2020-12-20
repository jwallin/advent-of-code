import { getInput, Position, toChars, sumPositions, multiply } from '../utils';
import { Matrix } from '../utils/matrix';

type Image = {
  id: string,
  data: Matrix
};

type Variant = {
  position: Position,
  img: Image
};

enum Flip {
  Vertically,
  Horizontally,
  Both,
  None
};

enum Rotation {
  Deg0 = 0,
  Deg90 = 1,
  Deg180 = 2,
  Deg270 = 3
};

type DirectionMap = {
  [key:string]: Position
}

const DIRECTIONS:DirectionMap = {
  N: { x: 0, y: -1 },  // N
  E: { x: 1, y: 0 },   // E
  S: { x: 0, y: 1 },   // S
  W: { x: -1, y: 0 },  // W
};

const allEnumNames = (inp:Object):string[] => Object.values(inp).filter(x => typeof x === 'string')

function splitArray<T>(input:T[], splitter:T):T[][] {
  const res:T[][] = [];
  while(input.includes(splitter)) {
    const end = input.indexOf(splitter);
    const removed = input.splice(0, end + 1);
    res.push(removed.slice(0, removed.length - 1));
  }
  res.push(input);
  return res;
}

function getVariations(m:Matrix):Matrix[] {
  const l:Matrix[] = [];
  allEnumNames(Flip).forEach(f => {
    let a = m;
    if (f === 'Vertically' || f === 'Both') {
      a = a.flipVertically();
    } 
    if (f === 'Horizontally' || f === 'Both') {
      a = a.flipHorizontally();
    }
    for (let i = 0; i < 4; i ++) {
      a = a.rotate();
      let exists = false;
      l.forEach((x, j) => {
        if (x.draw() === a.draw()) {
          //same same
          exists = true;
        }
      })
      if (!exists) {
        l.push(a);
      }
    }
  });
  return l;
}

function adjacentPositions(p: Position): Position[] {
  return Object.values(DIRECTIONS).map(d => sumPositions(p, d));
}


function arrayMatch(a: any[], b: any[]) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function toKey(p:Position):string {
  return JSON.stringify(p);
}

function fromKey(str:string):Position {
  return JSON.parse(str);
}

function matches(img:Matrix, p:Position, matrix:Map<string, Image>):boolean {
  const match = true;

  // Check top
  const topVal = matrix.get(toKey({x: p.x, y: p.y - 1}))?.data;
  if (topVal) {
    // check top row of img vs bottom row of matrix val
    if (!arrayMatch(img.getRow(0), topVal.getRow(topVal.rows.length - 1))) {
      return false;
    }
  }

  const rightVal = matrix.get(toKey({x: p.x + 1, y: p.y}))?.data;
  if (rightVal) {
    // Check right col of img vs left col of matrix val
    if (!arrayMatch(img.getCol(img.rows[0].length  - 1), rightVal.getCol(0))) {
      return false;
    }
  }

  const bottomVal = matrix.get(toKey({x: p.x, y: p.y + 1}))?.data;
  if (bottomVal) {
    // Check bottom row of img vs top row of matrix
    if (!arrayMatch(img.getRow(img.rows.length  - 1), bottomVal.getRow(0))) {
      return false;
    }
  }

  const leftVal = matrix.get(toKey({x: p.x - 1, y: p.y}))?.data;
  if (leftVal) {
    // Check left col of img vs right col of matrix
    if (!arrayMatch(img.getCol(0), leftVal.getCol(leftVal.rows[0].length - 1))) {
      return false;
    }
  }
  
  return true;
}

async function partOne() {
  const input = splitArray(await getInput(), '');
  const images:Image[] = [];

  input.forEach(img => {
    const idVal = img.slice(0, 1).join('').match(/[A-Za-z]+\s(\d+):/);
    const id = idVal ? idVal[1] : '';
    const data = new Matrix(img.slice(1).map(toChars));
    images.push({ id, data });
  });

  const imagesLeft = new Set(images.map(x => x.id));

  let m = new Map<string, Image>();
  //let m = new Matrix();
  while (imagesLeft.size > 0) {
    console.log(`${imagesLeft.size} images to go`)
    // If matrix length === 0, do something
    if (imagesLeft.size === images.length) {
      m.set(toKey({ x: 0, y: 0 }), images[0]);
      imagesLeft.delete(images[0].id);
    } else {
      // Find an images that matches any part of the matrix
      const possible:Position[] = [];
      [...m.keys()].map(fromKey).forEach(pos => {
        possible.push(...adjacentPositions(pos).filter(x => m.get(toKey(x)) === undefined));
      });

      // Matrix positions where 
      const imagesLeftArr = Array.from(imagesLeft);
      for (let i = 0; i < imagesLeftArr.length; i++) {
        const img = images.find(x => x.id === imagesLeftArr[i]);
        if (img) {
          const validPositions:Variant[] = [];

          possible.forEach(p => {
            const allVariants = getVariations(img.data);
            return allVariants.forEach(imgVariant => {
              if(matches(imgVariant, p, m)) {
                // This shouldnt be necessary
                if(!validPositions.find(x => toKey(x.position) === toKey(p) && x.img.id === img.id)) {
                  validPositions.push({ position: p, img: {data: imgVariant, id: img.id}});
                } 
              }
            });
            // Does imgVariant fit in pos p in matrix m?
          });
          if (validPositions.length === 1) {
            imagesLeft.delete(img.id);
            m.set(toKey(validPositions[0].position), validPositions[0].img);
            break;
          } else if (validPositions.length > 1) {
            console.log(validPositions.map(x => x.img.data.rows[0][0]))
          }
        }
      }
      
    }
  }

  //Get corners
  const min = [...m.keys()].map(k => fromKey(k)).reduce((prev, curr) => {
    return { x: Math.min(prev.x, curr.x), y: Math.min(prev.y, curr.y) }
  }, {x: 100, y: 100});

  const max = [...m.keys()].map(k => fromKey(k)).reduce((prev, curr) => {
    return { x: Math.max(prev.x, curr.x), y: Math.max(prev.y, curr.y) }
  }, {x: -100, y: -100});

  let corners = [
    { x: min.x, y: min.y },
    { x: max.x, y: min.y },
    { x: min.x, y: max.y },
    { x: max.x, y: max.y }
  ];

  console.log(corners.map(c => Number(m.get(toKey(c))?.id)).reduce(multiply));
  
  const a = new Matrix();
  [...m.keys()].forEach(k => {
    const p = fromKey(k);
    a.set(sumPositions(p, {x:5, y: 5}), m.get(k)?.id);
  });
  console.log(a.draw())
}

partOne();

const m = new Matrix([[1,2,3], [4,5,6], [7,8,9]]);
