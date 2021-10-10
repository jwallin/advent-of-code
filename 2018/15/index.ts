import { getInput } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { equals, Position, readingOrder } from '../../utils/position';
import { dijkstra, shortestPath } from '../../utils/dijkstra';

class Unit {
  static ELF = 'E';
  static GOBLIN = 'G';

  private static ATTACK_POWER = 3;
  private static START_HP = 300;

  private _hp: number;
  private _position: Position;
  private _type: string;

  constructor(type: string, position: Position) {
    this._hp = Unit.START_HP;
    this._type = type;
    this._position = position;
  }

  get position() {
    return this._position;
  }

  set position(p: Position) {
    this._position = p;
  }

  get type() {
    return this._type;
  }

  get hp() {
    return this._hp;
  }

  static sortEnemies(a: Unit, b: Unit) {
    return (a.hp !== b.hp) ? Math.sign(a.hp - b.hp) : readingOrder(a.position, b.position);
  }

  attack() {
    this._hp -= Unit.ATTACK_POWER;
  }

  isAlive() {
    return this._hp > 0;
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
  const input = (await getInput()).map(x => x.split(''));
  const m = new Matrix(input);
  console.log(m.draw())

  const units = m.asArray().filter(x => m.get(x) === 'E' || m.get(x) === 'G').map(c => new Unit(m.get(c) as string, c));

  for (let i = 0; i < 5; i++) {
    //const units = m.asArray().filter(x => m.get(x) === 'E' || m.get(x) === 'G').sort(readingOrder);
    units.sort((a, b) => readingOrder(a.position, b.position)).forEach(u => {
      
      const enemy = (u.type === 'E') ? 'G' : 'E';
      // combat
      if (neighbors(u.position).some(n => m.get(n) === enemy)) {
        return;
      }
  
      // find closest enemy
      const enemies = m.asArray().filter(x => m.get(x) === enemy);
      const closestEnemy = closest(u.position, enemies, m);
      if (!closestEnemy) {
        return;
      }
      // Move towards that enemy
      const candidates = neighbors(u.position).filter(n => m.get(n) === '.' /*|| m.get(n) === 'G'*/);
      const nextPosition = closest(closestEnemy, candidates, m) as Position;
      
      //Move to that square
      m.set(u.position, '.');
      m.set(nextPosition, u.type);
      u.position = nextPosition;

      const enemiesInRange = neighbors(nextPosition)
        .filter(p => m.get(p) === enemy)
        .map(x => units.find(u => equals(u.position, x)) as Unit)
        .sort(Unit.sortEnemies);
      const enemySelected = enemiesInRange[0];
      if (enemySelected) {
        enemySelected.attack();
      }
    });
    console.log('')
    console.log(m.draw())
  }
}

function closest(from: Position, candidates: Position[], m: Matrix<string>): Position | undefined {
  const nextDistances = candidates.map(x => {
    return dijkstra(from, x, (node) => neighbors(node).filter(p => m.get(p) === '.' || equals(p, x))
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
  }, []).map(i => candidates[i]).sort(readingOrder)[0];
  return c;
}

async function partTwo() {
  const input = (await getInput()).map(Number);
}
  

partOne();