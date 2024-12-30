import { getInput, splitArrayBy } from '../../utils';

async function partOne() {
  const [ruleInput, printInput] = splitArrayBy(await getInput(), '');

  const rules = ruleInput.map(r => r.split('|').map(Number)).reduce<Map<number, number[]>>((rules, r) => {
    const [before, after] = r;

    if (!rules.has(before)) {
      rules.set(before, []);
    }
    rules.get(before)!.push(after);

    return rules;
    
  }, new Map<number, number[]>())

  const prints = printInput.map(x => x.split(',').map(Number));
  const sum = prints.reduce<number>((acc, print, i) => {
    for (let i = 0; i < print.length; i++) {
      const page = print[i];
      if (!rules.has(page)) {
        continue;
      }
      const rule = rules.get(page)!;
      const pagesBefore = print.slice(0, i);
      const relevantRules = rule.filter(x => print.includes(x));
      if (pagesBefore.some(x => relevantRules.includes(x))) {
        return acc;
      }
    }
    return acc + print[(Math.ceil(print.length / 2) - 1)];
  }, 0);
  console.log(sum)
}


async function partTwo() {
  const input = (await getInput()).map(Number);
}
  

partOne();