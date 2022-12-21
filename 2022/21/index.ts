import { getInput } from '../../utils';

const ROOT = 'root';

function calc(job: string, map: Map<string,  string>) {
  if (!isNaN(Number(job))) {
    return Number(job)
  }
  const op = job.replace(/\w{4}/g, (m) => getVal(m, map).toString());
  return Number(eval(op));
}

function getVal(name: string, map: Map<string,  string>): number {
  const job = map.get(name) as string;
  if (!job) {
    throw new Error('not found');
  }

  return calc(job, map);
}

async function parseMonkeys() {
  return (await getInput()).map(l => l.split(': ')).reduce((acc, [name, job]) => {
    acc.set(name, job);
    return acc;
  }, new Map<string, string>());
}

async function partOne() {
  const map = await parseMonkeys();
  const a = getVal(ROOT, map);
  console.log(a);
}

async function partTwo() {
  const map = await parseMonkeys();
  const root = map.get(ROOT) as string;

  let v = 10;
  let vmin = 0;
  let vmax = 10000000000000000; // Random very high number

  while(true) {
    map.set('humn', v.toString());
    const [left,  right] = root.split(' + ').map(v => calc(v, map));

    if (left === right) {
      console.log(v);
      return;
    }
    if (left > right) {
      vmin = v
    }  else {
      vmax = v;
    }
    v = Math.floor((vmax + vmin) / 2)
  }
}

partOne();
partTwo();