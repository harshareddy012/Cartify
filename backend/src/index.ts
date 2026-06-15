import express from "express";
import { ENV } from "./config/env";
import { clerkMiddleware } from "@clerk/express"; // clerkMiddleware populates req.auth
import cors from "cors";

// Routes
import UserRoutes from "./routes/UserRoutes";
import ProductRoutes from "./routes/ProductRoutes";
import CommentsRoutes from "./routes/CommentsRoutes";

const app = express();

// 1. clerkMiddleware MUST come first – it populates req.auth so requireAuth can read it
app.use(clerkMiddleware());

// 2. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. CORS – allow our frontend origin and send cookies
app.use(
  cors({
    origin: ENV.FRONTEND_URL,
    credentials: true, // required for Clerk cookie-based auth
  })
);

// 4. Health-check route (public – no auth needed)
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Cartify API – powered by PostgreSQL, Drizzle ORM & Clerk Auth",
    endpoints: {
      users: "/api/users",
      products: "/api/products",
      comments: "/api/comments",
    },
  });
});

// 5. API routes (individual routes handle their own requireAuth)
app.use("/api/users/", UserRoutes);
app.use("/api/products/", ProductRoutes);
app.use("/api/comments/", CommentsRoutes);

// 6. 404 handler for unmatched routes
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// 7. Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(ENV.PORT, () =>
  console.log(`✅ Server running on port ${ENV.PORT}`)
);