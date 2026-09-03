import React, { useState } from 'react';
import { UserPsychologicalVector, Archetype } from '../types';
import { getArchetypeById } from '../utils/scoring';
import { ArchetypeAvatar } from './ArchetypeAvatar';
import { RadarChart } from './RadarChart';
import { ONET_CAREERS_DATABASE } from '../data/careers';
import { 
  Sparkles, 
  Flame, 
  Download, 
  Share2, 
  HeartHandshake, 
  Briefcase, 
  ShieldAlert, 
  Zap, 
  Layers, 
  BrainCircuit, 
  ArrowUpRight, 
  CheckCircle,
  BookOpen,
  FileText,
  UserCheck,
  TrendingUp,
  HelpCircle,
  Printer,
  Instagram,
  Compass,
  Heart,
  Award
} from 'lucide-react';

interface ResultsDashboardProps {
  vector: UserPsychologicalVector;
  onOpenRoastHype: () => void;
  onOpenWrapped: () => void;
  onOpenCompatibility: () => void;
  onOpenGlossary: (termId?: string) => void;
  onOpenDossier: () => void;
  onOpenPrintableReport: () => void;
  onOpenInstagramStory: () => void;
  onRetakeTest: () => void;
  onOpenFriends: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  vector,
  onOpenRoastHype,
  onOpenWrapped,
  onOpenCompatibility,
  onOpenGlossary,
  onOpenDossier,
  onOpenPrintableReport,
  onOpenInstagramStory,
  onRetakeTest,
  onOpenFriends
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'hexaco' | 'attachment' | 'career' | 'shadow' | 'eq'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);

  const archetype: Archetype = getArchetypeById(vector.calculatedArchetypeId);
  const variant = vector.identityVariant || 'A';
  const isAssertive = variant === 'A';

  // Radar data for HEXACO
  const hexacoRadarData = [
    { axis: 'Honesty', value: vector.hexaco.honestyHumility },
    { axis: 'Emotionality', value: vector.hexaco.emotionality },
    { axis: 'Extraversion', value: vector.hexaco.extraversion },
    { axis: 'Agreeableness', value: vector.hexaco.agreeableness },
    { axis: 'Conscientiousness', value: vector.hexaco.conscientiousness },
    { axis: 'Openness', value: vector.hexaco.openness }
  ];

  // Radar data for RIASEC
  const riasecRadarData = [
    { axis: 'Realistic', value: vector.riasec.realistic },
    { axis: 'Investigative', value: vector.riasec.investigative },
    { axis: 'Artistic', value: vector.riasec.artistic },
    { axis: 'Social', value: vector.riasec.social },
    { axis: 'Enterprising', value: vector.riasec.enterprising },
    { axis: 'Conventional', value: vector.riasec.conventional }
  ];

  const handleCopyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-16 px-3 sm:px-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-white brutal-border brutal-shadow-sm font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shrink-0" />
          <span className="font-black">UPG VECTOR STATUS: ACTIVE & SYNTHESIZED</span>
          <span className="text-slate-400 hidden md:inline">|</span>
          <span className="text-slate-600 hidden md:inline">LAST UPDATED: {vector.completionDate}</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => onOpenGlossary()}
            className="brutal-btn bg-indigo-50 text-indigo-950 px-3 py-1.5 text-xs flex items-center justify-center gap-1.5"
            title="Scientific Standards & Terms Handbook"
          >
            <BookOpen size={13} className="text-indigo-600" />
            <span>SCIENCE GUIDE</span>
          </button>
          <button
            onClick={onOpenDossier}
            className="brutal-btn bg-[#0F172A] text-white px-3 py-1.5 text-xs flex items-center justify-center gap-1.5"
          >
            <FileText size={13} />
            <span>DOSSIER</span>
          </button>
        </div>
      </div>

      {/* Hero Archetype Presentation Card */}
      <div className="brutal-card bg-white p-5 sm:p-10 brutal-shadow-xl relative overflow-hidden">
        {/* House Watermark */}
        <div 
          className="absolute -right-12 -top-12 opacity-5 select-none font-display font-black text-9xl tracking-tighter pointer-events-none"
        >
          {archetype.code}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
          {/* Avatar Graphic Column */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center text-center">
            <ArchetypeAvatar 
              archetype={archetype} 
              variant={variant} 
              size="xl" 
            />
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span 
                className="brutal-badge text-white text-xs font-mono font-bold"
                style={{ backgroundColor: archetype.houseColor }}
              >
                {archetype.house}
              </span>
              <button 
                onClick={() => onOpenGlossary('identity-variant')}
                className="brutal-badge bg-[#FFE600] text-[#0F172A] hover:bg-[#FFE600]/80 cursor-pointer flex items-center gap-1 text-xs font-mono font-bold"
                title="Click to learn what Assertive vs Turbulent means"
              >
                <span>{isAssertive ? 'ASSERTIVE (-A)' : 'TURBULENT (-T)'}</span>
                <HelpCircle size={10} />
              </button>
            </div>
          </div>

          {/* Archetype Details Column */}
          <div className="lg:col-span-8 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-600">
                  PRIMARY PSYCHOMETRIC TYPOLOGY
                </span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-5xl text-[#0F172A] tracking-tight">
                {archetype.name}
              </h1>
              <p className="font-display text-base sm:text-xl font-bold mt-0.5 sm:mt-1 text-[#6366F1]">
                "{archetype.title}"
              </p>
            </div>

            <p className="text-slate-700 text-xs sm:text-base leading-relaxed font-sans">
              {archetype.fullDescription}
            </p>

            {/* Quick Badges Matrix with Interactive Glossary Triggers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs font-mono">
              <div 
                onClick={() => onOpenGlossary('attachment-theory')}
                className="bg-white p-2.5 brutal-border cursor-pointer hover:bg-slate-50 transition-colors"
                title="Click to learn what Attachment Styles mean"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>ATTACHMENT</span>
                  <HelpCircle size={10} className="text-indigo-600" />
                </div>
                <span className="font-bold text-[#0F172A] block truncate">{vector.attachment.style}</span>
              </div>
              <div 
                onClick={() => onOpenGlossary('riasec-onet')}
                className="bg-white p-2.5 brutal-border cursor-pointer hover:bg-slate-50 transition-colors"
                title="Click to learn what Holland RIASEC means"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>HOLLAND CODE</span>
                  <HelpCircle size={10} className="text-indigo-600" />
                </div>
                <span className="font-bold text-[#0F172A] block">{vector.riasec.hollandCode}</span>
              </div>
              <div 
                onClick={() => onOpenGlossary('trait-eq')}
                className="bg-white p-2.5 brutal-border cursor-pointer hover:bg-slate-50 transition-colors"
                title="Click to learn what Trait EQ means"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>TRAIT EQ</span>
                  <HelpCircle size={10} className="text-indigo-600" />
                </div>
                <span className="font-bold text-[#0F172A] block">{vector.traitEq.score}%</span>
              </div>
              <div 
                onClick={() => onOpenGlossary('duckworth-grit')}
                className="bg-white p-2.5 brutal-border cursor-pointer hover:bg-slate-50 transition-colors"
                title="Click to learn what Duckworth Grit means"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>GRIT SCALE</span>
                  <HelpCircle size={10} className="text-indigo-600" />
                </div>
                <span className="font-bold text-[#0F172A] block">{vector.grit.score} / 5.0</span>
              </div>
            </div>

            {/* Action Bar (Refined Responsive Mobile Grid) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3">
              <button
                onClick={onOpenFriends}
                className="brutal-btn bg-[#A3F7BF] text-[#0F172A] p-2.5 text-xs font-black flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <HeartHandshake size={15} />
                <span>CO-OP DUEL</span>
              </button>
              <button
                onClick={onOpenRoastHype}
                className="brutal-btn bg-white text-[#0F172A] p-2.5 text-xs font-bold flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <Flame size={15} />
                <span>ROAST / HYPE</span>
              </button>
              <button
                onClick={onOpenWrapped}
                className="brutal-btn bg-white text-[#0F172A] p-2.5 text-xs font-bold flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <Sparkles size={15} />
                <span>WRAPPED</span>
              </button>
              <button
                onClick={handleCopyShareLink}
                className="brutal-btn bg-white p-2.5 text-xs font-mono font-bold flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <Share2 size={14} />
                <span>{copiedLink ? 'COPIED!' : 'SHARE'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Trait Summary Sheet Card */}
      <div className="brutal-card bg-white p-5 sm:p-7 brutal-shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b-2 border-[#0F172A] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0F172A] text-[#FFE600] brutal-border flex items-center justify-center font-display font-black text-base shrink-0">
              <Layers size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-lg text-[#0F172A]">
                  PSYCHOMETRIC TRAIT SUMMARY SHEET
                </span>
                <span className="brutal-badge bg-[#FFE600] text-[#0F172A] text-[9px] font-mono">
                  ALL 7 LAYERS
                </span>
              </div>
              <p className="font-mono text-xs text-slate-600 mt-0.5">
                Executive snapshot of your psychological vector topology.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onOpenPrintableReport}
              className="brutal-btn bg-[#FFE600] text-[#0F172A] px-3.5 py-2 text-xs font-mono font-black flex items-center justify-center gap-1.5 w-full sm:w-auto"
            >
              <Printer size={14} />
              <span>PRINT REPORT (PDF)</span>
            </button>
            <button
              onClick={onOpenInstagramStory}
              className="brutal-btn bg-[#0F172A] text-white px-3.5 py-2 text-xs font-mono font-bold flex items-center justify-center gap-1.5 w-full sm:w-auto"
            >
              <Instagram size={14} />
              <span>STORY (9:16)</span>
            </button>
          </div>
        </div>

        {/* 3-Column Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          {/* Column 1: HEXACO Spectrum Breakdown */}
          <div className="p-4 bg-[#F8FAFC] brutal-border space-y-3">
            <div className="flex items-center justify-between border-b pb-2 border-slate-200">
              <span className="font-display font-black text-sm text-[#0F172A] flex items-center gap-1.5">
                <Compass size={15} className="text-indigo-600" />
                HEXACO PERCENTILES
              </span>
              <button onClick={() => onOpenGlossary('hexaco')} className="text-indigo-600 hover:underline text-[10px]">
                Guide ⓘ
              </button>
            </div>

            <div className="space-y-2">
              {[
                { label: 'Honesty-Humility', val: vector.hexaco.honestyHumility, color: '#10B981' },
                { label: 'Emotionality', val: vector.hexaco.emotionality, color: '#06B6D4' },
                { label: 'Extraversion', val: vector.hexaco.extraversion, color: '#F59E0B' },
                { label: 'Agreeableness', val: vector.hexaco.agreeableness, color: '#8B5CF6' },
                { label: 'Conscientiousness', val: vector.hexaco.conscientiousness, color: '#EC4899' },
                { label: 'Openness', val: vector.hexaco.openness, color: '#6366F1' }
              ].map((item) => (
                <div key={item.label} className="space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-700">{item.label}</span>
                    <span className="font-black text-slate-900">{item.val}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 brutal-border">
                    <div className="h-full" style={{ width: `${item.val}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Relational Attachment & Holland RIASEC */}
          <div className="p-4 bg-[#F8FAFC] brutal-border space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2 border-slate-200">
                <span className="font-display font-black text-sm text-[#0F172A] flex items-center gap-1.5">
                  <Heart size={15} className="text-rose-600" />
                  ATTACHMENT STYLE
                </span>
                <span className="font-bold text-rose-700 text-[10px] bg-rose-50 px-1.5 py-0.5 brutal-border">
                  {vector.attachment.style}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-white brutal-border">
                  <span className="text-[10px] text-slate-500 block">ANXIETY</span>
                  <span className="text-base font-black text-[#0F172A]">{vector.attachment.anxiety}%</span>
                </div>
                <div className="p-2 bg-white brutal-border">
                  <span className="text-[10px] text-slate-500 block">AVOIDANCE</span>
                  <span className="text-base font-black text-[#0F172A]">{vector.attachment.avoidance}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                  <Briefcase size={13} className="text-indigo-600" />
                  HOLLAND VOCATION
                </span>
                <span className="font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 brutal-border">
                  {vector.riasec.hollandCode}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Primary: <strong className="text-slate-900">{vector.riasec.primaryDomain}</strong> // Secondary: <strong className="text-slate-900">{vector.riasec.secondaryDomain}</strong>
              </p>
            </div>
          </div>

          {/* Column 3: Resilience, Superpowers & Attribution */}
          <div className="p-4 bg-[#F8FAFC] brutal-border space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2 border-slate-200">
                <span className="font-display font-black text-sm text-[#0F172A] flex items-center gap-1.5">
                  <Award size={15} className="text-emerald-600" />
                  RESILIENCE & EQ
                </span>
                <span className="font-mono text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 brutal-border">
                  SYNTHESIS
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-white brutal-border">
                  <span className="text-[10px] text-slate-500 block">TRAIT EQ</span>
                  <span className="text-base font-black text-emerald-700">{vector.traitEq.score}%</span>
                </div>
                <div className="p-2 bg-white brutal-border">
                  <span className="text-[10px] text-slate-500 block">GRIT SCALE</span>
                  <span className="text-base font-black text-amber-700">{vector.grit.score} / 5.0</span>
                </div>
              </div>

              <div className="p-2 bg-emerald-50/80 brutal-border border-emerald-300">
                <span className="font-bold text-emerald-950 block text-[10px]">SIGNATURE SUPERPOWER</span>
                <p className="text-[11px] text-slate-800 font-medium line-clamp-2 mt-0.5">
                  "{archetype.superpowers[0]}"
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
              <span>Made by Samad</span>
              <span className="font-bold text-slate-700">OmniPsyche 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Compatibility Layer Callout Card */}
      <div className="bg-[#FFE600]/25 p-4 sm:p-5 brutal-border border-[#0F172A] brutal-shadow flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0F172A] text-[#FFE600] brutal-border flex items-center justify-center font-display font-black text-xl shrink-0">
            ⚔️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-base text-[#0F172A]">
                MULTIPLAYER COMPATIBILITY DUEL
              </span>
              <span className="brutal-badge bg-emerald-100 text-emerald-900 border-emerald-600 text-[9px] font-mono">
                LIVE CO-OP
              </span>
            </div>
            <p className="font-mono text-xs text-slate-700 mt-0.5">
              Send a custom link to your partner or friends. When they finish their test, both of your profiles unlock a live chemistry index, conflict friction points, and relational playbook.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenFriends}
          className="w-full sm:w-auto brutal-btn bg-[#0F172A] text-white px-4 py-2.5 font-mono text-xs font-black whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 min-h-[44px]"
        >
          <span>GENERATE DUEL LINK</span>
          <ArrowUpRight size={14} className="text-[#FFE600]" />
        </button>
      </div>

      {/* Navigation Tabs for Deep-Dives (Responsive Mobile Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-1.5 border-b-2 border-[#0F172A] pb-3">
        {[
          { id: 'overview', label: '7-LAYER UPG GRAPH' },
          { id: 'hexaco', label: 'HEXACO & RADAR' },
          { id: 'attachment', label: 'ATTACHMENT & GOTTMAN' },
          { id: 'career', label: 'CAREER MATRIX (O*NET)' },
          { id: 'shadow', label: 'SHADOW & EQ' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`p-2.5 sm:px-3.5 sm:py-1.5 font-mono text-xs font-bold uppercase brutal-border text-center min-h-[40px] flex items-center justify-center transition-all ${
              activeTab === tab.id
                ? 'bg-[#0F172A] text-white brutal-shadow-sm -translate-y-0.5'
                : 'bg-white hover:bg-slate-100 text-[#0F172A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & 7-Layer Scorecard */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Superpowers and Fatal Blindspots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="brutal-card bg-[#F0FDF4] p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="p-1.5 brutal-border bg-[#10B981] text-white">
                  <Zap size={18} />
                </span>
                <h3 className="font-display font-black text-lg uppercase tracking-tight text-[#0F172A]">
                  SIGNATURE SUPERPOWERS
                </h3>
              </div>
              <ul className="space-y-2.5 font-mono text-xs sm:text-sm">
                {archetype.superpowers.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white p-2.5 brutal-border">
                    <span className="font-black text-emerald-600">0{idx + 1}.</span>
                    <span className="font-bold">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="brutal-card bg-[#FFF1F2] p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="p-1.5 brutal-border bg-[#F43F5E] text-white">
                  <ShieldAlert size={18} />
                </span>
                <h3 className="font-display font-black text-lg uppercase tracking-tight text-[#0F172A]">
                  FATAL BLINDSPOTS & GROWTH EDGES
                </h3>
              </div>
              <ul className="space-y-2.5 font-mono text-xs sm:text-sm">
                {archetype.blindspots.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white p-2.5 brutal-border">
                    <span className="font-black text-rose-600">0{idx + 1}.</span>
                    <span className="font-bold">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 7-Layer Psychometric Graph Breakdown */}
          <div className="brutal-card bg-white p-5 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 border-b-2 border-[#0F172A] pb-3 gap-2">
              <div>
                <span className="brutal-badge bg-[#6366F1] text-white text-xs mb-1">
                  UPG ARCHITECTURE // 7 LAYERS
                </span>
                <h3 className="font-display font-black text-xl sm:text-2xl uppercase">
                  UNIFIED PSYCHOLOGICAL GRAPH MATRIX
                </h3>
              </div>
              <button
                onClick={() => onOpenGlossary()}
                className="brutal-btn bg-indigo-50 text-indigo-900 px-2.5 py-1 text-xs font-mono font-bold flex items-center gap-1"
              >
                <BookOpen size={12} />
                <span>EXPLAIN ALL 7 LAYERS</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Layer 1 */}
              <div className="p-4 brutal-border bg-[#FDFBF7] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-500 font-bold block">LAYER 01 // CORE PERSONALITY</span>
                  <button onClick={() => onOpenGlossary('hexaco')} className="text-indigo-600 hover:underline text-[10px] font-mono font-bold">
                    [?] Info
                  </button>
                </div>
                <h4 className="font-display font-bold text-base">HEXACO-PI-R Synthesis</h4>
                <div className="space-y-1.5 font-mono text-xs pt-1">
                  <div className="flex justify-between">
                    <span>Openness to Experience:</span>
                    <span className="font-bold">{vector.hexaco.openness}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Conscientiousness:</span>
                    <span className="font-bold">{vector.hexaco.conscientiousness}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Honesty-Humility:</span>
                    <span className="font-bold">{vector.hexaco.honestyHumility}%</span>
                  </div>
                </div>
              </div>

              {/* Layer 2 */}
              <div className="p-4 brutal-border bg-[#FDFBF7] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-500 font-bold block">LAYER 02 // RELATIONAL ATTACHMENT</span>
                  <button onClick={() => onOpenGlossary('attachment-theory')} className="text-indigo-600 hover:underline text-[10px] font-mono font-bold">
                    [?] Info
                  </button>
                </div>
                <h4 className="font-display font-bold text-base">ECR-R Dimensional Matrix</h4>
                <div className="space-y-1.5 font-mono text-xs pt-1">
                  <div className="flex justify-between">
                    <span>Attachment Style:</span>
                    <span className="font-bold bg-[#A3F7BF] px-1 brutal-border">{vector.attachment.style}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Attachment Anxiety:</span>
                    <span className="font-bold">{vector.attachment.anxiety}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Attachment Avoidance:</span>
                    <span className="font-bold">{vector.attachment.avoidance}%</span>
                  </div>
                </div>
              </div>

              {/* Layer 3 */}
              <div className="p-4 brutal-border bg-[#FDFBF7] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-500 font-bold block">LAYER 03 // LOVE & GOTTMAN</span>
                  <button onClick={() => onOpenGlossary('attachment-theory')} className="text-indigo-600 hover:underline text-[10px] font-mono font-bold">
                    [?] Info
                  </button>
                </div>
                <h4 className="font-display font-bold text-base">Connection Expression</h4>
                <div className="space-y-1.5 font-mono text-xs pt-1">
                  <div className="flex justify-between">
                    <span>Emotional Attunement:</span>
                    <span className="font-bold">{vector.relational.emotionalAttunement}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality Time Priority:</span>
                    <span className="font-bold">{vector.relational.sharedQualityTime}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gottman Safety Index:</span>
                    <span className="font-bold">{vector.relational.psychologicalSafetyIndex}%</span>
                  </div>
                </div>
              </div>

              {/* Layer 4 */}
              <div className="p-4 brutal-border bg-[#FDFBF7] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-500 font-bold block">LAYER 04 // VOCATIONAL SCIENCE</span>
                  <button onClick={() => onOpenGlossary('riasec-onet')} className="text-indigo-600 hover:underline text-[10px] font-mono font-bold">
                    [?] Info
                  </button>
                </div>
                <h4 className="font-display font-bold text-base">Holland RIASEC Vector</h4>
                <div className="space-y-1.5 font-mono text-xs pt-1">
                  <div className="flex justify-between">
                    <span>Primary Holland Code:</span>
                    <span className="font-bold bg-[#FFE600] px-1.5 brutal-border">{vector.riasec.hollandCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Top Cluster:</span>
                    <span className="font-bold">{vector.riasec.topCodes.join(' - ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>O*NET Direct Matches:</span>
                    <span className="font-bold text-emerald-600">8 High-Fit Roles</span>
                  </div>
                </div>
              </div>

              {/* Layer 5 */}
              <div className="p-4 brutal-border bg-[#FDFBF7] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-500 font-bold block">LAYER 05 // COGNITIVE & EMOTIONAL</span>
                  <button onClick={() => onOpenGlossary('trait-eq')} className="text-indigo-600 hover:underline text-[10px] font-mono font-bold">
                    [?] Info
                  </button>
                </div>
                <h4 className="font-display font-bold text-base">Trait EQ & Grit Scale</h4>
                <div className="space-y-1.5 font-mono text-xs pt-1">
                  <div className="flex justify-between">
                    <span>Global Trait EQ:</span>
                    <span className="font-bold">{vector.traitEq.score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Emotion Regulation:</span>
                    <span className="font-bold">{vector.traitEq.emotionRegulation}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duckworth Grit:</span>
                    <span className="font-bold">{vector.grit.score} / 5.0</span>
                  </div>
                </div>
              </div>

              {/* Layer 6 & 7 */}
              <div className="p-4 brutal-border bg-[#FDFBF7] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-500 font-bold block">LAYERS 06 & 07 // SHADOW & HSP</span>
                  <button onClick={() => onOpenGlossary('subclinical-shadow')} className="text-indigo-600 hover:underline text-[10px] font-mono font-bold">
                    [?] Info
                  </button>
                </div>
                <h4 className="font-display font-bold text-base">Shadow & Neuro-Profile</h4>
                <div className="space-y-1.5 font-mono text-xs pt-1">
                  <div className="flex justify-between">
                    <span>Shadow Integration:</span>
                    <span className="font-bold text-indigo-700">{vector.shadow.shadowIntegrationLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HSP Sensory Index:</span>
                    <span className="font-bold">{vector.neurodiversity.highSensitivityHsp}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Executive Focus Index:</span>
                    <span className="font-bold">{vector.neurodiversity.executiveFunctionPacing}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: HEXACO & Dynamic Radar */}
      {activeTab === 'hexaco' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 flex justify-center">
            <RadarChart 
              data={hexacoRadarData}
              title="HEXACO 6-Domain Vector"
              subtitle="Continuous trait percentiles relative to global benchmark"
              size={380}
              color={archetype.houseColor}
            />
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="brutal-card bg-white p-6">
              <h3 className="font-display font-black text-xl mb-3 uppercase">
                HEXACO Trait Spectrum Breakdown
              </h3>
              <div className="space-y-3 font-mono text-xs">
                {[
                  { name: 'Honesty-Humility (H)', val: vector.hexaco.honestyHumility, desc: 'Sincerity, fairness, greed avoidance, and modesty' },
                  { name: 'Emotionality (E)', val: vector.hexaco.emotionality, desc: 'Fearfulness, anxiety, dependence, and sentimentality' },
                  { name: 'Extraversion (X)', val: vector.hexaco.extraversion, desc: 'Social boldness, sociability, and liveliness' },
                  { name: 'Agreeableness (A)', val: vector.hexaco.agreeableness, desc: 'Forgivingness, gentleness, flexibility, and patience' },
                  { name: 'Conscientiousness (C)', val: vector.hexaco.conscientiousness, desc: 'Organization, diligence, perfectionism, and prudence' },
                  { name: 'Openness to Experience (O)', val: vector.hexaco.openness, desc: 'Aesthetic appreciation, inquisitiveness, creativity' }
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 brutal-border bg-[#FDFBF7]">
                    <div className="flex justify-between font-bold mb-1">
                      <span>{item.name}</span>
                      <span className="bg-[#FFE600] px-1.5 brutal-border">{item.val}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#E2E8F0] brutal-border mb-1">
                      <div className="h-full bg-[#0F172A]" style={{ width: `${item.val}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Attachment & Gottman */}
      {activeTab === 'attachment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 4-Quadrant Visualizer */}
            <div className="lg:col-span-6 brutal-card bg-white p-6">
              <div className="border-b-2 border-[#0F172A] pb-3 mb-4">
                <span className="brutal-badge bg-[#10B981] text-white text-xs mb-1">
                  ECR-R 4-QUADRANT MATRIX
                </span>
                <h3 className="font-display font-black text-xl uppercase">
                  Relational Attachment Map
                </h3>
              </div>

              {/* 2x2 Grid Representation */}
              <div className="relative aspect-square w-full max-w-[340px] mx-auto brutal-border bg-[#FDFBF7] p-2">
                {/* Quadrant Dividers */}
                <div className="absolute inset-x-0 top-1/2 h-[2px] bg-[#0F172A]" />
                <div className="absolute inset-y-0 left-1/2 w-[2px] bg-[#0F172A]" />

                {/* Top-Left: Secure */}
                <div className={`absolute top-2 left-2 w-[45%] h-[45%] p-2 brutal-border text-[11px] font-mono flex flex-col justify-between ${
                  vector.attachment.style === 'Secure' ? 'bg-[#A3F7BF] brutal-shadow-sm font-black' : 'bg-white opacity-60'
                }`}>
                  <span className="font-bold">SECURE</span>
                  <span className="text-[9px] text-slate-600">Low Anxiety / Low Avoidance</span>
                </div>

                {/* Top-Right: Anxious-Preoccupied */}
                <div className={`absolute top-2 right-2 w-[45%] h-[45%] p-2 brutal-border text-[11px] font-mono flex flex-col justify-between ${
                  vector.attachment.style === 'Anxious-Preoccupied' ? 'bg-[#FFE600] brutal-shadow-sm font-black' : 'bg-white opacity-60'
                }`}>
                  <span className="font-bold">ANXIOUS</span>
                  <span className="text-[9px] text-slate-600">High Anxiety / Low Avoidance</span>
                </div>

                {/* Bottom-Left: Dismissive-Avoidant */}
                <div className={`absolute bottom-2 left-2 w-[45%] h-[45%] p-2 brutal-border text-[11px] font-mono flex flex-col justify-between ${
                  vector.attachment.style === 'Dismissive-Avoidant' ? 'bg-[#74B9FF] brutal-shadow-sm font-black' : 'bg-white opacity-60'
                }`}>
                  <span className="font-bold">DISMISSIVE</span>
                  <span className="text-[9px] text-slate-600">Low Anxiety / High Avoidance</span>
                </div>

                {/* Bottom-Right: Fearful-Avoidant */}
                <div className={`absolute bottom-2 right-2 w-[45%] h-[45%] p-2 brutal-border text-[11px] font-mono flex flex-col justify-between ${
                  vector.attachment.style === 'Fearful-Avoidant' ? 'bg-[#FF6B6B] text-white brutal-shadow-sm font-black' : 'bg-white opacity-60'
                }`}>
                  <span className="font-bold">FEARFUL</span>
                  <span className="text-[9px]">High Anxiety / High Avoidance</span>
                </div>
              </div>
            </div>

            {/* Attachment Clinical Summary */}
            <div className="lg:col-span-6 brutal-card bg-[#FDFBF7] p-6 space-y-4">
              <h3 className="font-display font-black text-xl uppercase">
                Attachment Style: {vector.attachment.style}
              </h3>
              <p className="text-sm font-mono leading-relaxed bg-white p-3.5 brutal-border">
                {vector.attachment.description}
              </p>
              
              <div className="bg-[#FEF08A] p-4 brutal-border">
                <span className="font-mono text-xs font-black block mb-1">HIGH-LEVERAGE GROWTH EDGE:</span>
                <p className="text-xs font-mono text-slate-800">
                  {vector.attachment.growthEdge}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
                <div className="p-2.5 bg-white brutal-border">
                  <span className="text-slate-500 block text-[10px]">ANXIETY INDEX</span>
                  <span className="font-bold text-base">{vector.attachment.anxiety}%</span>
                </div>
                <div className="p-2.5 bg-white brutal-border">
                  <span className="text-slate-500 block text-[10px]">AVOIDANCE INDEX</span>
                  <span className="font-bold text-base">{vector.attachment.avoidance}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Career Matrix (O*NET) */}
      {activeTab === 'career' && (
        <div className="space-y-6">
          <div className="brutal-card bg-white p-6 sm:p-8">
            <div className="flex items-center justify-between border-b-2 border-[#0F172A] pb-3 mb-6">
              <div>
                <span className="brutal-badge bg-[#10B981] text-white text-xs mb-1">
                  O*NET 900+ OCCUPATION SYNTHESIS
                </span>
                <h3 className="font-display font-black text-2xl uppercase">
                  Top Matched High-Yield Careers
                </h3>
              </div>
              <span className="font-mono text-xs font-bold bg-[#FFE600] px-2 py-1 brutal-border">
                HOLLAND CODE: {vector.riasec.hollandCode}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ONET_CAREERS_DATABASE.map((job, idx) => (
                <div key={idx} className="brutal-card bg-[#FDFBF7] p-5 hover:-translate-y-1 transition-transform">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="font-mono text-[10px] text-slate-500 font-bold">O*NET {job.onetCode}</span>
                      <h4 className="font-display font-extrabold text-base text-[#0F172A] leading-tight">
                        {job.title}
                      </h4>
                    </div>
                    <span className="brutal-badge bg-[#A3F7BF] text-[10px] whitespace-nowrap">
                      {job.matchScore}% MATCH
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 mb-3 font-mono">
                    {job.description}
                  </p>

                  <div className="flex items-center justify-between text-xs font-mono border-t border-[#0F172A] pt-2 mt-2">
                    <div>
                      <span className="text-slate-500 text-[10px] block">MEDIAN SALARY</span>
                      <span className="font-black text-[#0F172A]">{job.medianSalary}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 text-[10px] block">GROWTH RATE</span>
                      <span className="font-bold text-emerald-600">{job.growthRate}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {job.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="text-[9px] font-mono bg-white px-1.5 py-0.5 brutal-border">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Shadow & EQ */}
      {activeTab === 'shadow' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subclinical Shadow Integration */}
          <div className="brutal-card bg-[#FFFDF7] p-6 space-y-4">
            <div className="border-b-2 border-[#0F172A] pb-2">
              <span className="brutal-badge bg-[#0F172A] text-white text-xs mb-1">
                SD3 SUBCLINICAL SCALE
              </span>
              <h3 className="font-display font-black text-xl uppercase">
                Shadow Trait Integration
              </h3>
            </div>
            <p className="text-xs font-mono text-slate-700">
              {vector.shadow.reframeInsight}
            </p>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-2.5 brutal-border bg-white">
                <div className="flex justify-between font-bold mb-1">
                  <span>Subclinical Machiavellianism (Strategic Calculation):</span>
                  <span>{vector.shadow.machiavellianism}%</span>
                </div>
                <div className="w-full h-2 bg-[#E2E8F0] brutal-border">
                  <div className="h-full bg-[#6366F1]" style={{ width: `${vector.shadow.machiavellianism}%` }} />
                </div>
              </div>
              <div className="p-2.5 brutal-border bg-white">
                <div className="flex justify-between font-bold mb-1">
                  <span>Subclinical Narcissism (Legacy & Ambition):</span>
                  <span>{vector.shadow.narcissism}%</span>
                </div>
                <div className="w-full h-2 bg-[#E2E8F0] brutal-border">
                  <div className="h-full bg-[#FFE600]" style={{ width: `${vector.shadow.narcissism}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Trait Emotional Intelligence (TEIQue-SF) */}
          <div className="brutal-card bg-white p-6 space-y-4">
            <div className="border-b-2 border-[#0F172A] pb-2">
              <span className="brutal-badge bg-[#0EA5E9] text-white text-xs mb-1">
                TEIQue-SF SYNTHESIS
              </span>
              <h3 className="font-display font-black text-xl uppercase">
                Trait EQ & Resilience Breakdown
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 brutal-border bg-[#F0F9FF]">
                <span className="text-slate-500 text-[10px] block">SELF-AWARENESS</span>
                <span className="font-black text-lg">{vector.traitEq.selfAwareness}%</span>
              </div>
              <div className="p-3 brutal-border bg-[#F0F9FF]">
                <span className="text-slate-500 text-[10px] block">EMOTION REGULATION</span>
                <span className="font-black text-lg">{vector.traitEq.emotionRegulation}%</span>
              </div>
              <div className="p-3 brutal-border bg-[#F0F9FF]">
                <span className="text-slate-500 text-[10px] block">EMPATHIC ATTUNEMENT</span>
                <span className="font-black text-lg">{vector.traitEq.empathy}%</span>
              </div>
              <div className="p-3 brutal-border bg-[#F0F9FF]">
                <span className="text-slate-500 text-[10px] block">DUCKWORTH GRIT</span>
                <span className="font-black text-lg">{vector.grit.score} / 5.0</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Retake Test Footer Banner */}
      <div className="p-4 bg-white brutal-border brutal-shadow flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div>
          <span className="font-bold">WANT TO RECALIBRATE YOUR VECTORS?</span>
          <p className="text-slate-500 text-[11px]">Retake the master Omni-Assessment or run targeted micro-tests in the Quick-Lab.</p>
        </div>
        <button
          onClick={onRetakeTest}
          className="brutal-btn bg-[#FFE600] px-4 py-2 font-black"
        >
          RETAKE OMNI-ASSESSMENT
        </button>
      </div>

      {/* Mandatory Non-Clinical Assessment Scope Disclosure Footer */}
      <div className="bg-[#FFFDF7] p-4 brutal-border border-slate-300 text-center font-mono text-[11px] text-slate-600 space-y-1">
        <p className="font-bold text-slate-800">
          ⚖️ SCIENTIFIC & ETHICAL SCOPE DISCLOSURE
        </p>
        <p>
          OmniPsyche is designed for personal development, interpersonal communication, and psychometric education based on empirical models (HEXACO PI-R, Holland RIASEC, ECR-R, TEIQue-SF). It is not a medical, psychiatric, or clinical diagnostic instrument.
        </p>
      </div>
    </div>
  );
};
