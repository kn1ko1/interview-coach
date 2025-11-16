import express, { Request, Response } from 'express';
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
router.post('/save', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const { cvId, keywords } = req.body;
    const userId = req.userId;

    if (!cvId || !keywords || !Array.isArray(keywords)) {
      res.status(400).json({ error: 'CV ID and keywords array required' });
      return;
    }

    // Verify CV belongs to user
    db.get('SELECT id FROM cvData WHERE id = ? AND userId = ?', [cvId, userId], (err: Error | null, row: any) => {
      if (err || !row) {
        res.status(403).json({ error: 'CV not found or unauthorized' });
        return;
      }

      const keywordsJson = JSON.stringify(keywords);

      db.run(
        'UPDATE cvData SET keywords = ?, updatedAt = datetime("now") WHERE id = ? AND userId = ?',
        [keywordsJson, cvId, userId],
        (err: Error | null) => {
          if (err) {
            console.error('Keywords save error:', err);
            res.status(500).json({ error: 'Failed to save keywords' });
            return;
          }

          res.status(200).json({
            message: 'Keywords saved successfully',
            cvId,
            keywords,
          });
        }
      );
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
router.get('/:cvId', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const { cvId } = req.params;
    const userId = req.userId;

    db.get('SELECT keywords FROM cvData WHERE id = ? AND userId = ?', [cvId, userId], (err: Error | null, row: any) => {
      if (err) {
        res.status(500).json({ error: 'Failed to retrieve keywords' });
        return;
      }

      if (!row) {
        res.status(404).json({ error: 'CV not found' });
        return;
      }

      const keywords = row.keywords ? JSON.parse(row.keywords) : [];
      res.status(200).json({ keywords });
    });
  } catch (err) {
    console.error('Keywords retrieve error:', err);
    res.status(500).json({ error: 'Failed to retrieve keywords' });
  }
});

export default router;