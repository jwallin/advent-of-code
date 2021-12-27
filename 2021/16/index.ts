import { getInput, multiply, sum } from '../../utils';
import { KeyVal } from '../../utils/types';

const toDec = (a:string[]):number => parseInt(a.join(''), 2);

const binMap:KeyVal<string> = {
  '0': '0000',
  '1': '0001',
  '2': '0010',
  '3': '0011',
  '4': '0100',
  '5': '0101',
  '6': '0110',
  '7': '0111',
  '8': '1000',
  '9': '1001',
  'A': '1010',
  'B': '1011',
  'C': '1100',
  'D': '1101',
  'E': '1110',
  'F': '1111'
};

function runOp(id: number, vals: number[]): number {
  switch (id) {
    case 0:
      return vals.reduce(sum);
    case 1:
      return vals.reduce(multiply);
    case 2:
      return Math.min(...vals);
    case 3:
      return Math.max(...vals);
    case 5:
      return vals[0] > vals[1] ? 1 : 0;
    case 6:
      return vals[0] < vals[1] ? 1 : 0;
    case 7:
      return vals.every(x => x === vals[0]) ? 1 : 0;
      
    default:
      throw new Error('operator not supported');
  }
}

function parsePacket(binary: string[]):[number, number] {
  const version = toDec(binary.splice(0, 3));
  const type = toDec(binary.splice(0, 3));
  if (type === 4) {

    let ended = false;
    const digits: string[] = [];
    while (!ended) {
      const data = binary.splice(0, 5);
      if (data.shift() === '0') {
        ended = true;
      }
      digits.push(...data);
    }
    return [toDec(digits), version];
  } else {
    const vals:[number, number][] = [];
    const lengthType = binary.shift();
    if (lengthType === '0') {
      const t = binary.splice(0, 15);
      const totalLength = toDec(t);
      const subpackets = binary.splice(0, totalLength);
      while (subpackets.length > 0) {
        vals.push(parsePacket(subpackets));
      }
    } else {
      const numOfSubPackets = toDec(binary.splice(0, 11));
      for (let i = 0; i < numOfSubPackets; i++) {
        vals.push(parsePacket(binary));
      }
    }
    return [runOp(type, vals.map(x => x[0])), [version, ...vals.map(x => x[1])].reduce(sum)];
  }
}

async function parttOneAndTwo() {
  const input = (await getInput())[0];
  const binary = input.split('').map<string>(x => binMap[x]).join('').split('');
  
  const result = parsePacket(binary);
  console.log(result);
}
  

parttOneAndTwo();