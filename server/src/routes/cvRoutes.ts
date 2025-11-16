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
router.post('/upload', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { cvText } = req.body;
    const userId = req.userId;

    if (!cvText || !userId) {
      return res.status(400).json({ error: 'CV text and authentication required' });
    }

    const cvId = crypto.randomBytes(8).toString('hex');

    return new Promise((resolve) => {
      db.run(
        'INSERT INTO cvData (id, userId, cvText, createdAt, updatedAt) VALUES (?, ?, ?, datetime("now"), datetime("now"))',
        [cvId, userId, cvText],
        (err) => {
          if (err) {
            console.error('CV upload error:', err);
            return res.status(500).json({ error: 'Failed to save CV' });
          }

          res.status(200).json({
            message: 'CV uploaded successfully',
            cvId,
            userId,
          });
          resolve(null);
        }
      );
    });
  } catch (err) {
    console.error('CV upload error:', err);
    res.status(500).json({ error: 'CV upload failed' });
  }
});

/**
 * GET /api/cv/:cvId
 * Get user's CV by ID
 */
router.get('/:cvId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { cvId } = req.params;
    const userId = req.userId;

    return new Promise((resolve) => {
      db.get('SELECT * FROM cvData WHERE id = ? AND userId = ?', [cvId, userId], (err, row: any) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve CV' });
        }

        if (!row) {
          return res.status(404).json({ error: 'CV not found' });
        }

        res.status(200).json(row);
        resolve(null);
      });
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
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    return new Promise((resolve) => {
      db.all('SELECT id, createdAt, updatedAt FROM cvData WHERE userId = ? ORDER BY createdAt DESC', [userId], (err, rows: any[]) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve CVs' });
        }

        res.status(200).json({ cvs: rows || [] });
        resolve(null);
      });
    });
  } catch (err) {
    console.error('CV list error:', err);
    res.status(500).json({ error: 'Failed to retrieve CVs' });
  }
});

export default router;