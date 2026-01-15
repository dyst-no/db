import postgres from 'postgres';
import chalk from 'chalk';
import { getEnvironment } from '../environment';

export async function create() {
  const env = getEnvironment();

  // Connect to postgres database to be able to create the target database
  const sql = postgres(`postgres://${env.PGUSER}:${env.PGPASSWORD}@${env.PGHOST}/postgres`, {
    max: 1,
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
