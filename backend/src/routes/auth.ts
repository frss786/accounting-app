import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma.js';
import { generateToken } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { token, user: { id, name, email, role } }
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Find first ledger member for this user to get ledger_id scope
    const membership = await prisma.ledgerMember.findFirst({
      where: { userId: user.id },
    });

    const ledgerId = membership?.ledgerId ?? '';

    const token = generateToken(user.id, ledgerId, user.role as 'ADMIN' | 'MEMBER');

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        ledgerId,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 * Creates a new user and a personal ledger, returns token.
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create user + personal ledger in one transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name, email, passwordHash, role: 'ADMIN' },
      });

      const ledger = await tx.ledger.create({
        data: { name: `${name}'s Ledger` },
      });

      await tx.ledgerMember.create({
        data: { userId: user.id, ledgerId: ledger.id },
      });

      // Create a default checking account for the new user
      await tx.account.create({
        data: {
          name: 'Main Account',
          type: 'CHECKING',
          userId: user.id,
          ledgerId: ledger.id,
        },
      });

      // Seed default categories
      const defaultCategories = [
        { name: 'Food', type: 'EXPENSE' },
        { name: 'Transport', type: 'EXPENSE' },
        { name: 'Salary', type: 'INCOME' },
        { name: 'Groceries', type: 'EXPENSE' },
        { name: 'Utilities', type: 'EXPENSE' },
        { name: 'Entertainment', type: 'EXPENSE' },
        { name: 'Savings Transfer', type: 'TRANSFER' },
      ];
      await tx.category.createMany({
        data: defaultCategories.map(c => ({ ...c, ledgerId: ledger.id })),
      });

      return { user, ledger };
    });

    const token = generateToken(result.user.id, result.ledger.id, 'ADMIN');

    res.status(201).json({
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        ledgerId: result.ledger.id,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
