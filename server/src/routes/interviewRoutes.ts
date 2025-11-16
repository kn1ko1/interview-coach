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

interface InterviewSession {
  id: string;
  userId: string;
  questions: string;
  answers: string;
  score: number | null;
  feedback: string | null;
  createdAt: string;
}

/**
 * POST /api/interview/start
 * Start a new interview session
 */
router.post('/start', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const { questions } = req.body;
    const userId = req.userId;

    if (!questions || !Array.isArray(questions)) {
      res.status(400).json({ error: 'Questions array required' });
      return;
    }

    const sessionId = crypto.randomBytes(8).toString('hex');
    const questionsJson = JSON.stringify(questions);
    const answersJson = JSON.stringify([]);

    db.run(
      'INSERT INTO interviewSessions (id, userId, questions, answers, createdAt) VALUES (?, ?, ?, ?, datetime("now"))',
      [sessionId, userId, questionsJson, answersJson],
      (err: Error | null) => {
        if (err) {
          console.error('Interview start error:', err);
          res.status(500).json({ error: 'Failed to start interview' });
          return;
        }

        res.status(200).json({
          message: 'Interview session started',
          sessionId,
          questions,
        });
      }
    );
  } catch (err) {
    console.error('Interview start error:', err);
    res.status(500).json({ error: 'Failed to start interview' });
  }
});

/**
 * POST /api/interview/:sessionId/answer
 * Submit answer for a question
 */
router.post('/:sessionId/answer', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const { sessionId } = req.params;
    const { answers } = req.body;
    const userId = req.userId;

    if (!answers || !Array.isArray(answers)) {
      res.status(400).json({ error: 'Answers array required' });
      return;
    }

    const answersJson = JSON.stringify(answers);

    db.run(
      'UPDATE interviewSessions SET answers = ? WHERE id = ? AND userId = ?',
      [answersJson, sessionId, userId],
      (err: Error | null) => {
        if (err) {
          res.status(500).json({ error: 'Failed to save answer' });
          return;
        }

        res.status(200).json({ message: 'Answer saved successfully' });
      }
    );
  } catch (err) {
    console.error('Answer save error:', err);
    res.status(500).json({ error: 'Failed to save answer' });
  }
});

/**
 * POST /api/interview/:sessionId/submit
 * Submit interview and get feedback
 */
router.post('/:sessionId/submit', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const { sessionId } = req.params;
    const { score, feedback } = req.body;
    const userId = req.userId;

    db.run(
      'UPDATE interviewSessions SET score = ?, feedback = ? WHERE id = ? AND userId = ?',
      [score || 0, feedback || '', sessionId, userId],
      (err: Error | null) => {
        if (err) {
          res.status(500).json({ error: 'Failed to submit interview' });
          return;
        }

        res.status(200).json({
          message: 'Interview submitted successfully',
          score,
          feedback,
        });
      }
    );
  } catch (err) {
    console.error('Interview submit error:', err);
    res.status(500).json({ error: 'Failed to submit interview' });
  }
});

/**
 * GET /api/interview/:sessionId
 * Get interview session details
 */
router.get('/:sessionId', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const { sessionId } = req.params;
    const userId = req.userId;

    db.get('SELECT * FROM interviewSessions WHERE id = ? AND userId = ?', [sessionId, userId], (err: Error | null, row: InterviewSession | undefined) => {
      if (err) {
        res.status(500).json({ error: 'Failed to retrieve session' });
        return;
      }

      if (!row) {
        res.status(404).json({ error: 'Session not found' });
        return;
      }

      // Parse JSON fields
      const session = {
        ...row,
        questions: JSON.parse(row.questions || '[]'),
        answers: JSON.parse(row.answers || '[]'),
      };

      res.status(200).json(session);
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
router.get('/', authenticate, (req: AuthRequest, res: Response): void => {
  try {
    const userId = req.userId;

    db.all(
      'SELECT id, score, createdAt FROM interviewSessions WHERE userId = ? ORDER BY createdAt DESC',
      [userId],
      (err: Error | null, rows: any[]) => {
        if (err) {
          res.status(500).json({ error: 'Failed to retrieve sessions' });
          return;
        }

        res.status(200).json({ sessions: rows || [] });
      }
    );
  } catch (err) {
    console.error('Sessions retrieve error:', err);
    res.status(500).json({ error: 'Failed to retrieve sessions' });
  }
});

export default router;