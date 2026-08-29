import React from 'react';
import { Archetype, IdentityVariant } from '../types';
import { 
  Compass, 
  FlaskConical, 
  Crown, 
  Zap, 
  Eye, 
  BookOpen, 
  Flame, 
  Sparkles, 
  FileCheck, 
  Shield, 
  Activity, 
  Users, 
  Wrench, 
  Palette, 
  Rocket, 
  Music,
  LucideIcon
} from 'lucide-react';

interface ArchetypeAvatarProps {
  archetype: Archetype;
  variant?: IdentityVariant;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  className?: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Compass,
  FlaskConical,
  Crown,
  Zap,
  Eye,
  BookOpen,
  Flame,
  Sparkles,
  FileCheck,
  Shield,
  Activity,
  Users,
  Wrench,
  Palette,
  Rocket,
  Music
};

export const ArchetypeAvatar: React.FC<ArchetypeAvatarProps> = ({
  archetype,
  variant = 'A',
  size = 'md',
  showBadge = true,
  className = ''
}) => {
  const IconComponent = ICON_MAP[archetype.avatarProps.iconName] || Compass;

  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-24 h-24 text-sm',
    lg: 'w-40 h-40 text-base',
    xl: 'w-56 h-56 text-lg'
  };

  const iconSizes = {
    sm: 20,
    md: 38,
    lg: 64,
    xl: 88
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Background Graphic Container */}
      <div 
        className={`relative ${sizeClasses[size]} brutal-border brutal-shadow flex items-center justify-center overflow-hidden transition-transform duration-200 hover:-translate-y-0.5`}
        style={{ backgroundColor: archetype.badgeBg || '#FFFFFF' }}
      >
        {/* Geometric Motif Pattern */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(${archetype.houseColor} 2px, transparent 2px)`,
            backgroundSize: '12px 12px'
          }}
        />

        {/* Decorative corner brutalist blocks */}
        <div 
          className="absolute top-0 right-0 w-3 h-3 brutal-border"
          style={{ backgroundColor: archetype.houseColor }}
        />
        <div 
          className="absolute bottom-0 left-0 w-3 h-3 brutal-border"
          style={{ backgroundColor: archetype.accentColor || '#FFE600' }}
        />

        {/* Central Graphic Element */}
        <div className="relative z-10 flex flex-col items-center justify-center p-2 text-center">
          <div 
            className="p-2.5 brutal-border brutal-shadow-sm rounded-none mb-1 transition-transform group-hover:scale-105"
            style={{ backgroundColor: archetype.houseColor, color: '#FFFFFF' }}
          >
            <IconComponent size={iconSizes[size]} strokeWidth={2.2} />
          </div>
          {size === 'xl' || size === 'lg' ? (
            <span className="font-mono font-bold tracking-tight text-[11px] uppercase bg-white px-1.5 py-0.5 brutal-border mt-1">
              {archetype.avatarProps.propName}
            </span>
          ) : null}
        </div>
      </div>

      {/* Code & Variant Identity Pill */}
      {showBadge && (
        <div 
          className="absolute -bottom-2.5 px-2 py-0.5 bg-[#0F172A] text-white font-mono font-black text-[10px] sm:text-xs brutal-border uppercase tracking-wider brutal-shadow-sm flex items-center gap-1 z-20"
        >
          <span>{archetype.code}-{variant}</span>
          <span 
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ backgroundColor: variant === 'A' ? '#A3F7BF' : '#FF6B6B' }}
          />
        </div>
      )}
    </div>
  );
};
