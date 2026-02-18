export const quizQuestions = [
  {
    id: 1,
    question: 'Which activity energizes you the most?',
    options: [
      { 
        text: '🔬 Experiments and discovering how things work',
        scores: { science: 3, commerce: 1, arts: 0, vocational: 1 }
      },
      { 
        text: '📊 Working with numbers and financial data',
        scores: { science: 1, commerce: 3, arts: 0, vocational: 1 }
      },
      { 
        text: '🎨 Creating art, writing, or expressing ideas',
        scores: { science: 0, commerce: 0, arts: 3, vocational: 2 }
      },
      { 
        text: '🛠️ Building or fixing things with your hands',
        scores: { science: 1, commerce: 0, arts: 1, vocational: 3 }
      }
    ]
  },
  {
    id: 2,
    question: 'Which school subject feels the easiest to you?',
    options: [
      { 
        text: '🧬 Biology, Physics, or Chemistry',
        scores: { science: 3, commerce: 0, arts: 0, vocational: 0 }
      },
      { 
        text: '📐 Mathematics or Economics',
        scores: { science: 2, commerce: 3, arts: 0, vocational: 1 }
      },
      { 
        text: '📜 History, Hindi, or Geography',
        scores: { science: 0, commerce: 0, arts: 3, vocational: 0 }
      },
      { 
        text: '💻 Computers or Workshop',
        scores: { science: 1, commerce: 1, arts: 0, vocational: 3 }
      }
    ]
  },
  {
    id: 3,
    question: 'If you could have any career, which would excite you most?',
    options: [
      { 
        text: '🏥 Doctor, Engineer, or Scientist',
        scores: { science: 3, commerce: 0, arts: 0, vocational: 0 }
      },
      { 
        text: '💼 Businessperson, Banker, or CA',
        scores: { science: 0, commerce: 3, arts: 0, vocational: 1 }
      },
      { 
        text: '⚖️ Lawyer, Teacher, or Journalist',
        scores: { science: 0, commerce: 0, arts: 3, vocational: 0 }
      },
      { 
        text: '🔧 Electrician, Chef, or IT Technician',
        scores: { science: 0, commerce: 1, arts: 0, vocational: 3 }
      }
    ]
  },
  {
    id: 4,
    question: 'How do you prefer to solve problems?',
    options: [
      { 
        text: '🔭 By testing and observing results',
        scores: { science: 3, commerce: 1, arts: 0, vocational: 2 }
      },
      { 
        text: '📈 By analyzing data and making plans',
        scores: { science: 1, commerce: 3, arts: 0, vocational: 0 }
      },
      { 
        text: '📝 By discussing and writing about it',
        scores: { science: 0, commerce: 0, arts: 3, vocational: 0 }
      },
      { 
        text: '⚙️ By trying it hands-on immediately',
        scores: { science: 1, commerce: 0, arts: 1, vocational: 3 }
      }
    ]
  },
  {
    id: 5,
    question: 'What do you want your work life to look like?',
    options: [
      { 
        text: '🔬 Lab, research, or technical work',
        scores: { science: 3, commerce: 0, arts: 0, vocational: 1 }
      },
      { 
        text: '🏢 Office, markets, or financial world',
        scores: { science: 0, commerce: 3, arts: 0, vocational: 0 }
      },
      { 
        text: '🌍 Writing, travel, courts, or teaching',
        scores: { science: 0, commerce: 0, arts: 3, vocational: 0 }
      },
      { 
        text: '🏭 Workshop, kitchen, or field work',
        scores: { science: 0, commerce: 0, arts: 0, vocational: 3 }
      }
    ]
  }
];

// This function calculates the final result
export function calculateResult(answers) {
  // Start with zero points for each stream
  const totals = { science: 0, commerce: 0, arts: 0, vocational: 0 };
  
  // Add up points from each answer
  answers.forEach(answer => {
    totals.science += answer.scores.science;
    totals.commerce += answer.scores.commerce;
    totals.arts += answer.scores.arts;
    totals.vocational += answer.scores.vocational;
  });
  
  // Calculate total points across all streams
  const totalPoints = totals.science + totals.commerce + totals.arts + totals.vocational;
  
  // Convert to percentages
  const percentages = {
    science: Math.round((totals.science / totalPoints) * 100),
    commerce: Math.round((totals.commerce / totalPoints) * 100),
    arts: Math.round((totals.arts / totalPoints) * 100),
    vocational: Math.round((totals.vocational / totalPoints) * 100)
  };
  
  // Find the top stream
  const topStream = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  return { percentages, topStream, totals };
}