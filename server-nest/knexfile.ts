import type { Knex } from "knex";

export const POSTGRES_LOCAL: { [key: string]: Knex.Config } = {
  development: {
    client: "pg",
    connection: {
      host: "127.0.0.1",
      port: 3306,
      user: "root",
      password: "nest",
      database: "postgres",
    },
  },
};
