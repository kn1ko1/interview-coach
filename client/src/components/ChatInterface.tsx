import React, { useState, useRef, useEffect } from 'react';
import '../styles/ChatInterface.css';
import { PersonalityMode } from './PersonalitySelector';

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
  "Tell me about your experience with the required technologies mentioned in this job description.",
  "How do you approach problem-solving and collaboration in a team environment?",
  "Describe a challenging project you worked on and how you overcame obstacles.",
  "Why are you interested in this particular role and company?",
  "What are your strengths and how do they align with this position?",
];

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onSubmit, isLoading = false, cv = '', jobSpec = '', personality = 'supportive' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with first sample question
  useEffect(() => {
    if (messages.length === 0) {
      const initialMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        type: 'ai',
        content: SAMPLE_QUESTIONS[0],
        timestamp: new Date(),
      };
      setMessages([initialMessage]);
    }
  }, []);

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
    setAnswers((prev) => [...prev, inputValue]);
    setInputValue('');

    if (onSubmit) {
      onSubmit(inputValue);
    }

    if (currentQuestion < SAMPLE_QUESTIONS.length - 1) {
      setTimeout(() => {
        const nextMessage: Message = {
          id: `msg-${Date.now()}-ai`,
          type: 'ai',
          content: SAMPLE_QUESTIONS[currentQuestion + 1],
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, nextMessage]);
        setCurrentQuestion((prev) => prev + 1);
      }, 500);
    } else if (currentQuestion === SAMPLE_QUESTIONS.length - 1) {
      setTimeout(() => {
        const score = calculateEmployabilityScore();
        
        let feedback = '';
        if (personality === 'ruthless') {
          // Ruthless coach feedback
          if (score >= 80) {
            feedback = "✅ Outstanding performance. You're well-prepared for this role.";
          } else if (score >= 60) {
            feedback = "⚠️ Decent effort, but you need to dig deeper. More specific examples required.";
          } else {
            feedback = "❌ Weak responses. Your preparation is insufficient for this role. Study harder.";
          }
        } else {
          // Supportive coach feedback
          if (score >= 80) {
            feedback = "✅ Excellent fit for this role! Great preparation!";
          } else if (score >= 60) {
            feedback = "✓ Good potential match! Keep practicing and building confidence.";
          } else {
            feedback = "○ Continue preparing and retake the test when ready. You're on the right track!";
          }
        }

        const scoreSummary = `Interview Complete! 🎉

Your Employability Score: ${score}/100

Summary:
• Questions Answered: ${answers.length + 1}/${SAMPLE_QUESTIONS.length}
• Response Quality: ${answers.reduce((sum, ans) => sum + ans.length, 0) / Math.max(answers.length, 1) > 200 ? 'Excellent' : 'Good'}
• Job Alignment: ${jobSpec ? 'Analyzed' : 'No job spec provided'}

${feedback}`;
        const scoreMessage: Message = {
          id: `msg-${Date.now()}-ai`,
          type: 'ai',
          content: scoreSummary,
          timestamp: new Date(),
          isScore: true,
        };
        setMessages((prev) => [...prev, scoreMessage]);
        setCurrentQuestion((prev) => prev + 1);
      }, 500);
    }
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
        content: SAMPLE_QUESTIONS[0],
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
