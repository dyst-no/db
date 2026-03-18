import chalk from 'chalk';
import { getEnvironment } from '../environment';
import { createPostgresClient, quoteDatabaseName } from '../postgres';

export async function create() {
  const env = getEnvironment();

  const sql = createPostgresClient('postgres');

  try {
    await sql.unsafe(`CREATE DATABASE ${quoteDatabaseName(env.PGDATABASE)};`);
    console.log(chalk.green('✅ Created database'));
  } catch (error) {
    console.error(chalk.red('⛔ Failed to create database:'), error);
    throw error;
  } finally {
    await sql.end();
  }
}
