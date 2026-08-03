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
  lengthMinutes: 3 | 5 | 10;
  starringMode: StarringMode;
  specificDetails?: string;
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
