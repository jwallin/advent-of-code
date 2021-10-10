import { getInput, sum } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { equals, Position, readingOrder } from '../../utils/position';
import { dijkstra } from '../../utils/dijkstra';

const OPEN = '.';
const BLOCK = '#';

type Square = '.' | '#' | Unit;

type PositionUnit = {
  position: Position,
  unit: Unit
}

class Unit {
  static ELF = 'E';
  static GOBLIN = 'G';

  private static ATTACK_POWER = 3;
  private static START_HP = 200;

  private _hp: number;
  private _position: Position;
  private _type: string;

  constructor(type: string, position: Position) {
    this._hp = Unit.START_HP;
    this._type = type;
    this._position = position;
  }
/*
  get position() {
    return this._position;
  }

  set position(p: Position) {
    this._position = p;
  }
*/
  get type() {
    return this._type;
  }

  get hp() {
    return this._hp;
  }

  attack() {
    this._hp -= Unit.ATTACK_POWER;
  }

  isAlive() {
    return this._hp > 0;
  }

  enemy(): string {
     return (this.type === Unit.ELF) ? Unit.GOBLIN : Unit.ELF;
  }

  toString() {
    return this.type;
  }

  isEnemy(s: Square | undefined) {
    return s instanceof Unit && (s as Unit).type === this.enemy();
  }
}

function neighbors(p: Position): Position[] {
  const {x, y} = p;
  return [
    { x, y: y - 1 },
    { x, y: y + 1 },
    { x: x - 1, y },
    { x: x + 1, y }
  ];
}

async function partOne() {
  const input = (await getInput()).map(x => x.split('').map<Square>(x => {
    if (x === Unit.ELF || x === Unit.GOBLIN) {
      return new Unit(x, {x:1,y:1});
    } else if (x === BLOCK || x === OPEN) {
      return x;
    } else {
      throw new Error('Unexpected type');
    }
  }));
  const m = new Matrix<Square>(input);
  console.log(m.draw())

  
  for (let i = 0; i < 50000; i++) {
    getUnits(m).sort((a,b) => readingOrder(a.position, b.position)).forEach((pu) => {
      let {position, unit}  = pu;

      if (!unit.isAlive()) {
        return;
      }

      if (!neighbors(position).some(n => unit.isEnemy(m.get(n)))) {
        // find closest enemy
        const enemies = getUnits(m).filter(pu => unit.isEnemy(pu.unit));
        const closestEnemy = closest(position, enemies.map<Position>(pu => pu.position), m);
        if (!closestEnemy) {
          return;
        }
        // Move towards that enemy
        const candidates = neighbors(position).filter(n => m.get(n) === OPEN);
        const nextPosition = closest(closestEnemy, candidates, m) as Position;
        
        //Move to that square
        m.set(position, OPEN);
        m.set(nextPosition, unit);
        position = nextPosition;
      }

      const enemiesInRange = neighbors(position)
        .filter(p => unit.isEnemy(m.get(p)))
        .map<PositionUnit>(p => ({position: p, unit: m.get(p) as Unit}))
        .sort((a: PositionUnit, b: PositionUnit) => {
          return (a.unit.hp !== b.unit.hp) ? Math.sign(a.unit.hp - b.unit.hp) : readingOrder(a.position, b.position);
        });
      const enemySelected = enemiesInRange[0];
      
      if (enemySelected) {
        enemySelected.unit.attack();
        if (!enemySelected.unit.isAlive()) {
          m.set(enemySelected.position, OPEN);
        }
      }      
    });

    /*console.log('')
    console.log(i)
    console.log(m.draw())
    console.log(getUnits(m).map(u => u.unit.hp))
*/
    if (new Set([...getUnits(m).map(u => u.unit.type)]).size === 1) {
      console.log('');
      console.log(m.draw())
      console.log(i, getUnits(m).map(u => u.unit.hp).reduce(sum))
      console.log(i * getUnits(m).map(u => u.unit.hp).reduce(sum))
      console.log(getUnits(m).map(u => u.unit.hp))
      //console.log(m.draw());
      break;
    }
  } 
}

function getUnits(m: Matrix<Square>): PositionUnit[] {
  return m.asArray()
    .filter(x => m.get(x) instanceof Unit)
    .map<PositionUnit>(p => ({position: p, unit:  m.get(p) as Unit }));
}

function closest(from: Position, candidates: Position[], m: Matrix<string | Unit>): Position | undefined {
  const nextDistances = candidates.map(x => {
    return dijkstra(from, x, (node) => neighbors(node).filter(p => m.get(p) === OPEN || equals(p, x))
    ) || Infinity;
  });
  const minDistance = Math.min(...nextDistances);
  if (minDistance === Infinity) {
    return undefined;
  }
  const c = nextDistances.reduce<number[]>((acc, v, i) => {
    if (v === minDistance) {
      return [...acc, i];
    }
    return acc;
  }, []).map(i => candidates[i]).sort(readingOrder);
  return c[0];
}

async function partTwo() {
  const input = (await getInput()).map(Number);
}
  

partOne();