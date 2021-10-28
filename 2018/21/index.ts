import { getInput } from '../../utils';
import { IntCode, OPERATIONS } from '../../utils/intcode';

async function partOneAndTwo() {
  const input = (await getInput());
  const registers:number[] = [0, 0, 0, 0, 0, 0];
  const seenValues = new Set<number>();
  let prevVal = -1;
  const intCode = new IntCode(registers, input, Object.assign({}, OPERATIONS, {
    eqrr: (r: number[], a:number, b:number, c:number) => {
      OPERATIONS.eqrr(r, a, b, c);
      if (a === 5) {
        const val = registers[5];
        if (prevVal === -1) {
          console.log(`Part 1: ${val}`);
        }
        if (seenValues.has(val)) {
          // Read registry 5. If value has been seen, force exit in a non-nice way
          console.log(`Part 2: ${prevVal}`);
          intCode.halt();
        } else {
          seenValues.add(val);
        }
        prevVal = val;
      }
    }
  }));
  intCode.run();
}

partOneAndTwo();