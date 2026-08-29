import React, { useState } from 'react';
import { Archetype, GrandHouse } from '../types';
import { ARCHETYPES, GRAND_HOUSES } from '../data/archetypes';
import { ArchetypeAvatar } from './ArchetypeAvatar';
import { 
  Search, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  X, 
  Zap, 
  ShieldAlert, 
  Briefcase, 
  Users 
} from 'lucide-react';

interface ArchetypeDirectoryProps {
  onSelectArchetype?: (archetype: Archetype) => void;
}

export const ArchetypeDirectory: React.FC<ArchetypeDirectoryProps> = ({
  onSelectArchetype
}) => {
  const [selectedHouse, setSelectedHouse] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalArchetype, setActiveModalArchetype] = useState<Archetype | null>(null);

  const filteredArchetypes = ARCHETYPES.filter((a) => {
    const matchesHouse = selectedHouse === 'ALL' || a.house === selectedHouse;
    const matchesSearch = 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesHouse && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 px-3 sm:px-6">
      {/* Header */}
      <div className="brutal-card bg-white p-6 sm:p-8">
        <div className="border-b-2 border-[#0F172A] pb-4 mb-6">
          <span className="brutal-badge bg-[#6366F1] text-white text-xs mb-1">
            THE 16 / 32 CHARACTER ARCHETYPE UNIVERSE
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-[#0F172A] tracking-tight uppercase">
            The Grand Houses & Archetypes Codex
          </h2>
          <p className="font-mono text-xs sm:text-sm text-slate-600 mt-1">
            Discover the 16 core typologies across 4 Grand Houses, each featuring Assertive (-A) and Turbulent (-T) neuroticism spectrum variants.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* House Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 font-mono text-xs">
            <button
              onClick={() => setSelectedHouse('ALL')}
              className={`px-3 py-1.5 brutal-border brutal-shadow-sm font-bold transition-all min-h-[36px] ${
                selectedHouse === 'ALL' ? 'bg-[#0F172A] text-white' : 'bg-white text-[#0F172A] hover:bg-slate-100'
              }`}
            >
              ALL HOUSES (16)
            </button>
            {GRAND_HOUSES.map((house) => (
              <button
                key={house.name}
                onClick={() => setSelectedHouse(house.name)}
                className={`px-3 py-1.5 brutal-border brutal-shadow-sm font-bold transition-all min-h-[36px] ${
                  selectedHouse === house.name ? 'bg-[#0F172A] text-white' : 'bg-white text-[#0F172A] hover:bg-slate-100'
                }`}
                style={{
                  borderLeftColor: house.color,
                  borderLeftWidth: '5px'
                }}
              >
                {house.name.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code or title (e.g. INTJ, Oracle)..."
              className="w-full bg-[#F8FAFC] brutal-border pl-8 pr-3 py-1.5 font-mono text-xs focus:outline-none focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Archetypes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredArchetypes.map((archetype) => (
          <div
            key={archetype.id}
            className="brutal-card bg-white p-5 flex flex-col justify-between hover:-translate-y-1 transition-all duration-150 relative group"
          >
            <div>
              {/* Avatar Center */}
              <div className="flex justify-center my-3">
                <ArchetypeAvatar archetype={archetype} variant="A" size="md" />
              </div>

              <div className="text-center mt-2">
                <span 
                  className="font-mono text-[10px] font-extrabold uppercase px-2 py-0.5 brutal-border text-white inline-block mb-1"
                  style={{ backgroundColor: archetype.houseColor }}
                >
                  {archetype.house}
                </span>
                <h3 className="font-display font-black text-lg text-[#0F172A] group-hover:text-indigo-600 transition-colors">
                  {archetype.name}
                </h3>
                <p className="font-mono text-xs font-bold text-slate-500 mb-2">
                  "{archetype.title}"
                </p>
                <p className="text-xs text-slate-700 font-mono line-clamp-3 leading-relaxed mb-4 text-left">
                  {archetype.shortDescription}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#0F172A] flex items-center justify-between">
              <span className="font-mono text-xs font-black text-[#0F172A]">
                {archetype.code}-A / {archetype.code}-T
              </span>
              <button
                onClick={() => setActiveModalArchetype(archetype)}
                className="brutal-btn bg-[#FFE600] px-2.5 py-1 text-xs font-mono font-bold flex items-center gap-1"
              >
                PROFILE <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Deep-Dive Modal */}
      {activeModalArchetype && (
        <div className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="brutal-card bg-[#FDFBF7] max-w-3xl w-full p-6 sm:p-8 brutal-shadow-xl relative my-auto animate-in fade-in zoom-in-95 duration-200 space-y-6">
            <button
              onClick={() => setActiveModalArchetype(null)}
              className="absolute top-4 right-4 p-1.5 bg-white brutal-border hover:bg-rose-100 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="flex flex-wrap items-center gap-5 border-b-2 border-[#0F172A] pb-4">
              <ArchetypeAvatar archetype={activeModalArchetype} variant="A" size="lg" />
              <div>
                <span 
                  className="font-mono text-xs font-black text-white px-2 py-0.5 brutal-border inline-block mb-1"
                  style={{ backgroundColor: activeModalArchetype.houseColor }}
                >
                  {activeModalArchetype.house}
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-[#0F172A]">
                  {activeModalArchetype.name} ({activeModalArchetype.code})
                </h3>
                <p className="font-mono text-sm font-bold text-indigo-700">
                  "{activeModalArchetype.title}"
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm font-mono text-slate-800 leading-relaxed bg-white p-4 brutal-border">
              {activeModalArchetype.fullDescription}
            </p>

            {/* Superpowers & Blindspots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 bg-[#F0FDF4] brutal-border">
                <span className="font-black text-emerald-700 flex items-center gap-1 mb-2 font-display text-sm">
                  <Zap size={14} /> SIGNATURE SUPERPOWERS
                </span>
                <ul className="space-y-1">
                  {activeModalArchetype.superpowers.map((p, idx) => (
                    <li key={idx}>• {p}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-[#FFF1F2] brutal-border">
                <span className="font-black text-rose-700 flex items-center gap-1 mb-2 font-display text-sm">
                  <ShieldAlert size={14} /> FATAL BLINDSPOTS
                </span>
                <ul className="space-y-1">
                  {activeModalArchetype.blindspots.map((b, idx) => (
                    <li key={idx}>• {b}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Famous Examples & Careers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 bg-white brutal-border">
                <span className="font-bold text-slate-500 block mb-1">HISTORICAL & MODERN ARCHETYPES</span>
                <p className="font-bold text-[#0F172A]">
                  {activeModalArchetype.famousExamples.join(', ')}
                </p>
              </div>
              <div className="p-3.5 bg-white brutal-border">
                <span className="font-bold text-slate-500 block mb-1">IDEAL CAREER CLUSTERS</span>
                <p className="font-bold text-[#0F172A]">
                  {activeModalArchetype.careerClusters.join(', ')}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2 border-t border-[#0F172A]">
              <button
                onClick={() => setActiveModalArchetype(null)}
                className="brutal-btn bg-[#0F172A] text-white px-6 py-2 text-xs font-mono font-bold"
              >
                CLOSE CODEX
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
