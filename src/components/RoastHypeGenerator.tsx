import React, { useState } from 'react';
import { Archetype, UserPsychologicalVector } from '../types';
import { ArchetypeAvatar } from './ArchetypeAvatar';
import { 
  Flame, 
  Sparkles, 
  Copy, 
  Check, 
  Share2, 
  RefreshCw, 
  X,
  AlertCircle
} from 'lucide-react';

interface RoastHypeGeneratorProps {
  archetype: Archetype;
  vector: UserPsychologicalVector;
  onClose: () => void;
}

export const RoastHypeGenerator: React.FC<RoastHypeGeneratorProps> = ({
  archetype,
  vector,
  onClose
}) => {
  const [mode, setMode] = useState<'roast' | 'hype'>('roast');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [content, setContent] = useState<{
    result: string;
    headline: string;
    rating: string;
  }>({
    result: mode === 'roast' 
      ? `You have 47 Notion dashboards for 'optimal life systems' but haven't replied to your mom's text in three weeks. You claim to value 'pure logic,' yet you will spend 6 hours researching mechanical keyboard switches just to write passive-aggressive Slack messages with 20% more tactility. You don't have emotional boundaries; you have a firewall built out of intellectualized defense mechanisms.`
      : `You are the rare human who can architect entire paradigms before breakfast and actually execute them before lunch. While others panic in chaos, your neural circuitry runs cold, diamond-grade clarity. Your strategic vision coupled with your relentless grit makes you a generational force multiplier. The world hasn't caught up to your wavelength yet.`,
    headline: mode === 'roast' ? `47 TABS OPEN, ZERO REPLIES SENT` : `TITANIC FORCE OF NATURE`,
    rating: mode === 'roast' ? `9.4/10 CLINICAL SASS` : `99.8TH PERCENTILE FORCE MULTIPLIER`
  });

  const handleGenerate = async (selectedMode: 'roast' | 'hype') => {
    setMode(selectedMode);
    setLoading(true);
    try {
      const res = await fetch('/api/roast-hype', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: selectedMode,
          archetype,
          userVector: vector
        })
      });
      const data = await res.json();
      if (data.result) {
        setContent({
          result: data.result,
          headline: data.headline || (selectedMode === 'roast' ? 'CLINICAL PSYCH SASS' : 'COSMIC HYPE'),
          rating: data.rating || (selectedMode === 'roast' ? 'S-TIER ROAST' : 'TOP 0.1% FORCE')
        });
      }
    } catch (e) {
      console.error('Failed to generate roast/hype', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = `[OMNIPSYCHE // ${mode.toUpperCase()} MY TYPE]\n${archetype.name} (${archetype.code}-${vector.identityVariant})\n\n"${content.headline}"\n${content.result}\n\nRating: ${content.rating}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="brutal-card bg-[#FDFBF7] max-w-2xl w-full p-6 sm:p-8 brutal-shadow-xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-white brutal-border hover:bg-rose-100 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#0F172A] pb-4 mb-6">
          <div>
            <span className="brutal-badge bg-[#FFE600] text-xs mb-1">
              VIRAL STORY CARD GENERATOR
            </span>
            <h2 className="font-display font-black text-2xl uppercase">
              Roast vs. Hype Engine
            </h2>
          </div>

          {/* Mode Toggle Buttons */}
          <div className="flex brutal-border bg-white p-1 gap-1">
            <button
              onClick={() => handleGenerate('roast')}
              className={`px-3 py-1.5 font-mono text-xs font-black flex items-center gap-1.5 transition-all ${
                mode === 'roast' ? 'bg-[#FF6B6B] text-white brutal-shadow-sm' : 'hover:bg-slate-100'
              }`}
            >
              <Flame size={14} /> ROAST ME
            </button>
            <button
              onClick={() => handleGenerate('hype')}
              className={`px-3 py-1.5 font-mono text-xs font-black flex items-center gap-1.5 transition-all ${
                mode === 'hype' ? 'bg-[#A3F7BF] text-[#0F172A] brutal-shadow-sm' : 'hover:bg-slate-100'
              }`}
            >
              <Sparkles size={14} /> HYPE ME
            </button>
          </div>
        </div>

        {/* The Downloadable / Shareable Social Story Card */}
        <div 
          className={`brutal-card p-6 sm:p-8 relative overflow-hidden transition-all ${
            mode === 'roast' ? 'bg-[#FFF1F2] border-rose-950' : 'bg-[#F0FDF4] border-emerald-950'
          }`}
        >
          {/* Top Card Branding */}
          <div className="flex items-center justify-between border-b-2 border-[#0F172A] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black bg-[#0F172A] text-white px-2 py-0.5">
                OMNIPSYCHE // 2026
              </span>
              <span className="font-mono text-[11px] font-bold text-slate-600">
                {mode.toUpperCase()} PROFILE
              </span>
            </div>
            <span className="brutal-badge bg-[#FFE600] text-[10px]">
              {content.rating}
            </span>
          </div>

          {/* Character Header */}
          <div className="flex items-center gap-4 mb-4">
            <ArchetypeAvatar archetype={archetype} variant={vector.identityVariant} size="sm" showBadge={false} />
            <div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-[#0F172A]">
                {archetype.name} ({archetype.code}-{vector.identityVariant})
              </h3>
              <p className="font-mono text-xs text-slate-600 font-bold">
                "{archetype.title}"
              </p>
            </div>
          </div>

          {/* Punchy Headline Banner */}
          <div className="bg-[#0F172A] text-[#FFE600] p-2.5 brutal-border mb-4 text-center">
            <h4 className="font-display font-black text-sm sm:text-base tracking-tight uppercase">
              "{content.headline}"
            </h4>
          </div>

          {/* Main Text Content */}
          <div className="bg-white p-4 brutal-border text-xs sm:text-sm font-mono leading-relaxed min-h-[110px] flex items-center">
            {loading ? (
              <div className="flex items-center justify-center w-full gap-2 text-slate-500 font-bold py-6">
                <RefreshCw size={16} className="animate-spin" />
                <span>SYNTHESIZING CLINICAL SASS VIA GEMINI...</span>
              </div>
            ) : (
              <p className="text-slate-800 font-semibold">{content.result}</p>
            )}
          </div>

          {/* Card Footer Tag */}
          <div className="mt-4 pt-3 border-t border-[#0F172A] flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>UPG VECTOR: O:{vector.hexaco.openness}% | C:{vector.hexaco.conscientiousness}% | E:{vector.hexaco.extraversion}%</span>
            <span className="font-bold text-[#0F172A]">OMNIPSYCHE.AI</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
          <button
            onClick={() => handleGenerate(mode)}
            disabled={loading}
            className="brutal-btn bg-white px-4 py-2 font-mono text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            REROLL {mode.toUpperCase()}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="brutal-btn bg-[#FFE600] px-4 py-2 font-mono text-xs font-black flex items-center gap-1.5"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'COPIED TO CLIPBOARD!' : 'COPY STORY TEXT'}
            </button>
            <button
              onClick={onClose}
              className="brutal-btn bg-[#0F172A] text-white px-4 py-2 font-mono text-xs font-bold"
            >
              DONE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
