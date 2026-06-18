import React, { useState } from 'react';
import { FaCalculator, FaPercent, FaSchool, FaInfoCircle, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const GRADES_UNILAG = { 'A1': 4.0, 'B2': 3.6, 'B3': 3.2, 'C4': 2.8, 'C5': 2.4, 'C6': 2.0, 'D7': 0, 'E8': 0, 'F9': 0 };
const GRADES_OAU = { 'A1': 2.0, 'B2': 1.8, 'B3': 1.6, 'C4': 1.4, 'C5': 1.2, 'C6': 1.0, 'D7': 0, 'E8': 0, 'F9': 0 };

const MOCK_CUTOFFS = {
  UNILAG: { 'Medicine': 81.5, 'Law': 78.5, 'Computer Science': 76.2, 'Accounting': 74.0, 'General Science': 62.0 },
  UI: { 'Medicine': 79.0, 'Law': 76.5, 'Computer Science': 75.0, 'Accounting': 72.5, 'General Science': 60.0 },
  OAU: { 'Medicine': 78.0, 'Law': 75.2, 'Computer Science': 74.0, 'Accounting': 71.0, 'General Science': 58.0 }
};

const AdmissionCalculator = () => {
  const [school, setSchool] = useState('UNILAG');
  const [jambScore, setJambScore] = useState(250);
  const [postUtmeScore, setPostUtmeScore] = useState(22); // Expected score out of 30 (UNILAG) or 50 (UI) or 40 (OAU)
  const [course, setCourse] = useState('Computer Science');
  
  // O'Level Grades for 5 subjects
  const [mathGrade, setMathGrade] = useState('A1');
  const [engGrade, setEngGrade] = useState('A1');
  const [subj3, setSubj3] = useState('A1');
  const [subj4, setSubj4] = useState('B2');
  const [subj5, setSubj5] = useState('B3');

  const [aggregateResult, setAggregateResult] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    
    const jambContribution = Number(jambScore) / 8; // standard for all three
    let olevelContribution = 0;
    let putmeContribution = Number(postUtmeScore);
    let maxPutme = 30;

    const grades = [mathGrade, engGrade, subj3, subj4, subj5];

    if (school === 'UNILAG') {
      // Sum top grades based on UNILAG values
      olevelContribution = grades.reduce((acc, grade) => acc + (GRADES_UNILAG[grade] || 0), 0);
      maxPutme = 30;
    } else if (school === 'OAU') {
      olevelContribution = grades.reduce((acc, grade) => acc + (GRADES_OAU[grade] || 0), 0);
      maxPutme = 40;
    } else if (school === 'UI') {
      // UI does not count OLevel grades in aggregate, it is strictly JAMB / 8 + PUTME / 2
      olevelContribution = 0;
      putmeContribution = Number(postUtmeScore) / 2; // UI Post-UTME is marked out of 100
      maxPutme = 50;
    }

    const finalAggregate = jambContribution + olevelContribution + putmeContribution;

    // Fetch matching cut-off and predict chances
    const targetCutoff = MOCK_CUTOFFS[school]?.[course] || 65.0;
    const difference = finalAggregate - targetCutoff;

    let chance = 0;
    let statusText = '';
    let statusColor = '';

    if (difference >= 3) {
      chance = 95;
      statusText = 'Excellent! Your aggregate is higher than last year\'s cut-off. Highly Safe Chance of Admission!';
      statusColor = 'text-green-600 bg-green-50 border-green-200';
    } else if (difference >= 0) {
      chance = 80;
      statusText = 'Very Good. Your aggregate matches or slightly exceeds the cut-off. Safe Chance of Admission!';
      statusColor = 'text-green-600 bg-green-50 border-green-200';
    } else if (difference >= -4) {
      chance = 50;
      statusText = 'Competitive Borderline. You are slightly below the cut-off. A supplementary or second-choice option is advised.';
      statusColor = 'text-amber-700 bg-amber-50 border-amber-200';
    } else {
      chance = 20;
      statusText = 'High Risk. Your aggregate is significantly below last year\'s cut-off. We advise exploring state universities or lower competition courses.';
      statusColor = 'text-red-700 bg-red-50 border-red-200';
    }

    setAggregateResult({
      aggregate: Math.round(finalAggregate * 100) / 100,
      jambRatio: Math.round(jambContribution * 100) / 100,
      olevelRatio: Math.round(olevelContribution * 100) / 100,
      putmeRatio: Math.round(putmeContribution * 100) / 100,
      cutoff: targetCutoff,
      chance,
      statusText,
      statusColor
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-dark flex items-center gap-2">
            <FaCalculator className="text-[#032b44]" /> One-Click Admission Calculator
          </h2>
          <p className="text-gray-500 text-sm">Calculate your precise aggregate percentage and predict university admission chances instantly</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form Column */}
        <form onSubmit={handleCalculate} className="lg:col-span-7 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Target School</label>
              <select
                value={school}
                onChange={(e) => {
                  setSchool(e.target.value);
                  setAggregateResult(null);
                }}
                className="w-full p-2.5 border rounded-lg bg-white text-sm"
              >
                <option value="UNILAG">University of Lagos (UNILAG)</option>
                <option value="UI">University of Ibadan (UI)</option>
                <option value="OAU">Obafemi Awolowo University (OAU)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Target Course</label>
              <select
                value={course}
                onChange={(e) => {
                  setCourse(e.target.value);
                  setAggregateResult(null);
                }}
                className="w-full p-2.5 border rounded-lg bg-white text-sm"
              >
                <option value="Medicine">Medicine & Surgery</option>
                <option value="Law">Faculty of Law</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Accounting">Accounting / Finance</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">JAMB Score (out of 400)</label>
              <input
                type="number"
                min={100}
                max={400}
                value={jambScore}
                onChange={(e) => setJambScore(e.target.value)}
                className="w-full p-2.5 border rounded-lg bg-white text-sm focus:outline-none focus:border-[#032b44]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                {school === 'UNILAG' && 'Post-UTME Expected (out of 30)'}
                {school === 'UI' && 'Post-UTME Expected (out of 100)'}
                {school === 'OAU' && 'Post-UTME Expected (out of 40)'}
              </label>
              <input
                type="number"
                min={0}
                max={school === 'UNILAG' ? 30 : school === 'UI' ? 100 : 40}
                value={postUtmeScore}
                onChange={(e) => setPostUtmeScore(e.target.value)}
                className="w-full p-2.5 border rounded-lg bg-white text-sm focus:outline-none focus:border-[#032b44]"
                required
              />
            </div>
          </div>

          {/* OLevel Section (conditionally hidden or disabled for UI aggregate formula) */}
          {school !== 'UI' ? (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-150 space-y-3.5">
              <span className="block text-xs font-extrabold text-[#032b44] uppercase tracking-wider">WAEC / NECO Grades (Top 5 Core Subjects)</span>
              <div className="grid grid-cols-5 gap-2">
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Maths</label>
                  <select value={mathGrade} onChange={(e) => setMathGrade(e.target.value)} className="w-full p-1.5 border rounded text-xs bg-white">
                    {Object.keys(GRADES_UNILAG).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">English</label>
                  <select value={engGrade} onChange={(e) => setEngGrade(e.target.value)} className="w-full p-1.5 border rounded text-xs bg-white">
                    {Object.keys(GRADES_UNILAG).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Subj 3</label>
                  <select value={subj3} onChange={(e) => setSubj3(e.target.value)} className="w-full p-1.5 border rounded text-xs bg-white">
                    {Object.keys(GRADES_UNILAG).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Subj 4</label>
                  <select value={subj4} onChange={(e) => setSubj4(e.target.value)} className="w-full p-1.5 border rounded text-xs bg-white">
                    {Object.keys(GRADES_UNILAG).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase mb-1">Subj 5</label>
                  <select value={subj5} onChange={(e) => setSubj5(e.target.value)} className="w-full p-1.5 border rounded text-xs bg-white">
                    {Object.keys(GRADES_UNILAG).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-150 text-xs text-gray-500 leading-relaxed">
              💡 **UI Aggregate Formula Note:** The University of Ibadan does NOT include O\'Level point grades directly in the 100% aggregate score. O\'Level results are purely audited to verify that you achieved a minimum of 5 credits (including English and Mathematics) at a single sitting or equivalent clearance.
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#032b44] hover:bg-[#f1a33b] text-white font-bold py-3.5 rounded-xl shadow-lg transition transform hover:-translate-y-0.5"
          >
            Calculate Aggregate & Chances
          </button>
        </form>

        {/* Results Graph / Column */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          {aggregateResult ? (
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 space-y-5 animate-scaleIn">
              <div className="text-center">
                <span className="text-xs text-gray-400 font-extrabold tracking-wider uppercase">CALCULATED AGGREGATE</span>
                <h3 className="text-4xl font-extrabold text-[#032b44] mt-1.5">
                  {aggregateResult.aggregate}%
                </h3>
                <span className="text-[11px] text-gray-400 font-semibold">
                  (Target Cut-off: {aggregateResult.cutoff}%)
                </span>
              </div>

              {/* Ratios breaking details */}
              <div className="space-y-2 border-t border-b py-3.5 text-xs text-gray-600 font-medium">
                <div className="flex justify-between">
                  <span>JAMB contribution:</span>
                  <span className="font-bold text-[#032b44]">{aggregateResult.jambRatio}%</span>
                </div>
                {school !== 'UI' && (
                  <div className="flex justify-between">
                    <span>O'Level contribution:</span>
                    <span className="font-bold text-[#032b44]">{aggregateResult.olevelRatio}%</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Post-UTME contribution:</span>
                  <span className="font-bold text-[#032b44]">{aggregateResult.putmeRatio}%</span>
                </div>
              </div>

              {/* Chance index */}
              <div className="text-center">
                <span className="block text-xs text-gray-400 font-bold uppercase mb-1">PROBABILITY OF ADMISSION</span>
                <div className="flex items-center justify-center gap-1">
                  <FaPercent className="text-amber-500 text-sm" />
                  <span className="text-2xl font-black text-amber-500">{aggregateResult.chance}%</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mt-2">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      aggregateResult.chance >= 80 ? 'bg-green-500' : aggregateResult.chance >= 50 ? 'bg-amber-400' : 'bg-red-500'
                    }`}
                    style={{ width: `${aggregateResult.chance}%` }}
                  />
                </div>
              </div>

              {/* Remarks Box */}
              <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${aggregateResult.statusColor}`}>
                {aggregateResult.statusText}
              </div>
            </div>
          ) : (
            <div className="text-center py-14 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col justify-center items-center">
              <FaCalculator className="text-gray-300 text-5xl mb-3 animate-pulse" />
              <h4 className="font-bold text-gray-500 text-sm">Waiting for Calculation Parameters</h4>
              <p className="text-gray-400 text-xs mt-1 w-64">Enter your JAMB, O'Level, and Post-UTME details to see your admissions chances.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdmissionCalculator;
