import React, { useState, useEffect } from 'react';

// grade scale mapping
const GRADE_SCALE = [
  { threshold: 85, letter: "A" },
  { threshold: 80, letter: "A-" },
  { threshold: 75, letter: "B+" },
  { threshold: 70, letter: "B" },
  { threshold: 65, letter: "B-" },
  { threshold: 60, letter: "C+" },
  { threshold: 55, letter: "C" },
  { threshold: 45, letter: "D" },
  { threshold: 0, letter: "E" }
];

const getLetterGrade = (score: number): string => {
  for (const grade of GRADE_SCALE){
    if (score >= grade.threshold){
      return grade.letter;
    }
  }
  return "E";
};

const calculateFinalGrade = (
  homework: number,
  midterm: number,
  finalExam: number,
  hwWeight: number,
  midWeight: number,
  finalWeight: number,
  fourthGrade?: number,
  fourthWeight: number = 0
): number => {
  const totalWeight = hwWeight + midWeight + finalWeight + fourthWeight;
  if (Math.abs(totalWeight - 100) > 0.01){
    throw new Error(`Weights must sum to 100%. Current sum: ${totalWeight}%`);
  }
  
  let grade = (homework * hwWeight/100) + (midterm * midWeight/100) + (finalExam * finalWeight/100);
  if (fourthGrade !== undefined && fourthWeight > 0){
    grade += (fourthGrade * fourthWeight/100);
  }
  
  return grade;
};

