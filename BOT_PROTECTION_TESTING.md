# Bot Protection & Security Testing Guide

## Overview

Your Interview Coach application has **multi-layer bot protection** to prevent automated access and AI agent exploitation:

### Layers of Protection

1. **Bot User-Agent Detection** - Identifies automated clients (curl, wget, Python, Selenium, headless browsers)
2. **Email Pattern Analysis** - Flags suspicious email patterns (test@, admin@, demo@, faker, etc.)
3. **Browser Header Validation** - Detects missing headers typical of automated requests
4. **VPN/Proxy Detection** - Identifies requests from proxy services
5. **Rate Limiting** - 5 login attempts per 15 minutes per IP
6. **Email Verification** - 6-digit codes required for signup (forces manual intervention)
7. **Request Timing Analysis** - Monitors suspicious rapid requests

---

## How to Test

### Prerequisites

Make sure the server is running:

```bash
cd /home/n1ko1/interview-coach/server
npm run dev
# Server should run on http://localhost:5000
```

### Test 1: Bot User-Agent Detection

**Objective:** Verify that requests from common automated tools are blocked

```bash
# Test with curl (should be flagged)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "User-Agent: curl/7.64.1" \
  -d '{"email":"test@gmail.com","password":"demo"}'

# Expected: 403 Forbidden or bot score > 50
```

**Test cases:**
- `User-Agent: curl/7.64.1` → Flagged ✓
- `User-Agent: Wget/1.20.3` → Flagged ✓
- `User-Agent: python-requests/2.28.0` → Flagged ✓
- `User-Agent: Mozilla/5.0 (Headless Chrome)` → Flagged ✓
- `User-Agent: PhantomJS/2.1.1` → Flagged ✓

---

### Test 2: Suspicious Email Pattern Detection

**Objective:** Verify that fake/test emails are rejected

```bash
# Test with suspicious email (should be flagged)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"demo"}'

# Expected: 403 Forbidden or bot score > 50
```

**Flagged patterns:**
- `test@*` → Test account
- `admin@*` → Admin/system account
- `demo@*` → Demo/test account
- `root@*` → System root account
- `example@example.com` → Example domain
- `test@test.com` → Test domain
- `faker@*` → Faker library pattern
- `placeholder@*` → Placeholder email

**Allowed patterns:**
- `john.doe@gmail.com` ✓
- `sarah@company.com` ✓
- `user.email@outlook.com` ✓

---

### Test 3: Missing Headers Detection

**Objective:** Verify that requests without typical browser headers are suspicious

```bash
# Request missing accept-language header
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0" \
  -d '{"email":"test@gmail.com","password":"demo"}'

# Expected: Higher bot score due to missing headers
```

**Typical browser headers:**
- `Accept-Language: en-US,en;q=0.9` 
- `Accept-Encoding: gzip, deflate, br`
- `Referer: http://localhost:3000/login`

---

### Test 4: Rate Limiting

**Objective:** Verify that rate limiting blocks repeated attempts

```bash
# Attempt 7 rapid login requests
for i in {1..7}; do
  echo "Attempt $i:"
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@gmail.com","password":"demo"}'
  echo ""
done

# Expected: First 5 succeed, 6th and 7th return 429 (Too Many Requests)
```

**Rate Limit Rules:**
- **5 login attempts** allowed per IP
- **15-minute window** per IP
- Returns: `429 Too Many Requests`

---

### Test 5: Email Verification Barrier

**Objective:** Verify that email codes prevent automated account creation

```bash
# Attempt signup with new email
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@gmail.com","password":"demo123"}'

# Expected: 
# 1. Verification code sent to email
# 2. Login blocked until code verified
# 3. Check server/email_logs.json for the code
```

**Email Verification Flow:**
1. User submits email
2. 6-digit code generated and sent
3. User must enter code within **10 minutes**
4. Only 3 attempts allowed before code expires
5. Code prevents brute force attacks

---

### Test 6: Combined Indicators

**Objective:** Verify that multiple suspicious patterns increase bot score

```bash
# Multiple red flags: curl + test email + missing headers
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "User-Agent: curl/7.64.1" \
  -d '{"email":"test@example.com","password":"demo"}'

# Expected: High bot score (>50) → Blocked
```

**vs. Legitimate request:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  -H "Accept-Language: en-US,en;q=0.9" \
  -H "Accept-Encoding: gzip, deflate, br" \
  -H "Referer: http://localhost:3000/" \
  -d '{"email":"john.doe@gmail.com","password":"secure123"}'

# Expected: Low bot score (<50) → Allowed
```

---

### Test 7: Run Automated Test Script

**Objective:** Run comprehensive bot protection tests

```bash
# Make script executable
chmod +x /home/n1ko1/interview-coach/server/scripts/test-bot-protection.sh

# Run all tests
bash /home/n1ko1/interview-coach/server/scripts/test-bot-protection.sh
```

This script tests:
- Suspicious user agents
- Email patterns
- Missing headers
- Rate limiting
- Combined indicators
- Email verification

---

## Bot Score Calculation

```
BASE SCORE: 0

