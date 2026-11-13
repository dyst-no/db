import { expect, test } from 'bun:test';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { migrateBuild } from './migrate-build';

test('migrate:build keeps comment lines', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dyst-db-'));
  fs.mkdirSync(path.join(dir, 'postgres/migrations'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'postgres/migrations/00001.sql'), 'SELECT 1;\n-- one\n-- two\n-- three\nSELECT 2;\n');

  const cwd = process.cwd();
  process.chdir(dir);
  migrateBuild();
  process.chdir(cwd);

  expect(fs.readFileSync(path.join(dir, 'postgres/migration.sql'), 'utf-8')).toContain(
    'SELECT 1;\n-- one\n-- two\n-- three\nSELECT 2;\n',
  );
});
