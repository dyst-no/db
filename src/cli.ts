import { Command } from 'commander';
import chalk from 'chalk';
import { create, drop, migrateApply, migrateBuild, seed, init } from './commands';

const program = new Command();

program.name('dyst-db').description('Database management CLI for Dyst projects').version('0.0.1');

program
  .command('init')
  .description('Initialize database directory structure')
  .action(async () => {
    try {
      await init();
      process.exit(0);
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program
  .command('create')
  .description('Create a new database')
  .action(async () => {
    try {
      await create();
      process.exit(0);
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program
  .command('drop')
  .description('Drop the database')
  .action(async () => {
    try {
      await drop();
      process.exit(0);
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program
  .command('migrate')
  .description('Migrate the database')
  .action(async () => {
    try {
      migrateBuild();
      await migrateApply();
      process.exit(0);
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program
  .command('seed')
  .description('Seed the database with initial data')
  .action(async () => {
    try {
      await seed();
      process.exit(0);
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program
  .command('migrate:build')
  .description('Build migration SQL file')
  .action(async () => {
    try {
      migrateBuild();
      process.exit(0);
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program
  .command('migrate:apply')
  .description('Apply database migrations file from disk')
  .action(async () => {
    try {
      await migrateApply();
      process.exit(0);
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program.parse();
