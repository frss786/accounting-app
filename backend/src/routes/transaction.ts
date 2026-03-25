import { Router, type Request, type Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
const TransactionType = { INCOME: "INCOME", EXPENSE: "EXPENSE", TRANSFER: "TRANSFER" };

const router = Router({ mergeParams: true });

// Apply auth middleware to all transaction routes
router.use(requireAuth);

/**
 * Middleware to verify ledger boundary
 * Ensures the `ledger_id` in the JWT matches the `ledgerId` parameter.
 */
const verifyLedgerAccess = (req: Request, res: Response, next: Function) => {
  const { ledgerId } = req.params;

  if (req.ledger_id !== ledgerId) {
    res.status(403).json({ error: 'Access denied: You do not have permission to access this ledger.' });
    return;
  }

  next();
};

/**
 * GET /api/ledgers/:ledgerId/transactions
 * Retrieves transactions for the specified ledger.
 * Supports query params: startDate, endDate, and optional user_id.
 * Orders by timestamp DESC.
 */
router.get('/', verifyLedgerAccess, async (req: Request, res: Response) => {
  try {
    const { ledgerId } = req.params;
    const { startDate, endDate, user_id } = req.query;

    const where: any = {
      ledgerId,
    };

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.timestamp.lte = new Date(endDate as string);
      }
    }

    if (user_id) {
      where.userId = user_id as string;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: {
        timestamp: 'desc',
      },
    });

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/ledgers/:ledgerId/transactions
 * Creates a new transaction for the specified ledger.
 */
router.post('/', verifyLedgerAccess, async (req: Request, res: Response) => {
  try {
    const { ledgerId } = req.params;
    const { amount, type, category_id, account_id } = req.body;

    if (amount === undefined || !type || !category_id || !account_id) {
      res.status(400).json({ error: 'Missing required fields: amount, type, category_id, account_id' });
      return;
    }

    if (!Object.values(TransactionType).includes(type)) {
      res.status(400).json({ error: 'Invalid transaction type' });
      return;
    }

    // Assumes `req.user_id` is set by the `requireAuth` middleware
    const userId = req.user_id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: missing user_id' });
      return;
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type: type,
        categoryId: category_id,
        accountId: account_id,
        userId: userId,
        ledgerId,
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;