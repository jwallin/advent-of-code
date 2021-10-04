import { getInput } from '../../utils';
import { KeyVal } from '../../utils/types';

type LogEntry = {
  time: string,
  entry: string
}

type LogDay = {
  [date:string]: {
    id: number,
    asleep: boolean[]
  }
}

function parseLogEntry(input: String):LogEntry {
  const regex = /\[(.+)\]\s(.*)$/;
  const m = input.match(regex);
  if (!m) {
    throw new Error(`Couldnt parse log: ${input}`);
  }
  const [,time, entry] = m;
  return {
    time, entry
  }
}

function parseGuardId(entry:string):number {
  const regex = /\#(\d+)\s/;
  const m = entry.match(regex);
  if (!m) {
    throw new Error(`Couldnt parse guard: ${entry}`);
  }
  return Number(m[1]);
}

function getLogsByDay(entries: LogEntry[]): LogDay {
  const days:LogDay = {};
  let currentDate = '';
  let currentGuard = -1;
  let minutePointer = 0;
  entries.forEach(({time, entry}) => {
    const [date, timeString] = time.split(' ');
    const minute = Number(timeString.split(':')[1]);
    
    if (entry.startsWith('Guard')) {
      currentGuard = parseGuardId(entry); 
    } else {
      if (date !== currentDate) {
        currentDate = date;
        minutePointer = 0;
        days[date] = {
          id: currentGuard,
          asleep: []
        };
      }
      if (entry === 'falls asleep') {
        for (let i = minutePointer; i < minute; i++) {
          days[date].asleep[i] = false;
        }
      } else if (entry === 'wakes up') {
        for (let i = minutePointer; i < minute; i++) {
          days[date].asleep[i] = true;
        }
        
      }
      minutePointer = minute;
    } 
    
  });
  return days;
}

function getMinutesForGuard(id:number, days:LogDay) {
  const minutesTotal = Array(60).fill(0);
  Object.values(days).filter(x => x.id === id).forEach(d => {
    for(let i = 0; i < minutesTotal.length; i++) {
      if (d.asleep[i]) {
        minutesTotal[i]++;
      }
    }
  });
  return minutesTotal;
}

async function partOne() {
  const input = (await getInput()).map(String).sort();
  const entries = input.map(parseLogEntry);

  const days = getLogsByDay(entries);

  const guardTotalSleep = Object.values(days).reduce<KeyVal<number>>((acc, curr) => {
    const accValue = acc[curr.id] || 0;
    return Object.assign(acc, { [curr.id]: accValue + curr.asleep.filter(x => x).length });
  }, {});
  
  const mostSleepyGuard = Object.keys(guardTotalSleep).filter(g => guardTotalSleep[g] === Math.max(...Object.values(guardTotalSleep))).map(Number)[0];
  
  const minutesTotal = getMinutesForGuard(mostSleepyGuard, days);

  const mostSleepyMinute = minutesTotal.indexOf(Math.max(...minutesTotal));

  console.log(mostSleepyGuard * mostSleepyMinute);
}

async function partTwo() {
  const input = (await getInput()).map(String).sort();
  const entries = input.map(parseLogEntry);

  const days = getLogsByDay(entries);
  const guardIds = new Set(Object.values(days).map(x => x.id));

  const totalMinutes = Array.from(guardIds).reduce<KeyVal<number[]>>((acc, curr) => {
    return Object.assign(acc, {[curr]: getMinutesForGuard(curr, days)});
  }, {})

  const maxNum = Math.max(...Object.values(totalMinutes).map(x => Math.max(...x)));
  const maxGuard = Object.keys(totalMinutes).filter(x => Math.max(...totalMinutes[x]) === maxNum).map(Number)[0];
  const maxMin = totalMinutes[maxGuard].indexOf(maxNum);
  console.log(maxGuard * maxMin)
}

partTwo();