import { getInput, multiply, sum } from '../../utils';

function getMaxCubes(data: string) {
  const maxCubes = new Map<string, number>();
  data.split('; ').forEach(d => {
    d.split(', ').map(c => c.split(' ')).forEach(([n, color]) => {
      const q = Number(n);
      const max = maxCubes.get(color);
      if (max === undefined || max < q) {
        maxCubes.set(color, q);
      }
    });
  });
  return maxCubes;
}

async function partOne() {
  const input = (await getInput());
  const games  = input.reduce<Map<number, Map<string, number>>>((acc, x) => {
    const [gameId, data] = x.split(': ');
    const [, idVal] = gameId.split('Game ');
    acc.set(Number(idVal), getMaxCubes(data));
    return acc;
  }, new Map());

  const maxVals = new Map(Object.entries({
    'red': 12,
    'green': 13,
    'blue': 14
  }));

  let idSum = 0;
  games.forEach((val, id) => {
    if ([...val.keys()].every(color => val.get(color)! <= maxVals.get(color)!)) {
      idSum += id;
    }
  })

  console.log(idSum)
}

async function partTwo() {
  const input = (await getInput());
  const games  = input.map<Map<string, number>>(g => {
    const [, data] = g.split(': ');
    return getMaxCubes(data);
  }, new Map());
  const p = games.map(g => [...g.values()].reduce(multiply)).reduce(sum);
  console.log(p)
}
  
partOne();
partTwo();
