import express, { Express } from "express";
import { InterviewController } from "../controllers/interviewController";
import { AuthController } from "../controllers/authController";
import aiRoutes from "./aiRoutes";

const router = express.Router();

// instantiate controllers
const interviewController = new InterviewController();
const authController = new AuthController();

// Interview routes
router.get("/interview/questions", interviewController.getInterviewQuestions.bind(interviewController));
router.post("/interview", interviewController.submitResponses.bind(interviewController));
router.post("/upload-cv", ((interviewController as any).uploadCV?.bind(interviewController)) ?? ((req, res) => { res.status(501).json({ error: "uploadCV not implemented" }); }));
router.get("/employability-score", ((interviewController as any).getEmployabilityScore?.bind(interviewController)) ?? ((req, res) => { res.status(501).json({ error: "getEmployabilityScore not implemented" }); }));

// Authentication routes
router.post("/login", authController.login.bind(authController));
router.post("/register", authController.register.bind(authController));

// AI subroutes
router.use("/ai", aiRoutes);

// keep a default function export that registers the router
export default function initRoutes(app: Express, _server?: any, _opts?: any) {
  app.use("/api", router);
}