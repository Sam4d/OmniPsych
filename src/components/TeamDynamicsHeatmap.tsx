import React, { useState, useEffect } from 'react';
import { Archetype, UserPsychologicalVector, CompanyTeam, CompanyMember, GrandHouse } from '../types';
import { ARCHETYPES } from '../data/archetypes';
import { ArchetypeAvatar } from './ArchetypeAvatar';
import { useAuth } from '../context/AuthContext';
import { 
  getDefaultDemoCompany, 
  getLocalActiveCompany, 
  saveLocalActiveCompany, 
  createCompanyTeam, 
  joinCompanyByCode, 
  removeCompanyMember 
} from '../services/companyService';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { 
  Users, 
  ShieldAlert, 
  Sparkles, 
  TrendingUp, 
  CheckCircle, 
  Layers, 
  Briefcase, 
  AlertTriangle,
  MessageSquare,
  Plus,
  Link,
  Copy,
  Check,
  Crown,
  UserPlus,
  Trash2,
  LogOut,
  Building2,
  X,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  BrainCircuit,
  Compass
} from 'lucide-react';

interface TeamDynamicsHeatmapProps {
  userArchetype: Archetype;
  userVector: UserPsychologicalVector;
  onOpenAuth?: () => void;
}

export const TeamDynamicsHeatmap: React.FC<TeamDynamicsHeatmapProps> = ({
  userArchetype,
  userVector,
  onOpenAuth
}) => {
  const { user, userProfile } = useAuth();

  // Active Company State
  const [company, setCompany] = useState<CompanyTeam>(() => {
    return getLocalActiveCompany() || getDefaultDemoCompany(userArchetype, userVector);
  });

  const [selectedMember, setSelectedMember] = useState<CompanyMember>(() => company.members[0] || null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showInviteSuccessModal, setShowInviteSuccessModal] = useState(false);

  // Create Form State
  const [createName, setCreateName] = useState('');
  const [createDept, setCreateDept] = useState('');
  const [createRole, setCreateRole] = useState('Founder & Lead Architect');
  const [isCreating, setIsCreating] = useState(false);

  // Join Form State
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [joinRoleInput, setJoinRoleInput] = useState('Product Engineer');
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  // Check URL params on mount for ?joinCompany= or ?company=
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const inviteCode = urlParams.get('joinCompany') || urlParams.get('company');
      if (inviteCode) {
        setJoinCodeInput(inviteCode);
        setShowJoinModal(true);
      }
    } catch (e) {
      console.warn('URL param check skipped:', e);
    }
  }, []);

  // Sync real-time updates from Firestore if company exists and is online
  useEffect(() => {
    if (!company.id || company.id === 'acme-corp-demo') return;

    try {
      const compRef = doc(db, 'companies', company.id);
      const unsubscribe = onSnapshot(compRef, (snapshot) => {
        if (snapshot.exists()) {
          const remoteData = snapshot.data() as CompanyTeam;
          setCompany(remoteData);
          saveLocalActiveCompany(remoteData);
        }
      }, (err) => {
        console.warn('Realtime company listener offline fallback:', err);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn('Snapshot setup skipped:', err);
    }
  }, [company.id]);

  // Keep selectedMember valid
  useEffect(() => {
    if (company.members.length > 0) {
      const stillExists = company.members.find(m => m.uid === selectedMember?.uid);
      if (!stillExists) {
        setSelectedMember(company.members[0]);
      }
    }
  }, [company.members, selectedMember]);

  // Check if current user is admin of this company
  const currentUserId = user?.uid || 'usr_local';
  const isAdmin = company.adminUid === currentUserId || company.members.find(m => (m.uid === currentUserId || m.displayName.includes('(You)')) && m.isAdmin);

  // House composition breakdown
  const houseDistribution = company.members.reduce((acc, member) => {
    const house = member.house || 'The Strategists';
    acc[house] = (acc[house] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Psychological safety score calculation (0-100)
  const uniqueHouses = Object.keys(houseDistribution).length;
  const rawSafety = Math.min(98, Math.round(65 + (uniqueHouses * 6) + (company.members.length * 2)));
  const psychologicalSafety = Math.max(60, Math.min(99, rawSafety));

  // Copy handlers
  const handleCopyCode = () => {
    navigator.clipboard.writeText(company.companyCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyInviteLink = () => {
    const origin = window.location.origin || window.location.href.split('?')[0];
    const link = `${origin}?joinCompany=${company.companyCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Create Company Action
  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return;

    setIsCreating(true);
    try {
      const newComp = await createCompanyTeam(
        createName,
        createDept,
        createRole,
        user,
        userProfile,
        userArchetype,
        userVector
      );
      setCompany(newComp);
      setSelectedMember(newComp.members[0]);
      setShowCreateModal(false);
      setShowInviteSuccessModal(true);
      setCreateName('');
      setCreateDept('');
    } catch (err) {
      console.error('Failed to create company:', err);
    } finally {
      setIsCreating(false);
    }
  };

  // Join Company Action
  const handleJoinCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;

    setIsJoining(true);
    setJoinError(null);
    try {
      const res = await joinCompanyByCode(
        joinCodeInput,
        joinRoleInput,
        user,
        userProfile,
        userArchetype,
        userVector
      );

      if (res.success && res.company) {
        setCompany(res.company);
        setSelectedMember(res.company.members.find(m => m.displayName.includes(userProfile?.displayName || '')) || res.company.members[0]);
        setShowJoinModal(false);
        setJoinCodeInput('');
      } else {
        setJoinError(res.error || 'Failed to join company.');
      }
    } catch (err: any) {
      setJoinError(err.message || 'An unexpected error occurred while joining.');
    } finally {
      setIsJoining(false);
    }
  };

  // Remove Member Action (Admin only)
  const handleRemoveMember = async (memberUid: string) => {
    if (!window.confirm('Are you sure you want to remove this member from the company roster?')) return;
    try {
      const updated = await removeCompanyMember(company, memberUid, currentUserId);
      setCompany(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to remove member.');
    }
  };

  // Leave Company Action
  const handleLeaveCompany = () => {
    if (!window.confirm('Leave this company workspace? You will be reverted to the sample demo team.')) return;
    const demo = getDefaultDemoCompany(userArchetype, userVector);
    setCompany(demo);
    saveLocalActiveCompany(demo);
    setSelectedMember(demo.members[0]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 px-3 sm:px-6 animate-in fade-in duration-150">
      {/* Top Organization Header & Controls */}
      <div className="brutal-card bg-white p-5 sm:p-7 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-[#0F172A] pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="brutal-badge bg-[#0F172A] text-[#FFE600] text-[10px] font-mono font-bold flex items-center gap-1">
                <Building2 size={12} />
                B2B ENTERPRISE WORKSPACE
              </span>
              <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 brutal-border">
                CODE: {company.companyCode}
              </span>
              <span className="font-mono text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 brutal-border flex items-center gap-1">
                <Crown size={11} className="text-amber-500" />
                ADMIN: {company.adminName}
              </span>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#0F172A] tracking-tight uppercase">
              {company.name}
            </h1>
            <p className="font-mono text-xs sm:text-sm text-slate-600 mt-0.5">
              {company.department || 'Cross-Functional Team'} • {company.members.length} Active Psychometric Profiles Synced
            </p>
          </div>

          {/* Action Buttons: Create, Join, Invite */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setShowCreateModal(true)}
              className="brutal-btn bg-[#FFE600] text-[#0F172A] px-3.5 py-2 text-xs font-mono font-black flex items-center gap-1.5 min-h-[40px]"
              title="Create a new organization & become Admin"
            >
              <Plus size={15} />
              <span>CREATE COMPANY</span>
            </button>

            <button
              onClick={() => {
                setJoinError(null);
                setShowJoinModal(true);
              }}
              className="brutal-btn bg-white hover:bg-slate-50 text-[#0F172A] px-3.5 py-2 text-xs font-mono font-black flex items-center gap-1.5 min-h-[40px]"
              title="Join an existing company with code or link"
            >
              <UserPlus size={15} />
              <span>JOIN COMPANY</span>
            </button>

            {company.id !== 'acme-corp-demo' && (
              <button
                onClick={handleLeaveCompany}
                className="brutal-btn bg-slate-100 hover:bg-red-50 text-red-600 px-2.5 py-2 text-xs font-mono font-bold flex items-center gap-1 min-h-[40px]"
                title="Leave company"
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">LEAVE</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Invite & Unique Join Link Bar */}
        <div className="bg-[#F8FAFC] p-3.5 brutal-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#0F172A] text-[#FFE600] brutal-border flex items-center justify-center font-bold shrink-0">
              <Link size={15} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-[#0F172A]">TEAM INVITE LINK:</span>
                <span className="bg-white px-2 py-0.5 brutal-border font-bold text-indigo-700 tracking-wider">
                  {company.companyCode}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Share this unique code or direct link with coworkers so their verified psychometric vectors automatically join your team heatmap.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyCode}
              className="brutal-btn bg-white hover:bg-slate-100 text-[#0F172A] px-3 py-1.5 text-xs font-bold flex items-center gap-1"
            >
              {copiedCode ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              <span>{copiedCode ? 'COPIED!' : 'COPY CODE'}</span>
            </button>

            <button
              onClick={handleCopyInviteLink}
              className="brutal-btn bg-[#0F172A] text-white px-3 py-1.5 text-xs font-bold flex items-center gap-1"
            >
              {copiedLink ? <Check size={13} className="text-[#FFE600]" /> : <ExternalLink size={13} />}
              <span>{copiedLink ? 'LINK COPIED!' : 'COPY INVITE LINK'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: House Balance & Cognitive Diversity (Left) + Member Roster & 1-on-1 Coach (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* House Distribution & Psychological Safety (Left 4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Cognitive Diversity Card */}
          <div className="brutal-card bg-white p-5 space-y-4">
            <div className="border-b-2 border-[#0F172A] pb-2 flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-slate-500 font-bold block">COGNITIVE COMPOSITION</span>
                <h3 className="font-display font-black text-lg uppercase">
                  Grand House Balance
                </h3>
              </div>
              <span className="font-mono text-xs font-black bg-[#FFE600] px-2 py-0.5 brutal-border">
                {company.members.length} SEATS
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {[
                { name: 'The Strategists', color: '#6366F1', count: houseDistribution['The Strategists'] || 0, desc: 'Vision, architecture, high-altitude systems design' },
                { name: 'The Diplomats', color: '#10B981', count: houseDistribution['The Diplomats'] || 0, desc: 'Empathy, consensus, mission alignment, UX attunement' },
                { name: 'The Navigators', color: '#0EA5E9', count: houseDistribution['The Navigators'] || 0, desc: 'Operational execution, reliability, stability' },
                { name: 'The Explorers', color: '#F43F5E', count: houseDistribution['The Explorers'] || 0, desc: 'Rapid prototyping, adaptation, dynamic pivots' }
              ].map((h, idx) => {
                const pct = company.members.length > 0 ? Math.round((h.count / company.members.length) * 100) : 0;
                return (
                  <div key={idx} className="p-3 brutal-border bg-[#F8FAFC] space-y-1.5">
                    <div className="flex justify-between items-center font-bold">
                      <span className="flex items-center gap-1.5 text-[#0F172A]">
                        <span className="w-3 h-3 brutal-border inline-block" style={{ backgroundColor: h.color }} />
                        {h.name}
                      </span>
                      <span>{h.count} ({pct}%)</span>
                    </div>

                    <div className="w-full h-2.5 bg-[#E2E8F0] brutal-border overflow-hidden">
                      <div 
                        className="h-full transition-all duration-300" 
                        style={{ width: `${pct}%`, backgroundColor: h.color }} 
                      />
                    </div>
                    <p className="text-[10px] text-slate-500">{h.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Psychological Safety Metric */}
            <div className="p-4 bg-emerald-50 brutal-border border-emerald-300 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="font-black text-emerald-900 flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-700" />
                  TEAM SAFETY INDEX
                </span>
                <span className="font-black text-emerald-800 text-sm bg-white px-2 py-0.5 brutal-border border-emerald-300">
                  {psychologicalSafety}% HEALTHY
                </span>
              </div>
              <p className="text-emerald-950 text-[11px] leading-relaxed">
                {uniqueHouses >= 3 
                  ? 'Excellent cognitive resilience: broad representation across multiple thinking styles prevents ideological groupthink.'
                  : 'Moderate diversity: Consider inviting members from complementary houses to strengthen operational and diplomatic blindspots.'}
              </p>
            </div>
          </div>
        </div>

        {/* Member Grid & 1-on-1 Coaching Playbook (Right 8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="brutal-card bg-white p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#0F172A] pb-2">
              <div>
                <span className="font-mono text-[10px] text-slate-500 font-bold block">WORKPLACE MATRIX</span>
                <h3 className="font-display font-black text-lg sm:text-xl uppercase">
                  Connected Team Roster
                </h3>
              </div>
              <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 brutal-border">
                CLICK ANY TEAMMATE FOR COACHING GUIDE
              </span>
            </div>

            {/* Teammates List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {company.members.map((member) => {
                const arch = ARCHETYPES.find(a => a.id === member.archetypeId) || ARCHETYPES[0];
                const isSelected = selectedMember?.uid === member.uid;

                return (
                  <div
                    key={member.uid}
                    onClick={() => setSelectedMember(member)}
                    className={`p-3.5 brutal-border cursor-pointer transition-all flex items-start justify-between gap-2.5 relative ${
                      isSelected ? 'bg-[#FFE600] brutal-shadow -translate-y-0.5' : 'bg-[#FDFBF7] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <ArchetypeAvatar archetype={arch} variant={member.variant} size="sm" showBadge={false} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-display font-black text-sm text-[#0F172A] truncate">
                            {member.displayName}
                          </h4>
                          {member.isAdmin && (
                            <span className="font-mono text-[9px] font-black uppercase bg-[#0F172A] text-[#FFE600] px-1.5 py-0.2 brutal-border shrink-0">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-[11px] text-slate-600 font-bold truncate">{member.role}</p>
                        <span className="font-mono text-[10px] text-indigo-800 font-black block mt-0.5">
                          {arch.code}-{member.variant} ({arch.name})
                        </span>
                      </div>
                    </div>

                    {/* Admin Delete Action for other members */}
                    {isAdmin && !member.isAdmin && company.members.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveMember(member.uid);
                        }}
                        className="p-1 hover:bg-red-100 text-red-600 brutal-border bg-white transition-colors shrink-0"
                        title="Remove member from company"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Detailed 1-on-1 Manager & Peer Playbook */}
            {selectedMember && (
              <div className="p-4 sm:p-5 bg-[#F8FAFC] brutal-border space-y-3.5 font-mono text-xs mt-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#0F172A] pb-2.5">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-full brutal-border flex items-center justify-center font-bold text-[10px]"
                      style={{ backgroundColor: selectedMember.avatarColor || '#FFE600' }}
                    >
                      {selectedMember.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-black text-[#0F172A] text-sm block">
                        1-ON-1 COLLABORATION PLAYBOOK: {selectedMember.displayName.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {selectedMember.role} • {selectedMember.house}
                      </span>
                    </div>
                  </div>

                  <span className="bg-white px-2.5 py-1 brutal-border font-black text-indigo-900">
                    {ARCHETYPES.find(a => a.id === selectedMember.archetypeId)?.code}-{selectedMember.variant} (
                    {ARCHETYPES.find(a => a.id === selectedMember.archetypeId)?.name})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-white brutal-border space-y-1">
                    <span className="font-black text-slate-900 flex items-center gap-1">
                      <Sparkles size={13} className="text-amber-500" />
                      HOW TO MOTIVATE & EMPOWER
                    </span>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      {ARCHETYPES.find(a => a.id === selectedMember.archetypeId)?.superpowers[0] 
                        ? `Leverage core strength: ${ARCHETYPES.find(a => a.id === selectedMember.archetypeId)?.superpowers[0]}. Provide clear milestone objectives and allow strategic autonomy in problem execution.`
                        : 'Provide clear milestone objectives and allow strategic autonomy in problem execution.'}
                    </p>
                  </div>

                  <div className="p-3 bg-white brutal-border space-y-1">
                    <span className="font-black text-slate-900 flex items-center gap-1">
                      <MessageSquare size={13} className="text-indigo-600" />
                      COMMUNICATION PROTOCOL
                    </span>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      {ARCHETYPES.find(a => a.id === selectedMember.archetypeId)?.relationshipKeys.communicationTip ||
                        'Lead with direct logic and concrete trade-offs rather than ambiguous emotional appeals.'}
                    </p>
                  </div>

                  <div className="p-3 bg-white brutal-border space-y-1">
                    <span className="font-black text-slate-900 flex items-center gap-1">
                      <AlertTriangle size={13} className="text-red-500" />
                      POTENTIAL BLINDSPOT UNDER STRESS
                    </span>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      {ARCHETYPES.find(a => a.id === selectedMember.archetypeId)?.blindspots[0]
                        ? `Watch for blindspot: ${ARCHETYPES.find(a => a.id === selectedMember.archetypeId)?.blindspots[0]}.`
                        : 'May over-analyze theoretical details or resist rapid protocol adjustments under extreme time pressure.'}
                    </p>
                  </div>

                  <div className="p-3 bg-white brutal-border space-y-1">
                    <span className="font-black text-slate-900 flex items-center gap-1">
                      <ShieldAlert size={13} className="text-emerald-600" />
                      MEETING & FEEDBACK BEST PRACTICE
                    </span>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      {selectedMember.variant === 'A' 
                        ? 'Assertive (-A): Appreciates direct, concise feedback and rapid executive decision loops.'
                        : 'Turbulent (-T): Highly thorough and conscientious; ensure constructive feedback acknowledges their meticulous attention to quality.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Create Company */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0F172A]/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md brutal-border brutal-shadow-xl p-5 sm:p-6 space-y-4 text-[#0F172A] relative">
            <div className="flex items-center justify-between border-b-2 border-[#0F172A] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#FFE600] brutal-border flex items-center justify-center font-bold">
                  <Building2 size={16} />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg uppercase">Create Organization</h3>
                  <span className="font-mono text-[10px] text-slate-500">You will be designated as Team Admin</span>
                </div>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1 bg-white brutal-border hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="font-bold block">Company or Organization Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corp, Stripe Core Eng, Figma Design"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  className="w-full p-2 bg-white brutal-border font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold block">Department / Team Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Core Architecture, Growth Marketing"
                  value={createDept}
                  onChange={(e) => setCreateDept(e.target.value)}
                  className="w-full p-2 bg-white brutal-border font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold block">Your Role in the Organization *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Founder & CEO, VP Engineering, Lead Product"
                  value={createRole}
                  onChange={(e) => setCreateRole(e.target.value)}
                  className="w-full p-2 bg-white brutal-border font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
                />
              </div>

              <div className="p-3 bg-amber-50 brutal-border border-amber-200 text-[11px] text-amber-900">
                <p>
                  Creating an organization generates a unique <strong>Company Code</strong> and shareable link. Your current psychometric vector ({userArchetype.name}) will be synced as the Founding Admin.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="brutal-btn bg-slate-100 hover:bg-slate-200 px-3 py-2 text-xs font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !createName.trim()}
                  className="brutal-btn bg-[#FFE600] text-[#0F172A] px-4 py-2 text-xs font-black flex items-center gap-1.5"
                >
                  {isCreating ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
                  <span>{isCreating ? 'CREATING...' : 'GENERATE COMPANY CODE'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Join Company */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0F172A]/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md brutal-border brutal-shadow-xl p-5 sm:p-6 space-y-4 text-[#0F172A] relative">
            <div className="flex items-center justify-between border-b-2 border-[#0F172A] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#0F172A] text-white brutal-border flex items-center justify-center font-bold">
                  <UserPlus size={16} />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg uppercase">Join Team Roster</h3>
                  <span className="font-mono text-[10px] text-slate-500">Enter company code or invite link</span>
                </div>
              </div>
              <button 
                onClick={() => setShowJoinModal(false)}
                className="p-1 bg-white brutal-border hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleJoinCompany} className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="font-bold block">Company Code or Invite Link *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CORP-94821 or paste invite URL"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value)}
                  className="w-full p-2 bg-white brutal-border font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#FFE600] uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold block">Your Role in the Organization *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer, UX Specialist"
                  value={joinRoleInput}
                  onChange={(e) => setJoinRoleInput(e.target.value)}
                  className="w-full p-2 bg-white brutal-border font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#FFE600]"
                />
              </div>

              {joinError && (
                <div className="p-2.5 bg-red-50 brutal-border border-red-300 text-red-700 text-[11px] font-bold">
                  {joinError}
                </div>
              )}

              <div className="p-3 bg-slate-50 brutal-border text-[11px] text-slate-600">
                Joining will add your psychometric vector (<strong>{userArchetype.name}</strong>) to the organization's real-time heatmap and 1-on-1 coaching directory.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="brutal-btn bg-slate-100 hover:bg-slate-200 px-3 py-2 text-xs font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isJoining || !joinCodeInput.trim()}
                  className="brutal-btn bg-[#0F172A] text-white px-4 py-2 text-xs font-black flex items-center gap-1.5"
                >
                  {isJoining ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                  <span>{isJoining ? 'CONNECTING...' : 'JOIN COMPANY ROSTER'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Invite Success & Link Presentation */}
      {showInviteSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0F172A]/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md brutal-border brutal-shadow-xl p-5 sm:p-6 space-y-4 text-[#0F172A] relative">
            <div className="bg-[#FFE600] p-4 brutal-border flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0F172A] text-[#FFE600] brutal-border flex items-center justify-center font-display font-black text-xl shrink-0">
                👑
              </div>
              <div>
                <span className="brutal-badge bg-[#0F172A] text-white text-[9px] font-mono">
                  ADMIN CREATED
                </span>
                <h3 className="font-display font-black text-lg uppercase leading-tight">
                  {company.name} is Live!
                </h3>
              </div>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <p className="text-slate-700">
                Your organization workspace has been created. Invite your teammates by sending them this unique code or direct link:
              </p>

              <div className="p-3 bg-slate-100 brutal-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-bold text-[10px]">COMPANY CODE:</span>
                  <span className="font-black text-indigo-700 text-sm tracking-wider">{company.companyCode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="w-1/2 brutal-btn bg-white hover:bg-slate-50 text-[#0F172A] py-1.5 text-xs font-bold flex items-center justify-center gap-1"
                  >
                    {copiedCode ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                    <span>{copiedCode ? 'COPIED!' : 'COPY CODE'}</span>
                  </button>
                  <button
                    onClick={handleCopyInviteLink}
                    className="w-1/2 brutal-btn bg-[#0F172A] text-white py-1.5 text-xs font-bold flex items-center justify-center gap-1"
                  >
                    {copiedLink ? <Check size={13} className="text-[#FFE600]" /> : <ExternalLink size={13} />}
                    <span>{copiedLink ? 'LINK COPIED!' : 'COPY LINK'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowInviteSuccessModal(false)}
                className="brutal-btn bg-[#0F172A] text-white px-5 py-2 font-mono text-xs font-black"
              >
                OPEN WORKPLACE DASHBOARD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
