import * as fs from 'node:fs';
import { styleText } from 'node:util';

export function getEnvironment() {
  // Load environment variables from .env file
  if (fs.existsSync('.env')) process.loadEnvFile();

  const { PGHOST, PGUSER, PGPASSWORD, PGDATABASE } = process.env;
  if (PGHOST !== undefined && PGUSER !== undefined && PGPASSWORD !== undefined && PGDATABASE !== undefined) {
    return { PGHOST, PGUSER, PGPASSWORD, PGDATABASE };
  }

  console.error(styleText('red', 'Missing environment variables in .env file:'));
  for (const name of ['PGHOST', 'PGUSER', 'PGPASSWORD', 'PGDATABASE']) {
    if (!process.env[name]) console.error(styleText('yellow', name));
  }
  process.exit(1);
}
