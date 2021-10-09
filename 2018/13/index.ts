import { getInput } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { equals, Position, sum } from '../../utils/position';
import { KeyVal } from '../../utils/types';

const DIRECTIONS:KeyVal<[Position, string]> = {
  '^': [{x: 0, y: -1}, '|'],
  'v': [{x: 0, y: 1}, '|'],
  '<': [{x: -1, y: 0}, '-'],
  '>': [{x: 1, y: 0}, '-']
}

const LEFT_CURVE = (d: Position) => ({ x: d.y, y: d.x });
const RIGHT_CURVE = (d: Position) => ({ x: -d.y, y: -d.x});

const TURN_DIRECTTIONS = [
  (d: Position) => ({x: d.y, y: -d.x}),
  (d: Position) => d,
  (d: Position) => ({x: -d.y, y: d.x})
  /* 
  Left:
    -1,0 -> 0,1       x:y, y:-x
    0,1 -> 1,0        x: y, y:-x
    1,0 -> 0,-1       x:y, y:-x
    0,-1 -> -1, 0     x: y, y: -x

  Right: 
    -1,0 => 0, -1     x: -y, y: x
    0,-1 => 1,0       x: -y, y: x
    1,0 => 0,1        x: -y, y: x
    0,1 => -1, 0      x: -y, y: x

  */
];

const cartSort = (a:Cart, b:Cart) => {
  const posA = a.position;
  const posB = b.position;

  const xDiff = Math.sign(posA.y - posB.y);
  if (xDiff !== 0) {
    return xDiff;
  } 
  return Math.sign(posA.x - posB.x);
};

class Cart {
  private _position: Position;
  private _direction: Position;
  private _turnIndex: number;
  
  constructor(position: Position, direction: Position) {
    this._position = position;
    this._direction = direction;
    this._turnIndex = 0;
  }

  get position() {
    return this._position;
  }

  move() {
    this._position = sum(this._position, this._direction);
  }

  drawDirection() {
    return Object.keys(DIRECTIONS)[Object.values(DIRECTIONS).findIndex(([d, ]) => d.x === this._direction.x && d.y === this._direction.y)];
  }

  turn() {
    this._direction = TURN_DIRECTTIONS[this._turnIndex++ % TURN_DIRECTTIONS.length](this._direction);
  }

  rightCurve() {
    this._direction = RIGHT_CURVE(this._direction);
  }

  leftCurve() {
    this._direction = LEFT_CURVE(this._direction);
  }
}

async function partOne() {
  const input = (await getInput()).map(x => x.split(''));
  const m = new Matrix(input);

  const carts = m.asArray()
    .filter(p => m.get(p) !== undefined)
    .filter(p => Object.keys(DIRECTIONS).includes(m.get(p) as string))
    .map(p => {
      const val = m.get(p) as string;
      const [dir, track] = DIRECTIONS[val];
      
      // Update track
      m.set(p, track);

      return new Cart(p, dir);
  });
  
  drawCarts(m, carts);
  for(let i = 0; i < 2000; i++) {
    // sort carts
    if (!tick(carts.sort(cartSort), m)) {
      break;
    }
    
  }
  
}

function tick(carts: Cart[], m: Matrix<string>): boolean {
  for (let i = 0; i < carts.length; i++) {
    const c = carts[i];
    c.move();
    const t = m.get(c.position) as string;
    switch (t) {
      case '\\':
        c.leftCurve();
        break;
      case '/':
        c.rightCurve();
        break;
      case '+':
        c.turn();
        break;
    }

    const positions = carts.map(c => c.position);
    const collision = positions.find((p, i) => positions.find((q, j) => equals(p, q) && i !== j));
    //drawCarts(m, carts);
    if (collision) {
      drawCarts(m, carts);
      console.log('collision', collision);
      return false;
    }
  }

  return true;
}

function drawCarts(m: Matrix<string>, carts: Cart[]) {
  const trackWithCarts = m.clone();
  
  carts.forEach(c => trackWithCarts.set(c.position, c.drawDirection()));
  console.log(trackWithCarts.draw());
  console.log('');
}

async function partTwo() {
  const input = (await getInput()).map(Number);
}
  

partOne();