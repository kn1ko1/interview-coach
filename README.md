# Interview Coach MVP

**Project:** AI-powered interview prep system powered by Claude Haiku API that transforms CVs and Job Descriptions into mock interviews, employability scoring, and personalized feedback — all with simple email login persistence.

**Goal:** Help job seekers (career changers, immigrants, anyone) prepare confidently for interviews through structured practice and AI-driven feedback.

---

## 🚀 MVP Overview

The MVP is structured as a **3-stage curriculum**:

### Stage 1: CV + Job Spec Analysis (Current MVP)
- Users upload their CV (PDF/DOC)
- Users paste job description/specification
- AI extracts roles, achievements, skills from CV
- AI analyzes CV ↔ Job Spec match
- System calculates alignment score
- **Cost:** ~$0.0001 per use (Claude Haiku API)

### Stage 2: Mock Interviews + Chat Practice
- 5 sample interview questions presented sequentially
- Users answer via chat interface in real-time
- AI provides constructive feedback on each response
- Employability score (0-100) calculated based on:
  - Number of questions answered (15pts each)
  - Response quality and depth (10-20pts bonus)
  - Job specification keyword matching (up to 15pts bonus)
- Summary report with insights and recommendations
- **Cost:** ~$0.001-0.005 per interview (Claude Haiku API)

### Stage 3: Story Bank + Advanced Analysis (Roadmap)
- Convert CV bullets into STAR stories aligned with job spec
- Categorize stories by job requirements
- Users can edit and save stories
- Voice recording for answers
- **Cost:** ~$0.01 per story generation (Claude API)

---

## 🎯 Core Features

✅ **Email Login + Persistence**
- Simple email authentication with 6-digit verification code
- Saves all progress to database
- Resume sessions across devices
- Session management with JWT tokens

✅ **Bot & Security Protection**
- Multi-layer bot detection (User-Agent, Email patterns, Request timing)
- Rate limiting: 5 login attempts per 15 minutes
- Email verification codes prevent automated access
- Suspicious activity flagging and blocking
- Protection against common AI/crawler patterns

✅ **CV + Job Spec Analysis**
- Extract skills, achievements, roles from CV
- Parse job requirements from job spec
- AI-powered match scoring and gaps analysis
- File validation (PDF/DOC only, max 5MB)

✅ **Mock Interviews (Chat Interface)**
- 5 sample interview questions presented sequentially
- Text-based answers via chat with Claude Haiku API
- Instant feedback on answer quality
- Tone: Supportive and constructive
- Real-time scoring as you answer

✅ **Employability Scoring**
- Calculates score 0-100 based on:
  - Questions completed (15pts per question)
  - Response quality (10-20pts bonus)
  - Job spec alignment (up to 15pts bonus)
- Summary with strengths, gaps, and recommendations
- Interview restart capability

---

## 💰 Cost Breakdown

| Feature | Cost |
|---------|------|
| **Claude Haiku API** | ~$0.25/month (at ~1000 interviews/month) |
| **Database (SQLite/PostgreSQL)** | $0-15/month |
| **Email Service** | $0-10/month |
| **Hosting (optional)** | $0-30/month |
| **Total MVP Cost** | **~$0.25-55/month** |

**Cost Rationale:**
- Claude Haiku: ~$0.80 per 1M input tokens, ~$2.40 per 1M output tokens
- Typical interview session: 2,000-3,000 tokens = ~$0.005-0.01
- 1000 interviews/month = ~$5-10 in API costs (well under $1 per user)

---

## ⚙️ Technology Stack

**Frontend**
- React 17 + TypeScript
- Plain CSS (no Tailwind)
- LocalStorage + API calls
- Responsive design

**Backend**
- Node.js + Express + TypeScript
- REST API endpoints
- JWT authentication (email-based)

**AI/LLM**
- **Claude Haiku API** (via Anthropic)
- Models: Claude 3.5 Haiku (fastest, most cost-effective)
- Fallback: OpenAI GPT-4 Turbo (optional)

**Database**
- SQLite (development) / PostgreSQL (production)
- Session storage, user data, interview history

