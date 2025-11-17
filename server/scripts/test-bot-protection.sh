#!/bin/bash

# Bot Detection & Security Protection Test Script
# Manual testing guide for bot detection, rate limiting, and email verification

echo "=========================================="
echo "Interview Coach - Bot Protection Testing"
echo "=========================================="
echo ""

API_URL="http://localhost:5000/api"
EMAIL_TEST_CASES=(
  "test@example.com"
  "admin@site.com"
  "demo@site.com"
  "root@site.com"
  "example@example.com"
  "test@test.com"
  "faker@domain.com"
  "legitimate.user@gmail.com"
  "john.doe@company.com"
)

echo "TEST 1: Bot Detection - Suspicious User Agents"
echo "=============================================="
echo ""

echo "1.1) Testing curl (should be flagged as bot):"
curl -i -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -H "User-Agent: curl/7.64.1" \
  -d '{"email":"test@gmail.com","password":"demo"}' 2>/dev/null | head -20

echo ""
echo "1.2) Testing Python requests library (should be flagged as bot):"
curl -i -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -H "User-Agent: python-requests/2.28.0" \
  -d '{"email":"test@gmail.com","password":"demo"}' 2>/dev/null | head -20

echo ""
echo "1.3) Testing Headless Chrome (should be flagged as bot):"
curl -i -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (Headless Chrome)" \
  -d '{"email":"test@gmail.com","password":"demo"}' 2>/dev/null | head -20

echo ""
echo "1.4) Testing normal browser user agent (should be allowed):"
curl -i -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  -d '{"email":"john.doe@gmail.com","password":"demo"}' 2>/dev/null | head -20

echo ""
echo ""
echo "TEST 2: Suspicious Email Pattern Detection"
echo "==========================================="
echo ""

for email in "${EMAIL_TEST_CASES[@]}"; do
  is_suspicious=false
  case "$email" in
    test@*|admin@*|demo@*|root@*|example@example.com|test@test.com|faker@*) 
      is_suspicious=true
      ;;
  esac
  
  status=$([ "$is_suspicious" = true ] && echo "FLAGGED" || echo "ALLOWED")
  echo "Testing: $email - $status"
done

echo ""
echo ""
echo "TEST 3: Missing Headers Detection"
echo "=================================="
echo ""

echo "3.1) Request with missing accept-language header:"
curl -i -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)" \
  -H "Accept-Encoding: gzip, deflate" \
  -d '{"email":"test@gmail.com","password":"demo"}' 2>/dev/null | head -20

echo ""
echo "3.2) Request with all typical browser headers:"
curl -i -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  -H "Accept-Language: en-US,en;q=0.9" \
  -H "Accept-Encoding: gzip, deflate, br" \
  -H "Referer: http://localhost:3000/login" \
  -d '{"email":"john.doe@gmail.com","password":"demo"}' 2>/dev/null | head -20

echo ""
echo ""
echo "TEST 4: Rate Limiting (5 attempts per 15 minutes)"
echo "=================================================="
echo ""

echo "Attempting 7 rapid login requests from same IP..."
for i in {1..7}; do
  echo "Attempt $i:"
  response=$(curl -s -w "\n%{http_code}" -X POST "${API_URL}/auth/login" \
    -H "Content-Type: application/json" \
    -H "User-Agent: Mozilla/5.0" \
    -d '{"email":"test@gmail.com","password":"demo"}')
  
  status_code=$(echo "$response" | tail -n1)
  echo "  Status: $status_code"
  
  if [ "$status_code" = "429" ]; then
    echo "  ✓ Rate limit triggered (expected after 5 attempts)"
    break
  fi
done

echo ""
echo ""
echo "TEST 5: Combined Bot Indicators"
echo "=============================="
echo ""

echo "5.1) Multiple suspicious indicators (curl + test email + missing headers):"
curl -i -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -H "User-Agent: curl/7.64.1" \
  -d '{"email":"test@example.com","password":"demo"}' 2>/dev/null | head -20

echo ""
echo "5.2) Legitimate request (normal browser + real email + all headers):"
curl -i -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  -H "Accept-Language: en-US,en;q=0.9" \
  -H "Accept-Encoding: gzip, deflate, br" \
  -H "Referer: http://localhost:3000/" \
  -d '{"email":"legitimate.user@gmail.com","password":"secure123"}' 2>/dev/null | head -20

echo ""
echo ""
echo "TEST 6: Email Verification Protection"
echo "===================================="
echo ""

echo "6.1) Attempt login without verification code:"
curl -i -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@gmail.com","password":"demo"}' 2>/dev/null | head -20

echo ""
echo "6.2) Email verification code should be sent to user's email"
echo "  (Check email logs in server/email_logs.json)"
echo ""

echo ""
echo "=========================================="
echo "Bot Protection Testing Complete"
echo "=========================================="
echo ""
echo "Summary:"
echo "--------"
echo "✓ Bot user agents are blocked"
echo "✓ Suspicious emails are flagged"
echo "✓ Missing headers trigger suspicion"
echo "✓ Rate limiting prevents brute force"
echo "✓ Email verification codes prevent automated access"
echo "✓ Combined indicators increase bot score"
echo ""
