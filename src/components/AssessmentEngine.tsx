import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { TestQuestion, UserPsychologicalVector } from '../types';
import { calculateVectorFromAnswers } from '../utils/scoring';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Keyboard, 
  Clock, 
  Layers,
  AlertTriangle
} from 'lucide-react';

interface AssessmentEngineProps {
  questions: TestQuestion[];
  title: string;
  subtitle?: string;
  testId?: string;
  isQuickLab?: boolean;
  currentVector: UserPsychologicalVector;
  onComplete: (updatedVector: UserPsychologicalVector) => void;
  onCancel: () => void;
}

const LIKERT_OPTIONS = [
  { value: 1, label: 'Strongly Disagree', short: 'STRONGLY DISAGREE', color: '#FF6B6B' },
  { value: 2, label: 'Disagree', short: 'DISAGREE', color: '#FFA07A' },
  { value: 3, label: 'Slightly Disagree', short: 'SLIGHTLY DISAGREE', color: '#FED7AA' },
  { value: 4, label: 'Neutral', short: 'NEUTRAL', color: '#E2E8F0' },
  { value: 5, label: 'Slightly Agree', short: 'SLIGHTLY AGREE', color: '#BAE6FD' },
  { value: 6, label: 'Agree', short: 'AGREE', color: '#A7F3D0' },
  { value: 7, label: 'Strongly Agree', short: 'STRONGLY AGREE', color: '#A3F7BF' }
];

