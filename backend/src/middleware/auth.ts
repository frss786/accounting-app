import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include user scoping
declare global {
  namespace Express {
    interface Request {
      user_id: string;
      ledger_id: string;
      role: 'ADMIN' | 'MEMBER';
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JWTPayload {
  user_id: string;
  ledger_id: string;
  role: 'ADMIN' | 'MEMBER';
}

/**
 * Middleware to verify JWT and attach user context to request.
 * Expects Authorization header in format: Bearer <token>
 * 
 * Sets:
 * - req.user_id: The authenticated user's ID
 * - req.ledger_id: The ledger scope for this request
 * - req.role: User's role (ADMIN or MEMBER)
 * 
 * Returns 401 if Authorization header is missing or malformed.
 * Returns 403 if token is invalid or expired.
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists
    if (!authHeader) {
      res.status(401).json({ error: 'Missing authorization header' });
      return;
    }

    // Extract token from "Bearer <token>" format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({ error: 'Invalid authorization header format' });
      return;
    }

    const token = parts[1];

    // Verify and decode JWT
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;

    // Attach user context to request
    req.user_id = payload.user_id;
    req.ledger_id = payload.ledger_id;
    req.role = payload.role;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ error: 'Invalid or expired token' });
      return;
    }
    if (error instanceof jwt.NotBeforeError) {
      res.status(403).json({ error: 'Token not yet valid' });
      return;
    }
    res.status(403).json({ error: 'Authentication failed' });
  }
};

export const generateToken = (
  user_id: string,
  ledger_id: string,
  role: 'ADMIN' | 'MEMBER'
): string => {
  return jwt.sign(
    { user_id, ledger_id, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};