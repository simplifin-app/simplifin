import { eq } from 'drizzle-orm'
import { db, usersTable } from '../schema'

export default defineEventHandler(async (event) => {
  const userID = Number.parseInt(event.context.params?.id ?? '')
  return db.select().from(usersTable).where(eq(usersTable.userID, userID))
})
