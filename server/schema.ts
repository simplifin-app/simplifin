import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle(process.env.DATABASE_URL!);

import {date, decimal, integer, pgTable, varchar} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    userID: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
});

export const expensesTable = pgTable("expenses", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userID: integer().references(() => usersTable.userID),
    recipient: varchar({ length: 255 }).notNull(),
    amount: decimal().notNull(),
    date: date().notNull(),
})