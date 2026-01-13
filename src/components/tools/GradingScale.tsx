import React, { useState } from 'react';

const GRADING_SCALE = [
  { threshold: 85, letter: "A", color: "#28a745", range: "85-100" },
  { threshold: 80, letter: "A-", color: "#28a745", range: "80-84" },
  { threshold: 75, letter: "B+", color: "#007bff", range: "75-79" },
  { threshold: 70, letter: "B", color: "#007bff", range: "70-74" },
  { threshold: 65, letter: "B-", color: "#007bff", range: "65-69" },
  { threshold: 60, letter: "C+", color: "#fd7e14", range: "60-64" },
  { threshold: 55, letter: "C", color: "#fd7e14", range: "55-59" },
  { threshold: 45, letter: "D", color: "#dc3545", range: "45-54" },
  { threshold: 0, letter: "E", color: "#dc3545", range: "0-44" }
];

const GRADE_POINTS: Record<string, number> = {
  'A': 4.00, 'A-': 3.70, 'B+': 3.30, 'B': 3.00, 'B-': 2.70,
  'C+': 2.30, 'C': 2.00, 'D': 1.00, 'E': 0.00
};

export const GradingScale: React.FC = () => {
  const [quickCheckScore, setQuickCheckScore] = useState<string>('');
  const [quickCheckResult, setQuickCheckResult] = useState<any>(null);

  const getGradeInfo = (score: number) => {
    for (const grade of GRADING_SCALE) {
      if (score >= grade.threshold) {
        return grade;
      }
    }
    return GRADING_SCALE[GRADING_SCALE.length - 1];
  };

  const handleQuickCheck = (value: string) => {
    setQuickCheckScore(value);
    
    if (value) {
      const score = parseFloat(value);
      if (!isNaN(score) && score >= 0 && score <= 100) {
        const gradeInfo = getGradeInfo(score);
        setQuickCheckResult(gradeInfo);
      } else {
        setQuickCheckResult(null);
      }
    } else {
      setQuickCheckResult(null);
    }
  };

  return (
    <div className="tool-component">
      {/* Quick Grade Checker */}
      <div className="tool-section">
        <h4 className="tool-section-title">Quick Grade Checker</h4>
        
        <div className="tool-card">
          <div className="tool-card-content">
            <div className="tool-input-group">
              <label className="tool-label">Enter your score (0-100):</label>
              <input
                type="number"
                value={quickCheckScore}
                onChange={(e) => handleQuickCheck(e.target.value)}
                className="tool-input"
                placeholder="e.g., 87.5"
                step="0.1"
                min="0"
                max="100"
              />
            </div>
            
            {quickCheckResult && (
              <div className="tool-result-box" style={{ marginTop: '10px' }}>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: 'bold', 
                  color: quickCheckResult.color,
                  marginBottom: '5px'
                }}>
                  {quickCheckScore}% = {quickCheckResult.letter}
                </div>
                <div style={{ fontSize: '9px', color: '#666', marginTop: '5px' }}>
                  Grade Points: {GRADE_POINTS[quickCheckResult.letter]?.toFixed(2) || 'N/A'}
                </div>
                {parseFloat(quickCheckScore) < 55 && (
                  <div style={{
                    fontSize: '11px',
                    color: '#dc3545',
                    fontWeight: 'bold',
                    marginTop: '8px',
                    padding: '6px',
                    background: '#f8d7da',
                    border: '1px solid #f5c6cb',
                    borderRadius: '4px'
                  }}>
                    FAILED - Score below passing threshold (C = 55%)
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complete Grading Scale */}
      <div className="tool-section">
        <h4 className="tool-section-title">Complete Grading Scale</h4>
        
        <div style={{ marginBottom: '15px' }}>
          {GRADING_SCALE.map((grade) => (
            <div
              key={grade.letter}
              className="tool-card"
              style={{ 
                marginBottom: '6px',
                border: quickCheckResult?.letter === grade.letter ? `2px solid ${grade.color}` : '1px solid #D9D7E0'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      backgroundColor: grade.color,
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      minWidth: '35px',
                      textAlign: 'center'
                    }}>
                      {grade.letter}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', fontWeight: 'bold' }}>
                        {grade.range}%
                      </div>
                      <div style={{ fontSize: '9px', color: '#666', marginTop: '2px' }}>
                        GPA: {GRADE_POINTS[grade.letter]?.toFixed(2) || 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    fontSize: '10px', 
                    color: '#666', 
                    fontStyle: 'italic',
                    marginTop: '5px'
                  }}>
                    Grade Range: {grade.range}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Tools */}
      <div className="tool-section">
        <h4 className="tool-section-title">Quick References</h4>
        
        <div className="tool-grid">
          <div className="tool-card">
            <div className="tool-card-title">Perfect Scores</div>
            <div className="tool-card-content" style={{ fontSize: '9px', lineHeight: '1.4' }}>
              <strong>A:</strong> 85%+ (4.0 GPA)<br />
              <strong>B:</strong> 70%+ (3.0 GPA)<br />
              <strong>C:</strong> 55%+ (2.0 GPA)<br />
              <strong>Pass:</strong> 45%+ (1.0 GPA)
            </div>
          </div>
          
          <div className="tool-card">
            <div className="tool-card-title">GPA Impact</div>
            <div className="tool-card-content" style={{ fontSize: '9px', lineHeight: '1.4' }}>
              Each A- instead of A costs<br />
              <strong>0.3 GPA points</strong><br /><br />
              Each B+ instead of A costs<br />
              <strong>0.7 GPA points</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Final Motivational Note */}
      <div style={{ 
        marginTop: '15px', 
        fontSize: '10px', 
        color: '#666', 
        fontStyle: 'italic',
        textAlign: 'center',
        padding: '10px',
        background: '#F7F6F9',
        borderRadius: '8px',
        border: '1px dotted #C59667'
      }}>
        Remember: grades are just numbers - what matters most is what you learn and how you grow!
        Every grade is a stepping stone to becoming better.
      </div>
    </div>
  );
};