import rl from 'readline';
import fs from 'fs';

export function readline(fn:string):Promise<Array<string>> {
  return new Promise((resolve, reject) => {
    let lines: Array<string> = [];
    const r = rl.createInterface({
      input: fs.createReadStream(fn)
    });
    
    r.on('line', (input) => {
      lines.push(input);
    });

    r.on('close', () => {
      resolve(lines);
    });
  });
}