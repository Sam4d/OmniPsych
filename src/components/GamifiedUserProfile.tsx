import React, { useState } from 'react';
import { 
  UserPsychologicalVector, 
  Archetype, 
  MicroTest 
} from '../types';
import { useAuth } from '../context/AuthContext';
import { getArchetypeById } from '../utils/scoring';
import { QUICK_LAB_TESTS } from '../data/questions';
import { 
  Trophy, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  ArrowRight, 
  Swords, 
  Users, 
  ShieldCheck, 
  Lock, 
  Share2, 
  Copy, 
  Check, 
  User as UserIcon, 
  Edit3, 
  Save, 
  Flame, 
  BrainCircuit, 
  Compass, 
  Award, 
  BarChart3, 
  Layers,
  Heart,
  Briefcase,
  EyeOff,
  Cpu,
  Feather,
  Activity,
  ChevronRight,
  LogIn,
  BookOpen,
  Download,
  Trash2,
  AlertTriangle,
  History,
  TrendingUp
} from 'lucide-react';

interface GamifiedUserProfileProps {
  vector: UserPsychologicalVector;
  archetype: Archetype;
  onStartFullAssessment: () => void;
  onStartMicroTest: (test: MicroTest) => void;
  onOpenFriends: () => void;
  onOpenGlossary: (termId?: string) => void;
  onOpenAuth: () => void;
}

interface TestInstrumentStatus {
  id: string;
  title: string;
  category: string;
  timeEstimate: string;
  xpReward: number;
  icon: any;
  color: string;
  isCompleted: boolean;
  scoreSnippet?: string;
  microTestObject?: MicroTest;
}

const AVATAR_PALETTE = [
  { name: 'Solar Yellow', hex: '#FFE600' },
  { name: 'Neo Mint', hex: '#A3F7BF' },
  { name: 'Cyber Coral', hex: '#FF6B6B' },
  { name: 'Electric Cyan', hex: '#38BDF8' },
  { name: 'Royal Violet', hex: '#C084FC' },
  { name: 'Obsidian Slate', hex: '#0F172A' },
];

