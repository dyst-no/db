import { styleText } from 'node:util';
import { getEnvironment } from '../environment';
import { createPostgresClient, quoteDatabaseName } from '../postgres';

export async function create() {
  const env = getEnvironment();

  const sql = createPostgresClient('postgres');

  try {
    await sql.unsafe(`CREATE DATABASE ${quoteDatabaseName(env.PGDATABASE)};`);
    console.log(styleText('green', '✅ Created database'));
  } catch (error) {
    console.error(styleText('red', '⛔ Failed to create database:'), error);
    throw error;
  } finally {
    await sql.end();
  }
}
