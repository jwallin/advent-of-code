import { getInput, unique } from '../../utils';
import { KeyVal } from '../../utils/types';

function getVisitsLeft(allNodes: string[]) {
  return allNodes.reduce<KeyVal<number>>((acc, curr) => {
    acc[curr] = 1;
    return acc;
  }, {});
}

function traverse(from: string, to: string, visitsLeft: KeyVal<number>, pathList: string[], edges: KeyVal<string[]>):string[][] {
  if (from === to) {
    return [pathList];
  }
  visitsLeft[from]--;
  if (!edges[from]) {
    return [];
  }
  return edges[from]
    .filter(n => n === n.toUpperCase() || visitsLeft[n] > 0)
    .flatMap(n => {
    return traverse(n, to, Object.assign({}, visitsLeft), pathList.concat([n]), edges);
  });
}

function getEdges(input: string[]) {
  return input.map(x => x.split('-')).reduce<KeyVal<string[]>>((acc, [from, to]) => {
    acc[from] = acc[from] ? acc[from].concat(to) : [to];
    acc[to] = acc[to] ? acc[to].concat(from) : [from];
    return acc;
  }, {});
}

async function partOne() {
  const input = (await getInput());
  const edges = getEdges(input);
  const allNodes = unique(Object.keys(edges).concat(...Object.values(edges)))  
  const visitsLeft = getVisitsLeft(allNodes)

  const tot = traverse('start', 'end', visitsLeft, ['start'], edges);
  console.log(tot.length);
}


async function partTwo() {
  const input = (await getInput());
  const edges = getEdges(input);
  const allNodes = unique(Object.keys(edges).concat(...Object.values(edges)))  
  const visitsLeft = getVisitsLeft(allNodes)

  const smallCaves = allNodes.filter(x => x === x.toLocaleLowerCase() && !['start', 'end'].includes(x));
  const all = smallCaves.reduce<string[]>((acc, curr) => {
    const v = Object.assign({}, visitsLeft, {[curr]: 2});
    const paths = traverse('start', 'end', v, ['start'], edges).map(x => x.join(','));
    return unique(acc.concat(paths));
  }, []);

  console.log(all.length)
}

partOne();