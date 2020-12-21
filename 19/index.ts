import { getInput, splitArray } from '../utils';

type Rule = string[];

type RuleObj = {
  [key: string]: Rule
}

type Input = {
  messages: string[],
  rules: RuleObj
};

function createRexStr(input: string, rules: RuleObj):string {
  const g = rules[input];
  if (rules[input]) {
    const options = g.map((o) => {
      return o.split(' ').map(c => {
        return createRexStr(c, rules);
      }).join('');
    });
    if (options.length === 1) {
      return options[0];
    } 
    return `(${options.join('|')})`;
  }
  return input;
}

function parseRules(input: string[]):RuleObj {
  const rules:RuleObj = input.reduce((prev, x) => {
    const a = x.split(': ');

    // Split on Pipe
    const v = a[1].replace(/["]/g, '').split('|');
    
    return Object.assign(prev, {
      [a[0]]: v
    });
  }, {});

  return rules;
}

function parseInput(input:string[]):Input {
  const parts = splitArray(input, '');
  return {
    rules: parseRules(parts[0]),
    messages: parts[1]
  };
}

async function partOne() {
  const input = await (await getInput());
  const { rules, messages } = parseInput(input);
  const r = createRexStr('0', rules);
  const reg = new RegExp(`^${r}$`);
  console.log(messages.filter(m => m.match(reg)).length);
}

partOne();