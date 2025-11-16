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
    title?: string;
    content?: string;
    format?: string;
    competency?: string;
  };
}

/**
 * POST /api/stories/create
 * Create a new story (STAR/CAR format)
 */
router.post('/create', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { cvId, title, content, format, competency } = req.body;
    const userId = req.userId;

    if (!title || !content || !format) {
      return res.status(400).json({ error: 'Title, content, and format required' });
    }

    const storyId = crypto.randomBytes(8).toString('hex');

    return new Promise((resolve) => {
      db.run(
        'INSERT INTO stories (id, userId, title, content, format, competency, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, datetime("now"), datetime("now"))',
        [storyId, userId, title, content, format, competency || ''],
        (err) => {
          if (err) {
            console.error('Story creation error:', err);
            return res.status(500).json({ error: 'Failed to create story' });
          }

          res.status(200).json({
            message: 'Story created successfully',
            storyId,
            title,
            format,
          });
          resolve(null);
        }
      );
    });
  } catch (err) {
    console.error('Story creation error:', err);
    res.status(500).json({ error: 'Failed to create story' });
  }
});

/**
 * GET /api/stories
 * Get all stories for logged-in user
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    return new Promise((resolve) => {
      db.all(
        'SELECT id, title, format, competency, createdAt FROM stories WHERE userId = ? ORDER BY createdAt DESC',
        [userId],
        (err, rows: any[]) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to retrieve stories' });
          }

          res.status(200).json({ stories: rows || [] });
          resolve(null);
        }
      );
    });
  } catch (err) {
    console.error('Stories retrieve error:', err);
    res.status(500).json({ error: 'Failed to retrieve stories' });
  }
});

/**
 * GET /api/stories/:storyId
 * Get a specific story
 */
router.get('/:storyId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { storyId } = req.params;
    const userId = req.userId;

    return new Promise((resolve) => {
      db.get('SELECT * FROM stories WHERE id = ? AND userId = ?', [storyId, userId], (err, row: any) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve story' });
        }

        if (!row) {
          return res.status(404).json({ error: 'Story not found' });
        }

        res.status(200).json(row);
        resolve(null);
      });
    });
  } catch (err) {
    console.error('Story retrieve error:', err);
    res.status(500).json({ error: 'Failed to retrieve story' });
  }
});

/**
 * PUT /api/stories/:storyId
 * Update a story
 */
router.put('/:storyId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { storyId } = req.params;
    const { title, content, format, competency } = req.body;
    const userId = req.userId;

    return new Promise((resolve) => {
      db.run(
        'UPDATE stories SET title = ?, content = ?, format = ?, competency = ?, updatedAt = datetime("now") WHERE id = ? AND userId = ?',
        [title, content, format, competency, storyId, userId],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to update story' });
          }

          res.status(200).json({ message: 'Story updated successfully' });
          resolve(null);
        }
      );
    });
  } catch (err) {
    console.error('Story update error:', err);
    res.status(500).json({ error: 'Failed to update story' });
  }
});

/**
 * DELETE /api/stories/:storyId
 * Delete a story
 */
router.delete('/:storyId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { storyId } = req.params;
    const userId = req.userId;

    return new Promise((resolve) => {
      db.run('DELETE FROM stories WHERE id = ? AND userId = ?', [storyId, userId], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to delete story' });
        }

        res.status(200).json({ message: 'Story deleted successfully' });
        resolve(null);
      });
    });
  } catch (err) {
    console.error('Story delete error:', err);
    res.status(500).json({ error: 'Failed to delete story' });
  }
});

export default router;