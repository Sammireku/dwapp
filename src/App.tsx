import React, { useState, useEffect } from 'react';
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

import { BedtimeChecklistReminders } from './components/BedtimeChecklistReminders';
import { SleepTrackerRewards } from './components/SleepTrackerRewards';
import { SleepCoachAI } from './components/SleepCoachAI';
import { SleepResourceBlog } from './components/SleepResourceBlog';
import { CreatorRoyaltiesModal } from './components/CreatorRoyaltiesModal';

import { ChildProfile, Story, VoiceProfile, BookOrder, UserAccount } from './types';
import { INITIAL_CHILD_PROFILES, INITIAL_STORIES } from './data/sampleStories';
import { auth, db, handleFirestoreError, OperationType } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';

export default function App() {
  const [isLandingPage, setIsLandingPage] = useState(true);
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signup');

  const [activeTab, setActiveTab] = useState<string>('create');

  // Child Profiles State
  const [childProfiles, setChildProfiles] = useState<ChildProfile[]>(INITIAL_CHILD_PROFILES);
  const [activeChild, setActiveChild] = useState<ChildProfile>(INITIAL_CHILD_PROFILES[0]);
  const [isAddChildOpen, setIsAddChildOpen] = useState(false);
  const [selectedChildForEdit, setSelectedChildForEdit] = useState<ChildProfile | null>(null);

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

  // Listen to Firebase Auth state change and restore session & Firestore data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // 1. Fetch user profile
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserAccount;
            setUserAccount(userData);
            setIsLandingPage(false);

            if (userData.kids && userData.kids.length > 0) {
              const loadedKids: ChildProfile[] = userData.kids.map((k, idx) => ({
                id: k.id || `child_${idx}`,
                name: k.name || 'Hero',
                age: k.age || 5,
                gender: k.gender || 'girl',
                traits: ['Curious', 'Kind'],
                favoriteCharacters: ['Pip the Starlight Fox'],
                favoriteSettings: ['Pine Forest'],
                readingLevel: (k.age || 5) <= 5 ? 'early' : 'intermediate',
                coveredThemes: [],
                avatarSeed: (k.name || 'hero').toLowerCase(),
                createdAt: new Date().toISOString(),
                photoUrl: k.photoUrl,
                aiAnimationAvatarUrl: k.aiAnimationAvatarUrl,
                isStarringInStories: k.isStarringInStories,
                parentAName: userData.parentAName,
                parentBName: userData.parentBName,
              }));
              setChildProfiles(loadedKids);
              if (loadedKids[0]) setActiveChild(loadedKids[0]);
            }
          }

          // 2. Fetch saved stories from Firestore subcollection /users/{uid}/stories
          try {
            const storiesSnap = await getDocs(collection(db, 'users', firebaseUser.uid, 'stories'));
            if (!storiesSnap.empty) {
              const fetchedStories: Story[] = [];
              storiesSnap.forEach((docSnap) => {
                fetchedStories.push(docSnap.data() as Story);
              });
              if (fetchedStories.length > 0) {
                setStories(fetchedStories);
                setSelectedStory(fetchedStories[0]);
              }
            }
          } catch (e) {
            console.warn('Firestore stories fetch note:', e);
          }

          // 3. Fetch Voice Profile from Firestore
          try {
            const voiceDoc = await getDoc(doc(db, 'users', firebaseUser.uid, 'voiceProfiles', 'primary'));
            if (voiceDoc.exists()) {
              setVoiceProfile(voiceDoc.data() as VoiceProfile);
            }
          } catch (e) {
            console.warn('Firestore voice profile fetch note:', e);
          }
        } catch (err) {
          console.error('Error loading Firestore data on auth change:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Auth / Sign Up Login handler
  const handleLoginSuccess = (user: UserAccount) => {
    setUserAccount(user);
    setIsLandingPage(false);

    // Populate child profiles
    if (user.kids && user.kids.length > 0) {
      const newProfiles: ChildProfile[] = user.kids.map((k, idx) => ({
        id: k.id || `child_auth_${idx}_${Date.now()}`,
        name: k.name || 'Hero',
        age: k.age || 5,
        gender: k.gender || 'girl',
        traits: ['Curious', 'Imaginative', 'Kind'],
        favoriteCharacters: ['Pip the Starlight Fox'],
        favoriteSettings: ['Pine Forest', 'Magical Castle'],
        readingLevel: (k.age || 5) <= 5 ? 'early' : (k.age || 5) <= 8 ? 'intermediate' : 'fluent',
        coveredThemes: [],
        avatarSeed: (k.name || 'hero').toLowerCase(),
        createdAt: new Date().toISOString(),
        photoUrl: k.photoUrl,
        aiAnimationAvatarUrl: k.aiAnimationAvatarUrl,
        isStarringInStories: k.isStarringInStories,
        parentAName: user.parentAName,
        parentBName: user.parentBName,
      }));

      setChildProfiles(newProfiles);
      if (newProfiles[0]) setActiveChild(newProfiles[0]);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUserAccount(null);
    setIsLandingPage(true);
  };

  // Handlers
  const handleStoryGenerated = async (newStory: Story) => {
    const storyWithUid = {
      ...newStory,
      userId: userAccount?.id || auth.currentUser?.uid || 'demo_user',
    };

    setStories((prev) => [storyWithUid, ...prev]);
    setSelectedStory(storyWithUid);
    
    // Add theme to child's covered themes
    const updatedChild: ChildProfile = {
      ...activeChild,
      coveredThemes: [
        { themeId: storyWithUid.themeCategory, themeLabel: storyWithUid.themeLabel, date: new Date().toISOString().split('T')[0] },
        ...activeChild.coveredThemes,
      ]
    };
    setActiveChild(updatedChild);
    setChildProfiles((prev) => prev.map((c) => (c.id === updatedChild.id ? updatedChild : c)));

    // Save story to Firestore if user is authenticated
    const uid = auth.currentUser?.uid || userAccount?.id;
    if (uid) {
      try {
        await setDoc(doc(db, 'users', uid, 'stories', storyWithUid.id), storyWithUid);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${uid}/stories/${storyWithUid.id}`);
      }
    }

    setActiveTab('read');
  };

  const handleToggleFavorite = async (storyId: string) => {
    setStories((prev) =>
      prev.map((s) => {
        if (s.id === storyId) {
          const updated = { ...s, isFavorite: !s.isFavorite };
          const uid = auth.currentUser?.uid || userAccount?.id;
          if (uid) {
            setDoc(doc(db, 'users', uid, 'stories', storyId), updated).catch(err => {
              handleFirestoreError(err, OperationType.WRITE, `users/${uid}/stories/${storyId}`);
            });
          }
          return updated;
        }
        return s;
      })
    );
  };

  const handleDeleteStory = async (storyId: string) => {
    setStories((prev) => prev.filter((s) => s.id !== storyId));
    const uid = auth.currentUser?.uid || userAccount?.id;
    if (uid) {
      try {
        await deleteDoc(doc(db, 'users', uid, 'stories', storyId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${uid}/stories/${storyId}`);
      }
    }
  };

  const handleSaveChildProfile = async (profile: ChildProfile) => {
    setChildProfiles((prev) => {
      const exists = prev.some((c) => c.id === profile.id);
      if (exists) return prev.map((c) => (c.id === profile.id ? profile : c));
      return [...prev, profile];
    });
    setActiveChild(profile);

    const uid = auth.currentUser?.uid || userAccount?.id;
    if (uid && userAccount) {
      const updatedAccount: UserAccount = {
        ...userAccount,
        kids: childProfiles.map(k => ({
          id: k.id,
          name: k.name,
          age: k.age,
          gender: k.gender,
          photoUrl: k.photoUrl,
          aiAnimationAvatarUrl: k.aiAnimationAvatarUrl,
          isStarringInStories: k.isStarringInStories,
        })),
      };
      try {
        await setDoc(doc(db, 'users', uid), updatedAccount);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
      }
    }
  };

  const handleSaveVoiceProfile = async (profile: VoiceProfile) => {
    const profileWithUid = {
      ...profile,
      userId: userAccount?.id || auth.currentUser?.uid || 'demo_user',
    };
    setVoiceProfile(profileWithUid);

    const uid = auth.currentUser?.uid || userAccount?.id;
    if (uid) {
      try {
        await setDoc(doc(db, 'users', uid, 'voiceProfiles', 'primary'), profileWithUid);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${uid}/voiceProfiles/primary`);
      }
    }
  };

  const handleDeleteVoiceProfile = async () => {
    const blankProfile: VoiceProfile = {
      id: `voice_${Date.now()}`,
      parentName: userAccount?.parentAName || 'Mom / Dad',
      status: 'unregistered',
      consentAccepted: false,
      recordingDurationSec: 0,
    };
    setVoiceProfile(blankProfile);

    const uid = auth.currentUser?.uid || userAccount?.id;
    if (uid) {
      try {
        await deleteDoc(doc(db, 'users', uid, 'voiceProfiles', 'primary'));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${uid}/voiceProfiles/primary`);
      }
    }
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

  const safeActiveChild = activeChild || childProfiles[0] || INITIAL_CHILD_PROFILES[0];

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
        activeChild={safeActiveChild}
        setActiveChild={setActiveChild}
        onOpenAddChild={() => {
          setSelectedChildForEdit(null);
          setIsAddChildOpen(true);
        }}
        onEditChild={(child) => {
          setSelectedChildForEdit(child);
          setIsAddChildOpen(true);
        }}
        hasVoiceProfile={voiceProfile.status === 'enrolled'}
        userAccount={userAccount}
        onOpenAuth={() => {
          setAuthInitialMode('signup');
          setIsAuthModalOpen(true);
        }}
        onGoToLandingPage={() => setIsLandingPage(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="pb-12 animate-fade-in relative z-10">
        {activeTab === 'create' && (
          <StoryGeneratorWizard
            activeChild={safeActiveChild}
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
            activeChild={safeActiveChild}

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

        {activeTab === 'routine' && (
          <BedtimeChecklistReminders
            activeChild={activeChild}
            onOpenStoryWizard={() => setActiveTab('create')}
          />
        )}

        {activeTab === 'tracker' && (
          <SleepTrackerRewards
            activeChild={activeChild}
          />
        )}

        {activeTab === 'coach' && (
          <SleepCoachAI
            activeChild={activeChild}
            onOpenStoryWizardWithTheme={(theme, detail) => {
              setActiveTab('create');
            }}
          />
        )}

        {activeTab === 'blog' && (
          <SleepResourceBlog />
        )}

        {activeTab === 'royalties' && (
          <CreatorRoyaltiesModal stories={stories} />
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
        onClose={() => {
          setIsAddChildOpen(false);
          setSelectedChildForEdit(null);
        }}
        existingChild={selectedChildForEdit || safeActiveChild}
        onSave={handleSaveChildProfile}
        onSelectThemeForStory={(theme) => {
          setActiveTab('create');
        }}
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
