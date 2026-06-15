import { Router } from "express";
import { requireAuth } from "@clerk/express";
import * as ProductController from "../controllers/ProductController";

const router = Router();

// GET /api/products – public feed (all products)
router.get("/", ProductController.getAllproducts);

// ✅ GET /api/products/my MUST come BEFORE /:id  
// otherwise Express treats "my" as a product id param
router.get("/my", requireAuth, ProductController.getMyProducts);

// GET /api/products/:id – single product detail (public)
router.get("/:id", ProductController.getProductById);

// POST /api/products – create a new product (protected)
// ✅ Was POST /:id which is wrong – create doesn't take an id
router.post("/", requireAuth, ProductController.createProduct);

// PUT /api/products/:id – update product (protected, owner only)
router.put("/:id", requireAuth, ProductController.updateProduct);

// DELETE /api/products/:id – delete product (protected, owner only)
router.delete("/:id", requireAuth, ProductController.deleteProduct);

export default router;