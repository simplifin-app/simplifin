import { eq } from 'drizzle-orm'
import { db, expensesTable } from '../schema'

export default defineEventHandler(async (event) => {
  const userID = Number.parseInt(event.context.params?.id ?? '')
  return db.select().from(expensesTable).where(eq(expensesTable.userID, userID))
})
