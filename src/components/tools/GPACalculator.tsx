import React, { useState, useEffect } from "react";

const GRADE_POINTS: Record<string, number> = {
  "A": 4.00,
  "A-": 3.70,
  "B+": 3.30,
  "B": 3.00,
  "B-": 2.70,
  "C+": 2.30,
  "C": 2.00,
  "D": 1.00,
  "E": 0.00,
  "-": 0.00
}

interface Course {
  id: number
  name: string
  classSection: string
  unit: number
  weight: number
  grade: string
  gradePoint: number
}

interface SavedSession {
  id: string
  name: string
  date: string
  curriculum: string
  semesters: Semester[]
  activeSemester: string
  cumulativeGPA: number
  totalUnitsCompleted: number
  totalWeightCompleted: number
  allSemesterGrades?: {[key: string]: Course[]}
}

interface Semester {
  id: string
  name: string
  courses: Course[]
  ips: number
  totalUnit: number
  totalWeight: number
}

// informatika 2024 kurikulum
const CURRICULUM_2024: Semester[] = [
  {
    id: "gasal-2024-2025",
    name: "Semester Gasal 2024/2025",
    ips: 0.00,
    totalUnit: 20,
    totalWeight: 0.00,
    courses: [
      { id: 1, name: "CE 232 Digital Systems", classSection: "ZZ", unit: 3, weight: 12.00, grade: "", gradePoint: 0.00 },
      { id: 2, name: "UM 122 English 1", classSection: "ZZ", unit: 2, weight: 8.00, grade: "", gradePoint: 0.00 },
      { id: 3, name: "UM 152 Religion", classSection: "ZZ", unit: 2, weight: 8.00, grade: "", gradePoint: 0.00 },
      { id: 4, name: "UM 162 Pancasila", classSection: "ZZ", unit: 2, weight: 8.00, grade: "", gradePoint: 0.00 },
      { id: 5, name: "UM 163 Civics", classSection: "ZZ", unit: 2, weight: 7.40, grade: "", gradePoint: 0.00 },
      { id: 6, name: "IF 130 Programming Fundamentals", classSection: "ZZ", unit: 3, weight: 12.00, grade: "", gradePoint: 0.00 },
      { id: 7, name: "IF 120 Discrete Mathematics", classSection: "ZZ", unit: 3, weight: 12.00, grade: "", gradePoint: 0.00 },
      { id: 8, name: "UM 888 New Student Preparation", classSection: "ZZ", unit: 0, weight: 0.00, grade: "-", gradePoint: 0.00 },
      { id: 9, name: "CE 121 Linear Algebra", classSection: "ZZ", unit: 3, weight: 12.00, grade: "", gradePoint: 0.00 }
    ]
  },
  {
    id: "genap-2024-2025",
    name: "Semester Genap 2024/2025",
    ips: 0.00,
    totalUnit: 19,
    totalWeight: 0.00,
    courses: [
      { id: 1, name: "UM 223 English 2", classSection: "ZZ", unit: 2, weight: 8.00, grade: "", gradePoint: 0.00 },
      { id: 2, name: "EPM 101 Kalkulus", classSection: "ZZ", unit: 4, weight: 16.00, grade: "", gradePoint: 0.00 },
      { id: 3, name: "IF 260 Operating System", classSection: "ZZ", unit: 3, weight: 12.00, grade: "", gradePoint: 0.00 },
      { id: 4, name: "IF 231 Intro to Internet Technology", classSection: "ZZ", unit: 3, weight: 12.00, grade: "", gradePoint: 0.00 },
      { id: 5, name: "IF 232 Algorithms & Data Structure", classSection: "ZZ", unit: 4, weight: 16.00, grade: "", gradePoint: 0.00 },
      { id: 6, name: "CE 332 Computer Architecture & Organization", classSection: "ZZ", unit: 3, weight: 12.00, grade: "", gradePoint: 0.00 }
    ]
  },
  {
    id: "gasal-2025-2026",
    name: "Semester Gasal 2025/2026",
    ips: 0.00,
    totalUnit: 23,
    totalWeight: 0.00,
    courses: [
      { id: 1, name: "UM 142 Indonesian Language", classSection: "ZZ", unit: 2, weight: 0.00, grade: "-", gradePoint: 0.00 },
      { id: 2, name: "IF 350 Software Engineering & Project Management", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 3, name: "IF 351 Database Systems", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 4, name: "IF 440 Artificial Intelligence", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 5, name: "MSC3401 Public Speaking & Presentation Skills", classSection: "ZZ", unit: 3, weight: 0.00, grade: "-", gradePoint: 0.00 },
      { id: 6, name: "CE 319 Probability and Statistics", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 7, name: "IF 451 Advanced Web Programming", classSection: "ZZ", unit: 3, weight: 0.00, grade: "-", gradePoint: 0.00 },
      { id: 8, name: "IF 333 Formal Languages & Automata Theory", classSection: "ZZ", unit: 3, weight: 0.00, grade: "-", gradePoint: 0.00 }
    ]
  },
  {
    id: "genap-2025-2026",
    name: "Semester Genap 2025/2026",
    ips: 0.00,
    totalUnit: 20,
    totalWeight: 0.00,
    courses: [
      { id: 1, name: "IF433 Object Oriented Programming", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 2, name: "IF450 Human & Computer Interaction", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 3, name: "IF470 Computer Security", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 4, name: "IF431 Algorithms & Complexity", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 5, name: "IF441 Machine Learning", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 6, name: "IF111 Ethics in Informatics", classSection: "ZZ", unit: 2, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 7, name: "CE449 Computer Network", classSection: "ZZ", unit: 2, weight: 0.00, grade: "", gradePoint: 0.00 }
    ]
  },
  {
    id: "ganjil-2026-2027",
    name: "Semester Ganjil 2026/2027",
    ips: 0.00,
    totalUnit: 19,
    totalWeight: 0.00,
    courses: [
      { id: 1, name: "EM105 Technopreneurship", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 2, name: "UM321 English 3", classSection: "ZZ", unit: 2, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 3, name: "IF570 Mobile App Programming", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 4, name: "IF590 Information Technology Research", classSection: "ZZ", unit: 2, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 5, name: "IF542 Deep Learning", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 6, name: "IF571 Cybersecurity", classSection: "ZZ", unit: 2, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 7, name: "IF581 Game Development", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 }
    ]
  }
];

