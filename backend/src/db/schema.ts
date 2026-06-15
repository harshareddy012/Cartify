import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── USERS TABLE ─────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  // Clerk user IDs are strings like "user_xxx", so we use text not uuid here
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// ─── PRODUCTS TABLE ───────────────────────────────────────────────────────────
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(), // ✅ .defaultRandom() so UUIDs auto-generate
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  userId: text("user_id") // ✅ text to match Clerk user id type
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// ─── COMMENTS TABLE ───────────────────────────────────────────────────────────
export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(), // ✅ .defaultRandom() added
  content: text("content").notNull(),
  userId: text("user_id") // ✅ text FK – no .defaultRandom() on a FK!
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// ─── RELATIONS ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  comments: many(comments),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  comments: many(comments),
  users: one(users, { fields: [products.userId], references: [users.id] }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  product: one(products, { fields: [comments.productId], references: [products.id] }),
}));

// ─── TYPE INFERENCE ───────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Comments = typeof comments.$inferSelect;
export type NewComments = typeof comments.$inferInsert;
