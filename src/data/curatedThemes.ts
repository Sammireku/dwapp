import { EmotionalTheme } from '../types';

export const CURATED_THEMES: EmotionalTheme[] = [
  {
    id: 'fear_dark_alone',
    category: 'fears',
    label: 'Fear of Sleeping Alone & The Dark',
    description: 'Helps children feel safe in their bedroom and transform dark shadows into friendly, comforting guardians.',
    iconName: 'Moon',
    samplePrompts: [
      'Struggling to stay in bed without a door open',
      'Thinking shadows on the wall are monsters',
      'Waking up in the middle of the night needing reassurance'
    ],
    parentGuideTip: 'Validate their fear first before introducing a playful perspective. Avoid telling them "there is nothing there" — instead give the shadows friendly jobs.'
  },
  {
    id: 'sibling_jealousy',
    category: 'social',
    label: 'Jealousy of a New Sibling',
    description: 'Nurtures a sense of irreplaceable love and highlights the unique superpowers of being the big brother or sister.',
    iconName: 'Users',
    samplePrompts: [
      'Feeling like baby gets all the attention',
      'Having to share toys or quiet space',
      'Frustration about being older and having more expectations'
    ],
    parentGuideTip: 'Emphasize that parent love is not a single slice of pie that gets divided, but an expanding universe that grows larger with every family member.'
  },
  {
    id: 'starting_school',
    category: 'transitions',
    label: 'Starting School or New Class',
    description: 'Eases separation anxiety and sparks curiosity about making new friends and discovering new routines.',
    iconName: 'GraduationCap',
    samplePrompts: [
      'Nervous about saying goodbye at drop-off',
      'Worrying about where the bathroom is or who to sit with',
      'Shyness around new teachers'
    ],
    parentGuideTip: 'Create an anchor item or ritual (like drawing a heart on both of your wrists) that connects you while you are apart during the school day.'
  },
  {
    id: 'resilience_mistakes',
    category: 'character',
    label: 'Resilience & Learning from Mistakes',
    description: 'Teaches that making mistakes is how brains grow, turning perfectionism into adventurous trial-and-error.',
    iconName: 'Sparkles',
    samplePrompts: [
      'Crying when a drawing or tower knocks over',
      'Refusing to try something new if not immediately good at it',
      'Frustration with losing a board game'
    ],
    parentGuideTip: 'Model enthusiasm for "glorious mistakes" during dinner talks. Celebrate what was learned from a mishap rather than just the final success.'
  },
  {
    id: 'sharing_patience',
    category: 'social',
    label: 'Sharing & Taking Turns',
    description: 'Framing generosity as an exciting invitation to play together rather than a loss of ownership.',
    iconName: 'HeartHandshake',
    samplePrompts: [
      'Holding onto toys during playdates',
      'Impatience when waiting for their turn on the playground',
      'Wanting what someone else is currently playing with'
    ],
    parentGuideTip: 'Use a timer or "turn tokens" to make waiting concrete for young minds, giving them a active role in the rhythm of sharing.'
  },
  {
    id: 'grief_loss_pet',
    category: 'fears',
    label: 'Grief & Remembering a Loved One / Pet',
    description: 'Gentle, comforting guidance on honoring warm memories, holding sadness softly, and knowing love stays forever.',
    iconName: 'Heart',
    samplePrompts: [
      'Saying goodbye to a beloved pet or family member',
      'Asking where someone goes when they pass away',
      'Feeling sudden waves of sadness before bedtime'
    ],
    parentGuideTip: 'Use clear, gentle language. Reassure them that memories live inside our hearts like warm blankets whenever we miss them.'
  },
  {
    id: 'moving_new_home',
    category: 'transitions',
    label: 'Moving to a New Home or City',
    description: 'Transforms moving house from a scary loss of familiarity into an exciting treasure hunt for new cozy spots.',
    iconName: 'Home',
    samplePrompts: [
      'Missing old bedroom or neighborhood friends',
      'Feeling overwhelmed by moving boxes',
      'Uncertainty about a new neighborhood'
    ],
    parentGuideTip: 'Involve the child in choosing bedroom wall colors or setting up their nightlight first so their personal space feels grounded right away.'
  },
  {
    id: 'honesty_truthfulness',
    category: 'character',
    label: 'Honesty & Admitting Mistakes',
    description: 'Demonstrates that telling the truth brings relief, safety, and deeper trust, making honesty feel courageous.',
    iconName: 'ShieldCheck',
    samplePrompts: [
      'Hiding a broken toy or spill out of fear of getting in trouble',
      'Making up exaggerated stories when caught',
      'Feeling guilty about a small secret'
    ],
    parentGuideTip: 'Thank them immediately for telling the truth before addressing the mishap. High praise for honesty reduces the instinct to hide things.'
  },
  {
    id: 'calming_sleep_winddown',
    category: 'calming',
    label: 'Body Relaxation & Wind-Down Routine',
    description: 'A rhythmic, breathing-focused sensory story designed to quiet active minds, relax tight muscles, and ease into deep sleep.',
    iconName: 'CloudMoon',
    samplePrompts: [
      'Mind won’t stop racing after a busy day',
      'Restless body & fidgeting in bed',
      'Transitioning from screen time or high energy play'
    ],
    parentGuideTip: 'Lower the bedroom lights 30 minutes before this story, and speak in a progressively softer, slower voice as you read through the pages.'
  }
];
