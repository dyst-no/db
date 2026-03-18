# @dyst-no/db

Database management CLI for Dyst projects. Provides commands for database initialization, migration, and seeding.

Install with:

```bash
bun add @dyst-no/db
```

Run the CLI with:

```bash
bunx dyst-db migrate
```

## Commands

- `init` - Initialize database directory structure
- `create` - Create a new database
- `drop` - Drop the database
- `migrate` - Build and apply database migrations
- `seed` - Seed the database with initial data

## Releasing

Run the `Release` GitHub Actions workflow and choose one of:

- `patch` for fixes and small non-breaking changes
- `minor` for new backward-compatible features
- `major` for breaking changes

The release flow builds, typechecks, updates `CHANGELOG.md` from commit messages since the previous tag, creates a release commit and tag, and publishes to npm.

You can also run releases locally:

```bash
bun run release:patch
bun run release:minor
bun run release:major
```
