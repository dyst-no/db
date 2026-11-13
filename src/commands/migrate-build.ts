import * as fs from 'node:fs';
import * as path from 'node:path';
import { styleText } from 'node:util';
import { config, resolvePath } from '../config';

function buildMigration(filename: string, migrationsDir: string) {
  return `
    IF NOT EXISTS (SELECT 1 FROM migration WHERE name = '${filename}') THEN
        ${fs.readFileSync(path.join(migrationsDir, filename), 'utf-8')}
        INSERT INTO migration (name) VALUES ('${filename}');
        RAISE NOTICE '📦 Applied migration: ${filename}';
    ELSE
        RAISE NOTICE '⏭️ Skipping migration: ${filename} (already applied)';
    END IF;
  `;
}

export function migrateBuild() {
  const migrationsDir = resolvePath(config.migrationsDir);
  const outputFile = resolvePath(config.migrationFile);

  try {
    const filenames = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    const migrationSql = `
      DO $migration$
      BEGIN
          SET LOCAL check_function_bodies = false;
          SET LOCAL client_min_messages = notice;

          IF NOT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name = 'migration'
          ) THEN
              -- Create migration table
              CREATE TABLE migration (
                  name TEXT PRIMARY KEY,
                  applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
              );
              RAISE NOTICE '📦 Created migration table';
              -- Transfer data if pgm_migration exists
              IF EXISTS (
                  SELECT FROM information_schema.tables 
                  WHERE table_schema = 'public' 
                  AND table_name = 'pgm_migration'
              ) THEN
                  INSERT INTO migration (name, applied_at)
                  SELECT name || '.sql', applied_at 
                  FROM pgm_migration;
                  RAISE NOTICE '📦 Transferred existing migrations from pgm_migration table';
              END IF;
          END IF;

          ${filenames.map((filename) => buildMigration(filename, migrationsDir)).join('\n\n')}
      END $migration$;
    `
      // remove empty lines
      .replace(/\n\s*\n/g, '\n\n')
      // trim leading/trailing whitespace
      .trim();

    fs.writeFileSync(outputFile, migrationSql, 'utf-8');
    console.log(styleText('green', `✅ Migration SQL built and saved to: ${outputFile}`));
  } catch (error) {
    console.error(styleText('red', '⛔ Failed to build migration SQL:'), error);
    throw error;
  }
}
