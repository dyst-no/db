import { SQL } from 'bun';
import chalk from 'chalk';
import { getEnvironment } from '../environment';

export async function create() {
  const env = getEnvironment();

  // Connect to postgres database to be able to create the target database
  const sql = new SQL({
    host: env.PGHOST,
    user: env.PGUSER,
    password: env.PGPASSWORD,
    database: 'postgres',
  });

  try {
    // Create database
    await sql`CREATE DATABASE ${sql(env.PGDATABASE)};`;
    console.log(chalk.green('✅ Created database'));
  } catch (error) {
    console.error(chalk.red('⛔ Failed to create database:'), error);
    throw error;
  } finally {
    await sql.end();
  }
}
