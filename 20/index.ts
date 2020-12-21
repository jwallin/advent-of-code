import { getInput, Position, toChars, sumPositions, multiply, allEnumNames, splitArray, maxPosition, minPosition, arrayMatch} from '../utils';
import { Matrix } from '../utils/matrix';

type Image = {
  id: string,
  data: Matrix
};

type ImageCandidate = {
  position: Position,
  image: Image
};

enum Flip {
  Vertically,
  Horizontally,
  Both,
  None
};

type DirectionMap = {
  [key:string]: Position
};

const DIRECTIONS:DirectionMap = {
  N: { x: 0, y: -1 },  // N
  E: { x: 1, y: 0 },   // E
  S: { x: 0, y: 1 },   // S
  W: { x: -1, y: 0 },  // W
};

/*
                  # 
#    ##    ##    ###
 #  #  #  #  #  #  
*/
 const SEA_MONSTER_PATTERN:Position[] = [
  { x: 18, y: 0 },
  { x: 0, y: 1 },
  { x: 5, y: 1 },
  { x: 6, y: 1 },
  { x: 11, y: 1 },
  { x: 12, y: 1 },
  { x: 17, y: 1 },
  { x: 18, y: 1 },
  { x: 19, y: 1 },
  { x: 1, y: 2 },
  { x: 4, y: 2 },
  { x: 7, y: 2 },
  { x: 10, y: 2 },
  { x: 13, y: 2 },
  { x: 16, y: 2 },
];

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
      if (!l.some(x => x.draw() === a.draw())) {
        l.push(a);
      }
    }
  });
  return l;
}

function adjacentPositions(p: Position): Position[] {
  return Object.values(DIRECTIONS).map(d => sumPositions(p, d));
}

function toKey(p:Position):string {
  return JSON.stringify(p);
}

function fromKey(str:string):Position {
  return JSON.parse(str);
}

function matches(img:Matrix, p:Position, matrix:Map<string, Image>):boolean {

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

function findValidPosition(candidates: Position[], img: Image, m: Map<string, Image>): ImageCandidate | undefined {
  const allVariants = getVariations(img.data);
  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    const match = allVariants.find(x => matches(x, candidate, m));
    if (match) {
      return { position: candidate, image: { data: match, id: img.id }};
    }
  }
  return undefined;
}

async function partOne():Promise<Matrix<Matrix<string>>> {
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
        if (!img) { 
          continue;
        }

        // Find valid position
        const validPosition = findValidPosition(possible, img, m);
        if (validPosition) {
          imagesLeft.delete(img.id);
          m.set(toKey(validPosition.position), validPosition.image)
        }
      } 
    }
  }

  //Get corners
  const min = minPosition([...m.keys()].map(k => fromKey(k)));
  const max = maxPosition([...m.keys()].map(k => fromKey(k)));

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
    a.set(sumPositions(p, {x: -min.x, y: -min.y}), m.get(k)?.data);
  });
  return a;
}

function findSeaMonster(m:Matrix<string>):Position[] {
  const maxP = maxPosition(SEA_MONSTER_PATTERN);

  let hits:Position[] = [];
  const allPositions = m.asArray();
  
  for (let i = 0; i < allPositions.length; i++) {
    const p = allPositions[i];

    if (m.rows[0].length - p.x < maxP.x || m.rows.length - p.y < maxP.y) {
      continue;
    }
    const hit = SEA_MONSTER_PATTERN.map(s => sumPositions(p, s)).every(x => m.get(x) === '#');
    if (hit) {
      hits.push(p);
    }
  }

  return hits;
}

async function partTwo() {
  const matrix = await partOne();

  // Trim matrixes
  matrix.asArray().forEach((p:Position) => {
    const data = matrix.get(p);
    if (!data) {
      return;
    }
    matrix.set(p, data.trim());
  });

  // Draw large matrix
  const rows:string[][] = [];
  matrix.asArray().forEach((p:Position) => {
    let m = matrix.get(p);
    if (m !== undefined) {
      const start = m.rows.length; 
      m.rows.forEach((r, i) => {
        const rowIndex = i + p.y * start;
        if (!rows[rowIndex]) {
          rows[rowIndex] = [];
        }
        rows[rowIndex].push(...r);
      });
    }
  });

  const largeMatrix = new Matrix<string>(rows).flipVertically();;
  const variation = getVariations(largeMatrix).find(v => findSeaMonster(v).length > 0);
  if (variation) {
    const numOfSeaMonsters = findSeaMonster(variation).length;
    console.log(`Found ${numOfSeaMonsters} monsters`);
    console.log(largeMatrix.values().filter(x => x === '#').length - numOfSeaMonsters * SEA_MONSTER_PATTERN.length);
  }
}

partTwo()
