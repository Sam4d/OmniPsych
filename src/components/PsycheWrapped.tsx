import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Archetype, UserPsychologicalVector, WrappedSlide } from '../types';
import { ArchetypeAvatar } from './ArchetypeAvatar';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Share2, 
  Flame, 
  Trophy, 
  Brain, 
  Heart,
  TrendingUp
} from 'lucide-react';

interface PsycheWrappedProps {
  archetype: Archetype;
  vector: UserPsychologicalVector;
  onClose: () => void;
}

export const PsycheWrapped: React.FC<PsycheWrappedProps> = ({
  archetype,
  vector,
  onClose
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const slides: WrappedSlide[] = [
    {
      id: 'intro',
      headline: 'YOUR 2026 PSYCHE WRAPPED IS HERE',
      subhead: 'A Year of Cognitive Evolution & Deep Vectors',
      statHighlight: '7 LAYERS SYNTHESIZED',
      description: 'You completed multiple psychometric deep dives, tracking your cognitive growth across HEXACO, Attachment, and Trait EQ.',
      tag: 'OMNIPSYCHE // 2026 EDITION',
      bgColor: '#6366F1',
      accentColor: '#FFE600'
    },
    {
      id: 'archetype',
      headline: `YOU BELONG TO ${archetype.house.toUpperCase()}`,
      subhead: `The Dominant Persona: ${archetype.name} (${archetype.code}-${vector.identityVariant})`,
      statHighlight: `TOP 2.8% RARITY`,
      description: `Your balance of high Conscientiousness (${vector.hexaco.conscientiousness}%) and Openness (${vector.hexaco.openness}%) cements your position as a master architect.`,
      tag: 'ARCHETYPE MATRIX',
      bgColor: '#10B981',
      accentColor: '#FFFDF7'
    },
    {
      id: 'superpower',
      headline: 'YOUR GENERATIONAL SUPERPOWER',
      subhead: `"${archetype.superpowers[0]}"`,
      statHighlight: `${vector.traitEq.score}% TRAIT EQ`,
      description: `When turbulence struck, your nervous system maintained surgical precision while preserving high empathic attunement.`,
      tag: 'COGNITIVE RESILIENCE',
      bgColor: '#F43F5E',
      accentColor: '#FFE600'
    },
    {
      id: 'attachment',
      headline: 'YOUR RELATIONAL SIGNATURE',
      subhead: `Attachment Style: ${vector.attachment.style}`,
      statHighlight: `${vector.attachment.anxiety}% ANXIETY / ${vector.attachment.avoidance}% AVOIDANCE`,
      description: `You cultivated emotional security, building mutual autonomy without sacrificing deep vulnerability and intimacy.`,
      tag: 'RELATIONAL ATTACHMENT',
      bgColor: '#0EA5E9',
      accentColor: '#A3F7BF'
    },
    {
      id: 'finale',
      headline: 'YOUR 2026 COGNITIVE MONOGRAM',
      subhead: `THE DEFINITIVE PSYCHOMETRIC VECTOR`,
      statHighlight: `${vector.grit.score}/5.0 DUCKWORTH GRIT`,
      description: `Keep expanding your boundaries. You are built for generational impact and architectural mastery.`,
      tag: 'CERTIFIED UPG PROFILE',
      bgColor: '#0F172A',
      accentColor: '#FFE600'
    }
  ];

  const currentSlide = slides[currentSlideIndex];

  useEffect(() => {
    if (currentSlideIndex === slides.length - 1) {
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#FFE600', '#6366F1', '#10B981', '#F43F5E']
      });
    }
  }, [currentSlideIndex, slides.length]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="brutal-card max-w-md w-full p-6 sm:p-8 brutal-shadow-xl relative my-auto transition-all text-white" style={{ backgroundColor: currentSlide.bgColor }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-white text-[#0F172A] brutal-border hover:bg-rose-100 transition-colors z-20"
        >
          <X size={18} />
        </button>

        {/* Progress Bar Strips */}
        <div className="flex gap-1.5 mb-6">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 flex-1 brutal-border transition-all ${
                idx <= currentSlideIndex ? 'bg-[#FFE600]' : 'bg-black/30'
              }`}
            />
          ))}
        </div>

        {/* Slide Content */}
        <div className="space-y-6 min-h-[380px] flex flex-col justify-between">
          <div>
            <span className="font-mono text-xs font-black bg-black text-white px-2 py-0.5 brutal-border inline-block mb-3">
              {currentSlide.tag}
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl leading-tight text-white tracking-tight uppercase">
              {currentSlide.headline}
            </h2>
            <p className="font-mono text-xs sm:text-sm font-bold text-white/90 mt-2">
              {currentSlide.subhead}
            </p>
          </div>

          {/* Central Visual Element */}
          <div className="bg-black/20 p-5 brutal-border text-center space-y-2">
            {currentSlideIndex === 1 ? (
              <div className="flex justify-center">
                <ArchetypeAvatar archetype={archetype} variant={vector.identityVariant} size="lg" />
              </div>
            ) : (
              <div>
                <span className="font-mono text-xs text-white/80 block">KEY METRIC</span>
                <span className="font-display font-black text-2xl sm:text-3xl text-[#FFE600] tracking-tight">
                  {currentSlide.statHighlight}
                </span>
              </div>
            )}
            <p className="font-mono text-xs text-white/90 leading-relaxed pt-2">
              {currentSlide.description}
            </p>
          </div>

          {/* Slide Navigation Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-white/30">
            <button
              onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
              disabled={currentSlideIndex === 0}
              className="p-2 bg-white text-[#0F172A] brutal-border disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="font-mono text-xs font-bold text-white">
              {currentSlideIndex + 1} / {slides.length}
            </span>

            {currentSlideIndex < slides.length - 1 ? (
              <button
                onClick={() => setCurrentSlideIndex(prev => prev + 1)}
                className="brutal-btn bg-[#FFE600] text-[#0F172A] px-4 py-2 text-xs font-mono font-black flex items-center gap-1"
              >
                NEXT <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="brutal-btn bg-[#A3F7BF] text-[#0F172A] px-4 py-2 text-xs font-mono font-black"
              >
                FINISH WRAPPED
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
