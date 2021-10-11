import { getInput, isValidYear, hasAllValuesFrom } from '../../utils';

type PassportValidator = (x: string) => boolean

type Passport = {
  [key: string]: string
};

type PassportField = {
  [key: string]: {
    required: boolean,
    validator: PassportValidator
  }
}

const VALID_COLORS = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];
const FIELDS: PassportField = {
  'byr': { required: true, validator: (x:string) => isValidYear(Number(x), 1920, 2002) },
  'iyr': { required: true, validator: (x:string) => isValidYear(Number(x), 2010, 2020) },
  'eyr': { required: true, validator: (x:string) => isValidYear(Number(x), 2020, 2030) },
  'hgt': { required: true, validator:  (x:string) => {
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
    }
  },
  'hcl': { required: true, validator: (x:string) => !!x.match(/^#[0-9a-z]{6}$/) },
  'ecl': { required: true, validator: (x:string) => !!VALID_COLORS.find(val => x == val) },
  'pid': { required: true, validator: (x:string) => !!x.match(/^\d{9}$/) },
  'cid': { required: false, validator: () => true }
}

async function getPassports():Promise<Passport[]> {
  const candidates: string[] = (await getInput()).join(' ').split('  ');
  
  return candidates.map(c => c.split(' ').map(x => x.split(':'))
                   .reduce((p, c) => Object.assign(p, { [c[0]]: c[1] }), {}));              
}

function filterOnRequiredFields(passports: Passport[]): Passport[] {
  const requiredFields = Object.keys(FIELDS).filter(k => FIELDS[k].required);
  
  return passports.filter(x => hasAllValuesFrom(Object.keys(x), requiredFields));
}

async function partOne() {
  const passports = await getPassports();
  const validPassports = filterOnRequiredFields(passports);
  console.log(validPassports.length)
}

async function partTwo() {
  const passports = filterOnRequiredFields(await getPassports());

  const validPassports = passports.filter(x => {
    return Object.keys(x).every((key:string) => {
      const value:string = x[key];
      const pass = !!FIELDS[key].validator(value);
      console.log(`trying ${key} with val ${value}: ${pass}`);
      return pass;
    });
  });

  console.log(validPassports.length)
}

partTwo();