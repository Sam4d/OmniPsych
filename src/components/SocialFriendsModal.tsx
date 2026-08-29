import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Search, 
  UserPlus, 
  UserMinus, 
  Share2, 
  Copy, 
  Check, 
  Swords, 
  Users, 
  Sparkles,
  Link,
  Flame
} from 'lucide-react';
import { 
  searchPublicProfiles, 
  addFriend, 
  removeFriend, 
  subscribeToFriends,
  createCompatibilityDuel 
} from '../services/socialService';
import { FriendRecord, PublicProfile, UserPsychologicalVector } from '../types';
import { ARCHETYPES } from '../data/archetypes';
import { getArchetypeById } from '../utils/scoring';

interface SocialFriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userVector: UserPsychologicalVector;
  onOpenAuth: () => void;
  onLaunchDuel: (duelId: string) => void;
  onCompareWithFriend: (friendArchetypeId: string) => void;
}

export const SocialFriendsModal: React.FC<SocialFriendsModalProps> = ({
  isOpen,
  onClose,
  userVector,
  onOpenAuth,
  onLaunchDuel,
  onCompareWithFriend
}) => {
  const { user, userProfile } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'friends' | 'search' | 'duel'>('friends');
  const [friendsList, setFriendsList] = useState<FriendRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PublicProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedDuelLink, setCopiedDuelLink] = useState(false);
  const [generatedDuelId, setGeneratedDuelId] = useState<string | null>(null);
  const [isGeneratingDuel, setIsGeneratingDuel] = useState(false);

  // Subscribe to friends when user is logged in
  useEffect(() => {
    if (!user) {
      setFriendsList([]);
      return;
    }
    const unsubscribe = subscribeToFriends(user.uid, (friends) => {
      setFriendsList(friends);
    });
    return () => unsubscribe();
  }, [user]);

  if (!isOpen) return null;

  const handleCopyFriendCode = () => {
    if (!userProfile?.friendCode) return;
    navigator.clipboard.writeText(userProfile.friendCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await searchPublicProfiles(searchQuery.trim());
      // Filter out self
      setSearchResults(results.filter(p => p.uid !== user?.uid));
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFriend = async (profile: PublicProfile) => {
    if (!user) {
      onOpenAuth();
      return;
    }
    try {
      await addFriend(user.uid, profile);
      // Remove from search results or mark as added
      setSearchResults(prev => prev.filter(p => p.uid !== profile.uid));
    } catch (err) {
      console.error('Add friend failed:', err);
    }
  };

  const handleRemoveFriend = async (friendUid: string) => {
    if (!user) return;
    try {
      await removeFriend(user.uid, friendUid);
    } catch (err) {
      console.error('Remove friend failed:', err);
    }
  };

  const handleCreateDuelInvite = async () => {
    if (!user || !userProfile) {
      onOpenAuth();
      return;
    }
    setIsGeneratingDuel(true);
    try {
      const duel = await createCompatibilityDuel(userProfile, userVector);
      setGeneratedDuelId(duel.duelId);
      const duelLink = `${window.location.origin}${window.location.pathname}?duel=${duel.duelId}`;
      navigator.clipboard.writeText(duelLink);
      setCopiedDuelLink(true);
      setTimeout(() => setCopiedDuelLink(false), 3000);
    } catch (err) {
      console.error('Failed to create duel:', err);
    } finally {
      setIsGeneratingDuel(false);
    }
  };

  const currentArchetype = userProfile?.primaryArchetypeId 
    ? getArchetypeById(userProfile.primaryArchetypeId) 
    : getArchetypeById(userVector.calculatedArchetypeId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FDFBF7] brutal-border brutal-shadow-lg w-full max-w-xl p-6 relative max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-white brutal-border hover:bg-slate-100 transition-colors"
          title="Close Modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-4 pr-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="brutal-badge bg-[#FFE600] text-[10px] font-mono flex items-center gap-1">
              <Users size={12} />
              PEER ECOSYSTEM
            </span>
          </div>
          <h2 className="font-display font-black text-2xl text-[#0F172A] tracking-tight">
            Friends & Compatibility Duels
          </h2>
          <p className="text-xs font-mono text-slate-600 mt-0.5">
            Befriend other archetypes, compare multidimensional vectors, and invite partners to live tests.
          </p>
        </div>

        {/* Not Signed In Banner */}
        {!user ? (
          <div className="p-4 bg-amber-100 brutal-border border-amber-600 mb-4 text-center">
            <p className="font-mono text-xs font-bold text-amber-950 mb-2">
              Sign in to save friends, generate live challenge links, and compare vectors across sessions.
            </p>
            <button
              onClick={onOpenAuth}
              className="brutal-btn bg-[#0F172A] text-white px-4 py-1.5 font-mono text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Sparkles size={13} className="text-[#FFE600]" />
              SIGN IN / CREATE ACCOUNT
            </button>
          </div>
        ) : (
          /* Signed In User Card */
          <div className="p-3 bg-white brutal-border mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div 
                className="w-10 h-10 brutal-border flex items-center justify-center font-display font-black text-sm text-[#0F172A]"
                style={{ backgroundColor: userProfile?.avatarColor || '#FFE600' }}
              >
                {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'Ψ'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-black text-sm text-[#0F172A]">
                    {userProfile?.displayName}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    @{userProfile?.username}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="brutal-badge bg-slate-100 text-[9px] font-mono text-slate-800">
                    {currentArchetype.code}-{userVector.identityVariant} {currentArchetype.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Friend Code Pill */}
            <div className="text-right">
              <span className="block font-mono text-[9px] font-bold text-slate-500 uppercase">
                Your Friend Code
              </span>
              <button
                onClick={handleCopyFriendCode}
                className="font-mono text-xs font-black bg-[#FFE600] px-2 py-0.5 brutal-border inline-flex items-center gap-1 hover:bg-yellow-400"
                title="Click to copy friend code"
              >
                {userProfile?.friendCode || 'PSY-XXXX'}
                {copiedCode ? <Check size={12} className="text-emerald-800" /> : <Copy size={12} />}
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200 brutal-border mb-4 font-mono text-xs font-bold">
          <button
            onClick={() => setActiveTab('friends')}
            className={`py-1.5 text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'friends' ? 'bg-[#0F172A] text-white brutal-shadow-xs font-black' : 'bg-transparent text-slate-700'
            }`}
          >
            <Users size={13} />
            FRIENDS ({friendsList.length})
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`py-1.5 text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'search' ? 'bg-[#0F172A] text-white brutal-shadow-xs font-black' : 'bg-transparent text-slate-700'
            }`}
          >
            <Search size={13} />
            FIND PEERS
          </button>
          <button
            onClick={() => setActiveTab('duel')}
            className={`py-1.5 text-center transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'duel' ? 'bg-[#0F172A] text-white brutal-shadow-xs font-black' : 'bg-transparent text-slate-700'
            }`}
          >
            <Swords size={13} className="text-[#FFE600]" />
            LIVE DUEL LINK
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {/* TAB 1: FRIENDS LIST */}
          {activeTab === 'friends' && (
            <div>
              {friendsList.length === 0 ? (
                <div className="p-8 text-center bg-white brutal-border border-dashed">
                  <Users size={32} className="mx-auto text-slate-400 mb-2" />
                  <p className="font-mono text-xs font-bold text-slate-700">
                    No friends connected yet.
                  </p>
                  <p className="font-mono text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                    Search for classmates or colleagues by username, or send them a live Duel link to test compatibility!
                  </p>
                  <button
                    onClick={() => setActiveTab('search')}
                    className="mt-3 brutal-btn bg-[#FFE600] text-[#0F172A] px-3 py-1 font-mono text-xs font-bold"
                  >
                    SEARCH USERS
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {friendsList.map((friend) => {
                    const arch = getArchetypeById(friend.friendArchetypeId);
                    return (
                      <div 
                        key={friend.friendUid}
                        className="p-3 bg-white brutal-border flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div 
                            className="w-9 h-9 brutal-border flex items-center justify-center font-display font-black text-xs text-[#0F172A]"
                            style={{ backgroundColor: arch.houseColor }}
                          >
                            {arch.code}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-display font-black text-xs text-[#0F172A]">
                                {friend.friendDisplayName}
                              </span>
                              <span className="font-mono text-[10px] text-slate-500">
                                @{friend.friendUsername}
                              </span>
                            </div>
                            <span className="font-mono text-[10px] text-slate-600 block">
                              {arch.name} • {friend.friendHouse}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              onCompareWithFriend(friend.friendArchetypeId);
                              onClose();
                            }}
                            className="brutal-btn bg-[#0F172A] text-white px-2.5 py-1 text-[11px] font-mono font-bold flex items-center gap-1"
                            title="Compare Psychometric Compatibility"
                          >
                            <Swords size={11} className="text-[#FFE600]" />
                            COMPARE
                          </button>
                          <button
                            onClick={() => handleRemoveFriend(friend.friendUid)}
                            className="p-1 bg-white brutal-border hover:bg-red-50 text-slate-400 hover:text-red-600"
                            title="Remove Friend"
                          >
                            <UserMinus size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SEARCH PEERS */}
          {activeTab === 'search' && (
            <div className="space-y-3">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by username or friend code (e.g. PSY-7K9)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2.5 pl-9 bg-white brutal-border font-mono text-xs text-[#0F172A] focus:outline-none"
                  />
                  <Search size={15} className="absolute left-3 top-3 text-slate-400" />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="brutal-btn bg-[#0F172A] text-white px-4 font-mono text-xs font-bold shrink-0"
                >
                  {isSearching ? 'SEARCHING...' : 'SEARCH'}
                </button>
              </form>

              {/* Search Results */}
              <div className="space-y-2">
                {searchResults.map((profile) => {
                  const arch = getArchetypeById(profile.primaryArchetypeId);
                  const isAlreadyFriend = friendsList.some(f => f.friendUid === profile.uid);

                  return (
                    <div 
                      key={profile.uid}
                      className="p-3 bg-white brutal-border flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-9 h-9 brutal-border flex items-center justify-center font-display font-black text-xs text-[#0F172A]"
                          style={{ backgroundColor: profile.avatarColor || arch.houseColor }}
                        >
                          {arch.code}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-display font-black text-xs text-[#0F172A]">
                              {profile.displayName}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500">
                              @{profile.username}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-slate-600 block">
                            {arch.name} • {profile.house}
                          </span>
                        </div>
                      </div>

                      {isAlreadyFriend ? (
                        <span className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-1 brutal-border">
                          FRIENDS ✓
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAddFriend(profile)}
                          className="brutal-btn bg-[#FFE600] text-[#0F172A] px-3 py-1 font-mono text-xs font-bold flex items-center gap-1"
                        >
                          <UserPlus size={13} />
                          ADD FRIEND
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: LIVE DUEL LINK GENERATOR */}
          {activeTab === 'duel' && (
            <div className="space-y-4">
              <div className="p-4 bg-[#FFE600]/20 brutal-border border-[#0F172A]">
                <div className="flex items-center gap-2 mb-1.5">
                  <Swords size={18} className="text-[#0F172A]" />
                  <h3 className="font-display font-black text-sm text-[#0F172A]">
                    Interactive Compatibility Challenge Link
                  </h3>
                </div>
                <p className="font-mono text-xs text-slate-700 leading-relaxed">
                  Send a dedicated invite link to a partner, friend, or coworker. They will take a rapid 3-minute assessment (or accept with their existing profile), and you will BOTH immediately unlock a live dual-comparison matrix with synergy breakdowns, friction alerts, and relational playbooks!
                </p>
              </div>

              <div className="p-4 bg-white brutal-border space-y-3">
                <button
                  type="button"
                  onClick={handleCreateDuelInvite}
                  disabled={isGeneratingDuel}
                  className="w-full brutal-btn bg-[#0F172A] text-white py-3 font-mono text-xs font-black flex items-center justify-center gap-2"
                >
                  <Flame size={15} className="text-[#FFE600]" />
                  {isGeneratingDuel ? 'GENERATING SECURE DUEL LINK...' : 'GENERATE LIVE DUEL CHALLENGE LINK'}
                </button>

                {generatedDuelId && (
                  <div className="p-3 bg-slate-100 brutal-border space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-700">
                      <span>CHALLENGE INVITE LINK:</span>
                      {copiedDuelLink && (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <Check size={12} /> COPIED TO CLIPBOARD
                        </span>
                      )}
                    </div>
                    <div className="p-2 bg-white brutal-border font-mono text-[10px] text-slate-800 break-all select-all">
                      {`${window.location.origin}${window.location.pathname}?duel=${generatedDuelId}`}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          const duelLink = `${window.location.origin}${window.location.pathname}?duel=${generatedDuelId}`;
                          navigator.clipboard.writeText(duelLink);
                          setCopiedDuelLink(true);
                          setTimeout(() => setCopiedDuelLink(false), 2000);
                        }}
                        className="brutal-btn bg-[#FFE600] text-[#0F172A] px-3 py-1 text-xs font-mono font-bold flex-1 flex items-center justify-center gap-1.5"
                      >
                        <Copy size={12} />
                        COPY LINK
                      </button>
                      <button
                        onClick={() => onLaunchDuel(generatedDuelId)}
                        className="brutal-btn bg-white text-[#0F172A] px-3 py-1 text-xs font-mono font-bold flex-1 flex items-center justify-center gap-1.5"
                      >
                        <Swords size={12} />
                        VIEW DUEL ROOM
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
