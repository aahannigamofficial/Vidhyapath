const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

export async function getStreamExplanation(answers, result, language, studentName) {
  const answerSummary = answers.map((ans, i) => `Q${i+1}: ${ans.text}`).join('\n');

  const prompt = `You are a warm, encouraging career counselor for Indian government college students.
Respond ONLY in ${language}. Keep it to exactly 3 sentences. Be specific and hopeful.

A student named ${studentName} just completed an aptitude quiz. Here are their results:
- Top stream match: ${result.topStream} (${result.percentages[result.topStream]}%)
- Science: ${result.percentages.science}%
- Commerce: ${result.percentages.commerce}%
- Arts: ${result.percentages.arts}%
- Vocational: ${result.percentages.vocational}%

Their answers were:
${answerSummary}

Write a personalized recommendation that:
1. Acknowledges their specific interests from their answers
2. Explains why ${result.topStream} is their best stream
3. Names ONE specific degree they should consider (like B.Sc. Biology, B.Com., B.A. History)
4. Mentions ONE real career path it leads to in India

Keep it warm, personal, and exactly 3 sentences. Use ${language} language only.`;

  try {
    // Use cors-anywhere proxy for development
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(proxyUrl + apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: prompt }] 
        }]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]) {
      return data.candidates[0].content.parts[0].text;
    } else {
      return generateFallbackMessage(result, studentName, language);
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    return generateFallbackMessage(result, studentName, language);
  }
}

function generateFallbackMessage(result, studentName, language) {
  const messages = {
    'English': `${studentName}, your results show strong potential in ${result.topStream}! This stream aligns well with your interests and can open doors to many career opportunities. Consider exploring degree programs in this field at nearby government colleges.`,
    'हिन्दी (Hindi)': `${studentName}, आपके परिणाम ${result.topStream} में मजबूत क्षमता दिखाते हैं! यह स्ट्रीम आपकी रुचियों के साथ अच्छी तरह मेल खाता है और कई करियर के अवसर खोल सकता है। नजदीकी सरकारी कॉलेजों में इस क्षेत्र में डिग्री कार्यक्रमों का अन्वेषण करें।`
  };
  
  return messages[language] || messages['English'];
}