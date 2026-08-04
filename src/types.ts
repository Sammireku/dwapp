export type ReadingLevel = 'early' | 'intermediate' | 'fluent';

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  gender?: string;
  traits: string[];
  favoriteCharacters: string[];
  favoriteSettings: string[];
  readingLevel: ReadingLevel;
  coveredThemes: {
    themeId: string;
    themeLabel: string;
    date: string;
  }[];
  avatarSeed: string;
  createdAt: string;
  photoUrl?: string;
  aiAnimationAvatarUrl?: string;
  isStarringInStories?: boolean;
  parentAName?: string;
  parentBName?: string;
}

export interface ChildFormEntry {
  id: string;
  name: string;
  age: number;
  gender?: string;
  photoUrl?: string;
  aiAnimationAvatarUrl?: string;
  isStarringInStories?: boolean;
}

export interface UserAccount {
  id: string;
  parentAName: string;
  parentBName?: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  numberOfKids: number;
  kids: ChildFormEntry[];
  createdAt: string;
}

export type ThemeCategory = 'fears' | 'social' | 'transitions' | 'character' | 'calming';

export interface EmotionalTheme {
  id: string;
  category: ThemeCategory;
  label: string;
  description: string;
  iconName: string;
  samplePrompts: string[];
  parentGuideTip: string;
}

export type StoryTone = 'soothing' | 'adventurous' | 'funny' | 'reflective';
export type StarringMode = 'child' | 'animal' | 'magical_guide';

export interface StoryGenerationRequest {
  childProfileId: string;
  childName: string;
  childAge: number;
  childTraits: string[];
  favoriteCharacters: string[];
  favoriteSettings: string[];
  themeId: string;
  themeLabel: string;
  customThemeText?: string;
  tone: StoryTone;
  lengthMinutes: number;
  starringMode: StarringMode;
  specificDetails?: string;
}

export interface RoutineStep {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  isCompleted: boolean;
  timeSlot?: string;
}

export interface RoutineChecklist {
  id: string;
  childId: string;
  date: string;
  steps: RoutineStep[];
  completedCount: number;
  isAllDone: boolean;
}

export interface SleepLog {
  id: string;
  childId: string;
  date: string; // YYYY-MM-DD
  bedtime: string; // HH:mm
  wakeTime: string; // HH:mm
  durationHours: number;
  qualityRating: 1 | 2 | 3 | 4 | 5;
  nightAwakenings: number;
  wokeUpMood: 'happy' | 'refreshed' | 'fussy' | 'tired';
  bedtimeRoutineCompleted: boolean;
  notes?: string;
}

export interface SleepAgreement {
  id: string;
  childId: string;
  childName: string;
  targetBedtime: string; // e.g. "8:15 PM"
  targetDurationDays: number; // e.g. 5 days consecutive
  currentStreakDays: number;
  agreedReward: string; // e.g. "Weekend trip to the zoo!"
  agreedConsequence: string; // e.g. "No iPad after dinner tomorrow"
  status: 'active' | 'met' | 'renegotiate' | 'failed';
  startDate: string;
  lastUpdated: string;
}

export interface ResourceArticle {
  id: string;
  title: string;
  category: 'sleep_science' | 'emotional_growth' | 'bedtime_anxiety' | 'toddler_routines';
  author: string;
  authorRole: string;
  readTimeMinutes: number;
  publishedDate: string;
  summary: string;
  content: string[];
  keyTakeaways: string[];
  imageUrl: string;
  tags: string[];
}

export interface CoachMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: 'create_story' | 'start_meditation' | 'start_routine';
    label: string;
  };
}

export interface PublishedStory {
  id: string;
  storyId: string;
  title: string;
  authorParentName: string;
  childAgeGroup: string;
  category: string;
  downloadsCount: number;
  likesCount: number;
  royaltyEarnedDollars: number;
  coverImageUrl: string;
  summary: string;
  price: number; // 0 for free community book, $3.99 for premium
  publishedAt: string;
}

export interface OfflineTimerSetting {
  id: string;
  childId: string;
  caregiverName: string;
  scheduledBedtime: string; // HH:mm
  storyIdToAutoplay?: string;
  timerDurationMinutes: number;
  soundEffect: 'lullaby' | 'rain' | 'singing_bowl' | 'silence';
  vibrationAlert: boolean;
  isActive: boolean;
}

export interface StoryPage {
  pageNumber: number;
  title?: string;
  text: string;
  illustrationPrompt: string;
  illustrationUrl?: string;
  parentalDiscussionPrompt?: string;
  audioCue?: string;
}

export interface Story {
  id: string;
  title: string;
  subtitle: string;
  childName: string;
  themeCategory: ThemeCategory;
  themeLabel: string;
  targetAge: number;
  readingTimeMinutes: number;
  pages: StoryPage[];
  summary: string;
  parentingLessonSummary: string;
  safetyApproved: boolean;
  safetyAdvice?: string;
  coverImageUrl?: string;
  createdAt: string;
  isFavorite: boolean;
  playCount: number;
  rating?: number;
  audioNarrations?: {
    narratorId: string;
    narratorName: string;
    audioUrl?: string; // base64 or URL
  }[];
}

export interface VoiceProfile {
  id: string;
  parentName: string;
  status: 'unregistered' | 'recording' | 'enrolled';
  consentAccepted: boolean;
  consentTimestamp?: string;
  recordingDurationSec: number;
  voiceEmbeddingId?: string;
  sampleAudioUrl?: string;
}

export interface Caregiver {
  id: string;
  name: string;
  role: 'Mom' | 'Dad' | 'Grandparent' | 'Therapist' | 'Caregiver';
  avatar: string;
  isSynced: boolean;
  lastActive: string;
}

export interface ScheduledStory {
  id: string;
  childId: string;
  storyId?: string;
  storyTitle: string;
  themeLabel: string;
  scheduledDate: string; // YYYY-MM-DD
  narratorType: 'cloned_voice' | 'luna' | 'barnaby' | 'celeste';
  parentNote?: string;
  status: 'queued' | 'delivered' | 'read';
}

export interface BookOrder {
  id: string;
  storyId: string;
  storyTitle: string;
  format: 'hardcover' | 'softcover' | 'digital_deluxe';
  coverStyle: string;
  inscription: string;
  recipientName: string;
  price: number;
  shippingAddress?: string;
  status: 'processing' | 'printed' | 'shipped';
  createdAt: string;
}
