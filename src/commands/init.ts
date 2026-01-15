import * as fs from 'node:fs';
import chalk from 'chalk';
import { config, resolvePath } from '../config';

export async function init() {
  const dirs = [config.migrationsDir, config.seedsDir].map(resolvePath);

  let createdCount = 0;
  let existingCount = 0;

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(chalk.green(`✅  Created directory: ${dir}`));
      createdCount++;
    } else {
      console.log(chalk.blue(`ℹ️  Directory already exists: ${dir}`));
      existingCount++;
    }
  }

  if (createdCount > 0) {
    console.log(chalk.green(`\n✨ Created ${createdCount} directories`));
  }
  if (existingCount > 0) {
    console.log(chalk.blue(`\nℹ️  ${existingCount} directories already existed`));
  }
  if (createdCount === 0 && existingCount > 0) {
    console.log(chalk.blue('\nℹ️  Project is already initialized'));
  }
}
