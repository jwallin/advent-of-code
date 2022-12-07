import { getInput, sortAscending, sum } from '../../utils';

type CommandAndResponse = [string[], string[]];

class File {
  name: string;
  size: number;
  constructor(name: string, size: number) {
    this.name = name;
    this.size = size;
  }

  static parse(input: string): File {
    const [sizeStr, name] = input.split(' ');
    return new File(name, Number(sizeStr));
  }
}

function findDirectories(commands: CommandAndResponse[]) {
  const dirs = new Map<string, Dir>();
  let workingDir: Dir | undefined;
  commands.forEach(([c, r]) => {
    if (c[0] === 'cd') {
      if (c[1] === '..') {
        workingDir = workingDir?.parent;
      } else {
        workingDir = new Dir(c[1], workingDir);
        if (dirs.has(workingDir.name)) {
          throw Error('duplicate: ' + workingDir.name);
        }
        dirs.set(workingDir.name, workingDir);
      }
    }
    if (c[0] === 'ls') {
      workingDir?.files.push(...r.filter(x => !x.startsWith('dir')).map(File.parse));
    }
  });
  return dirs;
}

function parseCommands(input: string[]) {
  const commands: CommandAndResponse[] = [];
  input.forEach(l => {
    if (l.startsWith('$')) {
      commands.push([l.substring(2).split(' '), []]);
    } else {
      commands[commands.length - 1][1].push(l);
    }
  });
  return commands;
}

class Dir {
  name: string;
  children: Dir[];
  parent: Dir | undefined;
  files: File[];

  constructor(name: string,  parent: Dir | undefined) {
    this.name = (parent ? parent.name + '/'  : '') + name;
    this.children = [];
    this.parent = parent;
    this.parent?.children.push(this);
    this.files = [];
  }

  totalSize(): number {
    return this.files.map(f => f.size).reduce(sum, 0) + this.children.map(c => c.totalSize()).reduce(sum, 0);
  }
}

async function partOne() {
  const input = (await getInput());
  const commands: CommandAndResponse[] = parseCommands(input);

  const dirs = findDirectories(commands);

  console.log(dirs.get('/')?.totalSize());
  const tot = [...dirs.values()].filter(d => d.totalSize() <= 100000).map(d => d.totalSize()).reduce(sum);
  console.log(tot)
}


async function partTwo() {
  const input = (await getInput());
  const commands: CommandAndResponse[] = parseCommands(input);

  const SPACE_AVAILABLE = 70000000;
  const SPACE_NEEDED = 30000000;

  const dirs = findDirectories(commands);

  const usedSpace = dirs.get('/')?.totalSize() || 0;
  const unused = SPACE_AVAILABLE - usedSpace;
  const needToFreeUp = SPACE_NEEDED - unused;

  const toDel = [...dirs.values()].map(d => d.totalSize()).sort(sortAscending).filter(x => x >= needToFreeUp)[0]
  console.log(toDel)
}

partOne();
partTwo();