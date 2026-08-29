import React, { useState, useEffect } from 'react';
import { UserPsychologicalVector, Archetype, MicroTest, TestQuestion } from './types';
import { loadUserVector, saveUserVector, getArchetypeById } from './utils/scoring';
import { OMNI_ASSESSMENT_QUESTIONS } from './data/questions';
import { useAuth } from './context/AuthContext';
import { completeCompatibilityDuel } from './services/socialService';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ResultsDashboard } from './components/ResultsDashboard';
import { AssessmentEngine } from './components/AssessmentEngine';
import { QuickLabGrid } from './components/QuickLabGrid';
import { ArchetypeDirectory } from './components/ArchetypeDirectory';
import { TeamDynamicsHeatmap } from './components/TeamDynamicsHeatmap';
import { RoastHypeGenerator } from './components/RoastHypeGenerator';
import { CompatibilityMirror } from './components/CompatibilityMirror';
import { PsycheWrapped } from './components/PsycheWrapped';
import { MasterDossierModal } from './components/MasterDossierModal';
import { AuthModal } from './components/AuthModal';
import { SocialFriendsModal } from './components/SocialFriendsModal';
import { CompatibilityDuelRoomModal } from './components/CompatibilityDuelRoomModal';
import { GamifiedUserProfile } from './components/GamifiedUserProfile';
import { PsychometricGlossaryModal } from './components/PsychometricGlossaryModal';
import { PrintableReportModal } from './components/PrintableReportModal';
import { InstagramStoryModal } from './components/InstagramStoryModal';
import { FriendsAndDuelView } from './components/FriendsAndDuelView';

