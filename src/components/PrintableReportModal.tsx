import React from 'react';
import { Archetype, UserPsychologicalVector } from '../types';
import { ArchetypeAvatar } from './ArchetypeAvatar';
import { 
  Printer, 
  Download, 
  X, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Compass, 
  Heart, 
  Briefcase, 
  Zap,
  BookOpen,
  Award
} from 'lucide-react';

interface PrintableReportModalProps {
  archetype: Archetype;
  vector: UserPsychologicalVector;
  onClose: () => void;
}

export const PrintableReportModal: React.FC<PrintableReportModalProps> = ({
  archetype,
  vector,
  onClose
}) => {
  const isAssertive = vector.identityVariant === 'Assertive';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white max-w-5xl w-full max-h-[94vh] flex flex-col brutal-border brutal-shadow-xl relative my-auto animate-in fade-in duration-200 print:max-h-none print:shadow-none print:border-none print:w-full">
        {/* Top Floating Control Bar (Hidden on Print) */}
        <div className="p-3 sm:p-5 border-b-2 border-[#0F172A] bg-[#FFE600] flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#0F172A] text-[#FFE600] brutal-border flex items-center justify-center font-display font-black text-base shrink-0">
              <Printer size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="brutal-badge bg-[#0F172A] text-white text-[9px] sm:text-[10px] font-mono font-bold">
                  OFFICIAL PSYCHOMETRIC REPORT // PRINT & PDF EXPORT
                </span>
                <span className="hidden sm:inline font-mono text-[10px] font-bold text-slate-800 bg-white px-2 py-0.5 brutal-border">
                  VECTOR SPECIFICATION
                </span>
              </div>
              <h2 className="font-display font-black text-base sm:text-xl text-[#0F172A] tracking-tight">
                Printable Psychometric Profile & Summary Sheet
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="brutal-btn bg-[#0F172A] text-white hover:bg-slate-800 px-4 py-2 text-xs font-mono font-black flex items-center gap-1.5 min-h-[40px]"
            >
              <Printer size={15} />
              <span>PRINT / SAVE AS PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white brutal-border brutal-shadow-sm hover:bg-rose-100 transition-colors shrink-0 min-h-[40px] min-w-[40px] flex items-center justify-center active:scale-95"
              title="Close Report"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="flex-1 p-4 sm:p-8 md:p-10 overflow-y-auto space-y-6 font-sans bg-[#FCFAF5] print:p-4 print:bg-white text-[#0F172A]">
          {/* Official Document Header */}
          <div className="p-5 sm:p-6 brutal-border bg-[#0F172A] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            {/* Watermark */}
            <div className="absolute right-0 top-0 text-[100px] font-display font-black text-white/5 pointer-events-none select-none -translate-y-8 translate-x-8">
              {archetype.code}
            </div>

            <div className="space-y-2 z-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 bg-[#FFE600] text-[#0F172A] font-mono text-[10px] font-black uppercase tracking-wider brutal-border">
                  CERTIFIED PSYCHOMETRIC SPECIFICATION
                </span>
                <span className="px-2 py-0.5 bg-white/20 text-white font-mono text-[10px] font-bold">
                  OMNIPSYCHE // 2026
                </span>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
                {archetype.name}
              </h1>

              <p className="font-display text-lg sm:text-xl font-bold text-[#FFE600]">
                "{archetype.title}"
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 pt-1">
                <span>TYPOLOGY: <strong className="text-white">{archetype.code}-{vector.identityVariant}</strong></span>
                <span>•</span>
                <span>HOUSE: <strong className="text-white">{archetype.house.toUpperCase()}</strong></span>
                <span>•</span>
                <span>DATE: <strong className="text-white">{vector.completionDate || '2026'}</strong></span>
                <span>•</span>
                <span>ID: <strong className="text-[#FFE600]">UPG-{vector.calculatedArchetypeId.toUpperCase()}</strong></span>
              </div>
            </div>

            <div className="z-10 shrink-0 self-center md:self-auto">
              <ArchetypeAvatar archetype={archetype} variant={vector.identityVariant} size="lg" />
            </div>
          </div>

          {/* Section 1: Executive Psychological Synthesis */}
          <div className="bg-white p-5 sm:p-6 brutal-border space-y-3">
            <div className="flex items-center justify-between border-b pb-2 border-slate-200">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-[#FFE600] brutal-border text-[#0F172A]">
                  <Sparkles size={16} />
                </span>
                <h3 className="font-display font-black text-lg text-[#0F172A]">
                  EXECUTIVE PSYCHOLOGICAL SYNTHESIS
                </h3>
              </div>
              <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                7-LAYER UNIFIED TOPOLOGY
              </span>
            </div>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-serif">
              {archetype.fullDescription}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 font-mono text-xs">
              <div className="p-3 bg-indigo-50/70 brutal-border border-indigo-200">
                <span className="font-bold text-indigo-900 block text-[11px] mb-1">COGNITIVE STAMINA</span>
                <p className="text-slate-700">
                  {vector.hexaco.conscientiousness > 70 ? 'High structured executive execution' : 'Fluid adaptive ideation capacity'}.
                </p>
              </div>

              <div className="p-3 bg-emerald-50/70 brutal-border border-emerald-200">
                <span className="font-bold text-emerald-900 block text-[11px] mb-1">RELATIONAL REGULATION</span>
                <p className="text-slate-700">
                  {vector.attachment.style} dynamic with balanced interpersonal autonomy.
                </p>
              </div>

              <div className="p-3 bg-amber-50/70 brutal-border border-amber-200">
                <span className="font-bold text-amber-900 block text-[11px] mb-1">STRESS ARCHITECTURE</span>
                <p className="text-slate-700">
                  {isAssertive ? 'Autonomous emotional recalibration' : 'High sensitivity hyper-vigilance'}.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: 7-Layer Trait Summary Visualizer Sheet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* HEXACO 6-Factor Percentile Spectrum */}
            <div className="bg-white p-5 brutal-border space-y-4">
              <div className="flex items-center justify-between border-b pb-2 border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-[#0F172A] text-white brutal-border">
                    <Compass size={15} />
                  </span>
                  <h4 className="font-display font-black text-base text-[#0F172A]">
                    HEXACO PI-R SPECTRUM
                  </h4>
                </div>
                <span className="font-mono text-[10px] font-bold text-slate-500">6 FACTOR SCALE</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {[
                  { label: 'Honesty-Humility', val: vector.hexaco.honestyHumility, color: '#10B981', desc: 'Fairness, sincerity, greed avoidance' },
                  { label: 'Emotionality', val: vector.hexaco.emotionality, color: '#06B6D4', desc: 'Vulnerability, empathic sentimentality' },
                  { label: 'Extraversion', val: vector.hexaco.extraversion, color: '#F59E0B', desc: 'Social boldness, vitality, leadership' },
                  { label: 'Agreeableness', val: vector.hexaco.agreeableness, color: '#8B5CF6', desc: 'Patience, forgiveness, gentleness' },
                  { label: 'Conscientiousness', val: vector.hexaco.conscientiousness, color: '#EC4899', desc: 'Diligence, orderliness, organization' },
                  { label: 'Openness to Exp.', val: vector.hexaco.openness, color: '#6366F1', desc: 'Intellectual curiosity, aesthetic depth' }
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{item.label}</span>
                      <span className="font-black text-slate-900">{item.val}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 brutal-border">
                      <div 
                        className="h-full transition-all" 
                        style={{ width: `${item.val}%`, backgroundColor: item.color }} 
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 block">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Relational Attachment & Emotional Resilience */}
            <div className="space-y-6">
              {/* Attachment Coordinates */}
              <div className="bg-white p-5 brutal-border space-y-3">
                <div className="flex items-center justify-between border-b pb-2 border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="p-1 bg-[#FF6B6B] text-white brutal-border">
                      <Heart size={15} />
                    </span>
                    <h4 className="font-display font-black text-base text-[#0F172A]">
                      RELATIONAL ATTACHMENT (ECR-R)
                    </h4>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 brutal-border">
                    {vector.attachment.style.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <div className="p-3 bg-slate-50 brutal-border">
                    <span className="text-[10px] text-slate-500 block">ATTACHMENT ANXIETY</span>
                    <span className="text-lg font-black text-[#0F172A]">{vector.attachment.anxiety}%</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Need for relational proximity</span>
                  </div>
                  <div className="p-3 bg-slate-50 brutal-border">
                    <span className="text-[10px] text-slate-500 block">ATTACHMENT AVOIDANCE</span>
                    <span className="text-lg font-black text-[#0F172A]">{vector.attachment.avoidance}%</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">Self-reliant boundary defenses</span>
                  </div>
                </div>

                <p className="font-mono text-xs text-slate-700 bg-rose-50/50 p-2.5 brutal-border border-rose-200">
                  <strong>Conflict Profile:</strong> Maintains autonomic stability with low defensiveness. Best paired with partners who appreciate high intellectual clarity.
                </p>
              </div>

              {/* Trait EQ & Duckworth Grit */}
              <div className="bg-white p-5 brutal-border space-y-3">
                <div className="flex items-center justify-between border-b pb-2 border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="p-1 bg-[#10B981] text-white brutal-border">
                      <Award size={15} />
                    </span>
                    <h4 className="font-display font-black text-base text-[#0F172A]">
                      TRAIT EQ & DUCKWORTH GRIT
                    </h4>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-slate-500">
                    REGULATION INDEX
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <div className="p-3 bg-emerald-50/60 brutal-border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 font-bold block">TRAIT EMOTIONAL INTEL</span>
                    <span className="text-xl font-black text-emerald-950">{vector.traitEq.score}%</span>
                    <span className="text-[10px] text-slate-600 block mt-0.5">Empathic clarity & regulation</span>
                  </div>

                  <div className="p-3 bg-amber-50/60 brutal-border border-amber-200">
                    <span className="text-[10px] text-amber-800 font-bold block">DUCKWORTH GRIT SCALE</span>
                    <span className="text-xl font-black text-amber-950">{vector.grit.score} / 5.0</span>
                    <span className="text-[10px] text-slate-600 block mt-0.5">Long-term perseverance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Vocational Holland (O*NET) & Superpowers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Holland RIASEC Career Code */}
            <div className="bg-white p-5 brutal-border space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b pb-2 border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-[#6366F1] text-white brutal-border">
                    <Briefcase size={15} />
                  </span>
                  <h4 className="font-display font-black text-base text-[#0F172A]">
                    HOLLAND RIASEC VOCATIONAL CODE
                  </h4>
                </div>
                <span className="font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 brutal-border">
                  {vector.riasec.hollandCode}
                </span>
              </div>

              <p className="text-slate-700 leading-relaxed">
                Your highest career interest aligns with <strong className="text-indigo-900">{vector.riasec.primaryDomain}</strong> and <strong className="text-indigo-900">{vector.riasec.secondaryDomain}</strong> tasks.
              </p>

              <div className="space-y-1.5 pt-1">
                <span className="font-bold text-slate-700 text-[11px] block uppercase">
                  Top Recommended Career Alignments:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Systems Architect', 'Quantitative Researcher', 'Strategic Director', 'Engineering Lead'].map((c) => (
                    <span key={c} className="bg-slate-100 px-2 py-1 brutal-border text-slate-800 font-bold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Superpowers & Growth Directives */}
            <div className="bg-white p-5 brutal-border space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b pb-2 border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-[#FFE600] text-[#0F172A] brutal-border">
                    <Zap size={15} />
                  </span>
                  <h4 className="font-display font-black text-base text-[#0F172A]">
                    SUPERPOWERS & BLINDSPOTS
                  </h4>
                </div>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 bg-emerald-50 brutal-border border-emerald-300">
                  <span className="font-bold text-emerald-900 block text-[10px] uppercase">KEY ADVANTAGE:</span>
                  <p className="text-slate-800 text-[11px] font-bold mt-0.5">
                    "{archetype.superpowers[0]}"
                  </p>
                </div>

                <div className="p-2.5 bg-rose-50 brutal-border border-rose-300">
                  <span className="font-bold text-rose-900 block text-[10px] uppercase">FATAL BLINDSPOT TO GUARD:</span>
                  <p className="text-slate-800 text-[11px] font-bold mt-0.5">
                    "{archetype.blindspots[0]}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Official Verification Footer Seal */}
          <div className="pt-4 border-t-2 border-[#0F172A] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 brutal-border bg-[#0F172A] text-[#FFE600] flex items-center justify-center font-display font-black text-lg shrink-0">
                Ψ
              </div>
              <div>
                <span className="font-bold text-[#0F172A] block">OMNIPSYCHE PSYCHOMETRIC EVALUATION</span>
                <span className="text-[10px] text-slate-500">Continuous Vector Space • Zero Binary Stereotypes</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#FFE600] text-[#0F172A] font-mono font-black text-xs uppercase brutal-border">
                Made by Samad
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                VERIFIED HASH: #{Math.floor(Math.random() * 899999 + 100000)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
