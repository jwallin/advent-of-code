import { getInput, multiply, sum } from '../utils';

type Range = {
  max: number,
  min: number
};

type FieldRule =  {
  fieldName: string,
  ranges: Range[]
};

type Field = {
  name: string | undefined,
  value: number
};

type Ticket = Field[];

type PuzzleInput = {
  fieldRules: FieldRule[],
  myTicket: Ticket,
  nearbyTickets: Ticket[] 
};

function mapField(input: string): FieldRule {
  const field = {}
  const a = input.split(': ');
  return {
    fieldName: a[0],
    ranges:  a[1].split(' or ').map(x => x.split('-').map(Number)).map(x => ({ min: x[0], max: x[1] }))
  }
}

function isValidField(value: number, rule: FieldRule):boolean {
  let valid = false;
  rule.ranges.forEach(f => {
    if (value >= f.min && value <= f.max) {
      valid = true;
      return false;
    }
  });
  return valid;
}

function isValid(value:number, rules: FieldRule[] ):boolean {
  let valid = false;
  rules.forEach(r => {
    if (isValidField(value, r)) {
      valid = true;
      return false;
    }
  });
  
  return valid;
}

function isValidTicket(ticket: Ticket, rules: FieldRule[]):boolean {
  return ticket.map(x => x.value).every(v => isValid(v, rules));
}

function parseInput(input: string[]):PuzzleInput {
  const toTicket = (row: string) => row.split(',').map(Number).map(x => ({ value: x, name: undefined }));
  const fieldRules = input.slice(0, input.indexOf('')).map(mapField);
  const myTicket:Ticket = input.slice(input.indexOf('your ticket:') + 1, input.indexOf('your ticket:') + 2).map(toTicket)[0];
  const nearbyTickets:Ticket[] = input.slice(input.indexOf('nearby tickets:') + 1).map(toTicket);
  return {
    fieldRules,
    myTicket,
    nearbyTickets
  }
}

async function partOne() {
  const { fieldRules, nearbyTickets } = parseInput(await getInput());
  
  const nearbyTicketValues = nearbyTickets.flat().map(x => x.value);
  const total = nearbyTicketValues.filter(x => !isValid(x, fieldRules)).reduce(sum, 0);
  console.log(total)
}

async function partTwo() {
  const { fieldRules, myTicket, nearbyTickets } = parseInput(await getInput());
  const validTickets:Ticket[] = nearbyTickets.filter(x => isValidTicket(x, fieldRules));

  const knownFields = new Set<string>();  
  while (knownFields.size < myTicket.length) {
    const validFields = myTicket.map((v, i) => {
      const valueOnOtherTickets = validTickets.map(t => t[i].value);
      // Valid if not a known field already and all values on all other tickets fit in the ranges
      return fieldRules.filter(f => !knownFields.has(f.fieldName) && valueOnOtherTickets.every(x => isValidField(x, f)));
    });
    validFields.forEach((possibleFields, i) => {
      if (possibleFields.length === 1) {
        //If only one possible field, mark it as known
        knownFields.add(possibleFields[0].fieldName);
        myTicket[i].name = possibleFields[0].fieldName;
      }
    });
  }

  const departureValues = myTicket.filter(x => x.name?.startsWith('departure')).map(x => x.value);
  console.log(departureValues.reduce(multiply, 1));
}

partOne();
partTwo();