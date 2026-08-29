import React, { useState } from 'react';
import { Archetype, UserPsychologicalVector } from '../types';
import { ARCHETYPES } from '../data/archetypes';
import { ArchetypeAvatar } from './ArchetypeAvatar';
import { RadarChart } from './RadarChart';
import { 
  HeartHandshake, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRightLeft, 
  X, 
  MessageSquare,
  Briefcase,
  Heart
} from 'lucide-react';

interface CompatibilityMirrorProps {
  userArchetype: Archetype;
  userVector: UserPsychologicalVector;
  onClose: () => void;
}

export const CompatibilityMirror: React.FC<CompatibilityMirrorProps> = ({
  userArchetype,
  userVector,
  onClose
}) => {
  const [partnerArchetypeId, setPartnerArchetypeId] = useState<string>(
    userArchetype.relationshipKeys.idealMatches[0]?.split(' ')[0].toLowerCase() || 'enfp'
  );

  const partnerArchetype = ARCHETYPES.find(a => a.id === partnerArchetypeId) || ARCHETYPES[7]; // Default ENFP

  // Calculate dynamic compatibility synergy score
  const isDirectIdeal = userArchetype.relationshipKeys.idealMatches.some(m => m.toLowerCase().includes(partnerArchetype.code.toLowerCase()));
  const isDirectFriction = userArchetype.relationshipKeys.frictionRisk.some(m => m.toLowerCase().includes(partnerArchetype.code.toLowerCase()));
  
  let synergyScore = 78;
  if (isDirectIdeal) synergyScore = 95;
  if (isDirectFriction) synergyScore = 62;

  // Radar comparison data
  const comparisonRadarData = [
    { axis: 'Honesty', value: userVector.hexaco.honestyHumility, benchmark: partnerArchetype.hexacoProfile.honestyHumility },
    { axis: 'Emotionality', value: userVector.hexaco.emotionality, benchmark: partnerArchetype.hexacoProfile.emotionality },
    { axis: 'Extraversion', value: userVector.hexaco.extraversion, benchmark: partnerArchetype.hexacoProfile.extraversion },
    { axis: 'Agreeableness', value: userVector.hexaco.agreeableness, benchmark: partnerArchetype.hexacoProfile.agreeableness },
    { axis: 'Conscientiousness', value: userVector.hexaco.conscientiousness, benchmark: partnerArchetype.hexacoProfile.conscientiousness },
    { axis: 'Openness', value: userVector.hexaco.openness, benchmark: partnerArchetype.hexacoProfile.openness }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="brutal-card bg-[#FDFBF7] max-w-4xl w-full p-6 sm:p-8 brutal-shadow-xl relative my-auto animate-in fade-in zoom-in-95 duration-200 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b-2 border-[#0F172A] pb-4">
          <div>
            <span className="brutal-badge bg-[#A3F7BF] text-[#0F172A] text-xs mb-1">
              RELATIONAL COMPATIBILITY MIRROR
            </span>
            <h2 className="font-display font-black text-2xl uppercase">
              Dual Dynamic Psychology Matcher
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white brutal-border hover:bg-rose-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dual Character Hero Bar */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center bg-white p-6 brutal-border">
          {/* User Side */}
          <div className="md:col-span-5 flex items-center gap-4">
            <ArchetypeAvatar archetype={userArchetype} variant={userVector.identityVariant} size="md" />
            <div>
              <span className="font-mono text-[10px] font-bold text-slate-500 block">YOUR ARCHETYPE</span>
              <h3 className="font-display font-black text-lg text-[#0F172A]">
                {userArchetype.name}
              </h3>
              <span className="font-mono text-xs font-bold text-indigo-700">
                {userArchetype.code}-{userVector.identityVariant}
              </span>
            </div>
          </div>

          {/* Center VS Indicator */}
          <div className="md:col-span-1 flex flex-col items-center justify-center text-center">
            <div className="w-9 h-9 brutal-border bg-[#FFE600] flex items-center justify-center font-display font-black text-xs">
              VS
            </div>
            <span className="font-mono text-[9px] font-black mt-1">{synergyScore}% SYNERGY</span>
          </div>

          {/* Partner Side Selector */}
          <div className="md:col-span-5 flex items-center justify-between gap-4">
            <div className="text-right flex-1">
              <span className="font-mono text-[10px] font-bold text-slate-500 block">PARTNER ARCHETYPE</span>
              <select
                value={partnerArchetypeId}
                onChange={(e) => setPartnerArchetypeId(e.target.value)}
                className="font-display font-black text-base bg-[#FDFBF7] brutal-border px-2 py-1 mt-1 text-[#0F172A]"
              >
                {ARCHETYPES.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.code} - {a.name}
                  </option>
                ))}
              </select>
              <span className="font-mono text-xs font-bold text-emerald-700 block mt-1">
                {partnerArchetype.house}
              </span>
            </div>
            <ArchetypeAvatar archetype={partnerArchetype} variant="A" size="md" />
          </div>
        </div>

        {/* Dual Radar & Friction Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Dual Radar Comparison */}
          <div className="lg:col-span-6 flex justify-center">
            <RadarChart 
              data={comparisonRadarData}
              title="Dual Psychometric Overlay"
              subtitle="Indigo: You | Coral: Partner"
              size={340}
              color="#6366F1"
              benchmarkColor="#F43F5E"
            />
          </div>

          {/* Relational Playbook */}
          <div className="lg:col-span-6 space-y-4">
            {/* Chemistry Summary */}
            <div className="p-4 brutal-border bg-[#F0FDF4]">
              <div className="flex items-center gap-2 mb-2 font-display font-black text-sm text-[#0F172A]">
                <Heart size={16} className="text-rose-500" />
                RELATIONAL SYNERGY ASSESSMENT
              </div>
              <p className="text-xs font-mono text-slate-800 leading-relaxed">
                {isDirectIdeal 
                  ? `Gold-tier algorithmic match! ${userArchetype.code} and ${partnerArchetype.code} form an electric synthesis of grounding structure and expansive conceptual novelty.`
                  : isDirectFriction
                  ? `Growth-oriented tension. High friction in communication styles that requires explicit vulnerability contracts and clear boundary discussions.`
                  : `Complementary dynamic with solid baseline understanding and balanced division of emotional and operational labor.`}
              </p>
            </div>

            {/* Friction Points */}
            <div className="p-4 brutal-border bg-[#FFF1F2]">
              <div className="flex items-center gap-2 mb-2 font-display font-black text-sm text-[#0F172A]">
                <AlertTriangle size={16} className="text-rose-600" />
                POTENTIAL FRICTION HOTSPOTS
              </div>
              <p className="text-xs font-mono text-slate-800 leading-relaxed">
                Watch for differences in Conscientiousness ({userVector.hexaco.conscientiousness}% vs {partnerArchetype.hexacoProfile.conscientiousness}%) and Extraversion pacing. Avoid expecting the partner to read implicit emotional cues without direct dialogue.
              </p>
            </div>

            {/* Communication Cheat Code */}
            <div className="p-4 brutal-border bg-[#FEF08A]">
              <div className="flex items-center gap-2 mb-1 font-display font-black text-sm text-[#0F172A]">
                <MessageSquare size={16} />
                COMMUNICATION CHEAT CODE
              </div>
              <p className="text-xs font-mono text-slate-900 font-bold">
                "{partnerArchetype.relationshipKeys.communicationTip}"
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-[#0F172A]">
          <button
            onClick={onClose}
            className="brutal-btn bg-[#0F172A] text-white px-6 py-2 text-xs font-mono font-bold"
          >
            CLOSE MIRROR
          </button>
        </div>
      </div>
    </div>
  );
};
