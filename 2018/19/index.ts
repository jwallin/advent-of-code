import { getInput } from '../../utils';
import { IntCode } from '../../utils/intcode';

async function partOne() {
  const input = (await getInput());
  const registers:number[] = [0, 0, 0, 0, 0, 0];
  new IntCode(registers, input).run();
  console.log(registers[0]);
}

function partTwo(n: number) {
  const sqrt = Math.sqrt(n);
  let res = (n % sqrt) === 0 ? sqrt : 0;
  for (let i = 1; i < sqrt; i++) {
    if (n % i === 0) {
      res += i + Math.floor(n / i);
    }
  }
  console.log(res);
}

partOne();

