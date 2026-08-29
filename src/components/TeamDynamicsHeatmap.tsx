import React, { useState } from 'react';
import { Archetype, UserPsychologicalVector } from '../types';
import { ARCHETYPES } from '../data/archetypes';
import { ArchetypeAvatar } from './ArchetypeAvatar';
import { 
  Users, 
  ShieldAlert, 
  Sparkles, 
  TrendingUp, 
  CheckCircle, 
  Layers, 
  Briefcase, 
  AlertTriangle,
  MessageSquare
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  archetypeId: string;
  variant: 'A' | 'T';
}

interface TeamDynamicsHeatmapProps {
  userArchetype: Archetype;
  userVector: UserPsychologicalVector;
}

export const TeamDynamicsHeatmap: React.FC<TeamDynamicsHeatmapProps> = ({
  userArchetype,
  userVector
}) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'Alex Rivera (You)', role: 'Lead Architect', archetypeId: userArchetype.id, variant: userVector.identityVariant },
    { id: '2', name: 'Marcus Chen', role: 'Head of Engineering', archetypeId: 'intp', variant: 'A' },
    { id: '3', name: 'Elena Rostova', role: 'VP of Product', archetypeId: 'entj', variant: 'A' },
    { id: '4', name: 'Sophia Miller', role: 'Lead UX Researcher', archetypeId: 'enfp', variant: 'T' },
    { id: '5', name: 'David Vance', role: 'Infrastructure Director', archetypeId: 'istj', variant: 'A' }
  ]);

  const [selectedMember, setSelectedMember] = useState<TeamMember>(teamMembers[0]);

  // Calculate team psychological safety and balance
  const houseDistribution = teamMembers.reduce((acc, member) => {
    const arch = ARCHETYPES.find(a => a.id === member.archetypeId);
    const house = arch?.house || 'The Strategists';
    acc[house] = (acc[house] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 px-3 sm:px-6">
      {/* Header */}
      <div className="brutal-card bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#0F172A] pb-4">
          <div>
            <span className="brutal-badge bg-[#6366F1] text-white text-xs mb-1">
              PSYCH TEAMS B2B // WORKPLACE HEATMAP
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-[#0F172A] tracking-tight uppercase">
              Team Dynamics & Psychological Safety Matrix
            </h2>
            <p className="font-mono text-xs sm:text-sm text-slate-600 mt-1">
              Predict team friction hotspots, balance cognitive diversity across Grand Houses, and generate bespoke 1-on-1 manager coaching guides.
            </p>
          </div>
          <span className="font-mono text-xs font-bold bg-[#FFE600] px-3 py-1.5 brutal-border">
            ENTERPRISE SEAT ACTIVE
          </span>
        </div>
      </div>

      {/* Team Composition & House Balance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* House Distribution Card */}
        <div className="lg:col-span-4 brutal-card bg-white p-6 space-y-4">
          <div className="border-b-2 border-[#0F172A] pb-2">
            <span className="font-mono text-[10px] text-slate-500 font-bold block">HOUSE COMPOSITION</span>
            <h3 className="font-display font-black text-lg uppercase">
              Cognitive Diversity
            </h3>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {[
              { name: 'The Strategists', color: '#6366F1', count: houseDistribution['The Strategists'] || 0 },
              { name: 'The Diplomats', color: '#10B981', count: houseDistribution['The Diplomats'] || 0 },
              { name: 'The Navigators', color: '#0EA5E9', count: houseDistribution['The Navigators'] || 0 },
              { name: 'The Explorers', color: '#F43F5E', count: houseDistribution['The Explorers'] || 0 }
            ].map((h, idx) => (
              <div key={idx} className="p-2.5 brutal-border bg-[#F8FAFC]">
                <div className="flex justify-between font-bold mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 brutal-border inline-block" style={{ backgroundColor: h.color }} />
                    {h.name}
                  </span>
                  <span>{h.count} Members ({Math.round((h.count / teamMembers.length) * 100)}%)</span>
                </div>
                <div className="w-full h-2 bg-[#E2E8F0] brutal-border">
                  <div 
                    className="h-full" 
                    style={{ width: `${(h.count / teamMembers.length) * 100}%`, backgroundColor: h.color }} 
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#F0FDF4] brutal-border text-xs font-mono">
            <span className="font-black text-emerald-800 block mb-1">HEALTH CHECK: BALANCED</span>
            <p className="text-slate-700">High strategic vision anchored by solid operational navigation.</p>
          </div>
        </div>

        {/* Member Grid & Friction Predictor */}
        <div className="lg:col-span-8 brutal-card bg-white p-6 space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#0F172A] pb-2">
            <div>
              <span className="font-mono text-[10px] text-slate-500 font-bold block">TEAM ROSTER</span>
              <h3 className="font-display font-black text-lg uppercase">
                Active Members & Archetypes
              </h3>
            </div>
            <span className="font-mono text-xs font-bold text-slate-500">{teamMembers.length} SEATS FILLED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {teamMembers.map((member) => {
              const arch = ARCHETYPES.find(a => a.id === member.archetypeId) || ARCHETYPES[0];
              const isSelected = selectedMember.id === member.id;

              return (
                <div
                  key={member.id}
                  onClick={() => setSelectedMember(member)}
                  className={`p-3.5 brutal-border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected ? 'bg-[#FFE600] brutal-shadow -translate-y-0.5' : 'bg-[#FDFBF7] hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ArchetypeAvatar archetype={arch} variant={member.variant} size="sm" showBadge={false} />
                    <div>
                      <h4 className="font-display font-black text-sm text-[#0F172A]">{member.name}</h4>
                      <p className="font-mono text-[11px] text-slate-600 font-bold">{member.role}</p>
                      <span className="font-mono text-[10px] text-indigo-700 font-black">
                        {arch.code}-{member.variant} ({arch.name})
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Member 1-on-1 Coaching Dossier */}
          {selectedMember && (
            <div className="p-4 bg-[#FDFBF7] brutal-border mt-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-[#0F172A] pb-2">
                <span className="font-black text-[#0F172A]">
                  1-ON-1 COACHING PLAYBOOK FOR {selectedMember.name.toUpperCase()}
                </span>
                <span className="bg-white px-2 py-0.5 brutal-border font-bold">
                  {ARCHETYPES.find(a => a.id === selectedMember.archetypeId)?.code}-{selectedMember.variant}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-2.5 bg-white brutal-border">
                  <span className="font-bold text-slate-500 block mb-0.5">HOW TO MOTIVATE</span>
                  <p className="text-slate-800">
                    Provide autonomous problem-solving sprints and clearly defined deliverables without micro-managing daily steps.
                  </p>
                </div>
                <div className="p-2.5 bg-white brutal-border">
                  <span className="font-bold text-slate-500 block mb-0.5">COMMUNICATION CHEAT CODE</span>
                  <p className="text-slate-800">
                    {ARCHETYPES.find(a => a.id === selectedMember.archetypeId)?.relationshipKeys.communicationTip}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