**Security**
- Email-based login with 6-digit verification codes
- Multi-layer bot detection and prevention
- Rate limiting (5 attempts per 15 minutes)
- JWT tokens for session management

**Authentication**
- Email-based login (simple, no passwords)
- Email verification codes (6-digit)
- JWT tokens with expiration
- Session persistence across devices

---

## 📋 Setup Instructions

### Prerequisites
- Node.js 18+ (for server)
- Node.js 16+ (for client)
- Claude Haiku API key from Anthropic (https://console.anthropic.com)

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd interview-coach

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Setup Environment Variables

**Server** (`.env`):
```
PORT=5000
DATABASE_URL=sqlite:./interview_coach.db
CLAUDE_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_key_here  # Optional fallback
EMAIL_SERVICE=sendgrid  # or nodemailer
EMAIL_API_KEY=your_email_service_key
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

**Client** (`.env`):
```
REACT_APP_API_URL=http://localhost:5000
```

### 3. Run the Application

**Terminal 1 - Start Server:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Start Client:**
```bash
cd client
npm start
# Client runs on http://localhost:3000
```

---

## 🎓 User Journey

1. **Sign up** with email + verification code
2. **Upload CV** (PDF/DOC) + **paste job description**
3. **Answer 5 interview questions** via chat interface
4. **Receive employability score** (0-100) with breakdown
5. **Get personalized feedback** on each response
6. **View summary report** with strengths and gaps
7. **Restart or exit** interview to try again or save progress

---

## 📁 Project Structure

```
interview-coach/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Home, Interview, Results
│   │   ├── components/    # CVUploader, KeywordInput, etc.
│   │   ├── services/      # API calls, auth
│   │   └── hooks/         # useAuth, etc.
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── routes/        # Auth, interview, stories
│   │   ├── services/      # LLM, scoring, email
│   │   ├── models/        # User, Story, Session
│   │   └── middleware/    # Auth, error handling
│   └── package.json
└── README.md
```

---

## 🚀 Roadmap (Future Versions)

**V1 (Current MVP)** ✅ IN PROGRESS
- Email login + 6-digit verification + persistence
- CV upload (PDF/DOC) + job spec paste
- Bot detection + rate limiting + security middleware
- Mock interviews with 5 sample questions
- Real-time employability scoring (0-100)
- Feedback reports with Claude Haiku API
- Styled UI with soft white theme

**V2** (Next Phase)
- Dynamic question generation (based on CV + job spec)
- Voice recording for answers
- Interview history & progress tracking
- Dual personality mode (Ruthless/Supportive coach)
- Export interview reports as PDF
- Multiple interview sets per session

**V3** (Future)
- Analytics dashboard (score trends, common weaknesses)
- Community question bank
- Integration with job boards (Indeed, LinkedIn)
- Video interview simulation with webcam
- Peer comparison (anonymized)

---

## 🛠️ Development

**Tech Stack Rationale:**
- **Claude Haiku API:** $0.80/1M tokens (cost-effective for MVP scale)
- **React + TypeScript:** Type-safe, scalable, industry standard
- **Plain CSS:** Fast, no build complexity, easy to customize
- **Express.js:** Lightweight, perfect for RESTful APIs
- **SQLite/PostgreSQL:** Zero setup, perfect for MVP → production scaling
- **Email-based auth:** Simple UX, no password complexity, 6-digit verification prevents bots
- **Multi-layer bot detection:** Protects against automated access without UX friction

**Why this approach:**
- MVP focuses on core value (interview prep + AI feedback)
- Authentication & security added early to prevent abuse
- Claude Haiku provides best cost/quality ratio for conversational AI
- Easy to scale: swap to Claude 3 Opus or GPT-4 when needed
- Bot detection prevents exploitation while maintaining user simplicity

---

## 📝 Contributing

Contributions welcome! Please:
1. Create a feature branch
2. Make your changes
3. Submit a pull request

---

## 📄 License

MIT License — See LICENSE file for details.

---

## 🆘 Support

For issues or questions:
- Check GitHub Issues
- Review project documentation
- Contact: [your-email]