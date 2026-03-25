import { Router, type Request, type Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/ledgers/me
 * Retrieves the ledger the current user belongs to (or has context for).
 * Based on the JWT payload `req.ledger_id`.
 */
router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const { ledger_id } = req;

    const ledger = await prisma.ledger.findUnique({
      where: { id: ledger_id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      }
    });

    if (!ledger) {
      res.status(404).json({ error: 'Ledger not found' });
      return;
    }

    res.json(ledger);
  } catch (error) {
    console.error('Error fetching ledger:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
