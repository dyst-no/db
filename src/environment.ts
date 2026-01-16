import { z } from 'zod';
import dotenv from 'dotenv';
import chalk from 'chalk';

export function getEnvironment() {
  // Load environment variables from .env file
  dotenv.config();

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
      chalk.red('Missing environment variables in .env file:'),
      error instanceof Error ? error.message : String(error),
    );

    const required = ['PGHOST', 'PGUSER', 'PGPASSWORD', 'PGDATABASE'];
    for (const name of required) {
      if (!process.env[name]) {
        console.error(chalk.yellow(`${name}`));
      }
    }

    process.exit(1);
  }
}
