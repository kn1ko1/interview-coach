import { Router } from 'express';
import InterviewController from '../controllers/interviewController';
import AuthController from '../controllers/authController';

const router = Router();

// Interview routes
router.post('/interview', InterviewController.handleInterview);
router.post('/upload-cv', InterviewController.uploadCV);
router.get('/employability-score', InterviewController.getEmployabilityScore);

// Authentication routes
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

export default router;