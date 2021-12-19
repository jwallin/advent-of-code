import { getInput } from '../../utils';
import { KeyVal } from '../../utils/types';


function run(input: string[], steps: number) {
  const template = input.shift() as string;
  input.shift();
  const rules = input.map(c => c.split(' -> ')).reduce<KeyVal<string>>((acc, [a, b]) => {
    acc[a] = b;
    return acc;
  }, {});

  let pairs: KeyVal<number> = {};
  for (let i = 0; i < template.length - 1; i++) {
    const f = template.substring(i, i + 2);
    pairs[f] = (pairs[f] || 0) + 1;
  }

  for (let i = 1; i <= steps; i++) {
    const curr: KeyVal<number> = {};
    Object.entries(pairs).forEach(([pair, cnt]) => {
      const rule = rules[pair];
      if (!rule) {
        throw new Error(`No rule matching ${pair}`);
      }
      const a = pair[0] + rule;
      const b = rule + pair[1];
      curr[a] = (curr[a] || 0) + cnt;
      curr[b] = (curr[b] || 0) + cnt;
    });
    pairs = curr;
  }

  const totals = Object.entries(pairs).reduce<KeyVal<number>>((p, [[a, b], cnt]) => {
    p[a] = (p[a] || 0) + cnt;
    p[b] = (p[b] || 0) + cnt;
    return p;
  }, {});

  totals[template[0]]++;
  totals[template[template.length - 1]]++;

  console.log(totals);
  const ord = Object.keys(totals).sort((a, b) => totals[b] - totals[a]);
  console.log((totals[ord[0]] - totals[ord[ord.length - 1]]) / 2);
}

async function partOne() {
  run(await getInput(), 10);
}

async function partTwo() {
  run(await getInput(), 40);
}

partTwo();
