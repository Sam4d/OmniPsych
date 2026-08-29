import React from 'react';
import { MicroTest } from '../types';
import { QUICK_LAB_TESTS } from '../data/questions';
import { 
  HeartHandshake, 
  Briefcase, 
  EyeOff, 
  Activity, 
  Flame, 
  ShieldCheck, 
  Cpu, 
  Feather, 
  Clock, 
  ArrowRight,
  LucideIcon
} from 'lucide-react';

interface QuickLabGridProps {
  onStartMicroTest: (test: MicroTest) => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  HeartHandshake,
  Briefcase,
  EyeOff,
  Activity,
  Flame,
  ShieldCheck,
  Cpu,
  Feather
};

export const QuickLabGrid: React.FC<QuickLabGridProps> = ({
  onStartMicroTest
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 px-3 sm:px-6">
      {/* Header */}
      <div className="brutal-card bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#0F172A] pb-4">
          <div>
            <span className="brutal-badge bg-[#FFE600] text-xs mb-1">
              THE QUICK-LAB // 12 MODULAR INSTRUMENTS
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-[#0F172A] tracking-tight uppercase">
              Targeted Psychometric Micro-Tests
            </h2>
            <p className="font-mono text-xs sm:text-sm text-slate-600 mt-1">
              Complete high-precision 3-minute assessments. Every result mathematically updates your centralized UPG vector.
            </p>
          </div>
          <span className="font-mono text-xs font-bold bg-[#A3F7BF] px-3 py-1.5 brutal-border">
            100% FREE & EMPIRICALLY GROUNDED
          </span>
        </div>
      </div>

      {/* Grid of Micro Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {QUICK_LAB_TESTS.map((test) => {
          const IconComp = ICON_MAP[test.iconName] || Activity;

          return (
            <div
              key={test.id}
              className="brutal-card bg-white p-6 flex flex-col justify-between hover:-translate-y-1 transition-all duration-150 relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="p-2 brutal-border text-white flex items-center justify-center"
                    style={{ backgroundColor: test.color }}
                  >
                    <IconComp size={20} />
                  </div>
                  <span className="brutal-badge bg-white text-[10px]">
                    {test.badge}
                  </span>
                </div>

                <h3 className="font-display font-black text-xl text-[#0F172A] leading-snug group-hover:text-indigo-600 transition-colors">
                  {test.title}
                </h3>
                <p className="font-mono text-xs font-bold text-slate-500 mt-0.5 mb-2">
                  {test.subtitle}
                </p>

                <p className="text-xs text-slate-700 font-mono leading-relaxed mb-4">
                  {test.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#0F172A] flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs font-mono font-bold text-slate-600">
                  <Clock size={13} />
                  <span>{test.timeMinutes} MIN ({test.questionCount} Qs)</span>
                </div>

                <button
                  onClick={() => onStartMicroTest(test)}
                  className="brutal-btn bg-[#FFE600] px-3 py-1.5 text-xs font-mono font-black flex items-center gap-1"
                >
                  START <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
