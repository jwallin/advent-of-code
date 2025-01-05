import { arrayEquals, cloneArray, getInput, splitArrayBy } from '../../utils';

function parseRules(ruleInput: string[]) {
  return ruleInput.map(r => r.split('|').map(Number)).reduce<Map<number, number[]>>((rules, r) => {
    const [before, after] = r;

    if (!rules.has(before)) {
      rules.set(before, []);
    }
    rules.get(before)!.push(after);

    return rules;

  }, new Map<number, number[]>());
}

async function partOne() {
  const [ruleInput, printInput] = splitArrayBy(await getInput(), '');

  const rules = parseRules(ruleInput);

  const prints = printInput.map(x => x.split(',').map(Number));
  const sum = prints.reduce<number>((acc, print) => {
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
  const [ruleInput, printInput] = splitArrayBy(await getInput(), '');
  const rules = parseRules(ruleInput);
  const updates = printInput.map(x => x.split(',').map(Number));

  const sum = updates.reduce<number>((acc, u) => {
    const validUpdate = cloneArray(u);
    let isValid = true;
    do { 
      isValid = true;
      for (let i = 0; i < validUpdate.length - 1; i++) {
        const a = validUpdate[i];
        const b = validUpdate[i + 1];
        
        if (rules.get(b)?.some(x => x === a)) {
          validUpdate[i] = b;
          validUpdate[i + 1]  = a;
          isValid = false;
        }
      }
      
    } while (!isValid)
    if (!arrayEquals(u, validUpdate)) {
      return acc + validUpdate[(Math.ceil(validUpdate.length / 2) - 1)];
    }
    return acc;
  }, 0); 
  console.log(sum)
}

partTwo();