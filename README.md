# Interview Coach MVP

**Project:** AI-powered interview prep system that transforms CVs and Job Descriptions into actionable stories, mock interview practice, and personalized feedback — all with simple email login persistence.

**Goal:** Help job seekers (career changers, immigrants, anyone) prepare confidently for interviews through structured practice and feedback.

---

## 🚀 MVP Overview

The MVP is structured as a **3-stage curriculum**:

### Stage 1: CV + Keywords Upload
- Users upload/paste their CV
- Users input role-specific keywords
- AI extracts roles, achievements, skills from CV
- System calculates CV ↔ Keywords match score
- **Cost:** Free (rules-based matching)

### Stage 2: Story Bank (AI-Powered)
- Convert CV bullets into STAR stories
- Categorize stories by competencies
- Users can edit and save stories
- Powered by **Ollama** (runs locally, free)
- **Cost:** Free (local LLM)

### Stage 3: Mock Interviews + Feedback
- AI generates tailored questions from CV + keywords
- Users answer via text
- Instant feedback on answer quality
- Summary report with improvements
- **Cost:** Free (local LLM)

---

## 🎯 Core Features

✅ **Email Login + Persistence**
- Simple email authentication (no password complexity)
- Saves all progress to database
- Resume sessions across devices

✅ **CV Analysis**
- Extract skills, achievements, roles
- Quick visual match vs job keywords

✅ **AI Story Generation**
- STAR format stories from CV bullets
- Powered by Ollama (local, free)

✅ **Mock Interviews**
- Tailored questions based on CV + keywords
- Text-based answers with instant feedback
- Tone: Supportive and constructive

✅ **Feedback Reports**
- Answer quality assessment
- Suggested improvements
- Key takeaways for practice

---

## 💰 Cost Breakdown

| Feature | Cost |
|---------|------|
| **Local LLM (Ollama)** | $0 |
| **Database (SQLite/PostgreSQL)** | $0-15/month |
| **Email Service** | $0-10/month |
| **Hosting (optional)** | $0-30/month |
| **Total MVP Cost** | **$0-55/month** |

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
- **Ollama** (local, free, runs on laptop)
- Models: Mistral 7B or Llama 2

**Database**
- SQLite (development) / PostgreSQL (production)
- Session storage, user data, story bank

**Authentication**
- Email-based login (simple, no passwords initially)
- JWT tokens for session management

---

## 📋 Setup Instructions

### Prerequisites
- Node.js 18+ (for server)
- Node.js 16 (for client, if using react-scripts 5.0.1)
- Ollama installed locally (https://ollama.ai)

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

### 2. Start Ollama (Local LLM)

```bash
# Download and run Ollama
ollama pull mistral
ollama serve
# Ollama API will be available at http://localhost:11434
```

### 3. Setup Environment Variables

**Server** (`.env`):
```
PORT=5000
DATABASE_URL=sqlite:./interview_coach.db
OLLAMA_API_URL=http://localhost:11434
EMAIL_SERVICE=sendgrid  # or nodemailer
EMAIL_API_KEY=your_key_here
JWT_SECRET=your_secret_key
```

**Client** (`.env`):
```
REACT_APP_API_URL=http://localhost:5000
```

### 4. Run the Application

**Terminal 1 - Start Server:**
```bash
nvm use 18
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Start Client:**
```bash
nvm use 16
cd client
npm start
# Client runs on http://localhost:3000
```

---

## 🎓 User Journey

1. **Sign up** with email (no password)
2. **Upload CV** + input **job keywords**
3. **View match score** + CV analysis
4. **Convert stories** from CV (AI-powered)
5. **Practice mock interviews** with feedback
6. **Get report** with improvement suggestions
7. **Save & resume** session anytime

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

**V1 (Current MVP)**
- Email login + persistence
- CV upload + keyword matching
- Story generation (Ollama)
- Mock interviews (hardcoded questions)
- Feedback reports

**V2**
- Claude/GPT integration (optional, paid)
- Voice recording for answers
- Dual personality mode (Ruthless/Supportive)
- More interview question templates

**V3**
- Analytics dashboard
- Progress tracking
- Community questions
- Integration with job boards

---

## 🛠️ Development

**Tech Stack Rationale:**
- **Ollama:** Free, local, no API costs
- **Plain CSS:** Faster, no build complexity
- **SQLite:** Zero setup, perfect for MVP
- **Email-based auth:** Simple UX, no password complexity

**Why this approach:**
- MVP focuses on core value (interview prep)
- Authentication & persistence added early
- AI integration is local-first (no cloud costs)
- Easy to scale up later

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