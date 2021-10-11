import { createInterface } from 'readline';
import { createReadStream } from 'fs';

export function lines(fn:string):Promise<Array<string>> {
  return new Promise((resolve) => {
    const lines: Array<string> = [];
    const r = createInterface({
      input: createReadStream(fn)
    });
    
    r.on('line', (input) => {
      lines.push(input);
    });

    r.on('close', () => {
      resolve(lines);
    });
  });
}