import { colleges } from '../data/collegesData';

export function getRecommendedColleges(studentProfile, studentQuizResult) {
  const { district, state, stream } = studentProfile;
  const topStream = studentQuizResult?.topStream || stream;

  // Step 1: Filter eligible colleges
  let eligibleColleges = colleges.filter(college => {
    // Must be in same state or nearby states
    const isAccessible = college.state === state;
    
    // Must offer programs matching the student's stream
    const hasRelevantProgram = college.programs.some(program => {
      if (topStream === 'science') return program.includes('B.Sc.') || program.includes('B.Tech');
      if (topStream === 'commerce') return program.includes('B.Com.') || program.includes('BBA');
      if (topStream === 'arts') return program.includes('B.A.') || program.includes('LLB');
      if (topStream === 'vocational') return program.includes('B.Voc.');
      return true;
    });
    
    return isAccessible && hasRelevantProgram;
  });

  // Step 2: Score each college
  eligibleColleges = eligibleColleges.map(college => {
    let score = 0;
    
    // Distance score (same district = +50 points)
    if (college.district === district) score += 50;
    else if (college.state === state) score += 20;
    
    // Facilities score
    if (college.hasHostel) score += 10;
    if (college.hasGirlsHostel) score += 10;
    if (college.scholarshipAvailable) score += 15;
    if (college.hasLab) score += 8;
    if (college.hasInternet) score += 5;
    
    // Seat availability (more seats = better chance)
    score += Math.min(college.totalSeats / 50, 20);
    
    // Lower cutoff = easier to get in
    score += (100 - college.cutoffPercentage) / 2;
    
    // Established reputation (older = more established)
    const age = new Date().getFullYear() - college.establishedYear;
    score += Math.min(age / 10, 15);
    
    return { ...college, matchScore: Math.round(score) };
  });

  // Step 3: Sort by score and take top 3
  eligibleColleges.sort((a, b) => b.matchScore - a.matchScore);
  const topColleges = eligibleColleges.slice(0, 3);

  // Step 4: Generate personalized reasons
  return topColleges.map(college => ({
    ...college,
    recommendationReason: generateRecommendationReason(college, studentProfile, studentQuizResult)
  }));
}

function generateRecommendationReason(college, studentProfile, quizResult) {
  const { district, stream, full_name, language } = studentProfile;
  const topStream = quizResult?.topStream || stream;
  const matchPercentage = quizResult?.percentages?.[topStream] || 75;
  
  const isLocal = college.district === district;
  const distance = isLocal ? 'right in your district' : `in ${college.district}`;
  
  // Build reason based on college features
  let reason = `Located ${distance}`;
  
  // Mention relevant program
  const relevantPrograms = college.programs.filter(p => {
    if (topStream === 'science') return p.includes('B.Sc.') || p.includes('B.Tech');
    if (topStream === 'commerce') return p.includes('B.Com.') || p.includes('BBA');
    if (topStream === 'arts') return p.includes('B.A.');
    return true;
  });
  
  if (relevantPrograms.length > 0) {
    reason += ` with ${relevantPrograms.join(', ')} programs that align perfectly with your ${topStream} stream`;
  }
  
  // Mention facilities
  const facilities = [];
  if (college.hasHostel) facilities.push('hostel accommodation');
  if (college.hasGirlsHostel) facilities.push('girls hostel');
  if (college.scholarshipAvailable) facilities.push('scholarship opportunities');
  
  if (facilities.length > 0) {
    reason += `. Offers ${facilities.join(', ')}`;
  }
  
  // Mention cutoff
  reason += `. The ${college.cutoffPercentage}% cutoff is achievable`;
  
  // Add reputation note
  const age = new Date().getFullYear() - college.establishedYear;
  if (age > 50) {
    reason += `, and it's a well-established institution with ${age}+ years of academic excellence`;
  }
  
  reason += '.';
  
  return reason;
}