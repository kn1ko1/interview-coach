import express, { Request, Response } from 'express';
import crypto from 'crypto';
import authenticate from '../middleware/authMiddleware';
import db from '../db/schema';

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
  email?: string;
  body: {
    cvText?: string;
    keywords?: string[];
  };
}

/**
 * POST /api/cv/upload
 * Upload/paste CV and save to database with userId
 */
router.post('/upload', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const { cvText } = req.body;
    const userId = req.userId;

    if (!cvText || !userId) {
      res.status(400).json({ error: 'CV text and authentication required' });
      return;
    }

    const cvId = crypto.randomBytes(8).toString('hex');

    db.run(
      'INSERT INTO cvData (id, userId, cvText, createdAt, updatedAt) VALUES (?, ?, ?, datetime("now"), datetime("now"))',
      [cvId, userId, cvText],
      (err: Error | null) => {
        if (err) {
          console.error('CV upload error:', err);
          res.status(500).json({ error: 'Failed to save CV' });
          return;
        }

        res.status(200).json({
          message: 'CV uploaded successfully',
          cvId,
          userId,
        });
      }
    );
  } catch (err) {
    console.error('CV upload error:', err);
    res.status(500).json({ error: 'CV upload failed' });
  }
});

/**
 * GET /api/cv/:cvId
 * Get user's CV by ID
 */
router.get('/:cvId', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const { cvId } = req.params;
    const userId = req.userId;

    db.get('SELECT * FROM cvData WHERE id = ? AND userId = ?', [cvId, userId], (err: Error | null, row: any) => {
      if (err) {
        res.status(500).json({ error: 'Failed to retrieve CV' });
        return;
      }

      if (!row) {
        res.status(404).json({ error: 'CV not found' });
        return;
      }

      res.status(200).json(row);
    });
  } catch (err) {
    console.error('CV retrieve error:', err);
    res.status(500).json({ error: 'Failed to retrieve CV' });
  }
});

/**
 * GET /api/cv
 * Get all CVs for logged-in user
 */
router.get('/', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const userId = req.userId;

    db.all('SELECT id, createdAt, updatedAt FROM cvData WHERE userId = ? ORDER BY createdAt DESC', [userId], (err: Error | null, rows: any[]) => {
      if (err) {
        res.status(500).json({ error: 'Failed to retrieve CVs' });
        return;
      }

      res.status(200).json({ cvs: rows || [] });
    });
  } catch (err) {
    console.error('CV list error:', err);
    res.status(500).json({ error: 'Failed to retrieve CVs' });
  }
});

export default router;