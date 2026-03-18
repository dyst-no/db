import chalk from 'chalk';
import { getEnvironment } from '../environment';
import { createPostgresClient, quoteDatabaseName } from '../postgres';

export async function drop() {
  const env = getEnvironment();

  const sql = createPostgresClient('postgres');

  try {
    // Drop connections
    await sql`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = ${env.PGDATABASE}
      AND pid <> pg_backend_pid();
    `;

    await sql.unsafe(`DROP DATABASE IF EXISTS ${quoteDatabaseName(env.PGDATABASE)};`);
    console.log(chalk.green('✅ Dropped database'));
  } catch (error) {
    console.error(chalk.red('⛔ Failed to drop database:'), error);
    throw error;
  } finally {
    await sql.end();
  }
}
