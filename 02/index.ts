import { readline } from '../utils/readline';

type PasswordRule = {
  positions: number[],
  letter: string,
  password: string
}

function countLetter(l:string, input:string):number {
  return [...input].filter(x => x == l).length;
}

function charAt(input:string, index:number):string {
  return [...input][index];
}

async function getPasswords():Promise<PasswordRule[]> {
  const passwords:string[] = (await readline('input.txt'));

  return passwords.map(x => {
    const parts = x.split(' ');
    const positions = parts[0].split('-').map(Number);
    const letter = parts[1].substr(0, 1);
    return {
      positions,
      letter,
      password: parts[2]
    }
  });
}

async function partOne() {
  const passwords:PasswordRule[] = await getPasswords();

  const validPasswords = passwords.filter(x => {
    const min = x.positions[0];
    const max = x.positions[1];
    const occ = countLetter(x.letter, x.password);
    return min <= occ && max >= occ;
  });

  console.log(validPasswords.length);
}

async function partTwo() {
  const passwords:PasswordRule[] = await getPasswords();

  const validPasswords = passwords.filter(x => {
    const p1 = charAt(x.password, x.positions[0] - 1) === x.letter;
    const p2 = charAt(x.password, x.positions[1] - 1) === x.letter;
    return (p1 || p2) && (p1 !== p2)
  });

  console.log(validPasswords.length)
}

partTwo();