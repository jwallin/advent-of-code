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

  static ATTACK_POWER = 3;
  private static START_HP = 200;

  protected _hp: number;
  private _type: string;
  private _attack: number;

  constructor(type: string, attack: number = Unit.ATTACK_POWER) {
    this._hp = Unit.START_HP;
    this._type = type;
    this._attack = attack;
  }

  get type() {
    return this._type;
  }

  get hp() {
    return this._hp;
  }

  attack(enemy: Unit) {
    enemy._hp -= this._attack;
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

function mapChar(x:string):Square {
  if (x === Unit.ELF || x === Unit.GOBLIN) {
    return new Unit(x);
  } else if (x === BLOCK || x === OPEN) {
    return x;
  } else {
    throw new Error('Unexpected type');
  }
}

async function partOne() {
  const input = (await getInput()).map(x => x.split('').map<Square>(mapChar));
  const m = new Matrix<Square>(input);
  console.log(m.draw())

  
  for (let i = 0; i < 50000; i++) {
    getUnits(m).sort((a,b) => readingOrder(a.position, b.position)).forEach((pu) => {
      let {position, unit}  = pu;

      if (!unit.isAlive()) {
        return;
      }

      position = moveUnit(position, unit, m);

      const enemySelected = getEnemy(position, unit, m);
      
      if (enemySelected) {
        unit.attack(enemySelected.unit);
        if (!enemySelected.unit.isAlive()) {
          m.set(enemySelected.position, OPEN);
        }
      }      
    });

    if (new Set([...getUnits(m).map(u => u.unit.type)]).size === 1) {
      console.log('');
      console.log(m.draw())
      console.log(`${i} * ${getUnits(m).map(u => u.unit.hp).reduce(sum)} = ${i * getUnits(m).map(u => u.unit.hp).reduce(sum)}`);
      console.log(getUnits(m).map(u => u.unit.hp))
      break;
    }
  } 
}

function getEnemy(position: Position, unit: Unit, m: Matrix<Square>) {
  return neighbors(position)
    .filter(p => unit.isEnemy(m.get(p)))
    .map<PositionUnit>(p => ({ position: p, unit: m.get(p) as Unit }))
    .sort((a: PositionUnit, b: PositionUnit) => {
      return (a.unit.hp !== b.unit.hp) ? Math.sign(a.unit.hp - b.unit.hp) : readingOrder(a.position, b.position);
    })[0];
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
  const input = (await getInput());

  for (let att = 4; att < 100; att++) {
    const m = new Matrix<Square>(input.map(x => x.split('').map<Square>(x => {
      if (x === Unit.ELF || x === Unit.GOBLIN) {
        return new Unit(x, x === Unit.ELF ? att : Unit.ATTACK_POWER);
      } else if (x === BLOCK || x === OPEN) {
        return x;
      } else {
        throw new Error('Unexpected type');
      }
    })));
    
    //console.log(m.draw())
    let gameOver = false;
    for (let i = 0; i < 50000; i++) {
      if (gameOver) {
        break;
      }
      const units = getUnits(m).sort((a,b) => readingOrder(a.position, b.position));
      for (let j = 0; j < units.length; j++) {
        let {position, unit}  = units[j];
        if (!unit.isAlive()) {
          continue;
        }
  
        position = moveUnit(position, unit, m);
  
        const enemySelected = getEnemy(position, unit, m);
        
        if (enemySelected) {
          unit.attack(enemySelected.unit);
          if (!enemySelected.unit.isAlive()) {
            if (enemySelected.unit.type === Unit.ELF) {
              // Game over
              gameOver = true;
              break;
            }
            m.set(enemySelected.position, OPEN);
          }
        }      
      }
  
      if (new Set([...getUnits(m).map(u => u.unit.type)]).size === 1) {
        console.log('');
        console.log(m.draw())
        console.log('power', att);
        console.log(`${i} * ${getUnits(m).map(u => u.unit.hp).reduce(sum)} = ${i * getUnits(m).map(u => u.unit.hp).reduce(sum)}`);
        console.log(getUnits(m).map(u => u.unit.hp))
        return;
      }
    } 
  }  
  console.log('ok')
}
  

partTwo();

function moveUnit(position: Position, unit: Unit, m: Matrix<Square>) {
  if (!neighbors(position).some(n => unit.isEnemy(m.get(n)))) {
    // find closest enemy
    const enemies = getUnits(m).filter(pu => unit.isEnemy(pu.unit));
    const closestEnemy = closest(position, enemies.map<Position>(pu => pu.position), m);
    if (closestEnemy) {
      // Move towards that enemy
      const candidates = neighbors(position).filter(n => m.get(n) === OPEN);
      const nextPosition = closest(closestEnemy, candidates, m) as Position;

      //Move to that square
      m.set(position, OPEN);
      m.set(nextPosition, unit);
      position = nextPosition;
    }
  }
  return position;
}
