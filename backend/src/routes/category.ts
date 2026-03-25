import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/auth';
import { TransactionType } from '@prisma/client';

const router = Router({ mergeParams: true });

// Apply auth middleware to all category routes
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
 * GET /api/ledgers/:ledgerId/categories
 * Retrieves all categories for the specified ledger.
 */
router.get('/', verifyLedgerAccess, async (req: Request, res: Response) => {
  try {
    const { ledgerId } = req.params;

    const categories = await prisma.category.findMany({
      where: {
        ledgerId,
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/ledgers/:ledgerId/categories
 * Creates a new category for the specified ledger.
 */
router.post('/', verifyLedgerAccess, async (req: Request, res: Response) => {
  try {
    const { ledgerId } = req.params;
    const { name, type } = req.body;

    if (!name || !type) {
      res.status(400).json({ error: 'Missing required fields: name, type' });
      return;
    }

    if (!Object.values(TransactionType).includes(type)) {
      res.status(400).json({ error: 'Invalid transaction type' });
      return;
    }

    const category = await prisma.category.create({
      data: {
        name,
        type: type as TransactionType,
        ledgerId,
      }
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
