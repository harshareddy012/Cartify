// DATA ACCESS LAYER – all database interactions live here

import { db } from "./index";
import { desc, eq } from "drizzle-orm";
import {
  users,
  products,
  comments,
  type NewUser,
  type NewProduct,
  type NewComments,
} from "./schema";

// ─── USER QUERIES ─────────────────────────────────────────────────────────────

export const getUserById = async (id: string) => {
  return await db.query.users.findFirst({ where: eq(users.id, id) });
};

export const upsertUser = async (data: NewUser) => {
  const [user] = await db
    .insert(users)
    .values(data)
    .onConflictDoUpdate({ target: users.id, set: data })
    .returning();
  return user;
};

export const updateUser = async (id: string, data: Partial<NewUser>) => {
  const [updatedUser] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();
  return updatedUser;
};

// ─── PRODUCT QUERIES ──────────────────────────────────────────────────────────

export const createProduct = async (data: NewProduct) => {
  const [product] = await db.insert(products).values(data).returning();
  return product;
};

// ✅ Fixed: when userId is empty string return ALL products (public feed)
//           when userId is provided filter to that user's products
export const getAllProducts = async (userId?: string) => {
  return await db.query.products.findMany({
    with: { users: true },
    ...(userId ? { where: eq(products.userId, userId) } : {}),
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
};

// Get a single product by its own id (with user + nested comments)
export const getProductById = async (id: string) => {
  return await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      users: true,
      comments: {
        with: { user: true },
        orderBy: (comments, { desc }) => [desc(comments.createdAt)],
      },
    },
  });
};

// Get all products belonging to a specific user (for "My Products" / profile)
export const getProductsByUserId = async (userId: string) => {
  return await db.query.products.findMany({
    where: eq(products.userId, userId),
    with: { users: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
};

export const updateProduct = async (id: string, data: Partial<NewProduct>) => {
  const [product] = await db
    .update(products)
    .set(data)
    .where(eq(products.id, id))
    .returning();
  return product;
};

export const deleteProductById = async (id: string) => {
  const [product] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning();
  return product;
};

// ─── COMMENT QUERIES ──────────────────────────────────────────────────────────

export const createComment = async (data: NewComments) => {
  const [comment] = await db.insert(comments).values(data).returning();
  return comment;
};

export const getCommentById = async (id: string) => {
  return await db.query.comments.findFirst({
    where: eq(comments.id, id),
    with: { user: true },
  });
};

export const deleteCommentById = async (id: string) => {
  const [comment] = await db
    .delete(comments)
    .where(eq(comments.id, id))
    .returning();
  return comment;
};