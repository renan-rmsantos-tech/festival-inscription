import { integer, pgTable, text, timestamp, index } from 'drizzle-orm/pg-core'

export const rsvps = pgTable(
  'rsvps',
  {
    code: text('code').primaryKey(),
    name: text('name').notNull(),
    email: text('email'),
    phone: text('phone'),
    adults: integer('adults').notNull().default(0),
    children: integer('children').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('rsvps_created_at_idx').on(table.createdAt)],
)

export type Rsvp = typeof rsvps.$inferSelect
export type NewRsvp = typeof rsvps.$inferInsert
