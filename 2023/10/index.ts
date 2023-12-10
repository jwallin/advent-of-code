import { getInput } from '../../utils';
import { dijkstraWithDistances } from '../../utils/dijkstra';
import { Matrix } from '../../utils/matrix';
import { Position, equals, sum, toKey } from '../../utils/position';


enum DIR {
  N, E, S, W
}

const DIRECTIONS = {
  [DIR.N]: {x: 0, y: -1},
  [DIR.E]: {x: 1, y: 0},
  [DIR.S]: {x: 0, y: 1},
  [DIR.W]: {x: -1, y: 0},
}

function getValidDirs(s: string) {
  switch (s) {
    case '|':
      return [DIR.N, DIR.S];
    case '-':
      return [DIR.W, DIR.E];
    case 'L':
      return [DIR.N, DIR.E];
    case 'J':
      return [DIR.N, DIR.W];
    case '7':
      return [DIR.W, DIR.S];
    case 'F':
      return [DIR.E, DIR.S];
    case 'S':
      return [DIR.N, DIR.E, DIR.S, DIR.W];
    default:
      return [];
  }
}

function getValidDirections(node: Position, matrix: Matrix<string>) {
  return getValidDirs(matrix.get(node)).map(x => DIRECTIONS[x]).map(x => sum(node, x));
}

function getPolygon(startingPoint: Position, matrix: Matrix<string>) {
  const polygon = [startingPoint];
  const nodes = new Set([toKey(startingPoint)]);
  let currentNode = startingPoint;
  
  while (true) {
    const neighbors = getValidNeighbors(currentNode, matrix).filter(n => !nodes.has(toKey(n)));
    if (neighbors.length === 0) {
      break;
    }
    currentNode = neighbors[0];
    polygon.push(currentNode);
    nodes.add(toKey(currentNode));
  }
  return polygon;
}

function getValidNeighbors(node: Position, matrix: Matrix<string>) {
  return getValidDirections(node, matrix).filter(neighborPos => {
    if (!matrix.has(neighborPos)) {
      return false;
    }
    const validDirectionsFromNeighbor = getValidDirections(neighborPos, matrix);
    return validDirectionsFromNeighbor.some(d => equals(d, node));
  });
}

function pointInPolygon(polygon: Position[], point: Position) {
  let isInside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const pi = polygon[i];
    const pj = polygon[j];

    const intersect = ((pi.y > point.y) != (pj.y > point.y)) && (point.x < (pj.x - pi.x) * (point.y - pi.y) / (pj.y - pi.y) + pi.x);
    if (intersect) {
      isInside = !isInside;
    }
  }
  return isInside;
}

async function partOne() {
  const input = (await getInput()).map(x => x.split(''));
  const matrix = new Matrix(input);
  const startingPoint = matrix.positionsWithValue('S')[0];

  const [, distances] = dijkstraWithDistances(startingPoint, undefined, (node) => getValidNeighbors(node, matrix));

  console.log(Math.max(...distances.values()))
}

async function partTwo() {
  const input = (await getInput()).map(x => x.split(''));
  const matrix = new Matrix(input);
  const startingPoint = matrix.positionsWithValue('S')[0];

  const polygon = getPolygon(startingPoint, matrix);
  const possiblePoints = matrix.asArray().filter(x => !polygon.some(y => equals(x, y)));

  const pointsInside = possiblePoints.filter(point => pointInPolygon(polygon, point));

  console.log(pointsInside.length);
}
  
partOne();
partTwo();


