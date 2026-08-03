import { Story, ChildProfile } from '../types';

export const INITIAL_CHILD_PROFILES: ChildProfile[] = [
  {
    id: 'child_zula',
    name: 'Zula',
    age: 5,
    gender: 'girl',
    traits: ['Curious', 'Loves animals', 'Big imagination', 'Sometimes nervous in dark'],
    favoriteCharacters: ['Pip the Starlight Fox', 'Captain Barnaby', 'Ayla the Owl'],
    favoriteSettings: ['Whispering Pine Forest', 'Starlight Treehouse', 'Cloud Kingdom'],
    readingLevel: 'early',
    coveredThemes: [
      { themeId: 'fear_dark_alone', themeLabel: 'Fear of Sleeping Alone & The Dark', date: '2026-08-01' },
      { themeId: 'resilience_mistakes', themeLabel: 'Resilience & Learning from Mistakes', date: '2026-07-28' },
      { themeId: 'sharing_patience', themeLabel: 'Sharing & Taking Turns', date: '2026-07-20' }
    ],
    avatarSeed: 'zula_fox',
    createdAt: '2026-07-01'
  },
  {
    id: 'child_leo',
    name: 'Leo',
    age: 7,
    gender: 'boy',
    traits: ['Energetic', 'Loves space', 'Builds LEGO towers', 'Nervous about new school'],
    favoriteCharacters: ['Comet the Rocket Dog', 'Cosmo Bear'],
    favoriteSettings: ['Nebula Island', 'The Moon Observatory'],
    readingLevel: 'intermediate',
    coveredThemes: [
      { themeId: 'starting_school', themeLabel: 'Starting School or New Class', date: '2026-07-30' },
      { themeId: 'sibling_jealousy', themeLabel: 'Jealousy of a New Sibling', date: '2026-07-15' }
    ],
    avatarSeed: 'leo_bear',
    createdAt: '2026-07-05'
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story_zula_starlight_fox',
    title: 'Zula and the Little Star That Wasn’t Scared of the Dark',
    subtitle: 'A soothing tale about finding the magic in quiet nighttime shadows',
    childName: 'Zula',
    themeCategory: 'fears',
    themeLabel: 'Fear of Sleeping Alone & The Dark',
    targetAge: 5,
    readingTimeMinutes: 5,
    summary: 'When Zula notices the shadows dance in her bedroom, Pip the Starlight Fox teaches her that shadows are just gentle bedtime blanket-helpers keeping the stars cozy.',
    parentingLessonSummary: 'This story validates nighttime uncertainty while equipping Zula with a playful mental reframing: shadows as gentle guardians rather than scary shapes.',
    safetyApproved: true,
    safetyAdvice: 'Safe, warm, age-appropriate content tailored for bedtime calm.',
    isFavorite: true,
    playCount: 4,
    createdAt: '2026-08-01T20:15:00Z',
    pages: [
      {
        pageNumber: 1,
        title: 'The Whispering Shadows',
        text: 'The moon shone like a warm silver coin outside Zula’s window. Inside her bedroom, the cozy blankets were tucked around her chin, but the shadows on the wall seemed to move whenever the oak tree swayed in the night breeze.',
        illustrationPrompt: 'A cozy bedroom at bedtime with a 5-year-old girl in bed, warm moonlight through the window, and a tiny glowing orange fox named Pip sitting on the windowsill, soft watercolor style.',
        parentalDiscussionPrompt: 'Ask Zula: "When you look at shadows at bedtime, what do you think they are doing?"'
      },
      {
        pageNumber: 2,
        title: 'Pip’s Secret Visit',
        text: 'Suddenly, a soft rustle sounded from the window sill. Out popped Pip, the tiny Starlight Fox, with glowing amber fur and a tail that sparkled like soft twilight dust. "Good evening, Zula!" whispered Pip with a tiny yawn.',
        illustrationPrompt: 'Pip the Starlight Fox with sparkling orange fur floating down gently onto the bed next to Zula, soft pastel tones, dreamy bedtime atmosphere.',
        parentalDiscussionPrompt: 'Encourage Zula to take a slow deep belly breath in sync with Pip’s cozy yawn.'
      },
      {
        pageNumber: 3,
        title: 'The Shadow Dance Party',
        text: '"Did you know?" Pip giggled softly, "Shadows aren\'t spooky at all! They are just the bedroom’s night-guards resting after a long day of catching sunshine. Watch this!" Pip waved his tail, and a shadow on the wall stretched into a happy bunny hopping across the wall.',
        illustrationPrompt: 'Pip using his sparkling tail to make a shadow rabbit on the wall, whimsical fairy tale illustration, warm ambient starlight.',
        parentalDiscussionPrompt: 'Try making a simple hand-shadow bunny with Zula using the nightlight.'
      },
      {
        pageNumber: 4,
        title: 'The Starlight Shield',
        text: 'Pip tapped his little paw against Zula’s nightlight. A wave of warm golden light brushed across her blanket. "Whenever you close your eyes, Zula, remember that your room is filled with love, and your bed is the safest boat sailing gently into Dreamland."',
        illustrationPrompt: 'Zula smiling happily under her blanket surrounded by a gentle dome of soft golden starlight, peaceful night sky with sleeping stars.',
        parentalDiscussionPrompt: 'Ask Zula to imagine her favorite cozy boat drifting peacefully across a calm starlight lake.'
      },
      {
        pageNumber: 5,
        title: 'Into Dreamland',
        text: 'Zula let out a long, peaceful sigh. Her eyelids felt pleasantly heavy. Pip curled up at the foot of her bed like a warm glowing mitten. "Sleep well, brave Zula," he whispered. And with a smile, Zula drifted gently off to sleep.',
        illustrationPrompt: 'Zula sleeping peacefully with a sweet smile, Pip curled at the end of the bed glowing softly, calm dark blue night full of sleeping clouds.',
        parentalDiscussionPrompt: 'Whisper softly: "I am right here, you are safe, goodnight my sweet Zula."'
      }
    ]
  },
  {
    id: 'story_leo_big_sibling',
    title: 'Leo and the Captain’s Big Sibling Mission',
    subtitle: 'Discovering how much love expands when a new explorer joins the crew',
    childName: 'Leo',
    themeCategory: 'social',
    themeLabel: 'Jealousy of a New Sibling',
    targetAge: 7,
    readingTimeMinutes: 5,
    summary: 'Leo feels like the new baby astronaut takes up all the rocket ship space, until Cosmo Bear shows him that a First Officer’s heart has infinite galaxy capacity.',
    parentingLessonSummary: 'Reinforces Leo’s vital role in the family unit while reassuring him that parental devotion is boundless.',
    safetyApproved: true,
    safetyAdvice: 'Encourages empathy and positive sibling role-modeling.',
    isFavorite: false,
    playCount: 2,
    createdAt: '2026-07-28T19:30:00Z',
    pages: [
      {
        pageNumber: 1,
        title: 'The crowded rocket ship',
        text: 'Leo sat on his bedroom rug looking at his space station. Ever since baby Sam arrived, the living room was filled with tiny socks and soft blankets. Leo wondered if there was still enough room on the space mission for Captain Leo.',
        illustrationPrompt: 'A 7-year-old boy in a cozy space-themed bedroom looking at his toy rocket ship, soft bedtime lighting.',
        parentalDiscussionPrompt: 'Ask Leo: "How does it feel when things change at home?"'
      },
      {
        pageNumber: 2,
        title: 'Cosmo Bear’s Galaxy Map',
        text: 'Cosmo Bear floating down on a tiny comet, opening a golden star map. "Captain Leo, love in a family isn\'t like a single slice of pizza. It\'s like the universe — every time a new star is born, the universe gets bigger and brighter!"',
        illustrationPrompt: 'Cosmo Bear pointing to a glowing galaxy map showing expanding stars, vibrant bedtime illustration.',
        parentalDiscussionPrompt: 'Remind Leo how special his heart is and how much he is cherished.'
      },
      {
        pageNumber: 3,
        title: 'The First Officer’s Superpower',
        text: 'Leo smiled as he thought about how he showed baby Sam how to make funny rocket noises. Cosmo Bear saluted: "Only a true First Officer knows the secret constellation path to Dreamland!"',
        illustrationPrompt: 'Leo wearing a paper astronaut helmet smiling with Cosmo Bear, friendly warm illustration.',
        parentalDiscussionPrompt: 'Ask Leo what superpower he loves sharing with his family.'
      }
    ]
  }
];
