/* eslint-disable @typescript-eslint/ban-types */
import { getInput, sum, } from '../../utils';
import { LinkedList } from '../../utils/linkedList';

function mod(x: number, n: number): number {
  return ((x % n) + n) % n;
}

function decrypt(input: Number[], list: LinkedList<Number>) {

  // Do work
  let aVal: LinkedList<Number> | undefined;
  for (let i = 0; i < input.length; i++) {
    const val = input[i].valueOf();
    if (val === 0) {
      continue;
    }
    const o = list.findValue(input[i]);
    if (o === undefined) {
      throw new Error(`Couldnt find value ${val}`);
    }

    const toLeft = o.stepRight(mod(val, input.length - 1));
    o.remove();
    aVal = toLeft.insertRight(input[i]);
  }
  return aVal;
}

function makeList(input: Number[]) {
  const list = LinkedList.fromArray(input);

  //Close circle
  const first = list;
  let last = list;
  while (last.right) {
    last = last.right;
  }
  last.right = first;
  first.left = last;
  return list;
}

function print(v: LinkedList<Number>) {
  const vals:Number[] = [v.value];
  let b = v.right;
  while (b && b !== v) {
    vals.push(b.value);
    b = b.right;
  }
  console.log(vals.join(' '))
}

async function partOne() {
  const input = (await getInput()).map(x => new Number(x)); // Use object wrapper for pointers
  const list = makeList(input);
  const aVal = decrypt(input, list);

  const a = aVal?.findValue(input.find(x => x.valueOf() === 0) as Number) as LinkedList<Number>;
  const coords = [a.step(1000 % input.length).value, a.step(2000 % input.length).value, a.step(3000 % input.length).value].map(x => x.valueOf());
  console.log(coords)
  console.log(coords.reduce(sum));
 
}

async function partTwo() {
  const KEY = 811589153;
  
  const input = (await getInput()).map(Number).map(x => x * KEY).map(x => new Number(x)); // Use object wrapper for pointers
  let list = makeList(input);
  for (let i = 0; i < 10; i++) {
    list = decrypt(input, list) as LinkedList<Number>;
  }

  const a = list?.findValue(input.find(x => x.valueOf() === 0) as Number) as LinkedList<Number>;
  const coords = [a.step(1000 % input.length).value, a.step(2000 % input.length).value, a.step(3000 % input.length).value].map(x => x.valueOf());
  console.log(coords)
  console.log(coords.reduce(sum)); 
}
  
partOne();
partTwo();