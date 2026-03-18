import * as fs from 'node:fs';
import chalk from 'chalk';
import { config, resolvePath } from '../config';
import { createPostgresClient } from '../postgres';

export async function migrateApply() {
  const migrationFile = resolvePath(config.migrationFile);

  if (!fs.existsSync(migrationFile)) {
    console.error(chalk.red('⛔ Migration file not found. Run `dyst-db migrate:build` first.'));
    throw new Error('Migration file not found');
  }

  const sql = createPostgresClient();

  try {
    const migrationSql = fs.readFileSync(migrationFile, 'utf-8').trim();
    await sql.unsafe(migrationSql);
    console.log(chalk.green('✅ All migrations applied'));
  } catch (error) {
    console.error(chalk.red('⛔ Failed to apply migrations:'), error);
    throw error;
  } finally {
    await sql.end();
  }
}
