import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { quizQuestions, calculateResult } from '../data/QuizData';
import { getStreamExplanation } from '../Services/geminiService';

export default function Quiz({ user, onQuizComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [aiExplanation, setAiExplanation] = useState('');
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  const question = quizQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;

  function handleSelectOption(optionIndex) {
    setSelectedOption(optionIndex);
  }

  function handleNext() {
    if (selectedOption === null) {
      alert('Please select an answer before continuing');
      return;
    }

    
    const newAnswers = [...answers, question.options[selectedOption]];
    setAnswers(newAnswers);

    if (isLastQuestion) {
      
      const result = calculateResult(newAnswers);
      setResults(result);
      setShowResults(true);
      saveResultToDatabase(result);
      
      
      setLoadingExplanation(true);
      getStudentDataAndGenerateExplanation(newAnswers, result);
    } else {
      
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    }
  }

  function handleBack() {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
      setSelectedOption(null);
    }
  }

  async function saveResultToDatabase(result) {
    await supabase
      .from('students')
      .update({ 
        aptitude_score: result,
        stream: result.topStream 
      })
      .eq('id', user.id);
  }

  async function getStudentDataAndGenerateExplanation(answersArray, result) {
    // Get student's name and language from database
    const { data } = await supabase
      .from('students')
      .select('full_name, language')
      .eq('id', user.id)
      .single();

    const studentName = data?.full_name || 'Student';
    const language = data?.language || 'English';

    // Generate AI explanation
    const explanation = await getStreamExplanation(answersArray, result, language, studentName);
    setAiExplanation(explanation);
    setLoadingExplanation(false);
  }

  if (showResults) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#faf8f3',
        padding: 32,
        fontFamily: 'sans-serif'
      }}>
        <div style={{
          maxWidth: 600,
          margin: '0 auto',
          background: 'white',
          borderRadius: 16,
          padding: 40,
          border: '1px solid #e2d9c8'
        }}>
          <h1 style={{ fontSize: '1.8rem', color: '#0f1923', marginBottom: 8, textAlign: 'center' }}>
            🎯 Your Results
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: 32, textAlign: 'center' }}>
            Based on your answers, here's your stream match
          </p>

          <div style={{ marginBottom: 32 }}>
            {Object.entries(results.percentages).map(([stream, percentage]) => (
              <div key={stream} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'capitalize' }}>
                    {stream === 'science' ? '🔬 Science' : 
                     stream === 'commerce' ? '📊 Commerce' :
                     stream === 'arts' ? '🎭 Arts' : '🛠️ Vocational'}
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f97316' }}>
                    {percentage}%
                  </span>
                </div>
                <div style={{
                  height: 12,
                  background: '#e2d9c8',
                  borderRadius: 100,
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${percentage}%`,
                    background: stream === results.topStream ? '#f97316' : '#6b7280',
                    borderRadius: 100,
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: '#fff7ed',
            border: '2px solid #fdba74',
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f97316', marginBottom: 4 }}>
              ✨ {results.topStream.charAt(0).toUpperCase() + results.topStream.slice(1)} Stream
            </p>
            <p style={{ fontSize: '0.9rem', color: '#9a3412' }}>
              Best match for your interests and strengths!
            </p>
          </div>

          {loadingExplanation && (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 12,
              padding: 20,
              marginBottom: 24,
              textAlign: 'center',
              color: '#166534'
            }}>
              💬 Generating your personalized guidance...
            </div>
          )}

          {aiExplanation && !loadingExplanation && (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 12,
              padding: 20,
              marginBottom: 24
            }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#166534', marginBottom: 8 }}>
                💬 Your Personalized Guidance
              </p>
              <p style={{ fontSize: '0.95rem', color: '#166534', lineHeight: 1.6 }}>
                {aiExplanation}
              </p>
            </div>
          )}

          <button
            onClick={onQuizComplete}
            style={{
              width: '100%',
              padding: 14,
              background: '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Continue to Dashboard →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#faf8f3',
      padding: 32,
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        maxWidth: 600,
        margin: '0 auto',
        background: 'white',
        borderRadius: 16,
        padding: 40,
        border: '1px solid #e2d9c8'
      }}>
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: 8 }}>
            Question {currentQuestion + 1} of {quizQuestions.length}
          </p>
          <div style={{
            height: 4,
            background: '#e2d9c8',
            borderRadius: 100,
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%`,
              background: '#f97316',
              borderRadius: 100
            }} />
          </div>
        </div>

        <h2 style={{ fontSize: '1.3rem', color: '#0f1923', marginBottom: 24, lineHeight: 1.4 }}>
          {question.question}
        </h2>

        <div style={{ marginBottom: 32 }}>
          {question.options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleSelectOption(index)}
              style={{
                padding: 16,
                marginBottom: 12,
                border: `2px solid ${selectedOption === index ? '#f97316' : '#e2d9c8'}`,
                background: selectedOption === index ? '#fff7ed' : 'white',
                borderRadius: 10,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  border: `2px solid ${selectedOption === index ? '#f97316' : '#e2d9c8'}`,
                  background: selectedOption === index ? '#f97316' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: selectedOption === index ? 'white' : '#6b7280'
                }}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span style={{ fontSize: '0.95rem', color: '#0f1923' }}>
                  {option.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {currentQuestion > 0 && (
            <button
              onClick={handleBack}
              style={{
                flex: 1,
                padding: 12,
                background: 'transparent',
                color: '#6b7280',
                border: '2px solid #e2d9c8',
                borderRadius: 10,
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={selectedOption === null}
            style={{
              flex: 2,
              padding: 12,
              background: selectedOption === null ? '#9ca3af' : '#f97316',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: selectedOption === null ? 'not-allowed' : 'pointer'
            }}
          >
            {isLastQuestion ? 'See Results →' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}