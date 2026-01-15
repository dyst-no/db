import postgres from 'postgres';
import * as fs from 'node:fs';
import chalk from 'chalk';
import { config, resolvePath } from '../config';
import { getEnvironment } from '../environment';

export async function migrateApply() {
  const env = getEnvironment();

  const migrationFile = resolvePath(config.migrationFile);

  if (!fs.existsSync(migrationFile)) {
    console.error(chalk.red('⛔ Migration file not found. Run `dyst-db migrate:build` first.'));
    throw new Error('Migration file not found');
  }

  const sql = postgres(`postgres://${env.PGUSER}:${env.PGPASSWORD}@${env.PGHOST}/${env.PGDATABASE}`, {
    max: 1,
    onnotice: (notice) => {
      // Just print the message part of the notice
      console.log(notice.message);
    },
  });

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
