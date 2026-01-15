import * as fs from 'node:fs';
import * as path from 'node:path';

export interface Environment {
  PGUSER: string;
  PGPASSWORD: string;
  PGHOST: string;
  PGDATABASE: string;
}

export function getEnvironment(): Environment {
  // First try to load from .env file
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const env = Object.fromEntries(
        envContent
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line && !line.startsWith('#'))
          .map((line) => line.split('=').map((part) => part.trim())),
      );

      return {
        PGUSER: env.PGUSER || process.env.PGUSER || '',
        PGPASSWORD: env.PGPASSWORD || process.env.PGPASSWORD || '',
        PGHOST: env.PGHOST || process.env.PGHOST || '',
        PGDATABASE: env.PGDATABASE || process.env.PGDATABASE || '',
      };
    }
  } catch (error) {
    console.warn(
      'Failed to load .env file, falling back to process.env',
      error instanceof Error ? error.message : String(error),
    );
  }

  // Fall back to process.env
  return {
    PGUSER: process.env.PGUSER || '',
    PGPASSWORD: process.env.PGPASSWORD || '',
    PGHOST: process.env.PGHOST || '',
    PGDATABASE: process.env.PGDATABASE || '',
  };
}
