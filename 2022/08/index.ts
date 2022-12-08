import { between, getInput } from '../../utils';
import { Matrix, ADJACENT} from '../../utils/matrix';
import { equals, Position } from '../../utils/position';

async function partOne() {
  const heights = (await getInput()).map(x => x.split('').map(Number));
  const trees = new Matrix(heights);
  const maxPos = trees.maxPos();
  const n = trees.asArray()
    .filter(p => {
      const height = trees.get(p);
      const directions = [
        // Up
        between(0, p.y).map<Position>(y => ({x: p.x, y})),

        // Down
        between(p.y, maxPos.y).map<Position>(y => ({x: p.x, y})),
        
        // Left
        between(0, p.x).map<Position>(x => ({x, y: p.y})),

        // Right
        between(p.x, maxPos.x).map<Position>(x => ({x, y: p.y})),
      ];
      return directions.some(dir => dir.filter(x => !equals(x, p)).map(f => trees.get(f)).every(f => f < height));
    }).length;
  console.log(n)
}

async function partTwo() {
  const heights = (await getInput()).map(x => x.split('').map(Number));
  const trees = new Matrix(heights);
  const maxPos = trees.maxPos();
  const n = trees.asArray()
    .reduce((accMax, p) => {
      const th = trees.get(p);

      return Math.max(accMax, ADJACENT.reduce((acc, ap) => {
        let view = 0;
        for (let x = p.x + ap.x, y = p.y + ap.y; y >= 0 && x >= 0 && x <= maxPos.x && y <= maxPos.y; y += ap.y, x += ap.x) {
          const height = trees.get({x, y});
          view++;
          if (height >= th) {
            break;
          }
        }
        return acc * view;
      }, 1));

    }, 0);
    console.log(n)
}

partOne();
partTwo();