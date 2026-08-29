import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Swords, 
  Search, 
  UserPlus, 
  UserMinus, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  ArrowRight,
  Zap,
  LogIn,
  ExternalLink
} from 'lucide-react';
import { 
  searchPublicProfiles, 
  addFriend, 
  removeFriend, 
  subscribeToFriends,
  createCompatibilityDuel 
} from '../services/socialService';
import { FriendRecord, PublicProfile, UserPsychologicalVector, Archetype, UserProfile } from '../types';
import { ARCHETYPES } from '../data/archetypes';
import { getArchetypeById } from '../utils/scoring';
import { ArchetypeAvatar } from './ArchetypeAvatar';

interface FriendsAndDuelViewProps {
  currentUserVector: UserPsychologicalVector;
  onOpenAuth: () => void;
  onLaunchDuel: (duelId: string) => void;
  onCompareWithFriend?: (friendArchetypeId: string) => void;
  onStartFullAssessment?: () => void;
}

// Curated Community Peers for immediate testing & demonstration
const DEMO_PEERS: PublicProfile[] = [
  {
    uid: 'demo_intj_sarah',
    username: 'sarah_architect',
    displayName: 'Sarah Chen',
    friendCode: 'OP-INTJ9',
    primaryArchetypeId: 'intj',
    archetypeTitle: 'The Grand Architect',
    house: 'The Strategists',
    identityVariant: 'A',
    avatarColor: '#6366F1',
    bio: 'Systems thinker, neurotech researcher, and chess enthusiast.',
    updatedAt: new Date().toISOString()
  },
  {
    uid: 'demo_entp_marcus',
    username: 'marcus_hacker',
    displayName: 'Marcus Vance',
    friendCode: 'OP-ENTP4',
    primaryArchetypeId: 'entp',
    archetypeTitle: 'The Paradigm Hacker',
    house: 'The Explorers',
    identityVariant: 'A',
    avatarColor: '#10B981',
    bio: 'Disruptive product designer & paradigm challenger.',
    updatedAt: new Date().toISOString()
  },
  {
    uid: 'demo_infj_elena',
    username: 'elena_oracle',
    displayName: 'Elena Rostova',
    friendCode: 'OP-INFJ2',
    primaryArchetypeId: 'infj',
    archetypeTitle: 'The Mystic Oracle',
    house: 'The Diplomats',
    identityVariant: 'A',
    avatarColor: '#0EA5E9',
    bio: 'Cognitive behavioral researcher & culture designer.',
    updatedAt: new Date().toISOString()
  }
];

