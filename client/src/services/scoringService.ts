import { PersonalityMode } from '../components/PersonalitySelector';

export interface AnswerScoring {
  questionIndex: number;
  question: string;
  answer: string;
  score: number; // 0-10 scale
  feedback: string;
  personality: PersonalityMode;
}

export interface CVStrengthAnalysis {
  overallStrength: number; // 0-10 scale
  strengths: string[];
  weaknesses: string[];
  alignment: number; // 0-100 CV-to-JobSpec alignment
  feedback: string;
  personality: PersonalityMode;
}

/**
 * Score individual answers on a 0-10 scale
 * Factors: Relevance, Specificity, Technical Depth, Length, Examples
 */
export function scoreAnswer(
  question: string,
  answer: string,
  jobSpec: string = '',
  personality: PersonalityMode = 'supportive'
): AnswerScoring {
  let score = 0;

  // 1. Length analysis (0-2 points) - Longer, thoughtful answers
  const wordCount = answer.trim().split(/\s+/).length;
  if (wordCount > 150) score += 2;
  else if (wordCount > 80) score += 1.5;
  else if (wordCount > 30) score += 0.5;

  // 2. Specificity check (0-2 points) - Look for specific examples, numbers, technologies
  const specificPatterns = /\b(example|specifically|for instance|such as|implemented|developed|created|built|designed)\b/gi;
  const specificity = (answer.match(specificPatterns) || []).length;
  score += Math.min(specificity * 0.5, 2);

  // 3. Technology/Keyword alignment (0-2 points) - Match job spec keywords
  if (jobSpec) {
    const jobKeywords = jobSpec
      .toLowerCase()
      .split(/[\s,;.]+/)
      .filter((w) => w.length > 4);
    const answerWords = answer.toLowerCase().split(/\s+/);
    const matches = answerWords.filter((w) => jobKeywords.includes(w)).length;
    score += Math.min(matches * 0.3, 2);
  }

  // 4. Question relevance (0-2 points) - Answer addresses the question
  const questionKeywords = question
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 4);
  const relevantWords = answer
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => questionKeywords.includes(w)).length;
  if (relevantWords >= questionKeywords.length * 0.5) score += 2;
  else if (relevantWords >= questionKeywords.length * 0.3) score += 1;

  // 5. Depth check (0-2 points) - Look for explanations, reasoning
  const depthPatterns =
    /\b(because|reason|approach|solution|challenge|overcame|learned|improve|strategy)\b/gi;
  const depth = (answer.match(depthPatterns) || []).length;
  score += Math.min(depth * 0.4, 2);

  // Cap score at 10
  const finalScore = Math.min(Math.round(score * 10) / 10, 10);

  // Generate personality-specific feedback
  const feedback = generateAnswerFeedback(
    finalScore,
    question,
    answer,
    wordCount,
    specificity,
    personality
  );

  return {
    questionIndex: 0,
    question,
    answer,
    score: finalScore,
    feedback,
    personality,
  };
}

function generateAnswerFeedback(
  score: number,
  question: string,
  answer: string,
  wordCount: number,
  specificityCount: number,
  personality: PersonalityMode
): string {
  if (personality === 'direct') {
    if (score >= 8) {
      return `✅ Strong answer (${score}/10). Specific and relevant. Maintain this quality.`;
    } else if (score >= 6.5) {
      return `⚠️ Good (${score}/10), but could be stronger. Add more specific examples or metrics. Include concrete technologies or outcomes you achieved.`;
    } else if (score >= 5) {
      return `❌ Needs work (${score}/10). Your answer is too vague. Include specific examples, technologies, or measurable results. Show concrete evidence, not just concepts.`;
    } else if (score >= 2.5) {
      return `🔴 Weak response (${score}/10). This lacks substance and specifics. Add real examples, detailed context, or metrics to strengthen your answer.`;
    } else {
      return `🔴 Off-topic (${score}/10). Your answer doesn't directly address the question. Refocus and answer what was asked.`;
    }
  } else {
    // Supportive feedback
    if (score >= 8) {
      return `✅ Excellent answer (${score}/10)! Your specific examples really demonstrate your experience. Keep that energy!`;
    } else if (score >= 6.5) {
      return `✓ Good foundation (${score}/10)! You're on the right track. Try adding one more concrete example or metric to make it even stronger.`;
    } else if (score >= 5) {
      return `○ You've got the right idea (${score}/10). Let's strengthen this by including specific technologies, projects, or numbers. This will really showcase your capabilities!`;
    } else if (score >= 2.5) {
      return `○ This is a start (${score}/10). Take a moment to think of a specific project or example you can share. More detail will help you stand out!`;
    } else {
      return `○ I see you're thinking (${score}/10). Let's refocus on the question and share a real example. You've got great experience—let it shine!`;
    }
  }
}

/**
 * Analyze CV strength against job spec
 */