// informatika 2025 kurikulum
const CURRICULUM_2025: Semester[] = [
  {
    id: "semester-1-2025",
    name: "Semester 1",
    ips: 0.00,
    totalUnit: 20,
    totalWeight: 0.00,
    courses: [
      { id: 1, name: "IF 111 Ethics in Informatics", classSection: "ZZ", unit: 2, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 2, name: "IF 120 Discrete Mathematics", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 3, name: "IF 130 Programming Fundamentals", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 4, name: "CE 121 Linear Algebra", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 5, name: "CE 232 Digital Systems", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 6, name: "UM 122 English 1", classSection: "ZZ", unit: 2, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 7, name: "UM 142 Indonesian Language", classSection: "ZZ", unit: 2, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 8, name: "UM 152 Religion", classSection: "ZZ", unit: 2, weight: 0.00, grade: "", gradePoint: 0.00 }
    ]
  },
  {
    id: "semester-2-2025",
    name: "Semester 2",
    ips: 0.00,
    totalUnit: 19,
    totalWeight: 0.00,
    courses: [
      { id: 1, name: "IF 233 Algorithms & Data Structure", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 2, name: "IF 260 Operating System", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 3, name: "CE 319 Probability and Statistics", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 4, name: "CE 332 Computer Architecture & Organization", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 5, name: "EPM 101 Calculus", classSection: "ZZ", unit: 4, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 6, name: "UM 162 Pancasila", classSection: "ZZ", unit: 2, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 7, name: "UM 223 English 2", classSection: "ZZ", unit: 2, weight: 0.00, grade: "", gradePoint: 0.00 }
    ]
  },
  {
    id: "semester-3-2025",
    name: "Semester 3",
    ips: 0.00,
    totalUnit: 20,
    totalWeight: 0.00,
    courses: [
      { id: 1, name: "IF 333 Formal Languages & Automata Theory", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 2, name: "IF 350 Software Engineering & Project Management", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 3, name: "IF 351 Database Systems", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 4, name: "IF 352 Basic Web Programming", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 5, name: "IF 440 Artificial Intelligence", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 6, name: "UM 163 Civics", classSection: "ZZ", unit: 2, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 7, name: "MSC 3401 Public Speaking & Presentation Skills", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 }
    ]
  },
  {
    id: "semester-4-2025",
    name: "Semester 4",
    ips: 0.00,
    totalUnit: 20,
    totalWeight: 0.00,
    courses: [
      { id: 1, name: "IF 431 Algorithms & Complexity", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 2, name: "IF 433 Object Oriented Programming", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 3, name: "IF 441 Machine Learning", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 4, name: "IF 450 Human Computer Interaction", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 5, name: "IF 451 Advanced Web Programming", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 6, name: "IF 470 Computer Security", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 7, name: "CE 449 Computer Network", classSection: "ZZ", unit: 2, weight: 0.00, grade: "", gradePoint: 0.00 }
    ]
  },
  {
    id: "semester-5-2025",
    name: "Semester 5",
    ips: 0.00,
    totalUnit: 19,
    totalWeight: 0.00,
    courses: [
      { id: 1, name: "IF 542 Deep Learning", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 2, name: "IF 570 Mobile Application Programming", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 3, name: "IF 571 Cybersecurity", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 4, name: "IF 581 Game Development", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 5, name: "IF 590 Information Technology Research", classSection: "ZZ", unit: 2, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 6, name: "EM 105 Technopreneurship", classSection: "ZZ", unit: 3, weight: 0.00, grade: "", gradePoint: 0.00 },
      { id: 7, name: "UM 321 English 3", classSection: "ZZ", unit: 2, weight: 0.00, grade: "", gradePoint: 0.00 }
    ]
  }
];

