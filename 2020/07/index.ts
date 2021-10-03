import { getInput, unique } from '../../utils';

type BagContent = {
  quantity: number,
  color: string
};

type Bag = {
  [key: string]: BagContent[]
};

async function getRules(): Promise<Bag> {
  return  (await getInput()).reduce((acc: Bag, b: string) => {
    const d = b.split(' contain ').map(x => x.replace(/\sbag(s?)(\.?)/g, ''));
    const content: BagContent[] = d[1].split(', ')
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

  function lookFor(color: string): string[] {
    return Object.keys(rules).reduce((acc: string[], r: string) => {
      const bags = rules[r].find(y => y.color === color);
      if (bags) {
        return [...acc, r, ...lookFor(r)];
      }
      return acc;
    }, []);
  }
  
  console.log(unique(lookFor('shiny gold')).length)
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