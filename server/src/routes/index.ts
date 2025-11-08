import express from 'express';
import { InterviewController } from '../controllers/interviewController';
import { AuthController } from '../controllers/authController';

// instantiate controllers (was missing)
const interviewController = new InterviewController();
const authController = new AuthController();

const router = express.Router();

// Interview routes
router.post('/interview', interviewController.handleInterview.bind(interviewController));
router.post('/upload-cv', interviewController.uploadCV.bind(interviewController));
router.get('/employability-score', interviewController.getEmployabilityScore.bind(interviewController));

// Authentication routes
router.post('/login', authController.login.bind(authController));
router.post('/register', authController.register.bind(authController));

export default function initRoutes(app: any, server: any, opts: any) {
  app.use('/api', router);
}