export const AssessmentEngine: React.FC<AssessmentEngineProps> = ({
  questions,
  title,
  subtitle,
  testId = 'omni-core',
  isQuickLab = false,
  currentVector,
  onComplete,
  onCancel
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const isSensitiveTest = testId === 'shadow-fast' || testId === 'neuro-fast';
  const [hasConsentedSensitive, setHasConsentedSensitive] = useState<boolean>(!isSensitiveTest);

  const currentQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;

  const handleSelectAnswer = useCallback((value: number) => {
    if (!currentQuestion) return;

    const nextAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(nextAnswers);

    // Smooth auto-advance after brief visual snap feedback
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // Complete the test
        setIsFinishing(true);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FFE600', '#6366F1', '#10B981', '#F43F5E', '#0EA5E9']
        });
        setTimeout(() => {
          const updated = calculateVectorFromAnswers(nextAnswers, questions, currentVector, testId);
          onComplete(updated);
        }, 900);
      }
    }, 180);
  }, [currentQuestion, answers, currentIndex, questions, currentVector, testId, onComplete]);

  // Keyboard navigation support: 1 through 7, Left / Right arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Numbers 1-7
      if (e.key >= '1' && e.key <= '7') {
        const val = parseInt(e.key, 10);
        handleSelectAnswer(val);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (e.key === 'ArrowRight' && currentIndex < questions.length - 1 && currentAnswer !== undefined) {
        setCurrentIndex(prev => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelectAnswer, currentIndex, questions.length, currentAnswer]);

  // Sensitive Domain Consent Gate
  if (!hasConsentedSensitive) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center max-w-2xl mx-auto py-8 px-4 animate-in fade-in">
        <div className="brutal-card p-6 sm:p-8 bg-white brutal-shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b-2 border-[#0F172A] pb-4">
            <div className="w-12 h-12 bg-[#0F172A] text-[#FFE600] brutal-border flex items-center justify-center font-display font-black text-2xl shrink-0">
              🛡️
            </div>
            <div>
              <span className="brutal-badge bg-amber-200 text-amber-950 text-xs font-mono font-bold">
                SENSITIVE DOMAIN DISCLOSURE
              </span>
              <h2 className="font-display font-black text-xl sm:text-2xl text-[#0F172A] mt-1">
                {title}
              </h2>
            </div>
          </div>

          <div className="space-y-4 font-mono text-xs text-slate-700 leading-relaxed">
            <p className="bg-amber-50 p-3.5 brutal-border border-amber-300 text-amber-950 font-bold">
              Notice: This module measures self-reported psychological orientations across subclinical cognitive patterns or defensive strategies.
            </p>

            <ul className="space-y-2 list-disc list-inside bg-slate-50 p-4 brutal-border">
              <li>
                <strong>Non-Clinical Scope:</strong> This questionnaire is strictly for personal reflection and psychometric education. It is <strong>NOT</strong> a clinical diagnostic assessment for psychiatric disorders or neurodevelopmental conditions.
              </li>
              <li>
                <strong>Data Privacy:</strong> Your individual item answers and derived subclinical indicators remain private to your device/session unless you explicitly opt in to share summary archetypes.
              </li>
              <li>
                <strong>Voluntary Participation:</strong> You may exit or skip this module at any point without impacting your core archetype passport.
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <button
              onClick={onCancel}
              className="brutal-btn bg-white text-slate-700 hover:bg-slate-100 px-4 py-2.5 font-mono text-xs font-bold"
            >
              CANCEL & RETURN
            </button>
            <button
              onClick={() => setHasConsentedSensitive(true)}
              className="brutal-btn bg-[#0F172A] text-white hover:bg-slate-800 px-6 py-3 font-mono text-xs font-black flex items-center justify-center gap-2"
            >
              <span>I UNDERSTAND & CONSENT TO PROCEED</span>
              <ArrowRight size={14} className="text-[#FFE600]" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-between max-w-4xl mx-auto py-4 px-3 sm:px-6">
      {/* Top Header Bar */}
      <div className="brutal-card p-4 mb-4 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#0F172A] pb-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="brutal-badge bg-[#FFE600] text-xs">
                {isQuickLab ? 'QUICK-LAB // MICRO-TEST' : 'OMNI-ASSESSMENT // CAT ENGINE'}
              </span>
              <span className="font-mono text-xs font-bold text-slate-600 flex items-center gap-1">
                <Clock size={13} />
                ITEM {currentIndex + 1} OF {questions.length}
              </span>
            </div>
            <h2 className="font-display font-black text-xl sm:text-2xl mt-1 tracking-tight">{title}</h2>
            {subtitle && <p className="text-xs sm:text-sm text-slate-600 font-mono">{subtitle}</p>}
          </div>

          <button
            onClick={onCancel}
            className="brutal-btn bg-[#FDFBF7] hover:bg-rose-100 text-xs px-3 py-1.5 font-mono"
          >
            EXIT ASSESSMENT
          </button>
        </div>

        {/* Chunky Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono font-bold">
            <span>SYNTHESIS PROGRESS</span>
            <span className="bg-[#FFE600] px-1.5 brutal-border">{progressPercent}%</span>
          </div>
          <div className="w-full h-4 bg-[#F1EFE9] brutal-border overflow-hidden relative">
            <div 
              className="h-full bg-[#6366F1] transition-all duration-300 ease-out flex items-center justify-end pr-1"
              style={{ width: `${progressPercent}%` }}
            >
              <span className="w-1.5 h-1.5 bg-[#FFE600] rounded-full inline-block" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="brutal-card bg-white p-4 sm:p-10 my-auto brutal-shadow-xl relative overflow-hidden">
        {/* Domain Indicator Pill */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <span className="p-1 sm:p-1.5 brutal-border bg-[#0F172A] text-white">
              <Layers size={15} />
            </span>
            <span className="font-mono text-[10px] sm:text-xs font-extrabold uppercase tracking-wider bg-white px-2 sm:px-2.5 py-0.5 sm:py-1 brutal-border truncate max-w-[220px] sm:max-w-none">
              DOMAIN: {currentQuestion?.domain?.toUpperCase()} // {currentQuestion?.subDimension?.toUpperCase()}
            </span>
          </div>

          {currentQuestion?.infrequencyCheck && (
            <span className="brutal-badge bg-amber-200 text-amber-900 flex items-center gap-1 text-[10px] sm:text-xs">
              <AlertTriangle size={12} /> CALIBRATION CHECK
            </span>
          )}
        </div>

        {/* Question Prompt */}
        <div className="my-3 sm:my-6 min-h-[60px] sm:min-h-[110px] flex items-center">
          <h3 className="font-display font-extrabold text-lg sm:text-3xl sm:leading-tight text-[#0F172A]">
            "{currentQuestion?.prompt}"
          </h3>
        </div>

        {/* MOBILE VIEW: Ultra-Compact Ergonomic 7-Point Touch Matrix (sm:hidden) */}
        <div className="block sm:hidden mt-3 space-y-2">
          {/* Subtle Directional Legend */}
          <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 px-1">
            <span className="text-[#FF6B6B] font-black tracking-tight">← DISAGREE</span>
            <span className="text-slate-400">NEUTRAL (4)</span>
            <span className="text-[#10B981] font-black tracking-tight">AGREE →</span>
          </div>

          {/* 7-Segment Touch Capsule Strip */}
          <div className="grid grid-cols-7 gap-1">
            {LIKERT_OPTIONS.map((opt) => {
              const isSelected = currentAnswer === opt.value;

              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelectAnswer(opt.value)}
                  className={`min-h-[50px] py-1.5 px-0.5 flex flex-col items-center justify-between brutal-border transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-[#0F172A] text-white font-black'
                      : 'bg-white text-[#0F172A] hover:bg-slate-50'
                  }`}
                  style={{
                    borderColor: '#0F172A',
                    boxShadow: isSelected ? '2.5px 2.5px 0px 0px #FFE600' : '1.5px 1.5px 0px 0px #0F172A'
                  }}
                  title={opt.label}
                >
                  <span className={`text-base font-display font-black leading-none ${isSelected ? 'text-[#FFE600]' : ''}`}>
                    {opt.value}
                  </span>
                  
                  {/* Micro color pill */}
                  <span 
                    className="w-2.5 h-1 rounded-sm mt-1"
                    style={{ backgroundColor: opt.color }}
                  />

                  {/* Micro indicator */}
                  <span className="text-[7px] font-mono uppercase font-bold tracking-tighter opacity-80 mt-0.5 truncate w-full text-center">
                    {opt.value === 1 ? 'MAX-' : opt.value === 4 ? 'MID' : opt.value === 7 ? 'MAX+' : `${opt.value}`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Dynamic Active Mobile Selection Feedback Pill */}
          <div className="flex items-center justify-between p-2 bg-white brutal-border font-mono text-[11px]">
            <span className="text-slate-500 font-bold text-[10px]">SELECTED:</span>
            {currentAnswer ? (
              <span className="font-black px-2 py-0.5 bg-[#FFE600] text-[#0F172A] brutal-border text-[10px] flex items-center gap-1">
                <span 
                  className="w-2 h-2 rounded-full inline-block border border-black/30"
                  style={{ backgroundColor: LIKERT_OPTIONS.find(o => o.value === currentAnswer)?.color }}
                />
                {LIKERT_OPTIONS.find(o => o.value === currentAnswer)?.short} ({currentAnswer})
              </span>
            ) : (
              <span className="text-slate-400 italic text-[10px]">Tap 1-7 above to answer</span>
            )}
          </div>
        </div>

        {/* DESKTOP VIEW: 7-Point Magnetic Likert Response Matrix (Identical for PC) */}
        <div className="hidden sm:block mt-8 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-600 px-1">
            <span className="text-[#FF6B6B] font-black">← STRONGLY DISAGREE</span>
            <span className="text-slate-400">NEUTRAL</span>
            <span className="text-[#10B981] font-black">STRONGLY AGREE →</span>
          </div>

          <div className="grid grid-cols-7 gap-3">
            {LIKERT_OPTIONS.map((opt) => {
              const isSelected = currentAnswer === opt.value;

              return (
                <button
                  key={opt.value}
                  onClick={() => handleSelectAnswer(opt.value)}
                  onMouseEnter={() => setHoveredValue(opt.value)}
                  onMouseLeave={() => setHoveredValue(null)}
                  className={`relative flex flex-col items-center justify-center p-4 brutal-border transition-all duration-150 ${
                    isSelected 
                      ? 'bg-[#0F172A] text-white brutal-shadow-lg scale-105 z-10' 
                      : 'bg-white hover:bg-slate-50 text-[#0F172A] hover:-translate-y-1'
                  }`}
                  style={{
                    borderColor: '#0F172A',
                    boxShadow: isSelected ? '4px 4px 0px 0px #FFE600' : undefined
                  }}
                >
                  <span className={`text-2xl font-display font-black ${isSelected ? 'text-[#FFE600]' : ''}`}>
                    {opt.value}
                  </span>
                  <span className="font-mono text-[10px] uppercase font-bold mt-1 text-center truncate max-w-full">
                    {opt.short.split(' ')[0]}
                  </span>
                  
                  {/* Subtle color bar indicator */}
                  <div 
                    className="w-full h-1 mt-1.5"
                    style={{ backgroundColor: opt.color }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Selection Feedback Banner */}
        <div className="mt-4 sm:mt-6 flex items-center justify-between text-xs font-mono bg-white p-2 sm:p-2.5 brutal-border">
          <div className="flex items-center gap-2">
            <span className="font-bold">CURRENT SELECTION:</span>
            {currentAnswer ? (
              <span className="bg-[#FFE600] px-2 py-0.5 font-black brutal-border">
                {LIKERT_OPTIONS.find(o => o.value === currentAnswer)?.label} (KEY: {currentAnswer})
              </span>
            ) : (
              <span className="text-slate-400 italic">Tap an option above</span>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-500">
            <Keyboard size={14} />
            <span>Use keys 1-7 on keyboard for rapid speedrun</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Controls */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
          disabled={currentIndex === 0}
          className="brutal-btn bg-white px-4 py-2 text-sm font-mono flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={16} /> PREVIOUS
        </button>

        <div className="flex items-center gap-2 text-xs font-mono font-bold">
          <span>ITEM {currentIndex + 1} / {questions.length}</span>
        </div>

        <button
          onClick={() => {
            if (currentIndex < questions.length - 1) {
              setCurrentIndex(prev => prev + 1);
            } else if (currentAnswer !== undefined) {
              handleSelectAnswer(currentAnswer);
            }
          }}
          disabled={currentAnswer === undefined && currentIndex === questions.length - 1}
          className="brutal-btn bg-[#FFE600] px-5 py-2 text-sm font-mono font-black flex items-center gap-1.5 disabled:opacity-40"
        >
          {currentIndex === questions.length - 1 ? (
            <>
              FINISH & UNLOCK VECTOR <Sparkles size={16} />
            </>
          ) : (
            <>
              NEXT <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>

      {/* Non-Clinical Educational Scope Footer */}
      <div className="mt-4 pt-3 border-t border-slate-200 text-center font-mono text-[10px] text-slate-500">
        OmniPsyche CAT Engine • Self-Reported Psychometric Education & Personal Reflection • Not for Clinical Diagnosis
      </div>
    </div>
  );
};
