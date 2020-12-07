import { lines, unique } from '../utils';

type BagContent = {
  quantity: number,
  color: string
};

type Bag = {
  [key: string]: BagContent[]
};

type P = {
  [key: string]: string[]
};

async function getRules(): Promise<Bag> {
  const input: string[] = (await lines('input.txt'));
  return  input.reduce((acc: Bag, b: string) => {
    const d = b.split(' contain ').map(x => x.replace(/\sbag(s?)(\.?)/g, ''));
    const content:BagContent[] = d[1].split(', ')
        .filter(x => x !== 'no other')
        .map(x => {
          const parts = x.split(/\s(.+)/);
          const quantity = Number(parts[0]);
          const color = parts[1];
          return { color, quantity };
        });
    return Object.assign(acc, { [d[0]]: content });
  }, {});
}

async function partOne() {
  const rules: Bag = await getRules();

  function lookFor(color: string, variations:Set<string> = new Set()) {
    Object.keys(rules).forEach(r => {
      const bags = rules[r].find(y => y.color === color);
      if (bags) {
        variations.add(r);
        lookFor(r, variations)
      }
    });
    return variations;
  }
  
  console.log(lookFor('shiny gold').size)
}

async function partTwo() {
  const rules: Bag = await getRules();

  function countBags(color: string): number {
    return rules[color].reduce((a,b) => {
      return a + b.quantity + (b.quantity) * countBags(b.color);
    }, 0);
  }

  console.log(countBags('shiny gold'));
}

partOne()