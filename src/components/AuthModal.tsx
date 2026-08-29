import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Link2,
  LogIn
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'emaillink';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin'
}) => {
  const { 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    sendPasswordlessEmailLink 
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'emaillink'>(initialMode);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  
  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (mode === 'signin') {
        await signInWithEmail(email.trim(), password);
        onClose();
      } else if (mode === 'signup') {
        if (!displayName.trim() || !username.trim()) {
          setErrorMsg('Display name and username are required.');
          setIsLoading(false);
          return;
        }
        await signUpWithEmail(
          email.trim(), 
          password, 
          displayName.trim(), 
          username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '')
        );
        onClose();
      }
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setErrorMsg('Invalid email or password. Please check your credentials.');
      } else if (code === 'auth/email-already-in-use') {
        setErrorMsg('An account with this email already exists. Try signing in.');
      } else if (code === 'auth/weak-password') {
        setErrorMsg('Password should be at least 6 characters.');
      } else {
        setErrorMsg(err?.message || 'Authentication failed. Please verify your details.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await sendPasswordlessEmailLink(email.trim());
      setSuccessMsg(`Magic login link sent to ${email.trim()}! Click the link in your inbox to sign in instantly.`);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to send login link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#FDFBF7] brutal-border brutal-shadow-lg w-full max-w-md p-6 sm:p-7 relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 bg-white brutal-border hover:bg-slate-100 transition-colors"
          title="Close Modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="brutal-badge bg-[#FFE600] text-[10px] font-mono">
              OMNIPSYCHE CLOUD SYNC
            </span>
          </div>
          <h2 className="font-display font-black text-2xl text-[#0F172A] tracking-tight">
            {mode === 'signin' && 'Sign In to OmniPsyche'}
            {mode === 'signup' && 'Create Your Psyche Profile'}
            {mode === 'emaillink' && 'Passwordless Magic Link'}
          </h2>
          <p className="text-xs font-mono text-slate-600 mt-1">
            Persist your psychological vector across devices, befriend peers, and launch live compatibility duels.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-200 brutal-border mb-5 text-xs font-mono font-bold">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-2 text-center transition-all ${
              mode === 'signin' 
                ? 'bg-[#0F172A] text-white brutal-shadow-xs font-black' 
                : 'bg-transparent text-slate-700 hover:bg-slate-300'
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-2 text-center transition-all ${
              mode === 'signup' 
                ? 'bg-[#0F172A] text-white brutal-shadow-xs font-black' 
                : 'bg-transparent text-slate-700 hover:bg-slate-300'
            }`}
          >
            REGISTER
          </button>
          <button
            type="button"
            onClick={() => { setMode('emaillink'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-2 text-center transition-all flex items-center justify-center gap-1 ${
              mode === 'emaillink' 
                ? 'bg-[#0F172A] text-white brutal-shadow-xs font-black' 
                : 'bg-transparent text-slate-700 hover:bg-slate-300'
            }`}
          >
            <Link2 size={12} />
            MAGIC LINK
          </button>
        </div>

        {/* Google One-Click Action */}
        <div className="mb-5">
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full brutal-btn bg-white hover:bg-slate-50 text-[#0F172A] py-2.5 px-4 font-mono text-xs font-bold flex items-center justify-center gap-2.5 transition-transform active:translate-y-0.5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google / Gmail
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-mono uppercase">
              <span className="bg-[#FDFBF7] px-2 text-slate-500 font-bold">Or with Email</span>
            </div>
          </div>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-100 brutal-border border-red-600 text-red-900 font-mono text-xs flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-600 mt-0.5" />
            <div>{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-100 brutal-border border-emerald-600 text-emerald-900 font-mono text-xs flex items-start gap-2">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600 mt-0.5" />
            <div>{successMsg}</div>
          </div>
        )}

        {/* Passwordless Magic Link Form */}
        {mode === 'emaillink' ? (
          <form onSubmit={handleEmailLinkSubmit} className="space-y-4">
            <div>
              <label className="block font-mono text-xs font-bold text-[#0F172A] mb-1">
                YOUR EMAIL ADDRESS
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="alex@onclusive.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 pl-9 bg-white brutal-border font-mono text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                />
                <Mail size={15} className="absolute left-3 top-3 text-slate-400" />
              </div>
              <p className="font-mono text-[10px] text-slate-500 mt-1">
                We'll email you a secure one-click sign-in link. No passwords needed.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full brutal-btn bg-[#FFE600] text-[#0F172A] py-2.5 font-mono text-xs font-black flex items-center justify-center gap-2"
            >
              {isLoading ? 'SENDING MAGIC LINK...' : 'SEND MAGIC SIGN-IN LINK'}
              <ArrowRight size={14} />
            </button>
          </form>
        ) : (
          /* Standard Email & Password Form */
          <form onSubmit={handleEmailPasswordSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block font-mono text-xs font-bold text-[#0F172A] mb-1">
                    DISPLAY NAME
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Samad Patel"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full p-2.5 pl-9 bg-white brutal-border font-mono text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                    />
                    <UserIcon size={15} className="absolute left-3 top-3 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold text-[#0F172A] mb-1">
                    HANDLE / USERNAME
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="samad_architect"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full p-2.5 pl-9 bg-white brutal-border font-mono text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                    />
                    <span className="absolute left-3 top-2.5 font-mono text-xs text-slate-400">@</span>
                  </div>
                  <p className="font-mono text-[9px] text-slate-500 mt-0.5">
                    Used for friend search and public profile leaderboards.
                  </p>
                </div>
              </>
            )}

            <div>
              <label className="block font-mono text-xs font-bold text-[#0F172A] mb-1">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 pl-9 bg-white brutal-border font-mono text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                />
                <Mail size={15} className="absolute left-3 top-3 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold text-[#0F172A] mb-1">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 pl-9 bg-white brutal-border font-mono text-xs text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                />
                <Lock size={15} className="absolute left-3 top-3 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full brutal-btn bg-[#0F172A] text-white py-2.5 font-mono text-xs font-black flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                'PROCESSING...'
              ) : mode === 'signin' ? (
                <>
                  <LogIn size={14} />
                  SIGN IN TO PROFILE
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-[#FFE600]" />
                  CREATE CLOUD PROFILE
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="mt-5 pt-4 border-t border-slate-300 text-center">
          <p className="font-mono text-[10px] text-slate-500">
            By continuing, your continuous psychometric vector is synced securely with Firebase Enterprise Firestore.
          </p>
        </div>
      </div>
    </div>
  );
};