// progress bar w/ position indicator
const GradeProgressBar: React.FC<{ currentGrade: number }> = ({ currentGrade }) => {
  const calculateDotPosition = (grade: number) => {
    if (grade >= 85) return 100; // A range
    if (grade >= 70) return 60 + ((grade - 70) / 15) * 20; // B range
    if (grade >= 55) return 40 + ((grade - 55) / 15) * 20; // C range
    if (grade >= 45) return 20 + ((grade - 45) / 10) * 20; // D range
    return (grade / 45) * 20; // E range
  };

  const dotPosition = calculateDotPosition(currentGrade);

  return (
    <div style={{ marginTop: '15px' }}>
      <h5 style={{ fontSize: '11px', color: '#32343A', margin: '0 0 8px 0', fontWeight: 'bold' }}>
        Grade Scale Position:
      </h5>
      <div style={{ position: 'relative', padding: '10px 0' }}>
        {/* Scale bar */}
        <div style={{
          height: '8px',
          background: 'linear-gradient(to right, #dc3545 0%, #dc3545 20%, #fd7e14 20%, #fd7e14 40%, #ffc107 40%, #ffc107 60%, #007bff 60%, #007bff 80%, #28a745 80%, #28a745 100%)',
          borderRadius: '4px',
          position: 'relative'
        }}>
          {/* Position dot */}
          <div style={{
            position: 'absolute',
            top: '-4px',
            left: `${dotPosition}%`,
            width: '12px',
            height: '12px',
            background: '#333',
            borderRadius: '50%',
            transform: 'translateX(-50%)',
            border: '2px solid white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
          }} />
        </div>
        {/* Grade labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10px', color: '#666' }}>
          <span>E (0)</span>
          <span>D (45)</span>
          <span>C (55)</span>
          <span>B (70)</span>
          <span>A (85)</span>
        </div>
        <div style={{ textAlign: 'center', marginTop: '5px', fontSize: '11px', fontWeight: 'bold', color: '#32343A' }}>
          Your grade: {currentGrade.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

export const GradeCalculator: React.FC = () => {
  const [homework, setHomework] = useState<string>('');
  const [midterm, setMidterm] = useState<string>('');
  const [finalExam, setFinalExam] = useState<string>('');
  
  const [hwWeight, setHwWeight] = useState<string>('30');
  const [midWeight, setMidWeight] = useState<string>('30');
  const [finalWeight, setFinalWeight] = useState<string>('40');

  const [fourthEnabled, setFourthEnabled] = useState(false);
  const [fourthGrade, setFourthGrade] = useState<string>('');
  const [fourthWeight, setFourthWeight] = useState<string>('');

  const [labEnabled, setLabEnabled] = useState(false);
  const [labHomework, setLabHomework] = useState<string>('');
  const [labMidterm, setLabMidterm] = useState<string>('');
  const [labFinalExam, setLabFinalExam] = useState<string>('');
  const [labHwWeight, setLabHwWeight] = useState<string>('30');
  const [labMidWeight, setLabMidWeight] = useState<string>('30');
  const [labFinalWeight, setLabFinalWeight] = useState<string>('40');

  const [result, setResult] = useState<string>('');
  const [weightStatus, setWeightStatus] = useState<string>('');

  useEffect(() => {
    const hw = parseFloat(hwWeight) || 0;
    const mid = parseFloat(midWeight) || 0;
    const final = parseFloat(finalWeight) || 0;
    const fourth = fourthEnabled ? (parseFloat(fourthWeight) || 0) : 0;
    
    const theoryTotal = hw + mid + final + fourth;
    
    if (labEnabled){
      const labHw = parseFloat(labHwWeight) || 0;
      const labMid = parseFloat(labMidWeight) || 0;
      const labFinal = parseFloat(labFinalWeight) || 0;
      const labTotal = labHw + labMid + labFinal;
      
      if (Math.abs(theoryTotal - 100) < 0.01 && Math.abs(labTotal - 100) < 0.01){
        setWeightStatus(`Theory: ${theoryTotal.toFixed(1)}%, Lab: ${labTotal.toFixed(1)}% - Valid`);
      } else {
        setWeightStatus(`Theory: ${theoryTotal.toFixed(1)}%, Lab: ${labTotal.toFixed(1)}%`);
      }
    } else {
      if (Math.abs(theoryTotal - 100) < 0.01){
        setWeightStatus(`Total Weight: ${theoryTotal.toFixed(1)}% - Valid`);
      } else {
        setWeightStatus(`Total Weight: ${theoryTotal.toFixed(1)}%`);
      }
    }
  }, [hwWeight, midWeight, finalWeight, fourthWeight, labHwWeight, labMidWeight, labFinalWeight, fourthEnabled, labEnabled]);

  const handleCalculate = () => {
    try {
      const homeworkNum = parseFloat(homework);
      const midtermNum = parseFloat(midterm);
      const finalExamNum = parseFloat(finalExam);
      const hwWeightNum = parseFloat(hwWeight);
      const midWeightNum = parseFloat(midWeight);
      const finalWeightNum = parseFloat(finalWeight);

      if ([homeworkNum, midtermNum, finalExamNum, hwWeightNum, midWeightNum, finalWeightNum].some(isNaN)){
        setResult('Please fill in all required fields with valid numbers.');
        return;
      }

      let fourthGradeNum: number | undefined;
      let fourthWeightNum = 0;
      
      if (fourthEnabled){
        fourthGradeNum = parseFloat(fourthGrade);
        fourthWeightNum = parseFloat(fourthWeight);
        
        if (isNaN(fourthGradeNum) || isNaN(fourthWeightNum)){
          setResult('Please fill in fourth component values.');
          return;
        }
      }

      const theoryGrade = calculateFinalGrade(
        homeworkNum, midtermNum, finalExamNum,
        hwWeightNum, midWeightNum, finalWeightNum,
        fourthGradeNum, fourthWeightNum
      );

      if (labEnabled){
        const labHomeworkNum = parseFloat(labHomework);
        const labMidtermNum = parseFloat(labMidterm);
        const labFinalExamNum = parseFloat(labFinalExam);
        const labHwWeightNum = parseFloat(labHwWeight);
        const labMidWeightNum = parseFloat(labMidWeight);
        const labFinalWeightNum = parseFloat(labFinalWeight);

        if ([labHomeworkNum, labMidtermNum, labFinalExamNum, labHwWeightNum, labMidWeightNum, labFinalWeightNum].some(isNaN)){
          setResult('Please fill in all lab component fields.');
          return;
        }

        const labGrade = calculateFinalGrade(
          labHomeworkNum, labMidtermNum, labFinalExamNum,
          labHwWeightNum, labMidWeightNum, labFinalWeightNum
        );

        // 2/3 theory + 1/3 lab
        const finalGrade = (theoryGrade * 2/3) + (labGrade * 1/3);
        const letterGrade = getLetterGrade(finalGrade);
        
        setResult(`Final Grade: ${finalGrade.toFixed(2)}% (${letterGrade})
Theory: ${theoryGrade.toFixed(2)}%, Lab: ${labGrade.toFixed(2)}%`);
      } else {
        const letterGrade = getLetterGrade(theoryGrade);
        setResult(`Final Grade: ${theoryGrade.toFixed(2)}% (${letterGrade})`);
      }
      
    } catch (error: any){
      if (error.message.includes('Weights must sum to 100%')){
        setResult(`Weight Error: ${error.message}`);
      } else {
        setResult('Please enter valid numbers for all fields.');
      }
    }
  };

  return (
    <div className="tool-component">
      {/* Main Components */}
      <div className="tool-section">
        <h4 className="tool-section-title">Main Components</h4>
        
        <div className="tool-grid">
          <div className="tool-input-group">
            <label className="tool-label">Homework Grade:</label>
            <input
              type="number"
              value={homework}
              onChange={(e) => setHomework(e.target.value)}
              className="tool-input"
              placeholder="0-100"
              step="0.1"
              min="0"
              max="100"
            />
          </div>
          
          <div className="tool-input-group">
            <label className="tool-label">Weight (%):</label>
            <input
              type="number"
              value={hwWeight}
              onChange={(e) => setHwWeight(e.target.value)}
              className="tool-input"
              step="1"
              min="0"
              max="100"
            />
          </div>
        </div>

        <div className="tool-grid">
          <div className="tool-input-group">
            <label className="tool-label">Midterm Grade:</label>
            <input
              type="number"
              value={midterm}
              onChange={(e) => setMidterm(e.target.value)}
              className="tool-input"
              placeholder="0-100"
              step="0.1"
              min="0"
              max="100"
            />
          </div>
          
          <div className="tool-input-group">
            <label className="tool-label">Weight (%):</label>
            <input
              type="number"
              value={midWeight}
              onChange={(e) => setMidWeight(e.target.value)}
              className="tool-input"
              step="1"
              min="0"
              max="100"
            />
          </div>
        </div>

        <div className="tool-grid">
          <div className="tool-input-group">
            <label className="tool-label">Final Exam Grade:</label>
            <input
              type="number"
              value={finalExam}
              onChange={(e) => setFinalExam(e.target.value)}
              className="tool-input"
              placeholder="0-100"
              step="0.1"
              min="0"
              max="100"
            />
          </div>
          
          <div className="tool-input-group">
            <label className="tool-label">Weight (%):</label>
            <input
              type="number"
              value={finalWeight}
              onChange={(e) => setFinalWeight(e.target.value)}
              className="tool-input"
              step="1"
              min="0"
              max="100"
            />
          </div>
        </div>
      </div>

      {/* Fourth Component Toggle */}
      <div className="tool-section">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
          <input
            type="checkbox"
            checked={fourthEnabled}
            onChange={(e) => setFourthEnabled(e.target.checked)}
          />
          <span>Enable 4th Component (Optional)</span>
        </label>
        
        {fourthEnabled && (
          <div className="tool-grid" style={{ marginTop: '10px' }}>
            <div className="tool-input-group">
              <label className="tool-label">4th Component Grade:</label>
              <input
                type="number"
                value={fourthGrade}
                onChange={(e) => setFourthGrade(e.target.value)}
                className="tool-input"
                placeholder="0-100"
                step="0.1"
                min="0"
                max="100"
              />
            </div>
            
            <div className="tool-input-group">
              <label className="tool-label">Weight (%):</label>
              <input
                type="number"
                value={fourthWeight}
                onChange={(e) => setFourthWeight(e.target.value)}
                className="tool-input"
                step="1"
                min="0"
                max="100"
              />
            </div>
          </div>
        )}
      </div>

      {/* Lab Components Toggle */}
      <div className="tool-section">
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
          <input
            type="checkbox"
            checked={labEnabled}
            onChange={(e) => setLabEnabled(e.target.checked)}
          />
          <span>Enable Lab Components (Theory + Lab = Final)</span>
        </label>
        
        {labEnabled && (
          <div style={{ marginTop: '10px' }}>
            <div className="tool-grid">
              <div className="tool-input-group">
                <label className="tool-label">Lab Homework:</label>
                <input
                  type="number"
                  value={labHomework}
                  onChange={(e) => setLabHomework(e.target.value)}
                  className="tool-input"
                  placeholder="0-100"
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>
              
              <div className="tool-input-group">
                <label className="tool-label">Weight (%):</label>
                <input
                  type="number"
                  value={labHwWeight}
                  onChange={(e) => setLabHwWeight(e.target.value)}
                  className="tool-input"
                  step="1"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="tool-grid">
              <div className="tool-input-group">
                <label className="tool-label">Lab Midterm:</label>
                <input
                  type="number"
                  value={labMidterm}
                  onChange={(e) => setLabMidterm(e.target.value)}
                  className="tool-input"
                  placeholder="0-100"
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>
              
              <div className="tool-input-group">
                <label className="tool-label">Weight (%):</label>
                <input
                  type="number"
                  value={labMidWeight}
                  onChange={(e) => setLabMidWeight(e.target.value)}
                  className="tool-input"
                  step="1"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="tool-grid">
              <div className="tool-input-group">
                <label className="tool-label">Lab Final Exam:</label>
                <input
                  type="number"
                  value={labFinalExam}
                  onChange={(e) => setLabFinalExam(e.target.value)}
                  className="tool-input"
                  placeholder="0-100"
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>
              
              <div className="tool-input-group">
                <label className="tool-label">Weight (%):</label>
                <input
                  type="number"
                  value={labFinalWeight}
                  onChange={(e) => setLabFinalWeight(e.target.value)}
                  className="tool-input"
                  step="1"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Weight Status */}
      <div style={{ margin: '15px 0', width: '100%' }}>
        <p style={{ fontSize: '11px', color: '#666', fontWeight: 'bold', margin: '0 auto' }}>
          {weightStatus}
        </p>
      </div>

      {/* Calculate Button */}
      <div style={{ margin: '20px 0' }}>
        <button
          onClick={handleCalculate}
          className="tool-button-primary"
        >
          Calculate Final Grade
        </button>
      </div>

      {/* Result Display */}
      {result && (
        <div className="tool-result-box">
          <pre className="tool-result-text">{result}</pre>
          {result.includes('Final Grade:') && (
            <GradeProgressBar currentGrade={parseFloat(result.match(/Final Grade: ([\d.]+)/)?.[1] || '0')} />
          )}
        </div>
      )}

      {/* Helpful Note */}
      <div style={{ marginTop: '15px', fontSize: '10px', color: '#666', fontStyle: 'italic', width: '100%' }}>
        All weights must sum to 100%. With lab enabled: Final = 2/3 Theory + 1/3 Lab
      </div>
    </div>
  );
};