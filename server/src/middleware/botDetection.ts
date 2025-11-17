import { Request, Response, NextFunction } from 'express';

interface BotDetectionRequest extends Request {
  isSuspiciousActivity?: boolean;
  botScore?: number;
}

/**
 * Bot/AI Agent Detection Middleware
 * Prevents automated logins by detecting patterns common to bots and AI agents
 */

const BOT_USER_AGENTS = [
  'bot',
  'crawler',
  'spider',
  'scraper',
  'curl',
  'wget',
  'python',
  'java',
  'node',
  'go-http-client',
  'axios',
  'http',
  'request',
  'selenium',
  'phantom',
  'headless',
];

const SUSPICIOUS_EMAIL_PATTERNS = [
  /^test/i,
  /^\d+@/,
  /^admin/i,
  /^root/i,
  /^demo/i,
  /faker/i,
  /placeholder/i,
  /example@example/i,
  /test@test/i,
];

/**
 * Calculate bot score based on multiple indicators
 * Returns 0-100, >50 is suspicious
 */
function calculateBotScore(req: BotDetectionRequest): number {
  let score = 0;

  // Check User-Agent
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  if (!userAgent || userAgent.length < 5) {
    score += 20; // Suspiciously short or missing user agent
  }
  
  for (const botIndicator of BOT_USER_AGENTS) {
    if (userAgent.includes(botIndicator)) {
      score += 25;
      break;
    }
  }

  // Check email patterns
  const email = (req.body?.email || '').toLowerCase();
  for (const pattern of SUSPICIOUS_EMAIL_PATTERNS) {
    if (pattern.test(email)) {
      score += 20;
      break;
    }
  }

  // Check for missing headers typical of automated clients
  const suspiciousHeaderAbsence = [
    !req.headers['accept-language'],
    !req.headers['accept-encoding'],
    !req.headers.referer,
  ].filter(Boolean).length;
  
  score += suspiciousHeaderAbsence * 10;

  // Check request timing - too many requests from same IP in short time
  // This is handled by rate limiter, but we can add basic check
  const xForwardedFor = req.headers['x-forwarded-for'];
  const clientIp = typeof xForwardedFor === 'string' 
    ? xForwardedFor.split(',')[0].trim() 
    : req.ip;

  // Check for VPN/Proxy patterns (common in automation)
  if (userAgent.includes('vpn') || userAgent.includes('proxy')) {
    score += 15;
  }

  // Check for headless browser patterns
  const headlessPatterns = [
    'headless',
    'headlesschrome',
    'chrome-lighthouse',
    'phantomjs',
  ];
  
  for (const pattern of headlessPatterns) {
    if (userAgent.includes(pattern)) {
      score += 30;
      break;
    }
  }

  return Math.min(score, 100);
}

/**
 * Middleware to detect and flag suspicious login attempts
 */
export const detectBotActivity = (req: BotDetectionRequest, res: Response, next: NextFunction): void => {
  if (req.method === 'POST' && (req.path.includes('login') || req.path.includes('register'))) {
    const botScore = calculateBotScore(req);
    req.botScore = botScore;
    req.isSuspiciousActivity = botScore > 50;

    // Log suspicious activity
    if (req.isSuspiciousActivity) {
      console.warn(`[BOT-DETECTION] Suspicious login attempt detected:`, {
        email: req.body?.email,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        botScore,
        timestamp: new Date().toISOString(),
      });
    }
  }

  next();
};

/**
 * Middleware to block requests from confirmed bot patterns
 * Used stricter than bot detection - only blocks obvious bots
 */
export const blockObviousBots = (req: Request, res: Response, next: NextFunction): void => {
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();

  // Hard block list for obvious bots
  const hardBlockPatterns = [
    'bot',
    'crawler',
    'spider',
    'scraper',
    'scan',
    'nmap',
    'nessus',
    'masscan',
  ];

  for (const pattern of hardBlockPatterns) {
    if (userAgent.includes(pattern)) {
      res.status(403).json({
        error: 'Access denied',
        message: 'Automated access is not permitted',
      });
      return;
    }
  }

  next();
};

export default {
  detectBotActivity,
  blockObviousBots,
  calculateBotScore,
};
