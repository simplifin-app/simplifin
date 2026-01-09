import {db, expensesTable} from "../schema";
import {eq} from "drizzle-orm";

export default defineEventHandler(async (event) => {
    const userID = Number.parseInt(event.context.params!.id);
    return db.select().from(expensesTable).where(eq(expensesTable.userID, userID)!);
})