import { lines, isValidYear } from '../utils';

type PassportValidator = {
  [key: string]: (x: string) => boolean
}

type PassportValue = {
  [key: string]: string
}

type Passport = PassportValue[];

const REQUIRED_FIELDS = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

const VALIDATORS: PassportValidator = {
  'byr': (x:string) => isValidYear(Number(x), 1920, 2002),
  'iyr': (x:string) => isValidYear(Number(x), 2010, 2020),
  'eyr': (x:string) => isValidYear(Number(x), 2020, 2030),
  'hgt': (x:string) => {
    const r = x.match(/^(?<l>\d*)(?<unit>cm|in)$/);
    if (!r) {
      return false;
    }
    const unit = r.groups?.unit;
    const length = Number(r.groups?.l);
    if (unit == 'cm') {
      return length >= 150 && length <= 193;
    } else {
      return length >= 59 && length <= 76;
    }
  },
  'hcl': (x:string) => !!x.match(/^#[0-9a-z]{6}$/),
  'ecl': (x:string) => !!['amb','blu','brn','gry','grn','hzl','oth'].find(val => x == val),
  'pid': (x:string) => !!x.match(/^\d{9}$/),
  'cid': () => true
}

async function getPassports():Promise<Passport> {
  const candidates: string[] = (await lines('input.txt')).join(' ').split('  ');;
  
  return candidates.map(c => c.split(' ').map(x => x.split(':'))
                   .reduce((p, c) => Object.assign(p, { [c[0]]: c[1] }), {}));              
}

async function partOne() {
  const passports = await getPassports();

  const isValid = (arr:any[], target:any[]):boolean => target.every((v:any) => arr.includes(v));
  const validPassports = passports.filter(x => {
    return isValid(Object.keys(x), REQUIRED_FIELDS);
  });

  console.log(validPassports.length)
}

async function partTwo() {
  const passports = await getPassports();

  const isValid = (arr:any[], target:any[]):boolean => target.every((v:any) => arr.includes(v));
  const validPassports = passports.filter(x => {
    if (!isValid(Object.keys(x), REQUIRED_FIELDS)) {
      return false;
    }

    return Object.keys(x).every((key:string) => {
      const value:string = x[key];
      const validator = VALIDATORS[key];
      const pass = !!validator(value);
      console.log(`trying ${key} with val ${value}: ${pass}`);
      return pass;
    })
  });

  console.log(validPassports.length)
}

partTwo();