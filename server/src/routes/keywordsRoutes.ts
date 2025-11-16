import express, { Request, Response } from 'express';
import crypto from 'crypto';
import authenticate from '../middleware/authMiddleware';
import db from '../db/schema';

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
  email?: string;
  body: {
    cvId?: string;
    keywords?: string[];
  };
}

/**
 * POST /api/keywords/save
 * Save keywords linked to a CV
 */
router.post('/save', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { cvId, keywords } = req.body;
    const userId = req.userId;

    if (!cvId || !keywords || !Array.isArray(keywords)) {
      return res.status(400).json({ error: 'CV ID and keywords array required' });
    }

    // Verify CV belongs to user
    return new Promise((resolve) => {
      db.get('SELECT id FROM cvData WHERE id = ? AND userId = ?', [cvId, userId], (err, row: any) => {
        if (err || !row) {
          return res.status(403).json({ error: 'CV not found or unauthorized' });
        }

        const keywordsJson = JSON.stringify(keywords);

        db.run(
          'UPDATE cvData SET keywords = ?, updatedAt = datetime("now") WHERE id = ? AND userId = ?',
          [keywordsJson, cvId, userId],
          (err) => {
            if (err) {
              console.error('Keywords save error:', err);
              return res.status(500).json({ error: 'Failed to save keywords' });
            }

            res.status(200).json({
              message: 'Keywords saved successfully',
              cvId,
              keywords,
            });
            resolve(null);
          }
        );
      });
    });
  } catch (err) {
    console.error('Keywords save error:', err);
    res.status(500).json({ error: 'Failed to save keywords' });
  }
});

/**
 * GET /api/keywords/:cvId
 * Get keywords for a specific CV
 */
router.get('/:cvId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { cvId } = req.params;
    const userId = req.userId;

    return new Promise((resolve) => {
      db.get('SELECT keywords FROM cvData WHERE id = ? AND userId = ?', [cvId, userId], (err, row: any) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve keywords' });
        }

        if (!row) {
          return res.status(404).json({ error: 'CV not found' });
        }

        const keywords = row.keywords ? JSON.parse(row.keywords) : [];
        res.status(200).json({ keywords });
        resolve(null);
      });
    });
  } catch (err) {
    console.error('Keywords retrieve error:', err);
    res.status(500).json({ error: 'Failed to retrieve keywords' });
  }
});

export default router;