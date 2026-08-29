import React, { useState, useEffect } from 'react';
import { Archetype, UserPsychologicalVector } from '../types';
import { ArchetypeAvatar } from './ArchetypeAvatar';
import { 
  FileText, 
  Download, 
  Printer, 
  Sparkles, 
  X, 
  CheckCircle2, 
  Layers, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface MasterDossierModalProps {
  archetype: Archetype;
  vector: UserPsychologicalVector;
  onClose: () => void;
}

export const MasterDossierModal: React.FC<MasterDossierModalProps> = ({
  archetype,
  vector,
  onClose
}) => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<{
    synthesis: string;
    growthActionItems: string[];
  }>({
    synthesis: `Executive Psychological Synthesis for ${archetype.name} (${archetype.code}-${vector.identityVariant}):\n\nYour profile demonstrates high cognitive stamina with an exceptional Conscientiousness-to-Openness index (${vector.hexaco.conscientiousness}% / ${vector.hexaco.openness}%). Interpersonally, your ${vector.attachment.style} attachment pattern promotes autonomic stability in high-stakes negotiations, while your shadow trait integration reveals high persuasive leverage with healthy ethical guardrails.`,
    growthActionItems: [
      "Establish asynchronous deep-work buffers to prevent cognitive fragmentation.",
      "Practice vocalizing intent 10% earlier to reduce team friction in ambiguous sprints.",
      "Channel RIASEC Investigative impulses into high-leverage strategic prototypes."
    ]
  });

  useEffect(() => {
    async function fetchInsights() {
      try {
        const res = await fetch('/api/dossier-insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ archetype, userVector: vector })
        });
        const data = await res.json();
        if (data.synthesis) {
          setInsights({
            synthesis: data.synthesis,
            growthActionItems: data.growthActionItems || []
          });
        }
      } catch (e) {
        console.error('Failed to fetch dossier insights', e);
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, [archetype, vector]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="brutal-card bg-[#FDFBF7] max-w-4xl w-full max-h-[90vh] flex flex-col brutal-shadow-xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Actions Bar */}
        <div className="p-4 sm:p-5 border-b-2 border-[#0F172A] bg-white flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="brutal-badge bg-[#FFE600] text-xs">
                MASTER DOSSIER PASS // FULL 7-LAYER REPORT
              </span>
              <span className="font-mono text-xs font-bold text-slate-500">
                45-PAGE SPECIFICATION
              </span>
            </div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-[#0F172A] mt-1">
              Comprehensive Psychometric Dossier
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="brutal-btn bg-[#A3F7BF] text-[#0F172A] px-3.5 py-1.5 text-xs font-mono font-black flex items-center gap-1.5"
            >
              <Printer size={14} /> PRINT / SAVE PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 bg-white brutal-border brutal-shadow-sm hover:bg-rose-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Dossier Document Content Area */}
        <div className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-8 font-mono bg-white">
          {/* Cover Header Banner */}
          <div className="p-6 brutal-border bg-[#0F172A] text-white flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-[#FFE600] font-black uppercase tracking-widest block">
                CONFIDENTIAL PSYCHOMETRIC EVALUATION // OMNIPSYCHE
              </span>
              <h1 className="font-display font-black text-2xl sm:text-4xl text-white mt-1">
                {archetype.name}
              </h1>
              <p className="text-xs text-slate-300 font-bold mt-1">
                TYPOLOGY: {archetype.code}-{vector.identityVariant} | COMPLETED: {vector.completionDate}
              </p>
            </div>
            <ArchetypeAvatar archetype={archetype} variant={vector.identityVariant} size="md" />
          </div>

          {/* Section 1: Executive AI Synthesis */}
          <div className="p-6 bg-white brutal-border space-y-3">
            <div className="flex items-center gap-2 border-b border-[#0F172A] pb-2">
              <span className="brutal-badge bg-[#6366F1] text-white text-[10px]">SECTION 01</span>
              <h3 className="font-display font-black text-lg text-[#0F172A] uppercase">
                Executive Psychological Synthesis
              </h3>
            </div>
            {loading ? (
              <div className="flex items-center gap-2 text-slate-500 py-4 text-xs font-bold">
                <RefreshCw size={14} className="animate-spin text-indigo-600" />
                <span>Compiling multi-dimensional psychological synthesis...</span>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {insights.synthesis}
              </p>
            )}
          </div>

          {/* Section 2: 7-Layer Psychometric Matrix */}
          <div className="p-6 bg-white brutal-border space-y-4">
            <div className="flex items-center gap-2 border-b border-[#0F172A] pb-2">
              <span className="brutal-badge bg-[#10B981] text-white text-[10px]">SECTION 02</span>
              <h3 className="font-display font-black text-lg text-[#0F172A] uppercase">
                Unified Dimensional Metric Audit
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#FDFBF7] brutal-border">
                <span className="font-black text-[#0F172A] block mb-1">HEXACO 6-DOMAIN PROFILE</span>
                <div className="space-y-1 text-slate-700">
                  <div>Honesty-Humility: {vector.hexaco.honestyHumility}%</div>
                  <div>Emotionality: {vector.hexaco.emotionality}%</div>
                  <div>Extraversion: {vector.hexaco.extraversion}%</div>
                  <div>Agreeableness: {vector.hexaco.agreeableness}%</div>
                  <div>Conscientiousness: {vector.hexaco.conscientiousness}%</div>
                  <div>Openness: {vector.hexaco.openness}%</div>
                </div>
              </div>

              <div className="p-3 bg-[#FDFBF7] brutal-border">
                <span className="font-black text-[#0F172A] block mb-1">RELATIONAL & VOCATIONAL</span>
                <div className="space-y-1 text-slate-700">
                  <div>Attachment: {vector.attachment.style} ({vector.attachment.anxiety}% Anx / {vector.attachment.avoidance}% Avo)</div>
                  <div>Holland Code: {vector.riasec.hollandCode} ({vector.riasec.topCodes.join('-')})</div>
                  <div>Trait EQ: {vector.traitEq.score}% (Reg: {vector.traitEq.emotionRegulation}%)</div>
                  <div>Duckworth Grit: {vector.grit.score} / 5.0</div>
                  <div>Shadow Integration: {vector.shadow.shadowIntegrationLevel}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: High-Leverage Strategic Action Plan */}
          <div className="p-6 bg-[#FEF08A] brutal-border space-y-3">
            <div className="flex items-center gap-2 border-b border-[#0F172A] pb-2">
              <span className="brutal-badge bg-[#0F172A] text-white text-[10px]">SECTION 03</span>
              <h3 className="font-display font-black text-lg text-[#0F172A] uppercase">
                Strategic Growth Directives
              </h3>
            </div>
            <ul className="space-y-2 text-xs font-bold text-slate-900">
              {insights.growthActionItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-white p-2.5 brutal-border">
                  <CheckCircle2 size={16} className="text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t-2 border-[#0F172A] flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="brutal-btn bg-[#0F172A] text-white px-6 py-2 text-xs font-mono font-bold"
          >
            CLOSE DOSSIER
          </button>
        </div>
      </div>
    </div>
  );
};
