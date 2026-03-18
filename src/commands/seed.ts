import * as fs from 'node:fs';
import * as path from 'node:path';
import { SQL } from 'bun';
import chalk from 'chalk';
import { config, resolvePath } from '../config';
import { getEnvironment } from '../environment';

export async function seed() {
  const env = getEnvironment();

  const seedsDir = resolvePath(config.seedsDir);

  // Connect to the database
  const sql = new SQL({
    host: env.PGHOST,
    user: env.PGUSER,
    password: env.PGPASSWORD,
    database: env.PGDATABASE,
  });

  try {
    // Get all seed files
    const seedFiles = fs
      .readdirSync(seedsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    if (seedFiles.length === 0) {
      console.log(chalk.blue('ℹ️  No seed files found'));
      return;
    }

    // Apply each seed file
    for (const file of seedFiles) {
      const seedContent = fs.readFileSync(path.join(seedsDir, file), 'utf-8');
      await sql.unsafe(seedContent);
      console.log(chalk.green(`✅ Applied seed: ${file}`));
    }
  } catch (error) {
    console.error(chalk.red('⛔ Failed to seed database:'), error);
    throw error;
  } finally {
    await sql.end();
  }
}
