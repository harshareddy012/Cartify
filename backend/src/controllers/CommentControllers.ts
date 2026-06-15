import type { Request, Response } from "express";
import * as db from "../db/Queries";
import { getAuth } from "@clerk/express";
import { NewComments } from "../db/schema";

// ─── CREATE COMMENT (protected) ───────────────────────────────────────────────
export const createComment = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const productId = req.params.productId as string; // ✅ actual variable, not "productId"
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Comment content is required" });

    // Verify the product exists before adding a comment
    const existingProduct = await db.getProductById(productId); // ✅ productId variable
    if (!existingProduct) return res.status(404).json({ error: "Product not found" });

    const comment = await db.createComment({
      content,
      userId,
      productId,
    } as NewComments);

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error in createComment:", error);
    res.status(500).json({ error: "Failed to create comment" });
  }
};

// ─── DELETE COMMENT (protected, owner only) ───────────────────────────────────
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const commentId = req.params.commentId as string; // actual variable, not "commentId"

    const existingComment = await db.getCommentById(commentId); //  commentId variable
    if (!existingComment) return res.status(404).json({ error: "Comment not found" });
    if (existingComment.userId !== userId)
      return res.status(403).json({ error: "Forbidden – you do not own this comment" });

    await db.deleteCommentById(commentId); // ✅ completed – was missing before
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error in deleteComment:", error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
};