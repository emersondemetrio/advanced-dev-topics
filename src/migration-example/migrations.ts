import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";
import { pathToFileURL } from "url";

type Database = {
  schema: {
    fields: string[];
  };
  migrations: string[];
  users: Record<string, unknown>[];
};

export type Migration = {
  id: string;
  description: string;
  up: (db: Database) => void;
  down: (db: Database) => void;
};

const ROOT = __dirname;
const DB_PATH = join(ROOT, "db.json");
const MIGRATIONS_DIR = join(ROOT, "migrations");
const SEED_PATH = join(ROOT, "seed.json");

const BASE_FIELDS = ["id", "name"];

const loadDb = (): Database => {
  const raw = readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as Database;
};

const saveDb = (db: Database): void => {
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
};

const loadMigrations = async (): Promise<Migration[]> => {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith(".ts") && !file.endsWith(".d.ts"))
    .sort();

  const migrations: Migration[] = [];

  for (const file of files) {
    const modulePath = pathToFileURL(join(MIGRATIONS_DIR, file)).href;
    const imported = await import(modulePath);
    const migration: Migration = imported.default ?? imported.migration ?? imported;
    migrations.push(migration);
  }

  return migrations;
};

const rebuildSchema = (users: Database["users"], migrations: Migration[]): Database => {
  const reset: Database = {
    schema: { fields: [...BASE_FIELDS] },
    migrations: [],
    users: users.map((user) => {
      const base: Record<string, unknown> = {};
      for (const key of BASE_FIELDS) {
        base[key] = user[key];
      }
      return base;
    }),
  };

  for (const migration of migrations) {
    migration.up(reset);
  }

  return reset;
};

const migrate = async (): Promise<void> => {
  const db = loadDb();
  const migrations = await loadMigrations();

  const unapplied = migrations.filter((migration) => !db.migrations.includes(migration.id));
  if (unapplied.length === 0) {
    console.log("No migrations to apply.");
    return;
  }

  for (const migration of unapplied) {
    migration.up(db);
    db.migrations.push(migration.id);
    console.log(`Applied migration: ${migration.id}`);
  }

  saveDb(db);
  console.log("Migrations completed.");
};

const seed = async (): Promise<void> => {
  const db = loadDb();
  const migrations = await loadMigrations();
  const seedData = JSON.parse(readFileSync(SEED_PATH, "utf-8")) as Record<string, unknown>[];

  // Ensure DB is migrated before seeding.
  for (const migration of migrations) {
    if (!db.migrations.includes(migration.id)) {
      migration.up(db);
      db.migrations.push(migration.id);
    }
  }

  // Build defaults by applying migrations on a sample user.
  const sample: Database = { schema: { fields: [...BASE_FIELDS] }, migrations: [], users: [{}] };
  migrations.forEach((migration) => migration.up(sample));
  const sampleUser = sample.users[0] ?? {};
  const defaults = new Map<string, unknown>();
  sample.schema.fields.forEach((field) => {
    defaults.set(field, (sampleUser as Record<string, unknown>)[field] ?? null);
  });

  db.users = seedData.map((user, index) => {
    const hydrated: Record<string, unknown> = { ...user };
    if (!hydrated.id) {
      hydrated.id = index + 1;
    }
    db.schema.fields.forEach((field) => {
      if (hydrated[field] === undefined) {
        hydrated[field] = defaults.get(field) ?? null;
      }
    });
    return hydrated;
  });

  saveDb(db);
  console.log(`Seeded ${db.users.length} users.`);
};

const deleteMigration = async (id: string): Promise<void> => {
  const db = loadDb();
  const migrations = await loadMigrations();
  const target = migrations.find((migration) => migration.id === id);
  const filtered = migrations.filter((migration) => migration.id !== id);

  if (!target) {
    console.error(`Migration not found: ${id}`);
    process.exitCode = 1;
    return;
  }

  // Apply down on current db for immediate effect.
  if (db.migrations.includes(target.id)) {
    target.down(db);
    db.migrations = db.migrations.filter((applied) => applied !== target.id);
  }

  // Rebuild schema to keep order consistent with remaining migrations.
  const rebuilt = rebuildSchema(db.users, filtered);
  rebuilt.migrations = filtered.map((m) => m.id);

  saveDb(rebuilt);
  console.log(`Removed migration ${id} and rebuilt schema.`);
};

const usage = (): void => {
  console.log("Usage: ts-node migrations.ts <migrate|seed|delete> [migrationId]");
};

const main = async (): Promise<void> => {
  const [, , command, arg] = process.argv;
  if (!command) {
    usage();
    process.exit(1);
  }

  if (command === "migrate") {
    await migrate();
    return;
  }

  if (command === "seed") {
    await seed();
    return;
  }

  if (command === "delete") {
    if (!arg) {
      console.error("Please provide a migration id to delete.");
      process.exit(1);
    }
    await deleteMigration(arg);
    return;
  }

  usage();
  process.exit(1);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