export const GamifiedUserProfile: React.FC<GamifiedUserProfileProps> = ({
  vector,
  archetype,
  onStartFullAssessment,
  onStartMicroTest,
  onOpenFriends,
  onOpenGlossary,
  onOpenAuth
}) => {
  const { 
    user, 
    userProfile, 
    updateUserProfileData, 
    exportUserData, 
    deleteUserAccountAndData 
  } = useAuth();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(userProfile?.displayName || '');
  const [selectedAvatarColor, setSelectedAvatarColor] = useState(userProfile?.avatarColor || '#FFE600');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isUpdatingPrivacy, setIsUpdatingPrivacy] = useState(false);

  // Derive completed test IDs
  const completedIds = new Set(vector.completedTestIds || ['omni-core']);
  
  // All 8 Core Psychometric Instruments in OmniPsyche
  const instruments: TestInstrumentStatus[] = [
    {
      id: 'omni-core',
      title: 'Master Omni 7-Layer Synthesis',
      category: 'Core Personality Matrix (HEXACO)',
      timeEstimate: '5-7 min',
      xpReward: 450,
      icon: BrainCircuit,
      color: '#0F172A',
      isCompleted: completedIds.has('omni-core'),
      scoreSnippet: `${archetype.code}-${vector.identityVariant} • ${archetype.name}`
    },
    {
      id: 'attachment-fast',
      title: 'Attachment & Relational Blueprint',
      category: 'Attachment Theory & Gottman Index',
      timeEstimate: '2 min',
      xpReward: 150,
      icon: Heart,
      color: '#FF6B6B',
      isCompleted: completedIds.has('attachment-fast'),
      scoreSnippet: `${vector.attachment.style} (${100 - vector.attachment.avoidance}% Attuned)`,
      microTestObject: QUICK_LAB_TESTS.find(t => t.id === 'attachment-fast')
    },
    {
      id: 'riasec-fast',
      title: 'Holland RIASEC Career Triad',
      category: 'Vocational Psychology & O*NET 900+',
      timeEstimate: '3 min',
      xpReward: 150,
      icon: Briefcase,
      color: '#6366F1',
      isCompleted: completedIds.has('riasec-fast'),
      scoreSnippet: `Code ${vector.riasec.hollandCode} (${vector.riasec.topCodes.join(', ')})`,
      microTestObject: QUICK_LAB_TESTS.find(t => t.id === 'riasec-fast')
    },
    {
      id: 'shadow-fast',
      title: 'Subclinical Shadow & Dark Triad',
      category: 'Tactical Defense & Dark Tetrad',
      timeEstimate: '2 min',
      xpReward: 150,
      icon: EyeOff,
      color: '#0F172A',
      isCompleted: completedIds.has('shadow-fast'),
      scoreSnippet: `${vector.shadow.shadowIntegrationLevel}`,
      microTestObject: QUICK_LAB_TESTS.find(t => t.id === 'shadow-fast')
    },
    {
      id: 'eq-fast',
      title: 'Trait Emotional Intelligence (EQ)',
      category: 'Bar-On / Petrides Trait EI',
      timeEstimate: '2 min',
      xpReward: 150,
      icon: Activity,
      color: '#10B981',
      isCompleted: completedIds.has('eq-fast'),
      scoreSnippet: `Score ${vector.traitEq.score}/100 • High Regulation`,
      microTestObject: QUICK_LAB_TESTS.find(t => t.id === 'eq-fast')
    },
    {
      id: 'executive-asrs',
      title: 'Executive Focus & Attention Flow',
      category: 'ASRS v1.1 Attentional Regulation',
      timeEstimate: '3 min',
      xpReward: 150,
      icon: Cpu,
      color: '#FFE600',
      isCompleted: completedIds.has('executive-asrs'),
      scoreSnippet: `Pacing ${vector.neurodiversity.executiveFunctionPacing}% • ${vector.neurodiversity.attentionRegulationAsrs}% Focus`,
      microTestObject: QUICK_LAB_TESTS.find(t => t.id === 'executive-asrs')
    },
    {
      id: 'hsp-sensory',
      title: 'HSP Sensory Processing Index',
      category: 'Aron Environmental Sensitivity',
      timeEstimate: '2 min',
      xpReward: 150,
      icon: Feather,
      color: '#A3F7BF',
      isCompleted: completedIds.has('hsp-sensory'),
      scoreSnippet: `Sensory Depth ${vector.neurodiversity.highSensitivityHsp}%`,
      microTestObject: QUICK_LAB_TESTS.find(t => t.id === 'hsp-sensory')
    },
    {
      id: 'grit-scale',
      title: 'Grit & Relentless Tenacity',
      category: 'Duckworth Long-Term Perseverance',
      timeEstimate: '2 min',
      xpReward: 150,
      icon: Flame,
      color: '#F97316',
      isCompleted: completedIds.has('grit-scale'),
      scoreSnippet: `Grit Score ${vector.grit.score} / 5.0`,
      microTestObject: QUICK_LAB_TESTS.find(t => t.id === 'grit-scale')
    }
  ];

  const completedCount = instruments.filter(i => i.isCompleted).length;
  const totalInstruments = instruments.length;
  const calibrationPercent = Math.round((completedCount / totalInstruments) * 100);

  // Dynamic Level Calculation
  const totalXP = (vector.xpPoints || 300) + (completedCount * 150);
  const currentLevel = Math.floor(totalXP / 250) + 1;
  const currentLevelXP = totalXP % 250;
  const nextLevelXP = 250;
  const levelProgressPercent = Math.round((currentLevelXP / nextLevelXP) * 100);

  // Determine Level Title
  const getLevelTitle = (lvl: number) => {
    if (lvl >= 8) return 'Omni-Mind Grandmaster';
    if (lvl >= 6) return 'Master Synthesizer';
    if (lvl >= 4) return 'Calibrated Strategist';
    if (lvl >= 2) return 'Active Explorer';
    return 'Novice Analyst';
  };

  // RPG Stat Calculations (0-100)
  const rpgStats = [
    { label: 'Strategic Vision', value: Math.round((vector.hexaco.openness + vector.hexaco.conscientiousness) / 2), color: '#6366F1' },
    { label: 'Emotional Fortitude', value: Math.round(vector.identityVariant === 'A' ? 88 : 45), color: '#10B981' },
    { label: 'Relational Resonance', value: Math.round((vector.traitEq.score + vector.relational.emotionalAttunement) / 2), color: '#EC4899' },
    { label: 'Tenacity & Grit', value: Math.round((vector.grit.score / 5) * 100), color: '#F97316' },
    { label: 'Ethical Navigation', value: Math.round(vector.hexaco.honestyHumility), color: '#38BDF8' },
    { label: 'Sensory Attunement', value: Math.round(vector.neurodiversity.highSensitivityHsp), color: '#A3F7BF' },
  ];

  // Achievements
  const achievements = [
    {
      id: 'first_synapse',
      title: 'First Synapse',
      desc: 'Completed your first psychometric instrument.',
      unlocked: completedCount >= 1,
      icon: Zap,
      color: '#FFE600'
    },
    {
      id: 'high_fidelity',
      title: 'High-Fidelity Mind',
      desc: 'Calibrated 4+ psychometric dimensions.',
      unlocked: completedCount >= 4,
      icon: BrainCircuit,
      color: '#6366F1'
    },
    {
      id: 'omni_perfection',
      title: 'Omni-Synthesis Master',
      desc: 'Calibrated all 8 psychological layers for 100% fidelity.',
      unlocked: completedCount >= 8,
      icon: Award,
      color: '#10B981'
    },
    {
      id: 'social_node',
      title: 'Sociometric Pioneer',
      desc: 'Connected with peers in your friendship network.',
      unlocked: Boolean(userProfile?.friendCode),
      icon: Users,
      color: '#EC4899'
    },
    {
      id: 'shadow_explorer',
      title: 'Shadow Integrator',
      desc: 'Calibrated the Subclinical Dark Triad & Ethical Defense test.',
      unlocked: completedIds.has('shadow-fast'),
      icon: EyeOff,
      color: '#0F172A'
    },
    {
      id: 'career_alchemist',
      title: 'Career Alchemist',
      desc: 'Unlocked your Holland RIASEC Triad & O*NET career cluster.',
      unlocked: completedIds.has('riasec-fast'),
      icon: Briefcase,
      color: '#F97316'
    }
  ];

  const handleSaveProfile = async () => {
    if (!user) {
      setIsEditingName(false);
      return;
    }
    await updateUserProfileData({
      displayName: newDisplayName.trim() || userProfile?.displayName,
      avatarColor: selectedAvatarColor
    });
    setIsEditingName(false);
  };

  const handleCopyCode = () => {
    const code = userProfile?.friendCode || 'PSY-77291';
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyShareProfile = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#profile`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-7 pb-16 px-3 sm:px-6 animate-in fade-in duration-200">
      {/* Logged Out Teaser Banner if Not Logged In */}
      {!user && (
        <div className="bg-[#FFE600] p-4 sm:p-5 brutal-border brutal-shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0F172A] text-[#FFE600] brutal-border flex items-center justify-center font-display font-black text-xl shrink-0">
              ⚡
            </div>
            <div>
              <h3 className="font-display font-black text-base sm:text-lg text-[#0F172A]">
                CLAIM YOUR PERSISTENT GAMIFIED PROFILE
              </h3>
              <p className="font-mono text-xs text-slate-800 mt-0.5">
                Sign in with 1-click Google or Email to save your XP, level up your archetype card, and sync across all devices automatically!
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAuth}
            className="brutal-btn bg-[#0F172A] text-white px-5 py-2.5 font-mono text-xs font-black whitespace-nowrap flex items-center gap-1.5 shrink-0 hover:bg-slate-800"
          >
            <LogIn size={14} className="text-[#FFE600]" />
            <span>SIGN IN / CREATE ACCOUNT</span>
          </button>
        </div>
      )}

      {/* Gamified Hero Passport & Identity Card */}
      <div className="bg-white p-6 sm:p-8 brutal-border brutal-shadow-lg relative overflow-hidden">
        {/* Background Pattern */}
        <div 
          className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-10 pointer-events-none blur-2xl"
          style={{ backgroundColor: archetype.houseColor }}
        />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          {/* Left: Avatar & Identity Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Custom Avatar Crest */}
            <div className="relative group">
              <div 
                className="w-20 h-20 sm:w-24 sm:h-24 brutal-border flex items-center justify-center font-display font-black text-3xl sm:text-4xl text-[#0F172A] shadow-inner transition-transform group-hover:scale-105"
                style={{ backgroundColor: userProfile?.avatarColor || archetype.houseColor }}
              >
                {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : archetype.code}
              </div>
              <span className="absolute -bottom-2 -right-2 brutal-badge bg-[#0F172A] text-white text-[10px] font-mono font-bold">
                LVL {currentLevel}
              </span>
            </div>

            {/* User details */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span 
                  className="brutal-badge text-[10px] font-mono font-bold"
                  style={{ backgroundColor: archetype.houseColor }}
                >
                  {archetype.house}
                </span>
                <span className="brutal-badge bg-[#0F172A] text-white text-[10px] font-mono">
                  {archetype.code}-{vector.identityVariant}
                </span>
                <span className="brutal-badge bg-emerald-100 text-emerald-900 border-emerald-600 text-[10px] font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  AUTO-SYNCED
                </span>
              </div>

              {isEditingName ? (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    placeholder="Enter display name..."
                    className="p-1.5 brutal-border font-display font-black text-lg bg-white max-w-[220px]"
                  />
                  <button
                    onClick={handleSaveProfile}
                    className="brutal-btn bg-[#FFE600] p-2 text-xs font-mono font-bold"
                    title="Save Name"
                  >
                    <Save size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-0.5">
                  <h1 className="font-display font-black text-2xl sm:text-3xl text-[#0F172A] tracking-tight">
                    {userProfile?.displayName || 'Psychometric Explorer'}
                  </h1>
                  {user && (
                    <button
                      onClick={() => {
                        setNewDisplayName(userProfile?.displayName || '');
                        setIsEditingName(true);
                      }}
                      className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-[#0F172A]"
                      title="Edit Profile Name"
                    >
                      <Edit3 size={15} />
                    </button>
                  )}
                </div>
              )}

              <p className="font-mono text-xs sm:text-sm text-slate-600 font-bold">
                {archetype.name} • {archetype.title}
              </p>

              {/* Friend Code & Username */}
              <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs text-slate-600">
                {userProfile?.username && (
                  <span className="bg-slate-100 px-2 py-0.5 brutal-border border-slate-300 font-bold">
                    @{userProfile.username}
                  </span>
                )}
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 brutal-border border-amber-300">
                  <span className="text-slate-500">FRIEND CODE:</span>
                  <span className="font-mono font-black text-[#0F172A]">
                    {userProfile?.friendCode || 'PSY-77291'}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="ml-1 p-0.5 hover:text-amber-800"
                    title="Copy Friend Code"
                  >
                    {copiedCode ? <Check size={12} className="text-emerald-700" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Gamified Level Box & Calibration Gauge */}
          <div className="w-full lg:w-80 bg-slate-50 p-4 brutal-border space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold text-slate-500 block uppercase">
                  CURRENT TIER
                </span>
                <span className="font-display font-black text-base text-[#0F172A]">
                  {getLevelTitle(currentLevel)}
                </span>
              </div>
              <div className="text-right">
                <span className="brutal-badge bg-[#FFE600] text-xs font-mono font-black">
                  {totalXP} XP
                </span>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div>
              <div className="flex justify-between text-[10px] font-mono text-slate-600 font-bold mb-1">
                <span>XP TO LEVEL {currentLevel + 1}</span>
                <span>{currentLevelXP} / {nextLevelXP} XP</span>
              </div>
              <div className="w-full h-3 bg-slate-200 brutal-border overflow-hidden p-0.5">
                <div 
                  className="h-full bg-[#FFE600] transition-all duration-500"
                  style={{ width: `${levelProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Psychometric Calibration Bar */}
            <div className="pt-2 border-t border-slate-200">
              <div className="flex justify-between text-[11px] font-mono font-bold mb-1">
                <span className="flex items-center gap-1 text-[#0F172A]">
                  <Layers size={13} className="text-indigo-600" />
                  CALIBRATION COMPLETION
                </span>
                <span className="text-[#0F172A] font-black">{completedCount} / {totalInstruments} ({calibrationPercent}%)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 brutal-border overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${calibrationPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Avatar Color Picker (If editing) */}
        {user && isEditingName && (
          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-slate-600">AVATAR THEME:</span>
            <div className="flex gap-2">
              {AVATAR_PALETTE.map((pal) => (
                <button
                  key={pal.hex}
                  onClick={() => setSelectedAvatarColor(pal.hex)}
                  className={`w-6 h-6 brutal-border transition-transform ${
                    selectedAvatarColor === pal.hex ? 'scale-125 ring-2 ring-[#0F172A]' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: pal.hex }}
                  title={pal.name}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Calibration Incentive Banner (If not all 8 tests completed) */}
      {completedCount < totalInstruments && (
        <div className="bg-[#A3F7BF] p-4 sm:p-5 brutal-border brutal-shadow flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0F172A] text-[#A3F7BF] brutal-border flex items-center justify-center font-display font-black text-lg shrink-0">
              🎯
            </div>
            <div>
              <span className="font-mono text-[10px] font-black uppercase text-emerald-950 block">
                FIDELITY BOOST OPPORTUNITY
              </span>
              <h3 className="font-display font-black text-base text-[#0F172A]">
                Take the remaining {totalInstruments - completedCount} micro-tests to unlock your 100% Complete Psychometric Passport!
              </h3>
              <p className="font-mono text-xs text-slate-700 mt-0.5">
                Each 2-minute test awards +150 XP and refines your live compatibility, career matches, and emotional regulation matrix.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const pending = instruments.find(i => !i.isCompleted);
              if (pending?.microTestObject) {
                onStartMicroTest(pending.microTestObject);
              } else {
                onStartFullAssessment();
              }
            }}
            className="brutal-btn bg-[#0F172A] text-white px-4 py-2 font-mono text-xs font-black whitespace-nowrap flex items-center gap-1.5 shrink-0"
          >
            <span>CALIBRATE NEXT TEST (+150 XP)</span>
            <ArrowRight size={14} className="text-[#FFE600]" />
          </button>
        </div>
      )}

      {/* Main Grid: 8-Dimension Test Matrix & Personality RPG Attributes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: The 8 Psychometric Instrument Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-[#0F172A]">
            <div>
              <h2 className="font-display font-black text-xl text-[#0F172A] flex items-center gap-2">
                <Layers size={20} />
                THE 8-DIMENSION PSYCHOMETRIC MATRIX
              </h2>
              <p className="font-mono text-xs text-slate-600 mt-0.5">
                Your psychometric passport updates in real time as each instrument is calibrated.
              </p>
            </div>
            <span className="font-mono text-xs font-bold bg-white px-2.5 py-1 brutal-border">
              {completedCount} / {totalInstruments} DONE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {instruments.map((inst) => {
              const Icon = inst.icon;
              return (
                <div
                  key={inst.id}
                  className={`p-4 brutal-border flex flex-col justify-between transition-all ${
                    inst.isCompleted 
                      ? 'bg-white hover:bg-slate-50' 
                      : 'bg-[#FFFDF7] border-dashed border-slate-400 opacity-95 hover:opacity-100 hover:border-solid hover:border-[#0F172A]'
                  }`}
                >
                  <div>
                    {/* Top status header */}
                    <div className="flex items-center justify-between mb-2">
                      <div 
                        className="w-8 h-8 brutal-border text-white flex items-center justify-center"
                        style={{ backgroundColor: inst.color }}
                      >
                        <Icon size={16} />
                      </div>
                      
                      {inst.isCompleted ? (
                        <span className="brutal-badge bg-emerald-100 text-emerald-800 border-emerald-600 text-[10px] font-mono flex items-center gap-1 font-bold">
                          <CheckCircle2 size={11} className="text-emerald-700" />
                          CALIBRATED
                        </span>
                      ) : (
                        <span className="brutal-badge bg-[#FFE600] text-[#0F172A] text-[10px] font-mono font-black">
                          +{inst.xpReward} XP
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-black text-sm text-[#0F172A] leading-snug">
                      {inst.title}
                    </h3>
                    <p className="font-mono text-[10px] text-slate-500 font-bold mb-2">
                      {inst.category} • {inst.timeEstimate}
                    </p>

                    {inst.isCompleted && inst.scoreSnippet && (
                      <div className="p-1.5 bg-slate-50 brutal-border border-slate-200 font-mono text-[11px] text-slate-800 font-bold mb-3">
                        {inst.scoreSnippet}
                      </div>
                    )}
                  </div>

                  {/* Action trigger */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    {inst.isCompleted ? (
                      <button
                        onClick={() => {
                          if (inst.microTestObject) {
                            onStartMicroTest(inst.microTestObject);
                          } else {
                            onStartFullAssessment();
                          }
                        }}
                        className="font-mono text-[11px] font-bold text-slate-500 hover:text-[#0F172A] flex items-center gap-1"
                      >
                        <span>Recalibrate</span>
                        <ChevronRight size={12} />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (inst.microTestObject) {
                            onStartMicroTest(inst.microTestObject);
                          } else {
                            onStartFullAssessment();
                          }
                        }}
                        className="w-full brutal-btn bg-[#FFE600] text-[#0F172A] py-1.5 px-3 font-mono text-xs font-black flex items-center justify-center gap-1"
                      >
                        <Play size={11} fill="currentColor" />
                        <span>TAKE 2-MIN TEST</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Personality RPG Attributes & Archetype Powers */}
        <div className="space-y-6">
          {/* RPG Attribute Gauges */}
          <div className="bg-white p-5 brutal-border brutal-shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <BarChart3 size={18} className="text-[#0F172A]" />
              <h3 className="font-display font-black text-base text-[#0F172A]">
                PERSONALITY ATTRIBUTES
              </h3>
            </div>

            <div className="space-y-3">
              {rpgStats.map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between font-mono text-xs mb-1">
                    <span className="font-bold text-slate-700">{stat.label}</span>
                    <span className="font-black text-[#0F172A]">{stat.value} / 100</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 brutal-border overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500"
                      style={{ 
                        width: `${stat.value}%`,
                        backgroundColor: stat.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Archetype Superpowers & Blindspots */}
          <div className="bg-[#FFFDF7] p-5 brutal-border space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Sparkles size={18} className="text-amber-500" />
              <h3 className="font-display font-black text-base text-[#0F172A]">
                CORE SUPERPOWERS
              </h3>
            </div>

            <div className="space-y-2 font-mono text-xs text-slate-800">
              {archetype.superpowers.slice(0, 3).map((sp, idx) => (
                <div key={idx} className="flex items-start gap-1.5 p-2 bg-white brutal-border">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{sp}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <span className="font-mono text-[10px] font-bold text-slate-500 uppercase block mb-1">
                GROWTH EDGE / BLINDSPOT
              </span>
              <p className="font-mono text-xs text-amber-900 bg-amber-50 p-2 brutal-border border-amber-300">
                {archetype.blindspots[0]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gamified Achievements & Trophy Vault */}
      <div className="bg-white p-6 sm:p-7 brutal-border brutal-shadow-md space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-[#0F172A]">
          <div>
            <h2 className="font-display font-black text-xl text-[#0F172A] flex items-center gap-2">
              <Trophy size={20} className="text-amber-500" />
              ACHIEVEMENT TROPHY VAULT
            </h2>
            <p className="font-mono text-xs text-slate-600 mt-0.5">
              Unlock badges as you calibrate your psychological vectors and engage with peer duels.
            </p>
          </div>
          <span className="font-mono text-xs font-bold bg-[#FFE600] px-3 py-1 brutal-border">
            {achievements.filter(a => a.unlocked).length} / {achievements.length} UNLOCKED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => {
            const Icon = ach.icon;
            return (
              <div 
                key={ach.id}
                className={`p-4 brutal-border flex items-start gap-3 transition-all ${
                  ach.unlocked 
                    ? 'bg-[#FFFDF7] hover:-translate-y-0.5' 
                    : 'bg-slate-50 opacity-60 grayscale'
                }`}
              >
                <div 
                  className={`w-10 h-10 brutal-border flex items-center justify-center shrink-0 text-white ${
                    ach.unlocked ? '' : 'bg-slate-300 text-slate-500'
                  }`}
                  style={{ backgroundColor: ach.unlocked ? ach.color : undefined }}
                >
                  {ach.unlocked ? <Icon size={18} /> : <Lock size={16} />}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-display font-black text-sm text-[#0F172A]">
                      {ach.title}
                    </h4>
                    {ach.unlocked && (
                      <span className="text-[10px] text-amber-500 font-bold">★</span>
                    )}
                  </div>
                  <p className="font-mono text-[11px] text-slate-600 leading-snug">
                    {ach.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Priority 1: Privacy Controls & Selective Publishing */}
      <div className="bg-white p-6 sm:p-7 brutal-border brutal-shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-[#0F172A]">
          <div>
            <h2 className="font-display font-black text-xl text-[#0F172A] flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-600" />
              PRIVACY CONTROLS & SOCIAL PUBLISHING GATES
            </h2>
            <p className="font-mono text-xs text-slate-600 mt-0.5">
              Control what information is published to public search or visible to peers in duel rooms.
            </p>
          </div>
          <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-3 py-1 brutal-border">
            OPT-IN PRIVACY BY DEFAULT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Attachment Style Toggle */}
          <div className="p-4 bg-slate-50 brutal-border flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Heart size={16} className="text-rose-500" />
                <h4 className="font-display font-black text-sm text-[#0F172A]">
                  Publish Attachment Style ({vector.attachment.style})
                </h4>
              </div>
              <p className="font-mono text-xs text-slate-600 leading-snug">
                When disabled (default), your attachment orientation is private to you and never listed in public search.
              </p>
            </div>
            <button
              onClick={async () => {
                if (!user) return;
                setIsUpdatingPrivacy(true);
                const current = userProfile?.shareAttachmentStyle ?? false;
                await updateUserProfileData({ shareAttachmentStyle: !current });
                setIsUpdatingPrivacy(false);
              }}
              disabled={!user || isUpdatingPrivacy}
              className={`brutal-btn px-4 py-2 font-mono text-xs font-black shrink-0 transition-colors ${
                userProfile?.shareAttachmentStyle
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-700'
              }`}
            >
              {userProfile?.shareAttachmentStyle ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>

          {/* Holland Code Toggle */}
          <div className="p-4 bg-slate-50 brutal-border flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Briefcase size={16} className="text-indigo-500" />
                <h4 className="font-display font-black text-sm text-[#0F172A]">
                  Publish Holland RIASEC Code ({vector.riasec.hollandCode})
                </h4>
              </div>
              <p className="font-mono text-xs text-slate-600 leading-snug">
                When disabled (default), your career vocational triad is omitted from the public directory.
              </p>
            </div>
            <button
              onClick={async () => {
                if (!user) return;
                setIsUpdatingPrivacy(true);
                const current = userProfile?.shareHollandCode ?? false;
                await updateUserProfileData({ shareHollandCode: !current });
                setIsUpdatingPrivacy(false);
              }}
              disabled={!user || isUpdatingPrivacy}
              className={`brutal-btn px-4 py-2 font-mono text-xs font-black shrink-0 transition-colors ${
                userProfile?.shareHollandCode
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-700'
              }`}
            >
              {userProfile?.shareHollandCode ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
        </div>
      </div>

      {/* Trajectory & Assessment Calibration Timeline */}
      {userProfile?.vectorHistory && userProfile.vectorHistory.length > 0 && (
        <div className="bg-white p-6 sm:p-7 brutal-border brutal-shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#0F172A]">
            <div>
              <h2 className="font-display font-black text-xl text-[#0F172A] flex items-center gap-2">
                <History size={20} className="text-indigo-600" />
                TRAIT CALIBRATION TRAJECTORY & HISTORY
              </h2>
              <p className="font-mono text-xs text-slate-600 mt-0.5">
                Track how your psychometric vector evolves across calibration sessions.
              </p>
            </div>
            <span className="font-mono text-xs font-bold bg-[#FFE600] px-3 py-1 brutal-border">
              {userProfile.vectorHistory.length} SNAPSHOTS RECORDED
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-[#0F172A]">
                  <th className="p-2.5 font-black text-slate-800">TIMESTAMP</th>
                  <th className="p-2.5 font-black text-slate-800">ARCHETYPE</th>
                  <th className="p-2.5 font-black text-slate-800">CONSCIENTIOUSNESS</th>
                  <th className="p-2.5 font-black text-slate-800">OPENNESS</th>
                  <th className="p-2.5 font-black text-slate-800">EXTRAVERSION</th>
                  <th className="p-2.5 font-black text-slate-800">AGREEABLENESS</th>
                  <th className="p-2.5 font-black text-slate-800">TRAIT EQ</th>
                </tr>
              </thead>
              <tbody>
                {userProfile.vectorHistory.map((snap, idx) => (
                  <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="p-2.5 text-slate-600 whitespace-nowrap">
                      {new Date(snap.date).toLocaleDateString()} {new Date(snap.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-2.5 font-black text-[#0F172A]">
                      {snap.archetypeCode}-{snap.variant}
                    </td>
                    <td className="p-2.5 text-slate-800 font-bold">{snap.conscientiousness}%</td>
                    <td className="p-2.5 text-slate-800 font-bold">{snap.openness}%</td>
                    <td className="p-2.5 text-slate-800 font-bold">{snap.extraversion}%</td>
                    <td className="p-2.5 text-slate-800 font-bold">{snap.agreeableness}%</td>
                    <td className="p-2.5 text-slate-800 font-bold">{snap.eqScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Priority 3: Data Governance & Sovereignty */}
      <div className="bg-white p-6 sm:p-7 brutal-border brutal-shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-[#0F172A]">
          <div>
            <h2 className="font-display font-black text-xl text-[#0F172A] flex items-center gap-2">
              <Download size={20} className="text-slate-800" />
              DATA GOVERNANCE & SOVEREIGNTY
            </h2>
            <p className="font-mono text-xs text-slate-600 mt-0.5">
              Export your full psychometric graph as a standard JSON archive or permanently delete your account.
            </p>
          </div>
          <span className="font-mono text-xs font-bold bg-[#A3F7BF] text-emerald-950 px-3 py-1 brutal-border">
            GDPR / CCPA COMPLIANT
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button
            onClick={async () => {
              setIsExporting(true);
              try {
                const data = await exportUserData();
                const jsonStr = JSON.stringify(data, null, 2);
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `omnipsyche_data_export_${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              } catch (err) {
                console.error('Export failed:', err);
              } finally {
                setIsExporting(false);
              }
            }}
            disabled={isExporting}
            className="brutal-btn bg-[#0F172A] text-white py-3 px-5 font-mono text-xs font-black flex items-center justify-center gap-2 hover:bg-slate-800"
          >
            <Download size={16} className="text-[#FFE600]" />
            <span>{isExporting ? 'PACKAGING DATA...' : 'DOWNLOAD MY DATA (JSON)'}</span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="brutal-btn bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-400 py-3 px-5 font-mono text-xs font-black flex items-center justify-center gap-2"
          >
            <Trash2 size={16} className="text-rose-600" />
            <span>DELETE MY ACCOUNT & WIPE DATA</span>
          </button>
        </div>

        {/* Delete Confirmation Modal Dialog */}
        {showDeleteConfirm && (
          <div className="p-4 bg-rose-50 brutal-border border-rose-400 space-y-3 mt-4 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertTriangle size={20} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-display font-black text-sm text-rose-950">
                  PERMANENT DELETION WARNING
                </h4>
                <p className="font-mono text-xs text-rose-900 mt-1">
                  This will permanently delete your authentication record, private psychological vectors, public profile, social friend connections, and duel records from the database. This action is irreversible.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={async () => {
                  setIsDeleting(true);
                  try {
                    await deleteUserAccountAndData();
                    setShowDeleteConfirm(false);
                  } catch (err) {
                    console.error('Delete account failed', err);
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                disabled={isDeleting}
                className="brutal-btn bg-rose-600 text-white hover:bg-rose-700 py-2 px-4 font-mono text-xs font-black"
              >
                {isDeleting ? 'WIPING DATA...' : 'CONFIRM IRREVERSIBLE DELETION'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="brutal-btn bg-white text-slate-800 py-2 px-4 font-mono text-xs font-bold"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Priority 2: Mandatory Clinical & Ethical Disclaimers */}
      <div className="bg-[#FFFDF7] p-5 brutal-border border-slate-300 flex items-start gap-3.5">
        <div className="w-8 h-8 bg-slate-200 brutal-border flex items-center justify-center font-display font-black text-slate-700 shrink-0">
          ℹ️
        </div>
        <div className="space-y-1">
          <h4 className="font-display font-black text-xs uppercase tracking-wider text-slate-800">
            SCIENTIFIC SCOPE & NON-CLINICAL DISCLOSURE
          </h4>
          <p className="font-mono text-[11px] text-slate-600 leading-relaxed">
            OmniPsyche is an exploratory educational and self-development platform based on peer-reviewed psychometric constructs (including HEXACO PI-R, Holland RIASEC, ECR-R Attachment, Trait EQ, and Duckworth Grit). It is explicitly not a diagnostic instrument, psychiatric evaluation, clinical assessment, or medical tool. Scores and archetype classifications reflect self-reported tendencies for interpersonal reflection.
          </p>
        </div>
      </div>

      {/* Quick Action Hub: AI Coach & Compatibility Duel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Friends & Compatibility Duel */}
        <div className="bg-[#FFE600]/20 p-5 brutal-border border-[#0F172A] flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Swords size={18} className="text-[#0F172A]" />
              <h3 className="font-display font-black text-base text-[#0F172A]">
                MULTIPLAYER COMPATIBILITY DUEL
              </h3>
            </div>
            <p className="font-mono text-xs text-slate-700">
              Send a challenge link to your partner or friends. Unlock live chemistry scores and friction playbooks side-by-side.
            </p>
          </div>

          <button
            onClick={onOpenFriends}
            className="brutal-btn bg-[#0F172A] text-white py-2 px-4 font-mono text-xs font-black flex items-center justify-center gap-1.5"
          >
            <Users size={14} className="text-[#FFE600]" />
            <span>OPEN DUEL & FRIENDS HUB</span>
          </button>
        </div>

        {/* Scientific Glossary & Taxonomy Guide */}
        <div className="bg-white p-5 brutal-border flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen size={18} className="text-indigo-600" />
              <h3 className="font-display font-black text-base text-[#0F172A]">
                PSYCHOMETRIC SCIENCE & GLOSSARY
              </h3>
            </div>
            <p className="font-mono text-xs text-slate-700">
              Explore definitions and scientific evidence behind HEXACO PI-R, Holland RIASEC, ECR-R Attachment, Trait EQ, and Duckworth Grit.
            </p>
          </div>

          <button
            onClick={() => onOpenGlossary()}
            className="brutal-btn bg-indigo-50 text-indigo-950 hover:bg-indigo-100 py-2 px-4 font-mono text-xs font-black flex items-center justify-center gap-1.5"
          >
            <BookOpen size={14} className="text-indigo-600" />
            <span>EXPLORE PSYCHOMETRIC TERMS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
