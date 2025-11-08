"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const interviewController_1 = require("../controllers/interviewController");
const authController_1 = require("../controllers/authController");
// instantiate controllers (was missing)
const interviewController = new interviewController_1.InterviewController();
const authController = new authController_1.AuthController();
const router = express_1.default.Router();
// Interview routes
router.post('/interview', interviewController.handleInterview.bind(interviewController));
router.post('/upload-cv', interviewController.uploadCV.bind(interviewController));
router.get('/employability-score', interviewController.getEmployabilityScore.bind(interviewController));
// Authentication routes
router.post('/login', authController.login.bind(authController));
router.post('/register', authController.register.bind(authController));
function initRoutes(app, server, opts) {
    app.use('/api', router);
}
exports.default = initRoutes;
