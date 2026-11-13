import { expect, test } from 'bun:test';
import * as path from 'node:path';

// Output commander 13 gave for these, so the CLI keeps behaving the same without it.
const usage = `Usage: dyst-db [options] [command]

Database management CLI for Dyst projects

Options:
  -V, --version   output the version number
  -h, --help      display help for command

Commands:
  init            Initialize database directory structure
  create          Create a new database
  drop            Drop the database
  migrate         Migrate the database
  seed            Seed the database with initial data
  migrate:build   Build migration SQL file
  migrate:apply   Apply database migrations file from disk
  help [command]  display help for command
`;

const cases: [string[], number, string, string][] = [
  [[], 1, '', usage],
  [['--help'], 0, usage, ''],
  [['nope', '-h'], 0, usage, ''],
  [
    ['help', 'migrate'],
    0,
    'Usage: dyst-db migrate [options]\n\nMigrate the database\n\nOptions:\n  -h, --help  display help for command\n',
    '',
  ],
  [['migrat'], 1, '', "error: unknown command 'migrat'\n(Did you mean migrate?)\n"],
  [['--hlep'], 1, '', "error: unknown option '--hlep'\n(Did you mean --help?)\n"],
  [['init', 'extra'], 1, '', "error: too many arguments for 'init'. Expected 0 arguments but got 1.\n"],
];

test.each(cases)('dyst-db %p', (args, code, stdout, stderr) => {
  const r = Bun.spawnSync(['bun', path.join(import.meta.dir, 'cli.ts'), ...args]);
  expect([r.exitCode, r.stdout.toString(), r.stderr.toString()]).toEqual([code, stdout, stderr]);
});
