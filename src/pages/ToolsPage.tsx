import React, { useState } from "react";
import "./Pages.css";

import {GradeCalculator, GPACalculator, TargetCalculator, GradingScale} from "../components/tools";

export const ToolsPage: React.FC = () => {
  const [activeToolIndex, setActiveToolIndex] = useState(0);

  const tools = [
    {
      id: "grade-calc",
      name: "Grade Calculator",
      description: "Calculate your final grade with weighted components",
      icon: "",
      component: GradeCalculator,
    },
    {
      id: "gpa-calc", 
      name: "GPA Calculator",
      description: "Track your academic progress semester by semester",
      icon: "",
      component: GPACalculator,
    },
    {
      id: "target-calc",
      name: "Target Calculator", 
      description: "Find out what score you need on your next exam",
      icon: "",
      component: TargetCalculator,
    },
    {
      id: "grading-scale",
      name: "Grading Scale",
      description: "Reference for grade conversion and requirements",
      icon: "",
      component: GradingScale,
    },
  ];

  const ActiveToolComponent = tools[activeToolIndex].component;

  return (
    <div className="page-container">
      <div className="page-content">
        {/* Header & Tool Selector */}
        <div className="tools-selector-box">
          <h2 className="toolbox-title">
            My Toolbox
          </h2>
          <p className="tools-selector-description">
            Choose your academic tool:
          </p>
          <div className="tools-grid">
            {tools.map((tool, index) => (
              <button key={tool.id}
                className={`tool-button ${activeToolIndex === index ? "active" : ""}`}
                onClick={() => setActiveToolIndex(index)}
                title={tool.description}>
                <div className="tool-name">{tool.name}</div>
                <div className="tool-description">{tool.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Tool Display */}
        <div className="tool-display-box">
          <div className="tool-header">
            <h3 className="active-tool-title">
              {tools[activeToolIndex].name}
            </h3>
            <p className="active-tool-description">
              {tools[activeToolIndex].description}
            </p>
          </div>
          
          {/* Tool Component */}
          <div className="tool-content">
            <ActiveToolComponent />
          </div>
        </div>

      </div>
    </div>
  );
};