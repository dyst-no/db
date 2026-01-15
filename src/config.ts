import * as path from 'node:path';

export const config = {
  migrationsDir: './postgres/migrations',
  seedsDir: './postgres/seeds',
  migrationFile: './postgres/migration.sql',
} as const;

export function resolvePath(relativePath: string): string {
  return path.resolve(process.cwd(), relativePath);
}
