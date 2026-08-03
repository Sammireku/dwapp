import React, { useState } from 'react';
import { ShoppingBag, BookOpen, Sparkles, Star, CreditCard } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { StoryGeneratorWizard } from './components/StoryGeneratorWizard';
import { StoryLibraryView } from './components/StoryLibraryView';
import { ParentReadView } from './components/ParentReadView';
import { AudiobookPlayerView } from './components/AudiobookPlayerView';
import { VoiceCloningModal } from './components/VoiceCloningModal';
import { BookMarketplaceModal } from './components/BookMarketplaceModal';
import { ParentDashboard } from './components/ParentDashboard';
import { PrivacySafetyHub } from './components/PrivacySafetyHub';
import { ChildProfileModal } from './components/ChildProfileModal';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';

import { ChildProfile, Story, VoiceProfile, BookOrder, UserAccount } from './types';
import { INITIAL_CHILD_PROFILES, INITIAL_STORIES } from './data/sampleStories';

export default function App() {
  const [isLandingPage, setIsLandingPage] = useState(false);
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signup');

  const [activeTab, setActiveTab] = useState<
    'create' | 'library' | 'read' | 'audiobook' | 'voice_clone' | 'dashboard' | 'marketplace' | 'privacy'
  >('create');

  // Child Profiles State
  const [childProfiles, setChildProfiles] = useState<ChildProfile[]>(INITIAL_CHILD_PROFILES);
  const [activeChild, setActiveChild] = useState<ChildProfile>(INITIAL_CHILD_PROFILES[0]);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);

  // Stories State
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [selectedStory, setSelectedStory] = useState<Story>(INITIAL_STORIES[0]);

  // Voice Profile State
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile>({
    id: 'voice_milou_1',
    parentName: 'Mom / Dad',
    status: 'unregistered',
    consentAccepted: false,
    recordingDurationSec: 0,
  });

  // Modal States
  const [isVoiceCloneOpen, setIsVoiceCloneOpen] = useState(false);
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);

  // Auth / Sign Up Login handler
  const handleLoginSuccess = (user: UserAccount) => {
    setUserAccount(user);
    setIsLandingPage(false);

    // If user has kids in registration form, populate child profiles
    if (user.kids && user.kids.length > 0) {
      const newProfiles: ChildProfile[] = user.kids.map((k, idx) => ({
        id: k.id || `child_auth_${idx}_${Date.now()}`,
        name: k.name,
        age: k.age || 5,
        gender: k.gender || 'girl',
        traits: ['Curious', 'Imaginative', 'Kind'],
        favoriteCharacters: ['Pip the Starlight Fox'],
        favoriteSettings: ['Pine Forest', 'Magical Castle'],
        readingLevel: k.age <= 5 ? 'early' : k.age <= 8 ? 'intermediate' : 'fluent',
        coveredThemes: [],
        avatarSeed: k.name.toLowerCase(),
        createdAt: new Date().toISOString(),
        photoUrl: k.photoUrl,
        aiAnimationAvatarUrl: k.aiAnimationAvatarUrl,
        isStarringInStories: k.isStarringInStories,
        parentAName: user.parentAName,
        parentBName: user.parentBName,
      }));

      setChildProfiles(newProfiles);
      setActiveChild(newProfiles[0]);
    }
  };

  // Handlers
  const handleStoryGenerated = (newStory: Story) => {
    setStories((prev) => [newStory, ...prev]);
    setSelectedStory(newStory);
    
    // Add theme to child's covered themes
    const updatedChild: ChildProfile = {
      ...activeChild,
      coveredThemes: [
        { themeId: newStory.themeCategory, themeLabel: newStory.themeLabel, date: new Date().toISOString().split('T')[0] },
        ...activeChild.coveredThemes,
      ]
    };
    setActiveChild(updatedChild);
    setChildProfiles((prev) => prev.map((c) => (c.id === updatedChild.id ? updatedChild : c)));

    setActiveTab('read');
  };

  const handleToggleFavorite = (storyId: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, isFavorite: !s.isFavorite } : s))
    );
  };

  const handleDeleteStory = (storyId: string) => {
    setStories((prev) => prev.filter((s) => s.id !== storyId));
  };

  const handleSaveChildProfile = (profile: ChildProfile) => {
    setChildProfiles((prev) => {
      const exists = prev.some((c) => c.id === profile.id);
      if (exists) return prev.map((c) => (c.id === profile.id ? profile : c));
      return [...prev, profile];
    });
    setActiveChild(profile);
  };

  const handleSaveVoiceProfile = (profile: VoiceProfile) => {
    setVoiceProfile(profile);
  };

  const handleDeleteVoiceProfile = () => {
    setVoiceProfile({
      id: `voice_${Date.now()}`,
      parentName: userAccount?.parentAName || 'Mom / Dad',
      status: 'unregistered',
      consentAccepted: false,
      recordingDurationSec: 0,
    });
  };

  const handlePurgeAllData = () => {
    setStories([]);
    handleDeleteVoiceProfile();
  };

  if (isLandingPage) {
    return (
      <>
        <LandingPage
          onOpenSignUp={() => {
            setAuthInitialMode('signup');
            setIsAuthModalOpen(true);
          }}
          onOpenSignIn={() => {
            setAuthInitialMode('signin');
            setIsAuthModalOpen(true);
          }}
          onGuestExplore={() => setIsLandingPage(false)}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          initialMode={authInitialMode}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#070514] text-indigo-50 font-sans selection:bg-amber-400 selection:text-slate-950 relative overflow-hidden">
      {/* Cosmic background ambient blurs */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-indigo-900/20 rounded-full blur-[128px] pointer-events-none z-0" />
      <div className="fixed top-1/3 -right-40 w-96 h-96 bg-purple-900/20 rounded-full blur-[128px] pointer-events-none z-0" />
      <div className="fixed -bottom-40 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px] pointer-events-none z-0" />

      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        childProfiles={childProfiles}
        activeChild={activeChild}
        setActiveChild={setActiveChild}
        onOpenAddChild={() => setIsAddChildOpen(true)}
        hasVoiceProfile={voiceProfile.status === 'enrolled'}
        userAccount={userAccount}
        onOpenAuth={() => {
          setAuthInitialMode('signup');
          setIsAuthModalOpen(true);
        }}
        onGoToLandingPage={() => setIsLandingPage(true)}
      />

      {/* Main Content Area */}
      <main className="pb-12 animate-fade-in relative z-10">
        {activeTab === 'create' && (
          <StoryGeneratorWizard
            activeChild={activeChild}
            allChildren={childProfiles}
            onStoryGenerated={handleStoryGenerated}
            onOpenReadView={(s) => {
              setSelectedStory(s);
              setActiveTab('read');
            }}
            onOpenAudiobook={(s) => {
              setSelectedStory(s);
              setActiveTab('audiobook');
            }}
          />
        )}

        {activeTab === 'library' && (
          <StoryLibraryView
            stories={stories}
            activeChild={activeChild}
            onOpenReadView={(s) => {
              setSelectedStory(s);
              setActiveTab('read');
            }}
            onOpenAudiobook={(s) => {
              setSelectedStory(s);
              setActiveTab('audiobook');
            }}
            onOpenMarketplace={(s) => {
              setSelectedStory(s);
              setIsMarketplaceOpen(true);
            }}
            onOpenStoryWizard={() => setActiveTab('create')}
            onToggleFavorite={handleToggleFavorite}
            onDeleteStory={handleDeleteStory}
          />
        )}

        {activeTab === 'read' && selectedStory && (
          <ParentReadView
            story={selectedStory}
            onBack={() => setActiveTab('library')}
            onOpenAudiobook={(s) => {
              setSelectedStory(s);
              setActiveTab('audiobook');
            }}
            onOpenMarketplace={(s) => {
              setSelectedStory(s);
              setIsMarketplaceOpen(true);
            }}
          />
        )}

        {activeTab === 'audiobook' && selectedStory && (
          <AudiobookPlayerView
            story={selectedStory}
            voiceProfile={voiceProfile}
            onBack={() => setActiveTab('library')}
            onOpenVoiceClone={() => setIsVoiceCloneOpen(true)}
          />
        )}

        {activeTab === 'voice_clone' && (
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4">
              <h2 className="font-serif text-2xl font-bold text-slate-100">
                Parent Voice Cloning Studio
              </h2>
              <p className="text-slate-300 text-xs max-w-md mx-auto">
                Record roughly 1 minute of a bedtime passage to narrate audiobooks for {activeChild.name} when traveling or working late.
              </p>
              <button
                onClick={() => setIsVoiceCloneOpen(true)}
                className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs shadow-lg"
              >
                {voiceProfile.status === 'enrolled' ? 'Manage Parent Voice Profile' : 'Start Voice Recording (1 min)'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <ParentDashboard
            activeChild={activeChild}
            stories={stories}
            onOpenStoryWizard={() => setActiveTab('create')}
            onOpenReadView={(s) => {
              setSelectedStory(s);
              setActiveTab('read');
            }}
          />
        )}

        {activeTab === 'marketplace' && (
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
            {/* Header Banner */}
            <div className="bg-[#0c0926]/90 border border-white/10 rounded-3xl p-8 text-center space-y-4 shadow-xl backdrop-blur-md relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400/20 to-purple-500/20 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-300 shadow-inner">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-200 via-purple-200 to-indigo-100 bg-clip-text text-transparent">
                Print-on-Demand Illustrated Book Marketplace
              </h2>
              <p className="text-indigo-200/80 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
                Transform personalized bedtime stories into heirloom-quality hardcovers and softcovers with full-bleed AI artwork and metallic gold leaf inscriptions.
              </p>
              <div className="flex items-center justify-center gap-6 pt-2 text-xs font-semibold text-amber-300/90">
                <span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-amber-300" /> Archival Paper</span>
                <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Full Color Art</span>
                <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> 3-5 Day Delivery</span>
              </div>
            </div>

            {/* Select a Story to Order */}
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-indigo-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-300" />
                <span>Select a Story to Print</span>
              </h3>

              {stories.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center space-y-3">
                  <p className="text-slate-300 text-xs">No stories generated yet. Create a story first to order a printed copy!</p>
                  <button
                    onClick={() => setActiveTab('create')}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300"
                  >
                    Create a Bedtime Story
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stories.map((story) => (
                    <div
                      key={story.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                        selectedStory?.id === story.id
                          ? 'bg-amber-400/10 border-amber-400/50 shadow-lg shadow-amber-500/5'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-amber-300/80 font-medium">
                          <span>For {story.childName}</span>
                          <span className="capitalize px-2 py-0.5 rounded-md bg-white/5 border border-white/10">{story.emotionalGoal}</span>
                        </div>
                        <h4 className="font-serif text-base font-bold text-slate-100 line-clamp-1">{story.title}</h4>
                        <p className="text-xs text-indigo-200/70 line-clamp-2 leading-relaxed">{story.summary}</p>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-amber-300">From $14.99</span>
                        <button
                          onClick={() => {
                            setSelectedStory(story);
                            setIsMarketplaceOpen(true);
                          }}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs hover:from-amber-300 hover:to-amber-400 transition-all flex items-center gap-1.5 shadow-md"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Customize & Order</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <PrivacySafetyHub
            voiceProfile={voiceProfile}
            onDeleteVoiceProfile={handleDeleteVoiceProfile}
            onPurgeAllData={handlePurgeAllData}
          />
        )}
      </main>

      {/* Modals */}
      <ChildProfileModal
        isOpen={isAddChildOpen}
        onClose={() => setIsAddChildOpen(false)}
        onSave={handleSaveChildProfile}
      />

      <VoiceCloningModal
        isOpen={isVoiceCloneOpen}
        onClose={() => setIsVoiceCloneOpen(false)}
        voiceProfile={voiceProfile}
        onSaveVoiceProfile={handleSaveVoiceProfile}
        onDeleteVoiceProfile={handleDeleteVoiceProfile}
        activeChild={activeChild}
      />

      {isMarketplaceOpen && selectedStory && (
        <BookMarketplaceModal
          story={selectedStory}
          onClose={() => setIsMarketplaceOpen(false)}
          onOrderComplete={(order) => {
            setIsMarketplaceOpen(false);
          }}
        />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authInitialMode}
      />
    </div>
  );
}
