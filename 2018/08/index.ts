import { textChangeRangeIsUnchanged } from 'typescript';
import { getInput, sum } from '../../utils';

class Node {

  private _children: Node[]
  private _metadata: number[]

  constructor(input: number[]) {
    this._children = [];
    this._metadata = [];

    const numChildren = popFirst(input);
    const numMetadata = popFirst(input);
    for (let i = 0; i < numChildren; i++) {
      this._children.push(new Node(input));
    }
    this._metadata = input.splice(0, numMetadata);
  }

  get children() {
    return this._children;
  }

  get metadata() {
    return this._metadata;
  }

  sumOfMetadata():number {
    return this.children.reduce((acc, curr) => acc + curr.sumOfMetadata(), this.metadata.reduce(sum));
  }
}

function popFirst<T>(arr: T[]): T {
  return arr.shift() as T;
}

async function partOne() {
  const input = (await getInput())[0].split(' ').map(Number);
  const tree = new Node(input);
  console.log(tree.sumOfMetadata())
}

async function partTwo() {
  const input = (await getInput()).map(Number);
}
  

partOne();