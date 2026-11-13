import { z } from 'zod';
import * as fs from 'node:fs';
import { styleText } from 'node:util';

export function getEnvironment() {
  // Load environment variables from .env file
  if (fs.existsSync('.env')) process.loadEnvFile();

  try {
    return z
      .object({
        PGHOST: z.string(),
        PGUSER: z.string(),
        PGPASSWORD: z.string(),
        PGDATABASE: z.string(),
      })
      .parse(process.env);
  } catch (error) {
    console.error(
      styleText('red', 'Missing environment variables in .env file:'),
      error instanceof Error ? error.message : String(error),
    );

    const required = ['PGHOST', 'PGUSER', 'PGPASSWORD', 'PGDATABASE'];
    for (const name of required) {
      if (!process.env[name]) {
        console.error(styleText('yellow', `${name}`));
      }
    }

    process.exit(1);
  }
}
