import { getInput } from '../../utils';
import { weightedDijkstra } from '../../utils/dijkstra';
import { Matrix } from '../../utils/matrix';

function calcShortestPath(input: number[][]) {
  const m = new Matrix(input);
  const shortest = weightedDijkstra({ x: 0, y: 0 }, m.maxPos(), (node) => {
    return Matrix.adjacentPositions(node).filter(x => m.has(x)).map(x => [x, m.get(x) as number]);
  });
  return shortest;
}

function extendMap(input: number[][]) {
  const val = [0, 1, 2, 3, 4];
  const extRows = input.map(n => val.reduce<number[]>((acc, i) => {
      acc.push(...n.map(y => getRiskVal(i, y)));
      return acc;
    }, []));
  
  return val.reduce<number[][]>((acc, i) => {
    const rows = extRows.map(r => r.map(y => getRiskVal(i, y)));
    acc.push(...rows);
    return acc;
  }, []);
}

function getRiskVal(i: number, y: number) {
  let riskVal = i + y;
  if (riskVal > 9) {
    riskVal = riskVal % 9;
  }
  return riskVal;
}

async function partOne() {
  const input = (await getInput()).map(x => x.split('').map(Number));
  const shortest = calcShortestPath(input);
  console.log(shortest);
}

async function partTwo() {
  const input = (await getInput()).map(x => x.split('').map(Number));
  const ext: number[][] = extendMap(input);
  const m = new Matrix(ext);
  const shortest = weightedDijkstra({x: 0, y: 0}, m.maxPos(), (node) => {
    return Matrix.adjacentPositions(node).filter(x => m.has(x)).map(x => [x, m.get(x) as number]);
  });
  console.log(shortest);
}

partTwo();

