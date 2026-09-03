import React, { useState } from 'react';
import { Archetype, UserPsychologicalVector } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  BrainCircuit, 
  Sparkles, 
  Flame, 
  Layers, 
  BookOpen, 
  Users, 
  FileText, 
  Menu, 
  X,
  Play,
  LogIn,
  LogOut,
  Swords,
  User as UserIcon,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'dashboard' | 'assessment' | 'quicklab' | 'directory' | 'teams' | 'profile' | 'friends' | 'duel';
  onSelectTab: (tab: 'dashboard' | 'assessment' | 'quicklab' | 'directory' | 'teams' | 'profile' | 'friends' | 'duel') => void;
  archetype: Archetype;
  vector: UserPsychologicalVector;
  onOpenGlossary: (termId?: string) => void;
  onOpenWrapped: () => void;
  onOpenDossier: () => void;
  onStartFullAssessment: () => void;
  onOpenFriends: () => void;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  archetype,
  vector,
  onOpenGlossary,
  onOpenWrapped,
  onOpenDossier,
  onStartFullAssessment,
  onOpenFriends,
  onOpenAuth
}) => {
  const { user, userProfile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'profile', label: 'My Profile' },
    { id: 'friends', label: 'Friends and Duel' },
    { id: 'quicklab', label: 'Quick Lab' },
    { id: 'teams', label: 'B2B teams' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b-2 border-[#0F172A] shadow-sm select-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-3">
        {/* Brand Identity */}
        <div 
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-2 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 brutal-border bg-[#0F172A] text-[#FFE600] flex items-center justify-center font-display font-black text-base sm:text-lg group-hover:scale-105 transition-transform">
            Ψ
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-base sm:text-xl tracking-tight text-[#0F172A]">
                OMNIPSYCHE
              </span>
            </div>
            <span className="font-mono text-[8px] sm:text-[9px] font-bold text-slate-500 block -mt-1 tracking-tighter">
              UNIFIED PSYCHOMETRIC GRAPH
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links: Only Dashboard, My Profile, Friends and Duel, Quick Lab, B2B teams, Science and terms */}
        <nav className="hidden lg:flex items-center gap-1.5 font-mono text-xs font-bold">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as any)}
              className={`px-3 py-1.5 brutal-border transition-all ${
                currentTab === item.id
                  ? 'bg-[#0F172A] text-white brutal-shadow-sm -translate-y-0.5'
                  : 'bg-white hover:bg-slate-100 text-[#0F172A]'
              }`}
            >
              {item.label}
            </button>
          ))}

          {/* Science and terms Button */}
          <button
            onClick={() => onOpenGlossary()}
            className="px-3 py-1.5 brutal-border bg-white hover:bg-slate-100 text-[#0F172A] flex items-center gap-1.5 transition-all"
            title="Psychometric Science & Terms Glossary"
          >
            <BookOpen size={13} className="text-indigo-600" />
            <span>Science and terms</span>
          </button>
        </nav>

        {/* Action Controls & Active Profile Pill */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Auth State Button / Profile Pill */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="brutal-btn bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-2 text-[#0F172A] min-h-[38px]"
                title="Account Settings & Profile"
              >
                <div 
                  className="w-5 h-5 rounded-full brutal-border flex items-center justify-center text-[10px] font-black text-[#0F172A] shrink-0"
                  style={{ backgroundColor: userProfile?.avatarColor || '#FFE600' }}
                >
                  {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'Ψ'}
                </div>
                <span className="font-mono text-xs font-black text-[#0F172A] max-w-[110px] truncate">
                  {userProfile?.displayName || 'Profile'}
                </span>
                <ChevronRight size={13} className={`transition-transform text-slate-500 ${userDropdownOpen ? 'rotate-90' : ''}`} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-60 bg-white brutal-border brutal-shadow-lg p-2 space-y-1 font-mono text-xs z-50 animate-in fade-in duration-100">
                  <div className="p-2 bg-slate-50 brutal-border border-slate-300 mb-1">
                    <span className="text-[9px] font-bold text-slate-500 block">AUTHENTICATED USER</span>
                    <span className="font-black text-[#0F172A] text-xs truncate block">{user.displayName || user.email || userProfile?.username}</span>
                    <span className="text-[9px] text-indigo-600 font-bold block mt-0.5">CODE: {userProfile?.friendCode || 'OP-MEMBER'}</span>
                  </div>
                  <button
                    onClick={() => {
                      onSelectTab('profile');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left p-2 hover:bg-slate-100 flex items-center gap-2 font-bold text-[#0F172A]"
                  >
                    <UserIcon size={14} className="text-indigo-600" />
                    My Psychometric Profile
                  </button>
                  <button
                    onClick={() => {
                      onSelectTab('friends');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left p-2 hover:bg-slate-100 flex items-center gap-2 font-bold text-[#0F172A]"
                  >
                    <Users size={14} className="text-emerald-600" />
                    Friends & Compatibility Duels
                  </button>
                  <button
                    onClick={() => {
                      onOpenGlossary();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left p-2 hover:bg-slate-100 flex items-center gap-2 font-bold text-[#0F172A]"
                  >
                    <BookOpen size={14} className="text-indigo-600" />
                    Science & Terms Glossary
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left p-2 hover:bg-red-50 text-red-600 flex items-center gap-2 font-bold border-t border-slate-200"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="brutal-btn bg-white hover:bg-slate-50 text-[#0F172A] px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5 min-h-[38px]"
            >
              <LogIn size={14} />
              <span>SIGN IN</span>
            </button>
          )}
        </div>

        {/* Mobile Header Quick Actions */}
        <div className="flex sm:hidden items-center gap-1.5">
          <button
            onClick={() => onOpenGlossary()}
            className="brutal-btn bg-white p-2 text-xs font-mono font-bold text-[#0F172A] min-h-[36px]"
            title="Science & Glossary"
          >
            <BookOpen size={15} className="text-indigo-600" />
          </button>
          <button
            onClick={() => onSelectTab('friends')}
            className="brutal-btn bg-white p-2 text-xs font-mono font-bold min-h-[36px]"
            title="Friends & Duels"
          >
            <Users size={15} />
          </button>
          {user ? (
            <button
              onClick={() => onSelectTab('profile')}
              className="h-9 px-2 bg-white brutal-border brutal-shadow-sm flex items-center gap-1.5 font-mono font-bold text-xs active:scale-95 transition-transform"
              title="My Profile"
            >
              <div 
                className="w-5 h-5 rounded-full brutal-border flex items-center justify-center font-black text-[10px] text-[#0F172A]"
                style={{ backgroundColor: userProfile?.avatarColor || '#FFE600' }}
              >
                {userProfile?.displayName?.charAt(0).toUpperCase() || 'Ψ'}
              </div>
              <span className="max-w-[60px] truncate text-[11px] font-black">{userProfile?.displayName?.split(' ')[0] || 'User'}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="brutal-btn bg-white p-2 text-xs font-mono font-bold min-h-[36px]"
            >
              <LogIn size={15} />
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-white brutal-border brutal-shadow-sm active:scale-95 transition-transform min-h-[36px]"
            title="Menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu (Refined Grid Structure) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-[#0F172A] bg-white p-4 space-y-3 font-mono text-xs animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`p-3 brutal-border brutal-shadow-sm font-bold text-center min-h-[44px] flex items-center justify-center transition-all ${
                  currentTab === item.id ? 'bg-[#0F172A] text-white' : 'bg-white text-[#0F172A] hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t-2 border-[#0F172A] space-y-2">
            {/* Primary Action Buttons in 2-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onOpenGlossary();
                  setMobileMenuOpen(false);
                }}
                className="brutal-btn bg-indigo-50 text-indigo-950 p-3 font-bold text-center flex items-center justify-center gap-2 min-h-[44px]"
              >
                <BookOpen size={16} className="text-indigo-600" />
                <span>SCIENCE & TERMS GLOSSARY</span>
              </button>

              <button
                onClick={() => {
                  onSelectTab('friends');
                  setMobileMenuOpen(false);
                }}
                className="brutal-btn bg-[#FFE600] text-[#0F172A] p-3 font-bold text-center flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Users size={16} />
                <span>FRIENDS & DUEL ARENA</span>
              </button>
            </div>

            <button
              onClick={() => {
                onStartFullAssessment();
                setMobileMenuOpen(false);
              }}
              className="w-full brutal-btn bg-[#0F172A] text-white p-3 font-bold text-center min-h-[44px] flex items-center justify-center gap-2"
            >
              <Play size={14} fill="currentColor" />
              <span>TAKE MASTER OMNI-ASSESSMENT</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onOpenWrapped();
                  setMobileMenuOpen(false);
                }}
                className="brutal-btn bg-white p-2.5 font-bold text-center min-h-[44px] flex items-center justify-center gap-1.5"
              >
                <Sparkles size={14} />
                <span>WRAPPED</span>
              </button>
              <button
                onClick={() => {
                  onOpenDossier();
                  setMobileMenuOpen(false);
                }}
                className="brutal-btn bg-white p-2.5 font-bold text-center min-h-[44px] flex items-center justify-center gap-1.5"
              >
                <FileText size={14} />
                <span>DOSSIER</span>
              </button>
            </div>

            {user && (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full brutal-btn bg-red-50 text-red-700 p-2.5 text-center font-bold min-h-[44px] flex items-center justify-center gap-1.5"
              >
                <LogOut size={14} />
                <span>Sign Out ({userProfile?.displayName})</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