export function analyzeCV(
  cv: string,
  jobSpec: string,
  personality: PersonalityMode = 'supportive'
): CVStrengthAnalysis {
  // Extract keywords from job spec
  const jobKeywords = extractKeywords(jobSpec, 5);
  const requiredTechnologies = jobKeywords.filter((kw) =>
    /\b(javascript|typescript|react|vue|angular|python|java|c\+\+|sql|aws|azure|docker|kubernetes)\b/i.test(kw)
  );

  // Extract skills from CV
  const cvSkills = extractKeywords(cv, 4);
  const cvTechnologies = cvSkills.filter((sk) =>
    /\b(javascript|typescript|react|vue|angular|python|java|c\+\+|sql|aws|azure|docker|kubernetes)\b/i.test(sk)
  );

  // Calculate alignment
  const matchedTechs = cvTechnologies.filter((tech) =>
    requiredTechnologies.some((req) => req.includes(tech) || tech.includes(req))
  );

  const techAlignment =
    requiredTechnologies.length > 0
      ? (matchedTechs.length / requiredTechnologies.length) * 100
      : 50;

  // Calculate overall strength
  const hasExperience = /\b(experience|worked|developed|led|managed|created|built)\b/i.test(cv);
  const hasEducation =
    /\b(bachelor|master|phd|degree|certification|bootcamp|university|college)\b/i.test(cv);
  const hasProjects = /\b(project|portfolio|github|deployed|shipped|launched)\b/i.test(cv);
  const hasMetrics = /\b(improved|increased|reduced|optimized|scaled|performance)\b/i.test(cv);

  let overallStrength = 5;
  if (hasExperience) overallStrength += 1;
  if (hasEducation) overallStrength += 1;
  if (hasProjects) overallStrength += 1;
  if (hasMetrics) overallStrength += 1;
  if (techAlignment > 80) overallStrength += 1;

  overallStrength = Math.min(overallStrength, 10);

  // Identify strengths and weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (hasExperience) strengths.push('Clear professional experience');
  else weaknesses.push('Limited work experience mentioned');

  if (hasMetrics) strengths.push('Results-oriented with quantified achievements');
  else weaknesses.push('Lacks quantified metrics and impact');

  if (techAlignment > 70)
    strengths.push(`Strong tech alignment (${Math.round(techAlignment)}%)`);
  else
    weaknesses.push(`Low tech alignment (${Math.round(techAlignment)}%) - missing key skills`);

  if (hasProjects) strengths.push('Demonstrates portfolio/projects');
  else weaknesses.push('No portfolio or projects mentioned');

  if (cvSkills.length > 15) strengths.push('Diverse skill set');
  else if (cvSkills.length < 5) weaknesses.push('Limited technical skills listed');

  // Generate personality-specific feedback
  const feedback = generateCVFeedback(
    overallStrength,
    Math.round(techAlignment),
    strengths,
    weaknesses,
    personality
  );

  return {
    overallStrength,
    strengths,
    weaknesses,
    alignment: Math.round(techAlignment),
    feedback,
    personality,
  };
}

function generateCVFeedback(
  strength: number,
  alignment: number,
  strengths: string[],
  weaknesses: string[],
  personality: PersonalityMode
): string {
  if (personality === 'direct') {
    if (strength >= 8 && alignment >= 80) {
      return `✅ Your CV is strong (${strength}/10, ${alignment}% job alignment). Well-positioned for this role.`;
    } else if (strength >= 6 && alignment >= 60) {
      return `⚠️ Your CV is solid (${strength}/10, ${alignment}% alignment), but there are gaps. Consider adding key technologies or achievements that align with the role.`;
    } else if (strength >= 4 && alignment >= 40) {
      return `❌ Your CV needs improvement (${strength}/10, ${alignment}% alignment). You're missing relevant experience. Consider building experience in key areas or tailoring your CV better.`;
    } else {
      return `🔴 Your CV is not a good fit (${strength}/10, ${alignment}% alignment). Significant gaps in alignment. Gain more relevant experience before applying to similar roles.`;
    }
  } else {
    // Supportive feedback
    if (strength >= 8 && alignment >= 80) {
      return `✅ Excellent CV! (${strength}/10, ${alignment}% job alignment). You're a great match for this role!`;
    } else if (strength >= 6 && alignment >= 60) {
      return `✓ Good CV foundation! (${strength}/10, ${alignment}% alignment). With a few additions—like highlighting some of the mentioned skills or adding metrics—you'll be very competitive.`;
    } else if (strength >= 4 && alignment >= 40) {
      return `○ You have potential! (${strength}/10, ${alignment}% alignment). Consider adding more specific projects, skills, or achievements. Every addition brings you closer to being a strong candidate!`;
    } else {
      return `○ Let's strengthen this together! (${strength}/10, ${alignment}% alignment). Add more details about your work, projects, and the impact you've had. You have more to offer than you think!`;
    }
  }
}

function extractKeywords(text: string, minLength: number): string[] {
  return text
    .toLowerCase()
    .split(/[\s,;.:—\-/()]+/)
    .filter((word) => word.length >= minLength && !isStopWord(word))
    .filter((word, index, arr) => arr.indexOf(word) === index);
}

function isStopWord(word: string): boolean {
  const stopWords = [
    'the',
    'and',
    'for',
    'with',
    'from',
    'have',
    'that',
    'this',
    'your',
    'their',
    'which',
    'other',
    'about',
    'more',
    'been',
    'also',
    'are',
    'was',
    'been',
  ];
  return stopWords.includes(word);
}
