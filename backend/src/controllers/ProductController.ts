import { Request, Response } from "express";
import * as db from "../db/Queries";
import { getAuth } from "@clerk/express";
import { NewProduct } from "../db/schema";

// ─── GET ALL PRODUCTS (public) ────────────────────────────────────────────────
export const getAllproducts = async (req: Request, res: Response) => {
  try {
    const products = await db.getAllProducts(); // no userId → returns all
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getAllproducts:", error);
    res.status(500).json({ error: "Failed to get products" });
  }
};

// ─── GET SINGLE PRODUCT BY ID (public) ───────────────────────────────────────
export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string; // ✅ actual variable, not string literal "id"
    const product = await db.getProductById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error in getProductById:", error);
    res.status(500).json({ error: "Failed to get product" });
  }
};

// ─── GET MY PRODUCTS (protected) ─────────────────────────────────────────────
export const getMyProducts = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const products = await db.getProductsByUserId(userId); // ✅ userId variable
    res.status(200).json(products);
  } catch (error) {
    console.error("Error in getMyProducts:", error);
    res.status(500).json({ error: "Failed to get your products" });
  }
};

// ─── CREATE PRODUCT (protected) ───────────────────────────────────────────────
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { title, description, imageUrl } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const product = await db.createProduct({
      title,
      description,
      imageUrl,
      userId,
    } as NewProduct);

    res.status(201).json(product);
  } catch (error) {
    console.error("Error in createProduct:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// ─── UPDATE PRODUCT (protected, owner only) ───────────────────────────────────
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const id = req.params.id as string; // ✅ actual id variable
    const { title, description, imageUrl } = req.body;

    const existingProduct = await db.getProductById(id); // ✅ id variable
    if (!existingProduct) return res.status(404).json({ error: "Product not found" });
    if (existingProduct.userId !== userId)
      return res.status(403).json({ error: "Forbidden – you do not own this product" });

    const updated = await db.updateProduct(id, { title, description, imageUrl }); // ✅ id variable
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// ─── DELETE PRODUCT (protected, owner only) ───────────────────────────────────
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const id = req.params.id as string; // ✅ actual id variable

    const existingProduct = await db.getProductById(id); // ✅ id variable
    if (!existingProduct) return res.status(404).json({ error: "Product not found" });
    if (existingProduct.userId !== userId)
      return res.status(403).json({ error: "Forbidden – you do not own this product" });

    await db.deleteProductById(id); // ✅ id variable
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
