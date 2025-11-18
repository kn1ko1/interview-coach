import React, { useState, useRef, useEffect } from 'react';
import '../styles/ChatInterface.css';
import { PersonalityMode } from './PersonalitySelector';
import { scoreAnswer, analyzeCV } from '../services/scoringService';
import CVScoreVisualization from './CVScoreVisualization';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isScore?: boolean;
}

interface ChatInterfaceProps {
  onSubmit?: (userMessage: string) => void;
  isLoading?: boolean;
  cv?: string;
  jobSpec?: string;
  personality?: PersonalityMode;
}

const SAMPLE_QUESTIONS = [
  {
    question: "Tell me about your experience with the required technologies mentioned in this job description.",
    category: "Technical Experience"
  },
  {
    question: "How do you approach problem-solving and collaboration in a team environment?",
    category: "Soft Skills"
  },
  {
    question: "Describe a challenging project you worked on and how you overcame obstacles.",
    category: "Problem Solving"
  },
  {
    question: "Why are you interested in this particular role and company?",
    category: "Motivation"
  },
  {
    question: "What are your strengths and how do they align with this position?",
    category: "Self-Assessment"
  },
  {
    question: "Describe your experience with agile/scrum methodologies and how you handle changing requirements.",
    category: "Methodology"
  },
  {
    question: "Tell me about a time you mentored or helped a junior team member grow.",
    category: "Leadership"
  },
];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onSubmit, isLoading = false, cv = '', jobSpec = '', personality = 'supportive' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with CV strength analysis + first sample question
  useEffect(() => {
    if (messages.length === 0 && cv) {
      const cvAnalysis = analyzeCV(cv, jobSpec, personality);
      
      const cvMessage: Message = {
        id: `msg-${Date.now()}-cv`,
        type: 'ai',
        content: `📋 **CV Analysis**
        
Strength: ${cvAnalysis.overallStrength}/10
Job Alignment: ${cvAnalysis.alignment}%

${cvAnalysis.feedback}

---

Now let's get started with the interview!`,
        timestamp: new Date(),
      };
      
      const initialMessage: Message = {
        id: `msg-${Date.now()}-ai-q1`,
        type: 'ai',
        content: SAMPLE_QUESTIONS[0].question,
        timestamp: new Date(),
      };
      
      setMessages([cvMessage, initialMessage]);
    } else if (messages.length === 0) {
      const initialMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        type: 'ai',
        content: SAMPLE_QUESTIONS[0].question,
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
    }
  }, [cv, jobSpec, personality]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const calculateEmployabilityScore = (): number => {
    let score = 0;
    
    const questionsAnswered = answers.length;
    score += questionsAnswered * 15;

    const avgResponseLength = answers.reduce((sum, ans) => sum + ans.length, 0) / Math.max(answers.length, 1);
    if (avgResponseLength > 200) score += 20;
    else if (avgResponseLength > 100) score += 10;

    if (jobSpec && answers.length > 0) {
      const keywords = jobSpec.toLowerCase().split(/\s+/).filter(w => w.length > 4);
      const matchedKeywords = answers.join(' ').toLowerCase().split(/\s+/).filter(w => keywords.includes(w));
      score += Math.min(matchedKeywords.length * 2, 15);
    }

    return Math.min(Math.round(score), 100);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    
    // Score the current answer
    const currentQ = SAMPLE_QUESTIONS[currentQuestion];
    const answerScoringResult = scoreAnswer(
      currentQ.question,
      inputValue,
      jobSpec,
      personality
    );
    
    setAnswers((prev) => [...prev, inputValue]);
    setInputValue('');

    if (onSubmit) {
      onSubmit(inputValue);
    }

    // Add immediate feedback for the answer
    setTimeout(() => {
      const feedbackMessage: Message = {
        id: `msg-${Date.now()}-feedback`,
        type: 'ai',
        content: `**Score: ${answerScoringResult.score}/10** (${currentQ.category})

${answerScoringResult.feedback}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, feedbackMessage]);

      // Then add next question or conclude
      if (currentQuestion < SAMPLE_QUESTIONS.length - 1) {
        setTimeout(() => {
          const nextQuestion = SAMPLE_QUESTIONS[currentQuestion + 1];
          const nextMessage: Message = {
            id: `msg-${Date.now()}-ai-next`,
            type: 'ai',
            content: nextQuestion.question,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, nextMessage]);
          setCurrentQuestion((prev) => prev + 1);
        }, 800);
      } else {
        // Interview complete - show final summary
        setTimeout(() => {
          showInterviewSummary();
        }, 1000);
      }
    }, 400);
  };

  const showInterviewSummary = () => {
    const score = calculateEmployabilityScore();
    
    // Calculate individual scores
    const allAnswerScores = answers.map((answer, idx) => {
      const q = SAMPLE_QUESTIONS[idx] || { question: '', category: '' };
      const scoring = scoreAnswer(q.question, answer, jobSpec, personality);
      return scoring.score;
    });
    const avgScore = allAnswerScores.length > 0 
      ? (allAnswerScores.reduce((a, b) => a + b, 0) / allAnswerScores.length).toFixed(1)
      : 0;

    let overallFeedback = '';
    if (personality === 'direct') {
      if (score >= 80) {
        overallFeedback = "✅ Outstanding performance. You're ready for this role. No major concerns.";
      } else if (score >= 60) {
        overallFeedback = "⚠️ You showed competence, but there are gaps to address. Work on the weaker areas before your interview.";
      } else {
        overallFeedback = "❌ Your performance needs improvement. Practice and come back when you're more prepared.";
      }
    } else {
      if (score >= 80) {
        overallFeedback = "✅ Excellent interview! You demonstrated strong capabilities and great fit for this role!";
      } else if (score >= 60) {
        overallFeedback = "✓ Good interview overall! You showed promise. With some practice on the weaker areas, you'll be even stronger!";
      } else {
        overallFeedback = "○ Keep practicing! You're building momentum. Each interview is a learning opportunity!";
      }
    }

    const scoreSummary = `🎉 **Interview Complete!**

📊 **Overall Results:**
• Employability Score: **${score}/100**
• Average Answer Score: **${avgScore}/10**
• Questions Answered: **${answers.length}/${SAMPLE_QUESTIONS.length}**

📈 **Answer Breakdown:**
${allAnswerScores
  .map(
    (s, i) =>
      `• Q${i + 1}: ${s}/10 - ${SAMPLE_QUESTIONS[i]?.category || 'N/A'}`
  )
  .join('\n')}

💡 **Overall Assessment:**
${overallFeedback}

---
${personality === 'direct' 
  ? "Reflect on this feedback. What will you do differently?" 
  : "You're making progress. Keep building on your strengths!"}`;

    const scoreMessage: Message = {
      id: `msg-${Date.now()}-ai-summary`,
      type: 'ai',
      content: scoreSummary,
      timestamp: new Date(),
      isScore: true,
    };
    setMessages((prev) => [...prev, scoreMessage]);
    setCurrentQuestion((prev) => prev + 1);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRestart = () => {
    setMessages([
      {
        id: `msg-${Date.now()}-ai`,
        type: 'ai',
        content: SAMPLE_QUESTIONS[0].question,
        timestamp: new Date(),
      },
    ]);
    setInputValue('');
    setCurrentQuestion(0);
    setAnswers([]);
  };

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty-state">
            <p>Start typing your answer to begin the interview</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message chat-message-${message.type} ${message.isScore ? 'score-message' : ''}`}
          >
            <div className="message-bubble">
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="chat-message chat-message-ai">
            <div className="message-bubble loading-bubble">
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
              <span className="loading-dot"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <textarea
          className="chat-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your answer here... (Shift+Enter for new line)"
          disabled={isLoading || currentQuestion > SAMPLE_QUESTIONS.length}
          rows={3}
        />
        <div className="chat-button-group">
          <button
            className="chat-send-button"
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim() || currentQuestion > SAMPLE_QUESTIONS.length}
          >
            {isLoading ? 'Generating feedback...' : 'Send'}
          </button>
          {currentQuestion > SAMPLE_QUESTIONS.length && (
            <button
              className="chat-restart-button"
              onClick={handleRestart}
            >
              Restart Interview
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
