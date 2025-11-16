import express, { Request, Response } from 'express';
import crypto from 'crypto';
import authenticate from '../middleware/authMiddleware';
import db from '../db/schema';

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
  email?: string;
  body: {
    questions?: string[];
    answers?: string[];
    score?: number;
    feedback?: string;
  };
}

/**
 * POST /api/interview/start
 * Start a new interview session
 */
router.post('/start', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { questions } = req.body;
    const userId = req.userId;

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Questions array required' });
    }

    const sessionId = crypto.randomBytes(8).toString('hex');
    const questionsJson = JSON.stringify(questions);
    const answersJson = JSON.stringify([]);

    return new Promise((resolve) => {
      db.run(
        'INSERT INTO interviewSessions (id, userId, questions, answers, createdAt) VALUES (?, ?, ?, ?, datetime("now"))',
        [sessionId, userId, questionsJson, answersJson],
        (err) => {
          if (err) {
            console.error('Interview start error:', err);
            return res.status(500).json({ error: 'Failed to start interview' });
          }

          res.status(200).json({
            message: 'Interview session started',
            sessionId,
            questions,
          });
          resolve(null);
        }
      );
    });
  } catch (err) {
    console.error('Interview start error:', err);
    res.status(500).json({ error: 'Failed to start interview' });
  }
});

/**
 * POST /api/interview/:sessionId/answer
 * Submit answer for a question
 */
router.post('/:sessionId/answer', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { answers } = req.body;
    const userId = req.userId;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers array required' });
    }

    const answersJson = JSON.stringify(answers);

    return new Promise((resolve) => {
      db.run(
        'UPDATE interviewSessions SET answers = ? WHERE id = ? AND userId = ?',
        [answersJson, sessionId, userId],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to save answer' });
          }

          res.status(200).json({ message: 'Answer saved successfully' });
          resolve(null);
        }
      );
    });
  } catch (err) {
    console.error('Answer save error:', err);
    res.status(500).json({ error: 'Failed to save answer' });
  }
});

/**
 * POST /api/interview/:sessionId/submit
 * Submit interview and get feedback
 */
router.post('/:sessionId/submit', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { score, feedback } = req.body;
    const userId = req.userId;

    return new Promise((resolve) => {
      db.run(
        'UPDATE interviewSessions SET score = ?, feedback = ? WHERE id = ? AND userId = ?',
        [score || 0, feedback || '', sessionId, userId],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to submit interview' });
          }

          res.status(200).json({
            message: 'Interview submitted successfully',
            score,
            feedback,
          });
          resolve(null);
        }
      );
    });
  } catch (err) {
    console.error('Interview submit error:', err);
    res.status(500).json({ error: 'Failed to submit interview' });
  }
});

/**
 * GET /api/interview/:sessionId
 * Get interview session details
 */
router.get('/:sessionId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId;

    return new Promise((resolve) => {
      db.get('SELECT * FROM interviewSessions WHERE id = ? AND userId = ?', [sessionId, userId], (err, row: any) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to retrieve session' });
        }

        if (!row) {
          return res.status(404).json({ error: 'Session not found' });
        }

        // Parse JSON fields
        const session = {
          ...row,
          questions: JSON.parse(row.questions || '[]'),
          answers: JSON.parse(row.answers || '[]'),
        };

        res.status(200).json(session);
        resolve(null);
      });
    });
  } catch (err) {
    console.error('Session retrieve error:', err);
    res.status(500).json({ error: 'Failed to retrieve session' });
  }
});

/**
 * GET /api/interview
 * Get all interview sessions for user
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    return new Promise((resolve) => {
      db.all(
        'SELECT id, score, createdAt FROM interviewSessions WHERE userId = ? ORDER BY createdAt DESC',
        [userId],
        (err, rows: any[]) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to retrieve sessions' });
          }

          res.status(200).json({ sessions: rows || [] });
          resolve(null);
        }
      );
    });
  } catch (err) {
    console.error('Sessions retrieve error:', err);
    res.status(500).json({ error: 'Failed to retrieve sessions' });
  }
});

export default router;