export const GPACalculator: React.FC = () => {
  const [selectedCurriculum, setSelectedCurriculum] = useState<"2024" | "2025">("2024");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [gpa, setGPA] = useState<number>(0);
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const [allSemesterData, setAllSemesterData] = useState<{[key: string]: Course[]}>({});
  const [cumulativeGPA, setCumulativeGPA] = useState<number>(0);
  const [cumulativeTotalUnits, setCumulativeTotalUnits] = useState<number>(0);
  const [sessionName, setSessionName] = useState<string>("");

  const getCurrentCurriculum = () => {
    return selectedCurriculum === "2024" ? CURRICULUM_2024 : CURRICULUM_2025;
  };

  const getCurrentSemester = () => {
    return getCurrentCurriculum().find(s => s.id === selectedSemester);
  };

  // Calculate cumulative GPA from current curriculum semester data only
  const calculateCumulativeGPA = () => {
    let totalPoints = 0;
    let totalUnitsAll = 0;
    const currentCurriculumSemesterIds = getCurrentCurriculum().map(s => s.id);

    // Only calculate from semesters that belong to the current curriculum
    Object.entries(allSemesterData).forEach(([semesterId, semesterCourses]) => {
      if (currentCurriculumSemesterIds.includes(semesterId)){
        semesterCourses.forEach(course => {
          if (course.grade && course.grade !== "" && course.grade !== "-"){
            const gradePoint = GRADE_POINTS[course.grade] || 0;
            totalPoints += gradePoint * course.unit;
            totalUnitsAll += course.unit;
          }
        });
      }
    });

    const cumGPA = totalUnitsAll > 0 ? totalPoints / totalUnitsAll : 0;
    setCumulativeGPA(cumGPA);
    setCumulativeTotalUnits(totalUnitsAll);
    return cumGPA;
  };

  // Calculate GPA based on current grades
  const calculateGPA = (coursesToCalculate: Course[]) => {
    let totalPoints = 0;
    let totalUnitsWithGrades = 0;

    coursesToCalculate.forEach(course => {
      if (course.grade && course.grade !== "" && course.grade !== "-"){
        const gradePoint = GRADE_POINTS[course.grade] || 0;
        totalPoints += gradePoint * course.unit;
        totalUnitsWithGrades += course.unit;
      }
    });

    return totalUnitsWithGrades > 0 ? totalPoints / totalUnitsWithGrades : 0;
  };

  // Update course grade
  const updateCourseGrade = (courseId: number, grade: string) => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId){
        const gradePoint = GRADE_POINTS[grade] || 0;
        return {...course, grade, gradePoint, weight: gradePoint * course.unit};
      }
      return course;
    });
    setCourses(updatedCourses);
    setAllSemesterData(prev => ({...prev,[selectedSemester]: updatedCourses}));
    
    // Recalculate GPA for current semester
    const newGPA = calculateGPA(updatedCourses);
    
    setGPA(newGPA);
  };

  // Load semester data when selection changes
  useEffect(() => {
    if (selectedSemester){
      const savedSemesterData = allSemesterData[selectedSemester];
      
      if (savedSemesterData){
        // Load saved data
        setCourses([...savedSemesterData]);
        const newGPA = calculateGPA(savedSemesterData);
        setGPA(newGPA);
      } else {
        // Load fresh semester data
        const semester = getCurrentSemester();
        if (semester){
          setCourses([...semester.courses]);
          setAllSemesterData(prev => ({
            ...prev,
            [selectedSemester]: [...semester.courses]
          }));
          const newGPA = calculateGPA(semester.courses);
          setGPA(newGPA);
        }
      }
    }
  }, [selectedSemester, selectedCurriculum]);

  // recalculate cum gpa when allSemesterData changes
  useEffect(() => {
    calculateCumulativeGPA();
  }, [allSemesterData]);

  // recalc cum GPA when curriculum changes (reset IPK per curriculum)
  useEffect(() => {
    calculateCumulativeGPA();
  }, [selectedCurriculum]);

  // set default semester when curriculum changes
  useEffect(() => {
    const curriculum = getCurrentCurriculum();
    if (curriculum.length > 0){
      setSelectedSemester(curriculum[0].id);
    }
  }, [selectedCurriculum]);

  // save session function
  const saveSession = () => {
    if (!sessionName.trim()){
      alert("Please enter a session name");
      return;
    }

    const session: SavedSession = {
      id: Date.now().toString(),
      name: sessionName.trim(),
      date: new Date().toLocaleDateString(),
      curriculum: selectedCurriculum,
      semesters: getCurrentCurriculum(),
      activeSemester: selectedSemester,
      cumulativeGPA: cumulativeGPA,
      totalUnitsCompleted: cumulativeTotalUnits,
      totalWeightCompleted: Object.values(allSemesterData).reduce((total, courses) => {
        return total + courses.reduce((sum, course) => sum + course.weight, 0);
      }, 0),
      allSemesterGrades: allSemesterData // Save individual grade data
    };

    const newSessions = [...savedSessions, session];
    setSavedSessions(newSessions);
    localStorage.setItem("gpa-calculator-sessions", JSON.stringify(newSessions));
    setSessionName("");
    alert("Session saved successfully!");
  };

  // load session function
  const loadSession = (sessionId: string) => {
    const session = savedSessions.find(s => s.id === sessionId);
    if (session){
      setSelectedCurriculum(session.curriculum as "2024" | "2025");
      setSelectedSemester(session.activeSemester);
      
      // restore individual grade data if available
      if ((session as any).allSemesterGrades){
        setAllSemesterData((session as any).allSemesterGrades);
        alert("Session loaded successfully with all individual grades!");
      } else {
        alert("Session loaded! Note: Individual grade data may need to be re-entered.");
      }
    }
  };

  // delete session function
  const deleteSession = (sessionId: string) => {
    const newSessions = savedSessions.filter(s => s.id !== sessionId);
    setSavedSessions(newSessions);
    localStorage.setItem("gpa-calculator-sessions", JSON.stringify(newSessions));
  };

  // oad saved sessions on component mount
  useEffect(() => {
    const saved = localStorage.getItem("gpa-calculator-sessions");
    if (saved){
      try {
        setSavedSessions(JSON.parse(saved));
      } catch (e){
        console.error("Failed to load saved sessions:", e);
      }
    }
  }, []);

  return (
    <div className="tool-component">
      {/* Header */}
      <div className="tool-section">
        <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#2D3748", margin: "0 0 8px 0" }}>
          GPA Calculator
        </h3>
        <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
          Calculate your Grade Point Average with curriculum support
        </p>
      </div>

      {/* Curriculum and Semester Selection */}
      <div className="tool-section">
        <div className="tool-card">
          <div className="tool-card-title">Academic Settings</div>
          <div className="tool-card-content">
            <div className="tool-grid">
              <div className="tool-input-group">
                <label className="tool-label">Curriculum:</label>
                <select value={selectedCurriculum}
                  onChange={(e) => setSelectedCurriculum(e.target.value as "2024" | "2025")}
                  className="tool-select"
                >
                  <option value="2024">2024 Informatics Curriculum</option>
                  <option value="2025">2025 Informatics Curriculum</option>
                </select>
              </div>
              
              <div className="tool-input-group">
                <label className="tool-label">Semester:</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="tool-select"
                >
                  {getCurrentCurriculum().map(semester => (
                    <option key={semester.id} value={semester.id}>
                      {semester.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save/Load Session */}
      <div className="tool-section">
        <div className="tool-card">
          <div className="tool-card-title">Session Management</div>
          <div className="tool-card-content">
            <div className="tool-grid">
              <div className="tool-input-group">
                <label className="tool-label">Save Current Session:</label>
                <input type="text"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  className="tool-input"
                  placeholder="Enter session name..."
                  style={{ marginBottom: "8px" }}
                />
                <button onClick={saveSession}
                  className="tool-button-primary"
                  style={{ width: "100%" }}>
                  Save Session
                </button>
              </div>
              
              <div className="tool-input-group">
                <label className="tool-label">Load Saved Session:</label>
                {savedSessions.length > 0 ? (
                  <div style={{ maxHeight: "120px", overflowY: "auto" }}>
                    {savedSessions.map(session => (
                      <div key={session.id} style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        padding: "4px 0",
                        borderBottom: "1px solid #e9ecef",
                        fontSize: "10px"
                      }}>
                        <div>
                          <div style={{ fontWeight: "bold" }}>{session.name}</div>
                          <div style={{ color: "#666" }}>{session.date} • GPA: {session.cumulativeGPA.toFixed(2)}</div>
                        </div>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <button
                            onClick={() => loadSession(session.id)}
                            className="tool-button-secondary"
                            style={{ padding: "2px 6px", fontSize: "9px" }}
                          >
                            Load
                          </button>
                          <button
                            onClick={() => deleteSession(session.id)}
                            className="tool-button-secondary"
                            style={{ padding: "2px 6px", fontSize: "9px", color: "#dc3545" }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: "10px", color: "#666", margin: 0 }}>No saved sessions</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current GPA Display */}
      {selectedSemester && (
        <div className="tool-section">
          <div className="tool-card" style={{ background: "#f8f9fa", border: "1px solid #e9ecef" }}>
            <div className="tool-card-content">
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", 
                gap: "15px", 
                alignItems: "center",
                fontSize: "12px"
              }}>
                <div>
                  <div style={{ fontWeight: "bold", color: "#495057", marginBottom: "2px" }}>Term</div>
                  <div style={{ color: "#6c757d" }}>{getCurrentSemester()?.name}</div>
                </div>
                <div>
                  <div style={{ fontWeight: "bold", color: "#495057", marginBottom: "2px" }}>Total Unit</div>
                  <div style={{ color: "#6c757d", fontWeight: "bold" }}>{getCurrentSemester()?.totalUnit}</div>
                </div>
                <div>
                  <div style={{ fontWeight: "bold", color: "#495057", marginBottom: "2px" }}>Total Weight</div>
                  <div style={{ color: "#6c757d", fontWeight: "bold" }}>
                    {courses.reduce((sum, course) => sum + course.weight, 0).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: "bold", color: "#495057", marginBottom: "2px" }}>IPS</div>
                  <div style={{ 
                    fontSize: "16px", 
                    fontWeight: "bold",
                    color: gpa >= 3.5 ? "#28a745" : gpa >= 3.0 ? "#007bff" : gpa >= 2.0 ? "#ffc107" : "#dc3545"
                  }}>
                    {gpa.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: "bold", color: "#495057", marginBottom: "2px" }}>IPK</div>
                  <div style={{ 
                    fontSize: "16px", 
                    fontWeight: "bold",
                    color: cumulativeGPA >= 3.5 ? "#28a745" : cumulativeGPA >= 3.0 ? "#007bff" : cumulativeGPA >= 2.0 ? "#ffc107" : "#dc3545"
                  }}>
                    {cumulativeGPA.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course List */}
      {courses.length > 0 && (
        <div className="tool-section">
          <h4 className="tool-section-title">Course Grades</h4>
          
          <div style={{ overflowX: "auto", background: "#f8f9fa", borderRadius: "8px", padding: "10px" }}>
            <table style={{ 
              width: "100%", 
              borderCollapse: "collapse",
              fontSize: "11px",
              background: "white",
              borderRadius: "6px",
              overflow: "hidden",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <thead>
                <tr style={{ background: "#e9ecef", borderBottom: "2px solid #dee2e6" }}>
                  <th style={{ padding: "8px 6px", textAlign: "left", fontWeight: "bold", color: "#495057" }}>#</th>
                  <th style={{ padding: "8px 6px", textAlign: "left", fontWeight: "bold", color: "#495057" }}>Course name</th>
                  <th style={{ padding: "8px 6px", textAlign: "center", fontWeight: "bold", color: "#495057" }}>Class Section</th>
                  <th style={{ padding: "8px 6px", textAlign: "center", fontWeight: "bold", color: "#495057" }}>Detail</th>
                  <th style={{ padding: "8px 6px", textAlign: "center", fontWeight: "bold", color: "#495057" }}>Grade</th>
                  <th style={{ padding: "8px 6px", textAlign: "center", fontWeight: "bold", color: "#495057" }}>Grade Point</th>
                  <th style={{ padding: "8px 6px", textAlign: "center", fontWeight: "bold", color: "#495057" }}>Unit</th>
                  <th style={{ padding: "8px 6px", textAlign: "center", fontWeight: "bold", color: "#495057" }}>Weight</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr 
                    key={course.id}
                    style={{ 
                      borderBottom: index < courses.length - 1 ? "1px solid #e9ecef" : "none",
                      background: index % 2 === 0 ? "#ffffff" : "#f8f9fa"
                    }}
                  >
                    <td style={{ padding: "6px", textAlign: "center", color: "#6c757d" }}>
                      {index + 1}
                    </td>
                    <td style={{ padding: "6px", color: "#495057", fontWeight: "500" }}>
                      {course.name}
                    </td>
                    <td style={{ padding: "6px", textAlign: "center", color: "#6c757d" }}>
                      {course.classSection}
                    </td>
                    <td style={{ padding: "6px", textAlign: "center" }}>
                      <span style={{ 
                        color: "#007bff", 
                        textDecoration: "underline", 
                        cursor: "pointer",
                        fontSize: "10px"
                      }}>
                        Detail
                      </span>
                    </td>
                    <td style={{ padding: "6px", textAlign: "center" }}>
                      <select
                        value={course.grade}
                        onChange={(e) => updateCourseGrade(course.id, e.target.value)}
                        style={{ 
                          border: "1px solid #ced4da",
                          borderRadius: "3px",
                          padding: "2px 4px",
                          fontSize: "10px",
                          background: "white",
                          width: "50px"
                        }}
                      >
                        <option value="">-</option>
                        {Object.keys(GRADE_POINTS).map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ 
                      padding: "6px", 
                      textAlign: "center",
                      fontWeight: "bold",
                      color: course.grade && course.grade !== "" && course.grade !== "-" 
                        ? (course.gradePoint >= 3.5 ? "#28a745" : course.gradePoint >= 3.0 ? "#007bff" : course.gradePoint >= 2.0 ? "#ffc107" : "#dc3545")
                        : "#6c757d"
                    }}>
                      {course.grade && course.grade !== "" && course.grade !== "-" 
                        ? course.gradePoint.toFixed(2) 
                        : "0.00"}
                    </td>
                    <td style={{ padding: "6px", textAlign: "center", color: "#495057", fontWeight: "500" }}>
                      {course.unit}
                    </td>
                    <td style={{ 
                      padding: "6px", 
                      textAlign: "center",
                      color: course.weight > 0 ? "#495057" : "#6c757d",
                      fontWeight: course.weight > 0 ? "500" : "normal"
                    }}>
                      {course.weight.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grade Scale Reference */}
      <div className="tool-section">
        <div className="tool-card">
          <div className="tool-card-title">Grade Point Scale</div>
          <div className="tool-card-content">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(60px, 1fr))", gap: "4px", fontSize: "9px" }}>
              {Object.entries(GRADE_POINTS).map(([grade, points]) => (
                <div 
                  key={grade} 
                  style={{ 
                    textAlign: "center", 
                    padding: "4px",
                    background: points >= 3.5 ? "#dcfce7" : points >= 3.0 ? "#dbeafe" : points >= 2.0 ? "#fef3c7" : "#fecaca",
                    borderRadius: "4px"
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>{grade}</div>
                  <div>{points.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div style={{ marginTop: "15px", fontSize: "9px", color: "#666", fontStyle: "italic", textAlign: "center" }}>
        <strong>Note:</strong> Use "-" for courses that don"t count toward GPA. 
        Your GPA updates automatically as you enter grades!
      </div>
    </div>
  );
};