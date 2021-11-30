import { getInput, splitArray, sum } from '../../utils';

type Army = {
  name: string,
  groups: Group[]
};

class Group {
  public hp:number;
  public attack: number;
  public numberOfUnits: number;
  public initiative: number;
  public attackType: string;
  public weaknesses: string[];
  public immunities: string[];
  public army: string;
  public target?: Group;
  public id: number;

  private constructor(army: string, numberOfUnits: number, hp: number, weaknesses:string[], immunities: string[], attack: number, attackType: string, initiative:number, id: number) {
    this.army = army;
    this.numberOfUnits = numberOfUnits;
    this.hp = hp;
    this.weaknesses = weaknesses;
    this.immunities = immunities;
    this.attack = attack;
    this.attackType = attackType;
    this.initiative = initiative;
    this.id = id;
  }

  public static parseGroup(s: string, army: string, id: number):Group {
    const re = /(\d+) units each with (\d+) hit points (\(([^)]*)\) )?with an attack that does (\d+) (\w+) damage at initiative (\d+)/
    const matches = s.match(re);

    if (!matches) {
      throw new Error(`Could not parse ${s}`);
    }
    const w = matches[4]?.split('; ');
    const weaknesses = w?.flatMap(x => x.match(/weak to (.*)$/)?.[1].split(', ')).filter(x => !!x) as string[] || [];
    const immunities = w?.flatMap(x => x.match(/immune to (.*)$/)?.[1].split(', ')).filter(x => !!x) as string[] || [];

    return new Group(army, Number(matches[1]), Number(matches[2]), weaknesses, immunities, Number(matches[5]), matches[6], Number(matches[7]), id);
  }

  get effectivePower():number {
    return this.attack * this.numberOfUnits;
  }

  get alive():boolean {
    return this.numberOfUnits > 0;
  }

  selectTarget(enemies: Set<Group>) {
    //enemies.forEach((e) => console.log(`${this.army} group ${this.id} would deal defending group ${e.id} ${this.calcAttack(e)} damage`));
    const aliveEnemies = Array.from(enemies).filter(e => e.alive);
    if (aliveEnemies.length === 0) {
      this.target = undefined;
      return;
    }
    this.target = aliveEnemies.reduce((p, c) => {
      const diff = this.calcAttack(c) - this.calcAttack(p);
      if (diff > 0) {
        return c;
      } else if (diff < 0) {
        return p;
      } else {
        const powerDiff = c.effectivePower - p.effectivePower;
        if (powerDiff > 0) {
          return c;
        } else if (powerDiff < 0) {
          return p;
        } else {
          return c.initiative > p.initiative ? c : p;
        }
      }
    });
    if (this.calcAttack(this.target) === 0) {
      this.target = undefined;
      return;
    }
    enemies.delete(this.target);
  }

  calcAttack(defendant: Group) {
    if (defendant.immunities.includes(this.attackType)) {
      return 0;
    }
    if (defendant.weaknesses.includes(this.attackType)) {
      return this.effectivePower * 2;
    }
    return this.effectivePower;
  }
}

async function partOne() {
  const input = (await getInput());
  const armies = splitArray(input, '').map<Army>((a) => {
    const name = a.shift() || '';
    return {
      name,
      groups: a.map((x, i) => Group.parseGroup(x, name, i + 1))
    }
  });

  while (armies.every(a => a.groups.map(x => x.numberOfUnits).reduce(sum) > 0)) {
    // List folks
    armies.forEach(a => {
      console.log(a.name);
      a.groups.forEach((g, i) => console.log(`Group ${i + 1} contains ${g.numberOfUnits} units`));
    });
    console.log('');

    // Target selection
    armies.forEach(ar => {
      const orderedGroups = ar.groups.filter(g => g.alive).sort((a,b) => {
        const powerDiff = Math.sign(b.effectivePower - a.effectivePower);
        if (powerDiff !== 0) {
          return powerDiff;
        }
        return Math.sign(b.initiative - a.initiative);
      });
      const candidates = new Set(armies.filter(c => c !== ar).flatMap(c => c.groups));
      orderedGroups.forEach(g => g.selectTarget(candidates));
    });
    console.log('');
    
    // Attack
    const groupsByInitiative = armies.flatMap(a => a.groups).sort((a,b) => Math.sign(b.initiative - a.initiative));
    groupsByInitiative.forEach(g => {
      const target = g.target;
      if (!target) {
        return;
      }
      const kills = Math.min(Math.floor(g.calcAttack(target) / target.hp), target.numberOfUnits);
      target.numberOfUnits -= kills;
      g.target = undefined;
      console.log(`${g.army} group ${g.id} attacks defending group ${target.id}, killing ${kills} units`);
    });
    console.log('')
  }
  
  armies.forEach(a => {
    console.log(a.name);
    a.groups.forEach(g => console.log(`Group ${g.id} contains ${g.numberOfUnits} units`));
    console.log(`Total ${a.groups.map(g => g.numberOfUnits).reduce(sum)}`);
  });
}

async function partTwo() {
  const input = (await getInput()).map(Number);
}
  

partOne();