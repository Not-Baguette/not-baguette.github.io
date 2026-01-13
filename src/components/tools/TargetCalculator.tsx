import React, { useState, useEffect } from 'react';

const calculateRequiredScore = (
  targetGrade: number,
  knownGrades: number[],
  knownWeights: number[],
  unknownWeight: number
): number => {
  const knownTotal = knownGrades.reduce((sum, grade, index) => {
    return sum + (grade * knownWeights[index] / 100);
  }, 0);
  
  const requiredScore = (targetGrade - knownTotal) * 100 / unknownWeight;
  return requiredScore;
};

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

interface ComponentData {
  score: string;
  weight: string;
  status: string;
  statusColor: string;
}

export const TargetCalculator: React.FC = () => {
  const [targetGrade, setTargetGrade] = useState<string>('');
  const [selectedComponent, setSelectedComponent] = useState<string>('Final Exam');
  const [result, setResult] = useState<string>('Enter your target grade and fill in the known scores');
  
  const [components, setComponents] = useState<Record<string, ComponentData>>({
    'Homework': { score: '', weight: '30', status: 'Enter values', statusColor: '#666' },
    'Midterm': { score: '', weight: '30', status: 'Enter values', statusColor: '#666' },
    'Final Exam': { score: '', weight: '40', status: 'Calculating', statusColor: '#C59667' },
    '4th Component': { score: '', weight: '', status: 'Enter values', statusColor: '#666' }
  });

  const componentOptions = ['Homework', 'Midterm', 'Final Exam', '4th Component'];

  const updateComponentStatus = (componentName: string) => {
    setComponents(prev => {
      const newComponents = { ...prev };
      const comp = newComponents[componentName];
      
      if (componentName === selectedComponent){
        comp.status = 'Calculating';
        comp.statusColor = '#C59667';
      } else {
        if (comp.score && comp.weight){
          comp.status = 'Ready';
          comp.statusColor = '#28a745';
        } else if (comp.weight && !comp.score){
          comp.status = 'Need score';
          comp.statusColor = '#fd7e14';
        } else if (comp.score && !comp.weight){
          comp.status = 'Need weight';
          comp.statusColor = '#dc3545';
        } else {
          comp.status = 'Enter values';
          comp.statusColor = '#666';
        }
      }
      
      return newComponents;
    });
  };

  const calculateTarget = () => {
    try {
      if (!targetGrade){
        setResult('Enter your target grade and fill in the known scores to calculate what you need.');
        return;
      }

      const target = parseFloat(targetGrade);
      
      if (target < 0 || target > 100){
        setResult('Please enter a target grade between 0 and 100.');
        return;
      }
      
      const knownGrades: number[] = [];
      const knownWeights: number[] = [];
      let unknownWeight = 0;
      
      for (const [compName, data] of Object.entries(components)){
        const weight = parseFloat(data.weight) || 0;
        
        if (compName === selectedComponent){
          unknownWeight = weight;
        } else if (data.score && weight > 0){
          knownGrades.push(parseFloat(data.score));
          knownWeights.push(weight);
        }
      }

      if (unknownWeight === 0){
        setResult(`Please set a weight for ${selectedComponent} first.`);
        return;
      }

      if (knownGrades.length === 0){
        setResult('Enter scores for the other components so I can calculate what you need.');
        return;
      }

      const totalWeight = knownWeights.reduce((sum, w) => sum + w, 0) + unknownWeight;
      if (Math.abs(totalWeight - 100) > 5){ // Allow some tolerance
        setResult(`Note: Total weights (${totalWeight.toFixed(1)}%) should equal 100% for accurate results.`);
        return;
      }

      const requiredScore = calculateRequiredScore(target, knownGrades, knownWeights, unknownWeight);
      
      let resultText: string;

      // DONT KNOW HOW TO MAKE THIS LESS UGLY SORRY
      if (requiredScore > 100){
        resultText = `You would need ${requiredScore.toFixed(1)}% on ${selectedComponent}

This exceeds 100% - your target may not be achievable with the current scores. 
You're cooked.`;
      } else if (requiredScore < 0){
        resultText = `Great news! You only need ${requiredScore.toFixed(1)}% on ${selectedComponent}

You've already exceeded your target of ${target}% with your current scores!`;
      } else if (requiredScore <= 45){
        resultText = `You need ${requiredScore.toFixed(1)}% on ${selectedComponent}

To achieve your target of ${target}%. This is very manageable!`;
      } else if (requiredScore <= 70){
        resultText = `You need ${requiredScore.toFixed(1)}% on ${selectedComponent}

To achieve your target of ${target}%. This is doable with some preparation.`;
      } else if (requiredScore <= 85){
        resultText = `You need ${requiredScore.toFixed(1)}% on ${selectedComponent}

To achieve your target of ${target}%. This will require focused study but is achievable.`;
      } else {
        resultText = `You need ${requiredScore.toFixed(1)}% on ${selectedComponent}

To achieve your target of ${target}%. This will require intensive preparation.`;
      }

      setResult(resultText);
      
    } catch (error){
      setResult('Something went wrong with the calculation. Please check your numbers.');
    }
  };

  const updateScore = (componentName: string, value: string) => {
    setComponents(prev => ({
      ...prev,
      [componentName]: {
        ...prev[componentName],
        score: value
      }
    }));
  };

  const updateWeight = (componentName: string, value: string) => {
    setComponents(prev => ({
      ...prev,
      [componentName]: {
        ...prev[componentName],
        weight: value
      }
    }));
  };

  const handleComponentChange = (newComponent: string) => {
    setSelectedComponent(newComponent);
  };

  useEffect(() => {
    componentOptions.forEach(compName => updateComponentStatus(compName));
  }, [targetGrade, selectedComponent, components]);

  const totalWeight = Object.values(components).reduce((sum, comp) => sum + (parseFloat(comp.weight) || 0), 0);

  return (
    <div className="tool-component">
      {/* Step 1: Target Grade */}
      <div className="tool-section">
        <h4 className="tool-section-title">Step 1: Set Your Target</h4>
        
        <div className="tool-input-group">
          <label className="tool-label">I want to achieve:</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="number"
              value={targetGrade}
              onChange={(e) => setTargetGrade(e.target.value)}
              className="tool-input"
              placeholder="85"
              step="0.1"
              min="0"
              max="100"
              style={{ width: '80px' }}
            />
            <span style={{ fontSize: '11px' }}>% overall</span>
          </div>
        </div>
      </div>

      {/* Step 2: Choose Component to Calculate */}
      <div className="tool-section">
        <h4 className="tool-section-title">Step 2: What do you need to calculate?</h4>
        
        <div className="tool-input-group">
          <label className="tool-label">Calculate required score for:</label>
          <select
            value={selectedComponent}
            onChange={(e) => handleComponentChange(e.target.value)}
            className="tool-select"
          >
            {componentOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Step 3: Enter Known Information */}
      <div className="tool-section">
        <h4 className="tool-section-title">Step 3: Enter Your Known Scores & Weights</h4>
        
        {/* Weight Status */}
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <span style={{ 
            fontSize: '10px', 
            color: totalWeight === 100 ? '#28a745' : '#666',
            fontWeight: 'bold'
          }}>
            Total Weight: {totalWeight.toFixed(1)}% {totalWeight === 100 ? '(Valid)' : ''}
          </span>
        </div>

        <div className="tool-grid">
          {componentOptions.map(componentName => (
            <div key={componentName} className="tool-card">
              <div className="tool-card-title">
                {componentName} {componentName === selectedComponent && '(Calculating)'}
              </div>
              <div className="tool-card-content">
                <div className="tool-input-group" style={{ marginBottom: '8px' }}>
                  <label className="tool-label">Score:</label>
                  <input
                    type="number"
                    value={components[componentName].score}
                    onChange={(e) => updateScore(componentName, e.target.value)}
                    className="tool-input"
                    disabled={selectedComponent === componentName}
                    placeholder={selectedComponent === componentName ? "Calculating..." : "0-100"}
                    step="0.1"
                    min="0"
                    max="100"
                  />
                </div>
                
                <div className="tool-input-group" style={{ marginBottom: '8px' }}>
                  <label className="tool-label">Weight (%):</label>
                  <input
                    type="number"
                    value={components[componentName].weight}
                    onChange={(e) => updateWeight(componentName, e.target.value)}
                    className="tool-input"
                    placeholder="0-100"
                    step="1"
                    min="0"
                    max="100"
                  />
                </div>
                
                <div style={{ 
                  fontSize: '9px', 
                  color: components[componentName].statusColor,
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                  {components[componentName].status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calculate Button */}
      <div style={{ margin: '15px 0' }}>
        <button
          onClick={calculateTarget}
          className="tool-button-primary"
        >
          Calculate Required Score
        </button>
      </div>

      {/* Result Display */}
      <div className="tool-result-box">
        <div className="tool-card-title">Your Result</div>
        <pre className="tool-result-text" style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>
          {result}
        </pre>
        {targetGrade && !isNaN(parseFloat(targetGrade)) && (
          <GradeProgressBar currentGrade={parseFloat(targetGrade)} />
        )}
      </div>

      {/* Quick Tips */}
      <div style={{ marginTop: '15px', fontSize: '10px', color: '#666', fontStyle: 'italic', width: '100%' }}>
        <strong>Note:</strong> This calculator works even if your weights don't add up to exactly 100%. 
        Use the 4th Component for any additional assignments or extra credit opportunities.
      </div>
    </div>
  );
};