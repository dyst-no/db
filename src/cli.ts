#!/usr/bin/env node

import { styleText } from 'node:util';
import pkg from '../package.json' with { type: 'json' };
import { create, drop, init, migrateApply, migrateBuild, seed } from './commands';

// The help, errors and exit codes commander printed for this CLI, without commander.
const commands: Record<string, [string, () => unknown]> = {
  init: ['Initialize database directory structure', init],
  create: ['Create a new database', create],
  drop: ['Drop the database', drop],
  migrate: [
    'Migrate the database',
    async () => {
      migrateBuild();
      await migrateApply();
    },
  ],
  seed: ['Seed the database with initial data', seed],
  'migrate:build': ['Build migration SQL file', migrateBuild],
  'migrate:apply': ['Apply database migrations file from disk', migrateApply],
};

function list(rows: string[][]) {
  const width = Math.max(...rows.map(([term]) => term!.length));
  return rows.map(([term, description]) => `  ${term!.padEnd(width)}  ${description}`).join('\n');
}

function help(name?: string) {
  if (name) {
    return `Usage: dyst-db ${name} [options]\n\n${commands[name]![0]}\n\nOptions:\n${list([['-h, --help', 'display help for command']])}\n`;
  }
  const options = [
    ['-V, --version', 'output the version number'],
    ['-h, --help', 'display help for command'],
  ];
  const rows = Object.entries(commands).map(([command, [description]]) => [command, description]);
  const all = list([...options, ...rows, ['help [command]', 'display help for command']]).split('\n');
  return `Usage: dyst-db [options] [command]\n\nDatabase management CLI for Dyst projects\n\nOptions:\n${all.slice(0, 2).join('\n')}\n\nCommands:\n${all.slice(2).join('\n')}\n`;
}

// Optimal string alignment distance, as commander uses for "Did you mean".
function distance(a: string, b: string) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0]![j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i]![j] = Math.min(d[i - 1]![j]! + 1, d[i]![j - 1]! + 1, d[i - 1]![j - 1]! + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i]![j] = Math.min(d[i]![j]!, d[i - 2]![j - 2]! + 1);
      }
    }
  }
  return d[a.length]![b.length]!;
}

function suggest(word: string, candidates: string[]) {
  const prefix = word.startsWith('--') ? '--' : '';
  const search = word.slice(prefix.length);
  let best = 3;
  let similar: string[] = [];
  for (const candidate of candidates.map((c) => c.slice(prefix.length))) {
    if (candidate.length <= 1) continue;
    const d = distance(search, candidate);
    const length = Math.max(search.length, candidate.length);
    if ((length - d) / length <= 0.4) continue;
    if (d < best) {
      best = d;
      similar = [candidate];
    } else if (d === best) similar.push(candidate);
  }
  similar = similar.sort((a, b) => a.localeCompare(b)).map((c) => prefix + c);
  if (similar.length > 1) return `\n(Did you mean one of ${similar.join(', ')}?)`;
  if (similar.length === 1) return `\n(Did you mean ${similar[0]}?)`;
  return '';
}

function exit(code: number, text: string) {
  (code ? process.stderr : process.stdout).write(text);
  process.exit(code);
}

function unknownOption(option: string, candidates: string[]): never {
  return exit(
    1,
    `error: unknown option '${option}'${option.startsWith('--') ? suggest(option, candidates) : ''}\n`,
  ) as never;
}

const [name, ...args] = process.argv.slice(2);
const argv = process.argv.slice(2);

if (argv.includes('-V') || argv.includes('--version')) exit(0, `${pkg.version}\n`);
else if (name === undefined) exit(1, help());
else if (name === 'help') {
  if (args[0] === undefined || args[0].startsWith('-')) exit(0, help());
  else if (args[0] in commands) exit(0, help(args[0]));
  else exit(1, help());
} else if (argv.includes('-h') || argv.includes('--help')) exit(0, help(name in commands ? name : undefined));
else if (name.startsWith('-')) unknownOption(name, ['--version', '--help']);
else if (!(name in commands)) {
  exit(1, `error: unknown command '${name}'${suggest(name, [...Object.keys(commands), 'help'])}\n`);
} else {
  const option = args.find((arg) => arg.startsWith('-'));
  if (option) unknownOption(option, ['--help']);
  if (args.length) {
    exit(1, `error: too many arguments for '${name}'. Expected 0 arguments but got ${args.length}.\n`);
  }
  try {
    await commands[name]![1]();
    process.exit(0);
  } catch (error) {
    console.error(styleText('red', 'Error:'), error);
    process.exit(1);
  }
}
