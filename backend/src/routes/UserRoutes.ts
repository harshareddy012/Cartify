import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { syncUser } from "../controllers/userController";

const router = Router();

// POST /api/users/sync – syncs Clerk user into our Neon DB (protected)
router.post("/sync", requireAuth, syncUser);

export default router; // ✅ export is at the BOTTOM so routes are registered first