export default function App() {
  const { user, userProfile, syncVectorToCloud } = useAuth();
  const [vector, setVector] = useState<UserPsychologicalVector>(() => loadUserVector());
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'assessment' | 'quicklab' | 'directory' | 'teams' | 'profile' | 'friends' | 'duel'>('dashboard');
  
  // Active Assessment State
  const [activeTestQuestions, setActiveTestQuestions] = useState<TestQuestion[]>(OMNI_ASSESSMENT_QUESTIONS);
  const [activeTestTitle, setActiveTestTitle] = useState<string>('Master Omni-Assessment');
  const [activeTestSubtitle, setActiveTestSubtitle] = useState<string>('Comprehensive 7-Layer Psychometric Synthesis');
  const [activeTestId, setActiveTestId] = useState<string>('omni-core');
  const [isQuickLabActive, setIsQuickLabActive] = useState<boolean>(false);

  // Social & Duel state
  const [activeDuelId, setActiveDuelId] = useState<string | null>(null);
  const [pendingDuelChallengeId, setPendingDuelChallengeId] = useState<string | null>(null);

  // Modals state
  const [showRoastHype, setShowRoastHype] = useState(false);
  const [showCompatibility, setShowCompatibility] = useState(false);
  const [showWrapped, setShowWrapped] = useState(false);
  const [showGlossary, setShowGlossary] = useState(false);
  const [glossaryInitialTerm, setGlossaryInitialTerm] = useState<string | undefined>(undefined);
  const [showDossier, setShowDossier] = useState(false);
  const [showPrintableReport, setShowPrintableReport] = useState(false);
  const [showInstagramStory, setShowInstagramStory] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [showDuelRoom, setShowDuelRoom] = useState(false);

  // Check URL params for duel links on mount
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const duelParam = urlParams.get('duel');
      if (duelParam) {
        setActiveDuelId(duelParam);
        setShowDuelRoom(true);
      }
    } catch (e) {
      console.warn('Failed to parse URL query params', e);
    }
  }, []);

  // Restore vector from Cloud Profile if logged in and profile has saved vector
  useEffect(() => {
    if (userProfile?.psychologicalVector) {
      setVector(userProfile.psychologicalVector);
      saveUserVector(userProfile.psychologicalVector);
    }
  }, [userProfile?.psychologicalVector]);

  const archetype: Archetype = getArchetypeById(vector.calculatedArchetypeId);

  const handleOpenGlossary = (termId?: string) => {
    setGlossaryInitialTerm(termId);
    setShowGlossary(true);
  };

  const handleUpdateVector = async (updatedVector: UserPsychologicalVector) => {
    setVector(updatedVector);
    saveUserVector(updatedVector);
    setCurrentTab('dashboard');

    // Auto-sync with Firestore if authenticated
    if (user) {
      try {
        await syncVectorToCloud(updatedVector);
      } catch (err) {
        console.warn('Vector sync to cloud skipped or pending:', err);
      }
    }

    // If user took the test as part of an active duel challenge, complete it
    if (pendingDuelChallengeId) {
      try {
        await completeCompatibilityDuel(
          pendingDuelChallengeId,
          userProfile?.displayName || 'Invitee',
          user?.uid || null,
          updatedVector
        );
        setActiveDuelId(pendingDuelChallengeId);
        setShowDuelRoom(true);
      } catch (e) {
        console.error('Failed to complete duel on test completion:', e);
      } finally {
        setPendingDuelChallengeId(null);
      }
    }
  };

  const handleStartFullAssessment = () => {
    setActiveTestQuestions(OMNI_ASSESSMENT_QUESTIONS);
    setActiveTestTitle('Master Omni-Assessment (UPG 2.0)');
    setActiveTestSubtitle('Continuous 7-Domain Psychometric Synthesis (HEXACO, Attachment, RIASEC, EQ)');
    setActiveTestId('omni-core');
    setIsQuickLabActive(false);
    setCurrentTab('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartDuelAssessment = (duelId: string) => {
    setPendingDuelChallengeId(duelId);
    handleStartFullAssessment();
  };

  const handleStartMicroTest = (test: MicroTest) => {
    const questions = test.questions || OMNI_ASSESSMENT_QUESTIONS.slice(0, test.questionCount);
    setActiveTestQuestions(questions);
    setActiveTestTitle(test.title);
    setActiveTestSubtitle(test.subtitle);
    setActiveTestId(test.id);
    setIsQuickLabActive(true);
    setCurrentTab('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDuelRoom = (duelId: string) => {
    setActiveDuelId(duelId);
    setShowDuelRoom(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#0F172A] flex flex-col font-sans selection:bg-[#FFE600] selection:text-[#0F172A]">
      {/* Top Sticky Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        archetype={archetype}
        vector={vector}
        onOpenGlossary={() => handleOpenGlossary()}
        onOpenWrapped={() => setShowWrapped(true)}
        onOpenDossier={() => setShowDossier(true)}
        onStartFullAssessment={handleStartFullAssessment}
        onOpenFriends={() => setCurrentTab('friends')}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 py-4 sm:py-6">
        {currentTab === 'assessment' ? (
          <AssessmentEngine
            questions={activeTestQuestions}
            title={activeTestTitle}
            subtitle={activeTestSubtitle}
            testId={activeTestId}
            isQuickLab={isQuickLabActive}
            currentVector={vector}
            onComplete={handleUpdateVector}
            onCancel={() => setCurrentTab('dashboard')}
          />
        ) : (
          <div>
            {currentTab === 'dashboard' && (
              <>
                <div className="max-w-6xl mx-auto px-3 sm:px-6">
                  <HeroBanner
                    onStartFullAssessment={handleStartFullAssessment}
                    onExploreQuickLab={() => setCurrentTab('quicklab')}
                    onOpenGlossary={handleOpenGlossary}
                  />
                </div>
                <ResultsDashboard
                  vector={vector}
                  onOpenRoastHype={() => setShowRoastHype(true)}
                  onOpenWrapped={() => setShowWrapped(true)}
                  onOpenCompatibility={() => setShowCompatibility(true)}
                  onOpenGlossary={handleOpenGlossary}
                  onOpenDossier={() => setShowDossier(true)}
                  onOpenPrintableReport={() => setShowPrintableReport(true)}
                  onOpenInstagramStory={() => setShowInstagramStory(true)}
                  onRetakeTest={handleStartFullAssessment}
                  onOpenFriends={() => setCurrentTab('friends')}
                />
              </>
            )}

            {currentTab === 'profile' && (
              <GamifiedUserProfile
                vector={vector}
                archetype={archetype}
                onStartFullAssessment={handleStartFullAssessment}
                onStartMicroTest={handleStartMicroTest}
                onOpenFriends={() => setCurrentTab('friends')}
                onOpenGlossary={handleOpenGlossary}
                onOpenAuth={() => setShowAuthModal(true)}
              />
            )}

            {(currentTab === 'friends' || currentTab === 'duel') && (
              <FriendsAndDuelView
                currentUserVector={vector}
                onOpenAuth={() => setShowAuthModal(true)}
                onLaunchDuel={handleOpenDuelRoom}
                onCompareWithFriend={(friendArchId) => {
                  setShowCompatibility(true);
                }}
                onStartFullAssessment={handleStartFullAssessment}
              />
            )}

            {currentTab === 'quicklab' && (
              <QuickLabGrid onStartMicroTest={handleStartMicroTest} />
            )}

            {currentTab === 'directory' && (
              <ArchetypeDirectory />
            )}

            {currentTab === 'teams' && (
              <TeamDynamicsHeatmap
                userArchetype={archetype}
                userVector={vector}
              />
            )}
          </div>
        )}
      </main>

      {/* Social, Auth & Duel Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <SocialFriendsModal
        isOpen={showFriendsModal}
        onClose={() => setShowFriendsModal(false)}
        currentUserVector={vector}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenDuel={handleOpenDuelRoom}
      />

      <CompatibilityDuelRoomModal
        duelId={activeDuelId}
        isOpen={showDuelRoom}
        onClose={() => {
          setShowDuelRoom(false);
          setActiveDuelId(null);
        }}
        currentUserVector={vector}
        onStartDuelAssessment={handleStartDuelAssessment}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Diagnostics & Feature Modals */}
      {showRoastHype && (
        <RoastHypeGenerator
          archetype={archetype}
          vector={vector}
          onClose={() => setShowRoastHype(false)}
        />
      )}

      {showCompatibility && (
        <CompatibilityMirror
          userArchetype={archetype}
          userVector={vector}
          onClose={() => setShowCompatibility(false)}
        />
      )}

      {showWrapped && (
        <PsycheWrapped
          archetype={archetype}
          vector={vector}
          onClose={() => setShowWrapped(false)}
        />
      )}

      <PsychometricGlossaryModal
        isOpen={showGlossary}
        onClose={() => setShowGlossary(false)}
        initialTermId={glossaryInitialTerm}
      />

      {showDossier && (
        <MasterDossierModal
          archetype={archetype}
          vector={vector}
          onClose={() => setShowDossier(false)}
        />
      )}

      {showPrintableReport && (
        <PrintableReportModal
          archetype={archetype}
          vector={vector}
          onClose={() => setShowPrintableReport(false)}
        />
      )}

      {showInstagramStory && (
        <InstagramStoryModal
          archetype={archetype}
          vector={vector}
          onClose={() => setShowInstagramStory(false)}
        />
      )}

      {/* Global Footer with 'Made by Samad' */}
      <footer className="border-t-2 border-[#0F172A] bg-white py-8 px-4 sm:px-6 mt-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 brutal-border bg-[#0F172A] text-[#FFE600] flex items-center justify-center font-display font-black text-sm">
                Ψ
              </div>
              <div>
                <span className="font-bold text-[#0F172A] block">OMNIPSYCHE // PSYCHOMETRIC PLATFORM</span>
                <span className="text-[10px] text-slate-500">7-Layer Continuous Vector Topology</span>
              </div>
            </div>

            {/* Interactive Terms & Scientific Standards Explanations */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 text-[11px]">
              <button 
                onClick={() => handleOpenGlossary('hexaco')}
                className="text-left font-bold text-slate-700 hover:text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>HEXACO PI-R</span>
                <span className="text-[9px] text-indigo-500">ⓘ</span>
              </button>
              <span className="hidden sm:inline text-slate-300">•</span>
              <button 
                onClick={() => handleOpenGlossary('attachment-theory')}
                className="text-left font-bold text-slate-700 hover:text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>ECR-R Attachment</span>
                <span className="text-[9px] text-indigo-500">ⓘ</span>
              </button>
              <span className="hidden sm:inline text-slate-300">•</span>
              <button 
                onClick={() => handleOpenGlossary('riasec-onet')}
                className="text-left font-bold text-slate-700 hover:text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>RIASEC Holland</span>
                <span className="text-[9px] text-indigo-500">ⓘ</span>
              </button>
              <span className="hidden sm:inline text-slate-300">•</span>
              <button 
                onClick={() => handleOpenGlossary('trait-eq')}
                className="text-left font-bold text-slate-700 hover:text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>Trait EQ & Grit</span>
                <span className="text-[9px] text-indigo-500">ⓘ</span>
              </button>
              <span className="hidden sm:inline text-slate-300">•</span>
              <button 
                onClick={() => handleOpenGlossary()}
                className="text-left font-bold text-indigo-600 hover:underline"
              >
                Full Science Guide →
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 brutal-border bg-[#FFE600] text-[#0F172A] font-black tracking-wider text-[11px] uppercase">
                Made by Samad
              </span>
              <span className="text-slate-500 text-[11px]">© 2026 OmniPsyche</span>
            </div>

            <div className="text-center sm:text-right text-[10px] text-slate-500 font-mono">
              RIGOROUS PSYCHOMETRIC RESEARCH • ZERO PSEUDOSCIENCE • REAL-TIME FIRESTORE SYNC
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

