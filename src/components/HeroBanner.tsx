import React from 'react';
import { 
  Play, 
  Layers, 
  ShieldCheck, 
  Compass, 
  Zap, 
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface HeroBannerProps {
  onStartFullAssessment: () => void;
  onExploreQuickLab: () => void;
  onOpenGlossary?: (termId?: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onStartFullAssessment,
  onExploreQuickLab,
  onOpenGlossary
}) => {
  return (
    <div className="brutal-card bg-white p-6 sm:p-10 mb-8 relative overflow-hidden brutal-shadow-xl text-[#0F172A]">
      <div className="relative z-10 max-w-3xl space-y-4 sm:space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="brutal-badge bg-[#FFE600] text-[#0F172A] text-[10px] sm:text-xs">
            OMNIPSYCHE // 7-LAYER PSYCHOMETRIC TEST
          </span>
          <span className="font-mono text-[10px] sm:text-xs font-black bg-[#F8FAFC] px-2 py-0.5 brutal-border">
            100% FREE & UNBIASED
          </span>
        </div>

        <h1 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-[#0F172A] tracking-tight leading-[1.1]">
          Understand who you are with precision.
        </h1>

        <p className="text-sm sm:text-base font-mono text-slate-700 leading-relaxed max-w-2xl">
          Move beyond oversimplified 4-letter types. OmniPsyche synthesizes scientific <strong>HEXACO Big-Six</strong>, <strong>Attachment Theory</strong>, and <strong>Holland RIASEC</strong> into one unified personal breakdown.
        </p>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button
            onClick={onStartFullAssessment}
            className="brutal-btn bg-[#0F172A] text-white hover:bg-slate-800 px-6 py-3.5 text-sm sm:text-base font-mono font-black flex items-center justify-center gap-2 min-h-[48px]"
          >
            <Play size={16} fill="currentColor" className="text-[#FFE600]" />
            <span>START THE QUIZ (5-6 MIN)</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={onExploreQuickLab}
            className="brutal-btn bg-[#F8FAFC] text-[#0F172A] hover:bg-slate-100 px-5 py-3.5 text-xs sm:text-sm font-mono font-bold flex items-center justify-center gap-1.5 min-h-[48px]"
          >
            <Zap size={15} className="text-[#F59E0B]" />
            <span>SHORT TESTS (2 MIN)</span>
          </button>
        </div>

        {/* Clean Scientific Trust Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-4 border-t-2 border-[#0F172A]/15 text-[11px] font-mono text-slate-600">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#0F172A] shrink-0" />
            <span className="font-bold">HEXACO PI-R Validated</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers size={14} className="text-[#0F172A] shrink-0" />
            <span className="font-bold">Attachment Dynamics</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
            <Compass size={14} className="text-[#0F172A] shrink-0" />
            <span className="font-bold">Holland Vocational RIASEC</span>
          </div>
        </div>
      </div>
    </div>
  );
};