export const FriendsAndDuelView: React.FC<FriendsAndDuelViewProps> = ({
  currentUserVector,
  onOpenAuth,
  onLaunchDuel,
  onCompareWithFriend,
  onStartFullAssessment
}) => {
  const { user, userProfile } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<'friends' | 'search' | 'duel'>('friends');
  const [friendsList, setFriendsList] = useState<FriendRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PublicProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedDuelLink, setCopiedDuelLink] = useState(false);
  const [manualDuelInput, setManualDuelInput] = useState('');
  const [isGeneratingDuel, setIsGeneratingDuel] = useState(false);
  const [generatedDuelId, setGeneratedDuelId] = useState<string | null>(null);

  // Fallback local friend code if user not logged in
  const effectiveFriendCode = userProfile?.friendCode || `OP-${currentUserVector.calculatedArchetypeId.toUpperCase()}${userProfile?.uid ? userProfile.uid.substring(0, 3).toUpperCase() : '77'}`;

  // Subscribe to real-time friends when logged in
  useEffect(() => {
    if (!user) {
      // Local demo friends if not logged in
      const savedLocal = localStorage.getItem('omnipsyche_local_friends');
      if (savedLocal) {
        try {
          setFriendsList(JSON.parse(savedLocal));
        } catch {
          setFriendsList([]);
        }
      }
      return;
    }

    const unsubscribe = subscribeToFriends(user.uid, (friends) => {
      setFriendsList(friends);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(effectiveFriendCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const queryTerm = searchQuery.trim();
    if (!queryTerm) return;

    setIsSearching(true);
    setSearchFeedback(null);
    setSearchResults([]);

    try {
      // Search remote Firestore if available
      let results = await searchPublicProfiles(queryTerm);

      // Also search local demo peers if needed
      if (results.length === 0) {
        const localMatches = DEMO_PEERS.filter(
          p => p.friendCode.toLowerCase().includes(queryTerm.toLowerCase()) ||
               p.username.toLowerCase().includes(queryTerm.toLowerCase()) ||
               p.displayName.toLowerCase().includes(queryTerm.toLowerCase())
        );
        results = localMatches;
      }

      // Exclude self
      const filtered = results.filter(p => p.uid !== user?.uid && p.friendCode !== effectiveFriendCode);
      setSearchResults(filtered);

      if (filtered.length === 0) {
        setSearchFeedback(`No profile found for "${queryTerm}". Try code "OP-INTJ9" or "OP-ENTP4".`);
      }
    } catch (err) {
      console.error('Search failed:', err);
      // Fallback search in demo peers
      const localMatches = DEMO_PEERS.filter(
        p => p.friendCode.toLowerCase().includes(queryTerm.toLowerCase()) ||
             p.username.toLowerCase().includes(queryTerm.toLowerCase())
      );
      setSearchResults(localMatches);
      if (localMatches.length === 0) {
        setSearchFeedback('Search completed with no direct matches. Try demo codes OP-INTJ9 or OP-ENTP4.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFriend = async (profile: PublicProfile) => {
    if (!user) {
      // Add to local state
      const newFriend: FriendRecord = {
        friendUid: profile.uid,
        friendUsername: profile.username,
        friendDisplayName: profile.displayName,
        friendCode: profile.friendCode,
        friendArchetypeId: profile.primaryArchetypeId,
        friendHouse: profile.house,
        addedAt: new Date().toISOString()
      };
      const updated = [newFriend, ...friendsList.filter(f => f.friendUid !== profile.uid)];
      setFriendsList(updated);
      localStorage.setItem('omnipsyche_local_friends', JSON.stringify(updated));
      setSearchResults(prev => prev.filter(p => p.uid !== profile.uid));
      return;
    }

    try {
      await addFriend(user.uid, profile);
      setSearchResults(prev => prev.filter(p => p.uid !== profile.uid));
    } catch (err) {
      console.error('Add friend failed:', err);
    }
  };

  const handleRemoveFriend = async (friendUid: string) => {
    if (!user) {
      const updated = friendsList.filter(f => f.friendUid !== friendUid);
      setFriendsList(updated);
      localStorage.setItem('omnipsyche_local_friends', JSON.stringify(updated));
      return;
    }

    try {
      await removeFriend(user.uid, friendUid);
    } catch (err) {
      console.error('Remove friend failed:', err);
    }
  };

  const handleCreateInstantDuel = async () => {
    setIsGeneratingDuel(true);
    try {
      const activeProf: UserProfile = userProfile || {
        uid: user?.uid || 'guest_user',
        email: user?.email || 'guest@omnipsyche.app',
        username: user?.displayName?.toLowerCase().replace(/\s+/g, '_') || 'omni_tester',
        displayName: user?.displayName || 'Vector Challenger',
        friendCode: effectiveFriendCode,
        primaryArchetypeId: currentUserVector.calculatedArchetypeId,
        archetypeTitle: getArchetypeById(currentUserVector.calculatedArchetypeId).title,
        house: getArchetypeById(currentUserVector.calculatedArchetypeId).house,
        identityVariant: currentUserVector.identityVariant,
        avatarColor: '#FFE600',
        lastActive: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const duel = await createCompatibilityDuel(activeProf, currentUserVector);
      setGeneratedDuelId(duel.duelId);
      const duelLink = `${window.location.origin}${window.location.pathname}?duel=${duel.duelId}`;
      navigator.clipboard.writeText(duelLink);
      setCopiedDuelLink(true);
      setTimeout(() => setCopiedDuelLink(false), 3000);
    } catch (err) {
      console.error('Failed to create duel:', err);
      // Fallback duel ID
      const fallbackId = `duel_${Date.now()}`;
      setGeneratedDuelId(fallbackId);
      const fallbackLink = `${window.location.origin}${window.location.pathname}?duel=${fallbackId}`;
      navigator.clipboard.writeText(fallbackLink);
      setCopiedDuelLink(true);
      setTimeout(() => setCopiedDuelLink(false), 3000);
    } finally {
      setIsGeneratingDuel(false);
    }
  };

  const handleJoinManualDuel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualDuelInput.trim()) return;

    let targetId = manualDuelInput.trim();
    if (targetId.includes('?duel=')) {
      targetId = targetId.split('?duel=')[1].split('&')[0];
    }
    onLaunchDuel(targetId);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 space-y-6 pb-12">
      {/* Top Hero Banner */}
      <div className="brutal-card bg-white p-5 sm:p-8 brutal-shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="brutal-badge bg-[#0F172A] text-white text-[10px] font-mono font-bold">
                PSYCHOMETRIC SOCIAL GRAPH
              </span>
              <span className="brutal-badge bg-[#FFE600] text-[#0F172A] text-[10px] font-mono font-bold">
                COMPATIBILITY ARENA
              </span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-[#0F172A] tracking-tight">
              Friends & Compatibility Duels
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl font-medium">
              Connect with peers, search by Friend Code, and launch real-time 1v1 compatibility challenges to map synergies and communication protocols.
            </p>
          </div>

          {/* User's Friend Code Quick Card */}
          <div className="brutal-card bg-[#F8FAFC] p-4 sm:p-5 brutal-border brutal-shadow-sm shrink-0 min-w-[280px] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-black text-slate-500">YOUR FRIEND CODE</span>
              <span className="font-mono text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                ONLINE
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 p-2 bg-white brutal-border">
              <span className="font-mono text-base font-black text-[#0F172A] tracking-wider">
                {effectiveFriendCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="brutal-btn bg-[#FFE600] text-[#0F172A] px-2.5 py-1 text-xs font-mono font-bold flex items-center gap-1"
                title="Copy Friend Code"
              >
                {copiedCode ? <Check size={14} className="text-emerald-700" /> : <Copy size={14} />}
                <span>{copiedCode ? 'COPIED!' : 'COPY'}</span>
              </button>
            </div>

            {!user && (
              <button
                onClick={onOpenAuth}
                className="w-full text-center text-xs font-mono font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1.5 pt-1"
              >
                <LogIn size={13} />
                <span>Sign in with Google to sync cloud friends</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('friends')}
          className={`px-4 py-2 brutal-border transition-all flex items-center gap-2 ${
            activeSubTab === 'friends'
              ? 'bg-[#0F172A] text-white brutal-shadow-sm -translate-y-0.5'
              : 'bg-white text-[#0F172A] hover:bg-slate-100'
          }`}
        >
          <Users size={15} />
          <span>MY FRIENDS ({friendsList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('search')}
          className={`px-4 py-2 brutal-border transition-all flex items-center gap-2 ${
            activeSubTab === 'search'
              ? 'bg-[#0F172A] text-white brutal-shadow-sm -translate-y-0.5'
              : 'bg-white text-[#0F172A] hover:bg-slate-100'
          }`}
        >
          <Search size={15} />
          <span>SEARCH & ADD BY CODE</span>
        </button>

        <button
          onClick={() => setActiveSubTab('duel')}
          className={`px-4 py-2 brutal-border transition-all flex items-center gap-2 ${
            activeSubTab === 'duel'
              ? 'bg-[#0F172A] text-white brutal-shadow-sm -translate-y-0.5'
              : 'bg-white text-[#0F172A] hover:bg-slate-100'
          }`}
        >
          <Swords size={15} />
          <span>DUEL ARENA</span>
        </button>
      </div>

      {/* Tab 1: Active Friends List */}
      {activeSubTab === 'friends' && (
        <div className="space-y-6">
          {friendsList.length === 0 ? (
            <div className="brutal-card bg-white p-8 brutal-shadow-md text-center space-y-4">
              <div className="w-14 h-14 mx-auto bg-[#F8FAFC] brutal-border flex items-center justify-center text-[#0F172A]">
                <Users size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-black text-lg text-[#0F172A]">
                  No Connected Friends Yet
                </h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  Search by Friend Code above or quick-add curated peers below to run compatibility duels!
                </p>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setActiveSubTab('search')}
                  className="brutal-btn bg-[#FFE600] text-[#0F172A] px-4 py-2 text-xs font-mono font-bold flex items-center gap-1.5"
                >
                  <Search size={14} />
                  <span>SEARCH FRIEND CODE</span>
                </button>
                <button
                  onClick={handleCreateInstantDuel}
                  className="brutal-btn bg-[#0F172A] text-white px-4 py-2 text-xs font-mono font-bold flex items-center gap-1.5"
                >
                  <Swords size={14} />
                  <span>CREATE 1V1 DUEL LINK</span>
                </button>
              </div>

              {/* Quick Connect Community Peers */}
              <div className="pt-8 border-t border-slate-200 text-left">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display font-black text-sm text-[#0F172A] flex items-center gap-1.5">
                    <Sparkles size={16} className="text-[#F59E0B]" />
                    QUICK CONNECT DEMO PEERS
                  </span>
                  <span className="text-xs font-mono text-slate-500">Test duels instantly</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {DEMO_PEERS.map((peer) => {
                    const arch = getArchetypeById(peer.primaryArchetypeId);
                    return (
                      <div key={peer.uid} className="brutal-card bg-[#F8FAFC] p-4 brutal-border flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span 
                              className="px-2 py-0.5 text-[10px] font-mono font-bold text-white brutal-border"
                              style={{ backgroundColor: arch.houseColor }}
                            >
                              {arch.code}
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-600">{peer.friendCode}</span>
                          </div>
                          <div>
                            <h4 className="font-display font-black text-sm text-[#0F172A]">{peer.displayName}</h4>
                            <p className="font-mono text-xs text-indigo-600 font-bold">{arch.name}</p>
                            <p className="text-xs text-slate-600 mt-1 line-clamp-2">{peer.bio}</p>
                          </div>
                        </div>

                        <div className="pt-2 flex items-center gap-2">
                          <button
                            onClick={() => handleAddFriend(peer)}
                            className="flex-1 brutal-btn bg-white hover:bg-slate-100 text-[#0F172A] py-1.5 text-xs font-mono font-bold flex items-center justify-center gap-1"
                          >
                            <UserPlus size={13} />
                            <span>CONNECT</span>
                          </button>
                          <button
                            onClick={() => onLaunchDuel(`duel_demo_${peer.uid}`)}
                            className="brutal-btn bg-[#FFE600] text-[#0F172A] px-3 py-1.5 text-xs font-mono font-bold flex items-center justify-center gap-1"
                            title="Duel this peer"
                          >
                            <Swords size={13} />
                            <span>DUEL</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friendsList.map((friend) => {
                const arch = getArchetypeById(friend.friendArchetypeId);
                return (
                  <div 
                    key={friend.friendUid}
                    className="brutal-card bg-white p-5 brutal-shadow-md flex flex-col justify-between space-y-4 hover:-translate-y-0.5 transition-transform"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span 
                          className="px-2 py-0.5 text-[10px] font-mono font-black text-white brutal-border"
                          style={{ backgroundColor: arch.houseColor || '#6366F1' }}
                        >
                          {arch.code} // {friend.friendHouse.toUpperCase()}
                        </span>
                        <button
                          onClick={() => handleRemoveFriend(friend.friendUid)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          title="Remove Friend"
                        >
                          <UserMinus size={15} />
                        </button>
                      </div>

                      <div className="flex items-start gap-3">
                        <div 
                          className="w-10 h-10 brutal-border bg-[#0F172A] text-[#FFE600] flex items-center justify-center font-display font-black text-base shrink-0"
                        >
                          {friend.friendDisplayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-display font-black text-base text-[#0F172A] truncate">
                            {friend.friendDisplayName}
                          </h4>
                          <p className="font-mono text-xs text-indigo-600 font-bold truncate">
                            {arch.name}
                          </p>
                          <p className="font-mono text-[10px] text-slate-500 mt-0.5">
                            CODE: {friend.friendCode}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => onLaunchDuel(`duel_${friend.friendUid}_${Date.now()}`)}
                        className="flex-1 brutal-btn bg-[#FFE600] text-[#0F172A] py-2 text-xs font-mono font-bold flex items-center justify-center gap-1.5"
                      >
                        <Swords size={14} />
                        <span>LAUNCH DUEL</span>
                      </button>
                      {onCompareWithFriend && (
                        <button
                          onClick={() => onCompareWithFriend(friend.friendArchetypeId)}
                          className="brutal-btn bg-[#0F172A] text-white px-3 py-2 text-xs font-mono font-bold flex items-center justify-center gap-1"
                          title="Compare Archetypes"
                        >
                          <Sparkles size={14} />
                          <span>SYNERGY</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Search & Add by Code */}
      {activeSubTab === 'search' && (
        <div className="brutal-card bg-white p-6 sm:p-8 brutal-shadow-lg space-y-6">
          <div className="space-y-2">
            <h2 className="font-display font-black text-xl text-[#0F172A]">
              Search by Friend Code or Username
            </h2>
            <p className="text-slate-600 text-sm font-medium">
              Enter an exact 6-character Friend Code (e.g. <code className="bg-slate-100 px-1.5 py-0.5 brutal-border font-mono font-bold">OP-INTJ9</code>) or handle to send a connection request.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter friend code (e.g. OP-INTJ9) or username..."
                className="w-full bg-[#F8FAFC] brutal-border pl-10 pr-4 py-3 font-mono text-sm focus:bg-white focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="brutal-btn bg-[#0F172A] text-white px-6 py-3 font-mono text-xs font-bold flex items-center justify-center gap-2 min-h-[46px]"
            >
              <Search size={16} />
              <span>{isSearching ? 'SEARCHING...' : 'FIND USER'}</span>
            </button>
          </form>

          {/* Feedback Message */}
          {searchFeedback && (
            <div className="p-3 bg-amber-50 brutal-border border-amber-300 text-xs font-mono text-amber-900">
              {searchFeedback}
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-3 pt-2">
              <span className="font-mono text-xs font-bold text-slate-500 block">
                FOUND MATCHES ({searchResults.length})
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((result) => {
                  const arch = getArchetypeById(result.primaryArchetypeId);
                  const isAlreadyFriend = friendsList.some(f => f.friendUid === result.uid);
                  return (
                    <div key={result.uid} className="brutal-card bg-[#F8FAFC] p-4 brutal-border flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div 
                          className="w-10 h-10 brutal-border bg-[#0F172A] text-[#FFE600] flex items-center justify-center font-display font-black text-base shrink-0"
                        >
                          {result.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-display font-black text-sm text-[#0F172A] truncate">
                            {result.displayName}
                          </h4>
                          <p className="font-mono text-xs text-indigo-600 font-bold truncate">
                            {arch.name} ({arch.code})
                          </p>
                          <p className="font-mono text-[10px] text-slate-500">
                            CODE: {result.friendCode}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleAddFriend(result)}
                        disabled={isAlreadyFriend}
                        className={`brutal-btn px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1 shrink-0 ${
                          isAlreadyFriend ? 'bg-slate-200 text-slate-500' : 'bg-[#FFE600] text-[#0F172A]'
                        }`}
                      >
                        {isAlreadyFriend ? <Check size={13} /> : <UserPlus size={13} />}
                        <span>{isAlreadyFriend ? 'CONNECTED' : 'ADD FRIEND'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Compatibility Duel Arena */}
      {activeSubTab === 'duel' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Instant Duel Link Card */}
          <div className="brutal-card bg-white p-6 sm:p-8 brutal-shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-[#FFE600] text-[#0F172A] brutal-border flex items-center justify-center font-display font-black text-xl">
                <Swords size={24} />
              </div>
              <h3 className="font-display font-black text-xl text-[#0F172A]">
                Create 1v1 Vector Duel
              </h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                Generate an encrypted challenge link. Send it to anyone on WhatsApp, Slack, Discord, or iMessage. When they complete the test, both of your vectors collide in the live psychometric matrix!
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCreateInstantDuel}
                disabled={isGeneratingDuel}
                className="w-full brutal-btn bg-[#FFE600] text-[#0F172A] py-3 px-4 font-display font-black text-sm flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Swords size={18} />
                <span>{isGeneratingDuel ? 'GENERATING ARENA...' : 'GENERATE & COPY DUEL LINK'}</span>
              </button>

              {copiedDuelLink && (
                <div className="p-2.5 bg-emerald-50 brutal-border border-emerald-300 text-xs font-mono font-bold text-emerald-800 text-center flex items-center justify-center gap-1.5">
                  <Check size={14} className="text-emerald-700" />
                  <span>DUEL LINK COPIED TO CLIPBOARD! SEND IT TO YOUR FRIEND.</span>
                </div>
              )}
            </div>
          </div>

          {/* Join Duel Room with Code / Link */}
          <div className="brutal-card bg-white p-6 sm:p-8 brutal-shadow-lg flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-[#0F172A] text-white brutal-border flex items-center justify-center font-display font-black text-xl">
                <Zap size={24} className="text-[#FFE600]" />
              </div>
              <h3 className="font-display font-black text-xl text-[#0F172A]">
                Enter / Accept a Duel
              </h3>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                Received a duel link or Duel ID from a friend? Paste it below to jump directly into the live compatibility arena.
              </p>
            </div>

            <form onSubmit={handleJoinManualDuel} className="space-y-3">
              <input
                type="text"
                value={manualDuelInput}
                onChange={(e) => setManualDuelInput(e.target.value)}
                placeholder="Paste duel link or ID (e.g. duel_12345)..."
                className="w-full bg-[#F8FAFC] brutal-border px-3.5 py-2.5 font-mono text-xs focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={!manualDuelInput.trim()}
                className="w-full brutal-btn bg-[#0F172A] text-white py-3 px-4 font-mono text-xs font-bold flex items-center justify-center gap-2 min-h-[46px] disabled:opacity-50"
              >
                <ArrowRight size={16} />
                <span>ENTER ARENA</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
