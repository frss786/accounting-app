import { Router, type Request, type Response } from "express";
import multer from "multer";
import { parseCsv } from "../services/csvParser";
import { prisma } from "../lib/prisma";

// Use mergeParams so we can access :ledgerId
const router = Router({ mergeParams: true });
const upload = multer({ storage: multer.memoryStorage() });

// Temporarily mock user ID since we don't have full auth setup yet based on the context
// In a real app, this comes from req.user
const MOCK_USER_ID = "user-1";

// POST /upload - Parse CSV and return preview JSON array
router.post(
  "/upload",
  upload.single("file"),
  (req: Request, res: Response): void => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      // In a real scenario, you might want to detect 'gbk' vs 'utf8'
      // based on file magic bytes or user input, but we'll default to GBK as requested.
      const records = parseCsv(req.file.buffer);

      res.json({
        message: "File parsed successfully",
        preview: records,
      });
    } catch (error) {
      console.error("Import error:", error);
      res.status(500).json({ error: "Failed to parse CSV file" });
    }
  },
);

// POST /commit - Save staging data to Prisma transactions
router.post("/commit", async (req: Request, res: Response): Promise<void> => {
  try {
    const { ledgerId } = req.params;
    const { transactions } = req.body; // Array of mapped transaction objects

    if (!transactions || !Array.isArray(transactions)) {
      res.status(400).json({ error: "Invalid transactions array" });
      return;
    }

    // Build the data to insert
    const txData = transactions.map((tx: any) => ({
      ledgerId,
      userId: MOCK_USER_ID, // Use mock or actual user from auth context
      amount: parseFloat(tx.amount),
      type: tx.type, // 'INCOME' | 'EXPENSE' | 'TRANSFER'
      categoryId: tx.categoryId,
      accountId: tx.accountId,
      notes: tx.notes || null,
      timestamp: tx.timestamp ? new Date(tx.timestamp) : new Date(),
      externalId: tx.externalId || null,
    }));

    // Create many transactions. Prisima createMany supports standard bulk insert.
    const createdTransactions = await prisma.transaction.createMany({
      data: txData,
      skipDuplicates: true, // Useful if externalId is mapped to prevent double-imports
    });

    res.json({
      message: "Transactions committed successfully",
      count: createdTransactions.count,
    });
  } catch (error) {
    console.error("Commit error:", error);
    res.status(500).json({ error: "Failed to commit transactions" });
  }
});

export default router;
