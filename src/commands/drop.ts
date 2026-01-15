import postgres from 'postgres';
import chalk from 'chalk';
import { getEnvironment } from '../environment';

export async function drop() {
  const env = getEnvironment();

  // Connect to postgres database to be able to drop the target database
  const sql = postgres(`postgres://${env.PGUSER}:${env.PGPASSWORD}@${env.PGHOST}/postgres`, {
    max: 1,
  });

  try {
    // Drop connections
    await sql`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = ${env.PGDATABASE}
      AND pid <> pg_backend_pid();
    `;

    // Drop database
    await sql`DROP DATABASE IF EXISTS ${sql(env.PGDATABASE)};`;
    console.log(chalk.green('✅ Dropped database'));
  } catch (error) {
    console.error(chalk.red('⛔ Failed to drop database:'), error);
    throw error;
  } finally {
    await sql.end();
  }
}
