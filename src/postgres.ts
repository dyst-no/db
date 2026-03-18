import postgres from 'postgres';
import { getEnvironment } from './environment';

function quoteIdentifier(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export function createPostgresClient(database?: string) {
  const env = getEnvironment();

  return postgres({
    host: env.PGHOST,
    user: env.PGUSER,
    password: env.PGPASSWORD,
    database: database ?? env.PGDATABASE,
  });
}

export function quoteDatabaseName(name: string) {
  return quoteIdentifier(name);
}
