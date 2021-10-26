import { getInput } from '../../utils';
import { Matrix } from '../../utils/matrix';
import { max, min, Position, sum } from '../../utils/position';

function arrayBetween(n:number, m:number) {
  return Array.from({length: m - n + 1}, (_v,k) => k + n);
}

function parseInput(s:string):Position[] {
  const r = s.match(/(x|y)=(\d+), (x|y)=(\d+)..(\d+)/);
  if (!r) {
    throw new Error('Failed parsing input ' + s);
  }
  const [a,b] = r.slice(4).map(Number);
  return arrayBetween(a,b).map(a => {
    return { 
      [r[1]]: Number(r[2]),
      [r[3]]: a
    } as Position
  });
}

async function partOne() {
  const input = (await getInput()).map(parseInput).flat();
  const m = new Matrix<string>();
  const spring = {x:500, y: 0};
  
  m.fill(min(input.concat(spring)), max(input), '.');
  m.set(spring, '+');
  input.forEach(i => m.set(i, '#'));
  
  let prev = '';
  const flows = [spring];

  for (let i = 0; i < 5000; i++) {
    //const flows = m.asArray().filter(x => m.get(x)?.match(/\||\+/));
    flows.forEach(p => {
      const below = m.get(sum(p, {x:0, y:1}));
      if (below === '|') {
        return;
      } 
      if(below === '.') {
        m.set(sum(p, {x:0, y:1}), '|');
        flows.push(sum(p, {x:0, y:1}))
      } else if (below === '#' || below === '~') {
        //Try to left and right
        const leftPos = sum(p, {x:-1, y:0});
        const rightPos = sum(p, {x:1, y:0});
        if (m.get(leftPos) === '.') {
          m.set(leftPos, '|');
          flows.push(leftPos)
        }
        if (m.get(rightPos) === '.') {
          m.set(rightPos, '|');
          flows.push(rightPos)
        }
        // If row is bucket
        const row = m.getRow(p.y);
        const left = row.lastIndexOf('#', p.x - 1);
        const right = row.indexOf('#', p.x + 1);
        const belowRow = m.getRow(p.y + 1).slice(left + 1, right -1);

        if (left !== -1 && right !== -1 && belowRow.every(x => x !== '.')) {
          arrayBetween(left + 1, right - 1).forEach(x => m.set({x, y: p.y}, '~'));  
        }
        
      }
    })
    
    const curr = m.toString();
    if (curr === prev) {
      break;
    }
    
    prev = curr;
  }

  console.log(prev);
  console.log('');
  console.log(m.values().filter(x => x === '|' || x === '~').length)
}

async function partTwo() {
  const input = (await getInput()).map(Number);
}
  

partOne();