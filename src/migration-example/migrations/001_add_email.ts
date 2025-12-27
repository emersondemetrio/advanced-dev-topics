type Database = {
  schema: { fields: string[] };
  migrations: string[];
  users: Record<string, unknown>[];
};

type MigrationDefinition = {
  id: string;
  description: string;
  up: (db: Database) => void;
  down: (db: Database) => void;
};

const FIELD = "email";
const DEFAULT = "";

const up = (db: Database): void => {
  if (!db.schema.fields.includes(FIELD)) {
    db.schema.fields.push(FIELD);
  }
  db.users = db.users.map((user) => ({
    ...user,
    [FIELD]: user[FIELD] ?? DEFAULT,
  }));
};

const down = (db: Database): void => {
  db.schema.fields = db.schema.fields.filter((field) => field !== FIELD);
  db.users = db.users.map((user) => {
    const clone = { ...user };
    delete clone[FIELD];
    return clone;
  });
};

const migration: MigrationDefinition = {
  id: "001_add_email",
  description: "Add email field to users",
  up,
  down,
};

export default migration;