ADD POINTS FOR:
- Bot user agent detected: +25 points
- Suspicious email pattern: +20 points
- Missing browser headers: +10 points each (max 30)
- Short/missing user agent: +20 points
- VPN/Proxy detected: +15 points

THRESHOLD: >50 = Suspicious activity blocked
```

---

## Expected Results

| Test | Input | Expected Output | Status |
|------|-------|-----------------|--------|
| curl user agent | `curl/7.64.1` | Blocked (403) | ✓ |
| Python requests | `python-requests` | Blocked (403) | ✓ |
| Headless Chrome | `Headless Chrome` | Blocked (403) | ✓ |
| test@ email | `test@example.com` | Blocked (403) | ✓ |
| admin@ email | `admin@site.com` | Blocked (403) | ✓ |
| Legit email | `john@gmail.com` | Allowed | ✓ |
| Missing headers | No Accept-Language | Increased bot score | ✓ |
| 6th request in 15min | Rapid requests | 429 Too Many Requests | ✓ |
| New signup | Any email | Verification code sent | ✓ |
| Combined flags | curl + test@ | High bot score | ✓ |

---

## Security Implementation Details

### Files Involved

1. **Bot Detection Middleware**
   - File: `server/src/middleware/botDetection.ts`
   - Functions: `detectBotActivity()`, `blockObviousBots()`
   - Patterns: User-agents, emails, headers, VPN/proxy detection

2. **Rate Limiting Middleware**
   - File: `server/src/middleware/rateLimiter.ts`
   - Limit: 5 attempts per 15 minutes per IP
   - Returns: 429 status code when exceeded

3. **Email Verification Middleware**
   - File: `server/src/middleware/emailVerification.ts`
   - Method: 6-digit codes, 10-minute expiration, 3-attempt limit
   - Prevents: Automated account creation and access

4. **Auth Routes**
   - File: `server/src/routes/authRoutes.ts`
   - Middleware applied to: `/login` and `/signup` endpoints

---

## Defense Layers Summary

```
REQUEST RECEIVED
    ↓
1. Block Obvious Bots (User-Agent check)
    ├─ curl? → BLOCK
    ├─ wget? → BLOCK
    ├─ Headless? → BLOCK
    └─ Pass? ↓
2. Calculate Bot Score
    ├─ Email patterns? +20 points
    ├─ Missing headers? +10 points
    ├─ VPN/Proxy? +15 points
    └─ Score >50? → BLOCK (403)
3. Rate Limiting
    ├─ >5 attempts/15min? → BLOCK (429)
    └─ Pass? ↓
4. Email Verification (Signup only)
    ├─ Send 6-digit code
    ├─ Verify before login
    └─ Block after 3 wrong attempts
    
ALLOW REQUEST ✓
```

---

## Prevention of AI/LLM Agent Abuse

This protection specifically prevents:

- ✓ **Automated signups** - Bot detection + email verification
- ✓ **Brute force attacks** - Rate limiting + email codes
- ✓ **Scraping/crawling** - User-Agent detection + header validation
- ✓ **API abuse** - Rate limiting + bot scoring
- ✓ **Test account creation** - Suspicious email patterns
- ✓ **Headless automation** - Browser header detection + headless detection
- ✓ **Selenium/Puppeteer automation** - Headless browser detection
- ✓ **Curl/wget automation** - User-Agent blocking
- ✓ **Python script abuse** - Python user-agent detection

---

## Next Steps

To further enhance bot protection:

1. **Add CAPTCHA** - reCAPTCHA v3 or hCaptcha for signup
2. **Device Fingerprinting** - Detect suspicious device patterns
3. **Geographical Anomalies** - Flag logins from unusual locations
4. **Behavioral Analytics** - Track user behavior patterns
5. **API Key Rotation** - Require periodic key updates
6. **Two-Factor Authentication** - SMS or TOTP codes
7. **IP Reputation** - Check against known bot IP lists
8. **Machine Learning** - Train model on attack patterns

---

## Troubleshooting

**Q: My legitimate request is being blocked**
- A: Check that you have proper browser headers. Add:
  - `Accept-Language: en-US,en;q=0.9`
  - `Accept-Encoding: gzip, deflate`
  - `Referer: http://localhost:3000/`

**Q: I got a 429 error**
- A: You've exceeded the rate limit. Wait 15 minutes or use a different IP.

**Q: Email verification code not received**
- A: Check `server/email_logs.json` to see if code was generated. Ensure email service is configured.

**Q: How do I bypass bot protection for testing?**
- A: Use a real email (not test@) + proper browser headers + single request (no rapid retries).

---

## Resources

- [OWASP Bot Management](https://owasp.org/www-project-automated-threats/)
- [Protecting APIs from Bot Attacks](https://www.cloudflare.com/learning/bots/what-are-bot-attacks/)
- [Rate Limiting Best Practices](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)
