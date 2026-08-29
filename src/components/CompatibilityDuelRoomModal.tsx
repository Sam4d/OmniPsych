import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Swords, 
  Sparkles, 
  Check, 
  Copy, 
  Share2, 
  Flame, 
  HeartHandshake, 
  AlertTriangle, 
  ArrowRight,
  ShieldAlert,
  Layers,
  Zap,
  Play
} from 'lucide-react';
import { 
  CompatibilityDuel, 
  UserPsychologicalVector 
} from '../types';
import { 
  getCompatibilityDuel, 
  subscribeToDuel, 
  completeCompatibilityDuel 
} from '../services/socialService';
import { getArchetypeById } from '../utils/scoring';
import { ArchetypeAvatar } from './ArchetypeAvatar';
import { RadarChart } from './RadarChart';

interface CompatibilityDuelRoomModalProps {
  duelId: string | null;
  isOpen: boolean;
  onClose: () => void;
  currentUserVector: UserPsychologicalVector;
  onStartDuelAssessment: (duelId: string) => void;
  onOpenAuth: () => void;
}

export const CompatibilityDuelRoomModal: React.FC<CompatibilityDuelRoomModalProps> = ({
  duelId,
  isOpen,
  onClose,
  currentUserVector,
  onStartDuelAssessment,
  onOpenAuth
}) => {
  const { user, userProfile } = useAuth();
  const [duel, setDuel] = useState<CompatibilityDuel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    if (!duelId || !isOpen) {
      setDuel(null);
      return;
    }

    setLoading(true);
    // Initial fetch
    getCompatibilityDuel(duelId).then((data) => {
      setDuel(data);
      setLoading(false);
    });

    // Real-time listener
    const unsubscribe = subscribeToDuel(duelId, (updatedDuel) => {
      setDuel(updatedDuel);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [duelId, isOpen]);

  if (!isOpen || !duelId) return null;

  const isInviter = user?.uid === duel?.inviterUid;
  const isCompleted = duel?.status === 'completed';

  const handleCopyShareLink = () => {
    const link = `${window.location.origin}${window.location.pathname}?duel=${duelId}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAcceptWithExistingProfile = async () => {
    if (!duel || !duelId) return;
    if (!user || !userProfile) {
      onOpenAuth();
      return;
    }

    setIsSubmitting(true);
    try {
      await completeCompatibilityDuel(
        duelId,
        userProfile.displayName || 'Invitee',
        user.uid,
        currentUserVector
      );
    } catch (err) {
      console.error('Failed to complete duel:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inviterArchetype = duel ? getArchetypeById(duel.inviterArchetypeId) : getArchetypeById('intj');
  const inviteeArchetype = duel?.inviteeArchetypeId ? getArchetypeById(duel.inviteeArchetypeId) : getArchetypeById('enfp');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FDFBF7] brutal-border brutal-shadow-lg w-full max-w-3xl p-6 sm:p-7 relative max-h-[92vh] flex flex-col overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-white brutal-border hover:bg-slate-100 transition-colors"
          title="Close Modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-5 pr-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="brutal-badge bg-[#FFE600] text-[10px] font-mono flex items-center gap-1">
              <Swords size={12} />
              LIVE COMPATIBILITY MATRIX
            </span>
            <span className="font-mono text-[10px] text-slate-500 font-bold">
              ID: {duelId}
            </span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-[#0F172A] tracking-tight">
            {isCompleted ? 'Psychometric Compatibility Synthesis' : 'Compatibility Challenge Room'}
          </h2>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-4 border-[#0F172A] border-t-[#FFE600] rounded-full animate-spin mx-auto mb-3"></div>
            <p className="font-mono text-xs font-bold text-slate-600">
              CONNECTING TO REAL-TIME DUEL MATRIX...
            </p>
          </div>
        ) : !duel ? (
          <div className="py-12 text-center p-6 bg-white brutal-border">
            <ShieldAlert size={36} className="mx-auto text-red-500 mb-2" />
            <h3 className="font-display font-black text-lg text-[#0F172A]">Duel Challenge Not Found</h3>
            <p className="font-mono text-xs text-slate-600 mt-1 max-w-sm mx-auto">
              This compatibility link may have expired or was formatted incorrectly.
            </p>
          </div>
        ) : !isCompleted ? (
          /* PENDING STATE (Waiting for invitee or ready to accept) */
          <div className="space-y-6">
            {/* Inviter Challenger Banner */}
            <div className="p-5 bg-white brutal-border relative overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="shrink-0 text-center">
                  <div 
                    className="w-18 h-18 brutal-border mx-auto flex items-center justify-center font-display font-black text-2xl shadow-sm"
                    style={{ backgroundColor: inviterArchetype.houseColor }}
                  >
                    {inviterArchetype.code}
                  </div>
                  <span className="font-mono text-[10px] font-bold text-slate-600 block mt-1">
                    CHALLENGER
                  </span>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <span className="brutal-badge bg-[#0F172A] text-white text-[9px] font-mono">
                    {inviterArchetype.house}
                  </span>
                  <h3 className="font-display font-black text-xl text-[#0F172A] mt-1">
                    {duel.inviterName} ({inviterArchetype.code})
                  </h3>
                  <p className="font-mono text-xs text-slate-600 mt-0.5">
                    {inviterArchetype.name} • {inviterArchetype.title}
                  </p>
                  <p className="font-mono text-[11px] text-slate-700 bg-amber-50 p-2 brutal-border border-amber-300 mt-2">
                    "Take the 3-minute assessment to unlock our live chemistry score, psychological friction hotspots, and communication synergy playbook!"
                  </p>
                </div>
              </div>
            </div>

            {/* Waiting or Action Controls */}
            {isInviter ? (
              <div className="p-5 bg-amber-50 brutal-border border-amber-400 text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full animate-ping"></div>
                  <span className="font-mono text-xs font-black text-amber-950 uppercase">
                    Waiting for your partner to complete the test...
                  </span>
                </div>
                <p className="font-mono text-xs text-slate-600 max-w-md mx-auto">
                  Copy your unique duel link and send it via Slack, WhatsApp, or Email. This screen updates in real time the moment they submit!
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={handleCopyShareLink}
                    className="brutal-btn bg-[#FFE600] text-[#0F172A] px-4 py-2 font-mono text-xs font-black flex items-center gap-1.5"
                  >
                    {copiedLink ? <Check size={14} className="text-emerald-800" /> : <Copy size={14} />}
                    {copiedLink ? 'COPIED TO CLIPBOARD' : 'COPY DUEL CHALLENGE LINK'}
                  </button>
                </div>
              </div>
            ) : (
              /* Invitee Options */
              <div className="p-5 bg-slate-100 brutal-border space-y-4">
                <h4 className="font-display font-black text-base text-[#0F172A] text-center">
                  How would you like to accept this challenge?
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Option 1: Fast Accept with Current Vector */}
                  <div className="p-4 bg-white brutal-border flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Zap size={15} className="text-amber-500" />
                        <span className="font-mono text-xs font-black text-[#0F172A]">
                          USE MY CURRENT PROFILE
                        </span>
                      </div>
                      <p className="font-mono text-[11px] text-slate-600 leading-snug">
                        Use your loaded psychometric profile ({currentUserVector.calculatedArchetypeId.toUpperCase()}-{currentUserVector.identityVariant}) to instantly calculate compatibility.
                      </p>
                    </div>

                    <button
                      onClick={handleAcceptWithExistingProfile}
                      disabled={isSubmitting}
                      className="mt-3 w-full brutal-btn bg-[#0F172A] text-white py-2 font-mono text-xs font-black flex items-center justify-center gap-1.5"
                    >
                      <Sparkles size={13} className="text-[#FFE600]" />
                      {isSubmitting ? 'CALCULATING...' : 'ACCEPT WITH PROFILE'}
                    </button>
                  </div>

                  {/* Option 2: Take Fresh Assessment */}
                  <div className="p-4 bg-[#FFE600]/30 brutal-border border-[#0F172A] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Play size={14} fill="currentColor" className="text-[#0F172A]" />
                        <span className="font-mono text-xs font-black text-[#0F172A]">
                          TAKE 3-MIN TEST NOW
                        </span>
                      </div>
                      <p className="font-mono text-[11px] text-slate-700 leading-snug">
                        Answer 18 quick-calibration questions now. Your freshly calculated scores will automatically link to this duel.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onStartDuelAssessment(duelId);
                        onClose();
                      }}
                      className="mt-3 w-full brutal-btn bg-[#FFE600] text-[#0F172A] py-2 font-mono text-xs font-black flex items-center justify-center gap-1.5"
                    >
                      <Play size={12} fill="currentColor" />
                      START RAPID TEST
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* COMPLETED STATE: LIVE DUAL COMPATIBILITY SYNTHESIS */
          <div className="space-y-6">
            {/* Massive Chemistry Score Header */}
            <div className="p-5 bg-[#0F172A] text-white brutal-border brutal-shadow-md text-center relative overflow-hidden">
              <div className="relative z-10">
                <span className="brutal-badge bg-[#FFE600] text-[#0F172A] text-[10px] font-mono font-black mb-2 inline-block">
                  {duel.chemistryGrade || 'A-TIER CATALYTIC SYNERGY'}
                </span>
                <div className="font-display font-black text-5xl sm:text-6xl text-[#FFE600] tracking-tight">
                  {duel.compatibilityScore}%
                </div>
                <p className="font-mono text-xs text-slate-300 uppercase tracking-wider mt-1 font-bold">
                  PSYCHOMETRIC HARMONY INDEX
                </p>
              </div>
            </div>

            {/* Side-by-Side Archetype Avatars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Partner A */}
              <div className="p-4 bg-white brutal-border">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-14 h-14 brutal-border flex items-center justify-center font-display font-black text-xl"
                    style={{ backgroundColor: inviterArchetype.houseColor }}
                  >
                    {inviterArchetype.code}
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                      CHALLENGER
                    </span>
                    <h3 className="font-display font-black text-base text-[#0F172A]">
                      {duel.inviterName}
                    </h3>
                    <span className="brutal-badge bg-slate-100 text-[9px] font-mono text-slate-800">
                      {inviterArchetype.name}
                    </span>
                  </div>
                </div>
                {duel.inviterVector && (
                  <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-3 gap-1 text-center font-mono text-[10px]">
                    <div className="bg-slate-50 p-1 brutal-border">
                      <span className="block text-slate-500">HEXACO</span>
                      <span className="font-bold text-[#0F172A]">{duel.inviterVector.hexaco.conscientiousness}% C</span>
                    </div>
                    <div className="bg-slate-50 p-1 brutal-border">
                      <span className="block text-slate-500">ATTACH</span>
                      <span className="font-bold text-[#0F172A]">{duel.inviterVector.attachment.style.split('-')[0]}</span>
                    </div>
                    <div className="bg-slate-50 p-1 brutal-border">
                      <span className="block text-slate-500">RIASEC</span>
                      <span className="font-bold text-[#0F172A]">{duel.inviterVector.riasec.hollandCode}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Partner B */}
              <div className="p-4 bg-white brutal-border">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-14 h-14 brutal-border flex items-center justify-center font-display font-black text-xl"
                    style={{ backgroundColor: inviteeArchetype.houseColor }}
                  >
                    {inviteeArchetype.code}
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                      PARTNER
                    </span>
                    <h3 className="font-display font-black text-base text-[#0F172A]">
                      {duel.inviteeName}
                    </h3>
                    <span className="brutal-badge bg-slate-100 text-[9px] font-mono text-slate-800">
                      {inviteeArchetype.name}
                    </span>
                  </div>
                </div>
                {duel.inviteeVector && (
                  <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-3 gap-1 text-center font-mono text-[10px]">
                    <div className="bg-slate-50 p-1 brutal-border">
                      <span className="block text-slate-500">HEXACO</span>
                      <span className="font-bold text-[#0F172A]">{duel.inviteeVector.hexaco.conscientiousness}% C</span>
                    </div>
                    <div className="bg-slate-50 p-1 brutal-border">
                      <span className="block text-slate-500">ATTACH</span>
                      <span className="font-bold text-[#0F172A]">{duel.inviteeVector.attachment.style.split('-')[0]}</span>
                    </div>
                    <div className="bg-slate-50 p-1 brutal-border">
                      <span className="block text-slate-500">RIASEC</span>
                      <span className="font-bold text-[#0F172A]">{duel.inviteeVector.riasec.hollandCode}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Key Synergies & Friction Playbook */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Synergies */}
              <div className="p-4 bg-emerald-50 brutal-border border-emerald-600 space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-950 font-display font-black text-sm">
                  <Sparkles size={16} className="text-emerald-600" />
                  CORE SYNERGY HIGHLIGHTS
                </div>
                <ul className="space-y-1.5 font-mono text-xs text-emerald-900">
                  {duel.synergyHighlights?.map((syn, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Check size={14} className="shrink-0 text-emerald-600 mt-0.5" />
                      <span>{syn}</span>
                    </li>
                  )) || (
                    <li>Balanced cognitive exploration and mutual respect for analytical depth.</li>
                  )}
                </ul>
              </div>

              {/* Friction Hotspots */}
              <div className="p-4 bg-amber-50 brutal-border border-amber-500 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-950 font-display font-black text-sm">
                  <AlertTriangle size={16} className="text-amber-600" />
                  POTENTIAL FRICTION HOTSPOTS
                </div>
                <ul className="space-y-1.5 font-mono text-xs text-amber-900">
                  {duel.frictionWarnings?.map((fric, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="shrink-0 font-bold text-amber-700">⚠️</span>
                      <span>{fric}</span>
                    </li>
                  )) || (
                    <li>Occasional tempo mismatch during rapid decision execution.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Relational Protocol Box */}
            <div className="p-4 bg-white brutal-border">
              <div className="flex items-center gap-2 mb-1.5">
                <HeartHandshake size={16} className="text-[#0F172A]" />
                <h4 className="font-display font-black text-sm text-[#0F172A]">
                  Tactical Collaboration Protocol
                </h4>
              </div>
              <p className="font-mono text-xs text-slate-700 leading-relaxed">
                {duel.communicationProtocol || `Foster open feedback loops by scheduling asynchronous idea vetting before high-stakes syncs.`}
              </p>
            </div>

            {/* Share / Copy Result Button */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={handleCopyShareLink}
                className="brutal-btn bg-[#FFE600] text-[#0F172A] py-2.5 px-4 font-mono text-xs font-black flex items-center justify-center gap-1.5 flex-1"
              >
                {copiedLink ? <Check size={14} /> : <Share2 size={14} />}
                {copiedLink ? 'DUEL LINK COPIED' : 'SHARE LIVE DUEL RESULT'}
              </button>
              <button
                onClick={onClose}
                className="brutal-btn bg-[#0F172A] text-white py-2.5 px-4 font-mono text-xs font-bold flex items-center justify-center flex-1"
              >
                CLOSE MATRIX
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
