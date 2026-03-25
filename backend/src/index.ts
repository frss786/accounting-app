import express, { Express, Request, Response, NextFunction } from "express";
// import cors from 'cors';

import ledgerRoutes from "./routes/ledger";
import categoryRoutes from "./routes/category";
import transactionRoutes from "./routes/transaction";
import importRoutes from "./routes/import";

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
// app.use(cors()); // Uncomment when you add cors package
app.use(express.json());

// Main Routes
app.use("/api/ledgers", ledgerRoutes);

// Category routes (nested under ledgers)
// For example: /api/ledgers/123/categories
app.use("/api/ledgers/:ledgerId/categories", categoryRoutes);

// Transaction routes (nested under ledgers)
app.use("/api/ledgers/:ledgerId/transactions", transactionRoutes);

// Import routes (nested under ledgers)
app.use("/api/ledgers/:ledgerId/import", importRoutes);

// Health check route
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Basic error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Internal server error", message: err.message });
});

// Unknown route handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
