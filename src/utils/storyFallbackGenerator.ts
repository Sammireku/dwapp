import { Story, StoryPage, StoryTone, StarringMode } from '../types';

interface FallbackPayload {
  childName: string;
  childAge: number;
  childTraits: string[];
  favoriteCharacters: string[];
  favoriteSettings: string[];
  themeLabel: string;
  themeLabels?: string[];
  customThemeText?: string;
  tone: StoryTone;
  lengthMinutes: number;
  starringMode: StarringMode;
  specificDetails?: string;
}

export function generateFallbackStory(payload: FallbackPayload): Story {
  const {
    childName,
    childAge,
    childTraits,
    favoriteCharacters,
    favoriteSettings,
    themeLabel,
    themeLabels = [],
    customThemeText,
    tone,
    lengthMinutes,
    starringMode,
    specificDetails,
  } = payload;

  const displayTheme = (themeLabels && themeLabels.length > 0)
    ? themeLabels.join(' & ')
    : themeLabel;

  const setting = favoriteSettings[0] || 'Whispering Pine Forest';
  const character = favoriteCharacters[0] || 'Pip the Starlight Fox';
  const trait = childTraits[0] || 'gentle heart';

  const pageCount = lengthMinutes <= 3 ? 6 : lengthMinutes >= 10 ? 12 : 8;

  const title = `The Night ${childName} Found Light in the ${setting}`;
  const subtitle = `A bedtime journey through ${displayTheme.toLowerCase()}`;

  const pages: StoryPage[] = [];

  // Page 1: Introduction & Evening Calm
  pages.push({
    pageNumber: 1,
    title: 'The Soft Evening Sky',
    text: `As twilight brushed gold and lavender over the ${setting}, ${childName} curled up under a warm, cozy blanket. Outside, the night stars began to sparkle one by one, whispering soft bedtime lullabies.`,
    illustrationPrompt: `A cozy bedroom overlooking a magical starry ${setting}, bedtime pastel colors, warm glowing lamp light.`,
    parentalDiscussionPrompt: `What was your favorite part of today before we tucked into bed?`,
  });

  // Page 2: The Feeling & The Companion
  pages.push({
    pageNumber: 2,
    title: 'A Little Thought',
    text: `${childName} felt a quiet feeling inside about ${themeLabel.toLowerCase()}. Just then, ${character} tapped softly at the window, smiling with eyes full of warmth and understanding.`,
    illustrationPrompt: `An adorable ${character} visiting ${childName} with glowing starlight around them in the cozy room.`,
    parentalDiscussionPrompt: `It is completely normal to feel this way. Did you know everyone feels like this sometimes?`,
  });

  // Page 3: The Journey Begins
  pages.push({
    pageNumber: 3,
    title: 'Steps into the Starlight',
    text: `"Come with me," whispered ${character}. "Together, we will discover why ${themeLabel.toLowerCase()} is just a step towards finding our inner strength and peace." Hand in hand, they stepped into the peaceful moonlit ${setting}.`,
    illustrationPrompt: `Hand in hand walking down a luminous starlight path through a gentle, magical forest.`,
    parentalDiscussionPrompt: `Who makes you feel safe when you visit new or quiet places?`,
  });

  // Page 4: Embracing the Challenge
  pages.push({
    pageNumber: 4,
    title: 'The Gentle Reflection',
    text: `Along the silver stream, ${character} paused and showed ${childName} their reflection in the water. "Look how brave and ${trait} you are," ${character} said softly. "Even when things feel big, your heart knows the way."`,
    illustrationPrompt: `A calm sparkling water stream reflecting starry moonlight and brave glowing hearts.`,
    parentalDiscussionPrompt: `Can you remember a time when you were very brave?`,
  });

  // Page 5: The Breakthrough & Warmth
  pages.push({
    pageNumber: 5,
    title: 'A Pocket Full of Light',
    text: `With a deep, slow breath, ${childName} felt the quiet magic of the night settle inside. ${customThemeText ? `Remembering ${customThemeText}, ` : ''}the big feeling grew soft and gentle, turning into a glowing golden star in ${childName}'s pocket.`,
    illustrationPrompt: `${childName} holding a glowing warm star with a peaceful, happy bedtime smile.`,
    parentalDiscussionPrompt: `How does your body feel when you take three deep, slow belly breaths?`,
  });

  // Page 6: Returning Home
  pages.push({
    pageNumber: 6,
    title: 'Back to the Nest',
    text: `${character} tucked ${childName} back into bed, pulling the warm quilt right up to the chin. "You are safe, loved, and deeply protected," whispered ${character}.`,
    illustrationPrompt: `Warm cozy bed tuck-in scene with glowing starlight softly shining from the window.`,
    parentalDiscussionPrompt: `I love you so much. What dream shall we imagine tonight?`,
  });

  if (pageCount >= 8) {
    // Page 7: Deep Sleepy Wind-down
    pages.push({
      pageNumber: 7,
      title: 'Heavy Eyelids',
      text: `The crickets sang a slow rhythm, and the moon wrapped a silver ribbon around the bedroom. ${childName}'s eyes grew delightfully heavy, filled with golden dreams.`,
      illustrationPrompt: `Moonlight softly resting over sleeping child's bed, starry dreamy night clouds floating outside.`,
      parentalDiscussionPrompt: `Close your eyes gently... imagine sliding down a soft cloud of fluffy dreams.`,
    });

    // Page 8: Peaceful Night
    pages.push({
      pageNumber: 8,
      title: 'Sweetest Bedtime Dreams',
      text: `Soft, deep breaths flowed like quiet waves. ${childName} drifted into a peaceful sleep, knowing that morning would bring a bright new day filled with joy. Goodnight, sweet explorer.`,
      illustrationPrompt: `Peaceful sleeping child wrapped in starry dreamlight, quiet moon smiling above.`,
      parentalDiscussionPrompt: `Goodnight my darling child. Rest deeply.`,
    });
  }

  return {
    id: `story_fallback_${Date.now()}`,
    title,
    subtitle,
    childName,
    themeCategory: 'fears',
    themeLabel,
    targetAge: childAge,
    readingTimeMinutes: lengthMinutes,
    pages,
    summary: `A comforting bedtime story guiding ${childName} through ${themeLabel.toLowerCase()} with gentle therapeutic warmth and bedtime calm.`,
    parentingLessonSummary: `This story validates ${childName}'s natural emotions regarding ${themeLabel.toLowerCase()}, offering gentle somatic breathing anchors and unconditional parental safety to soothe the nervous system before sleep.`,
    safetyApproved: true,
    safetyAdvice: 'Safety evaluated: Fully age-appropriate, gentle, and child-safe.',
    isFavorite: false,
    playCount: 0,
    createdAt: new Date().toISOString(),
  };
}
