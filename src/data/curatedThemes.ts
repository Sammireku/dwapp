import { EmotionalTheme } from '../types';

export interface ThemeCategoryGroup {
  id: string;
  name: string;
  description: string;
}

export const THEME_CATEGORY_GROUPS: ThemeCategoryGroup[] = [
  {
    id: 'featured',
    name: 'Featured & Core Bedtime Themes',
    description: 'Essential themes frequently requested by parents for night-time comfort.'
  },
  {
    id: 'emotional_social',
    name: 'Emotional & Social',
    description: 'Helping children navigate relationships, feelings, and social dynamics.'
  },
  {
    id: 'fears_worries',
    name: 'Fears & Worries',
    description: 'Transforming bedtime anxieties, shadows, and bad dreams into peaceful safety.'
  },
  {
    id: 'confidence_growth',
    name: 'Confidence & Growth',
    description: 'Building inner courage, resilience, self-worth, and independence.'
  },
  {
    id: 'change_transitions',
    name: 'Change & Transitions',
    description: 'Gentle support during life changes, new milestones, and family shifts.'
  },
  {
    id: 'everyday',
    name: 'Everyday Bedtime Themes',
    description: 'Daily wind-down habits, gratitude, mindfulness, and boundaries.'
  }
];

export const CURATED_THEMES: EmotionalTheme[] = [
  // --- Category: Featured ---
  {
    id: 'fear_dark_shadows',
    category: 'featured',
    categoryGroupLabel: 'Featured & Core Bedtime Themes',
    label: 'Fear of dark & shadows',
    description: 'Helps children reframe room shadows into friendly night guards and discover comfort in the quiet dark.',
    iconName: 'Moon',
    samplePrompts: ['Worried about shapes on the wall', 'Needs the nightlight left on full brightness'],
    parentGuideTip: 'Acknowledge their creative imagination first, then invite them to give shadow shapes gentle, silly names.'
  },
  {
    id: 'bullying_self_worth',
    category: 'featured',
    categoryGroupLabel: 'Featured & Core Bedtime Themes',
    label: 'Bullying & self-worth',
    description: 'Reminds children of their inherent light, building a unbreakable shield of self-kindness against harsh words.',
    iconName: 'Shield',
    samplePrompts: ['Someone said something mean at school', 'Feeling small or insecure about who they are'],
    parentGuideTip: 'Remind them that unkind words are like heavy rocks someone tried to hand them — they do not have to carry them.'
  },
  {
    id: 'sibling_jealousy_sharing',
    category: 'featured',
    categoryGroupLabel: 'Featured & Core Bedtime Themes',
    label: 'Sibling jealousy & sharing',
    description: 'Shows that parental love expands infinitely for every child, celebrating their special role in the family.',
    iconName: 'Users',
    samplePrompts: ['Feeling like a sibling gets more attention', 'Frustrated about sharing personal toys'],
    parentGuideTip: 'Frame love as an expanding light bulb, not a single slice of cake.'
  },
  {
    id: 'starting_school_anxiety',
    category: 'featured',
    categoryGroupLabel: 'Featured & Core Bedtime Themes',
    label: 'Starting school anxiety',
    description: 'Eases nervous tummy butterflies before new classrooms, teachers, or daily school routines.',
    iconName: 'GraduationCap',
    samplePrompts: ['Nervous about the morning teacher drop-off', 'Worrying about where the cubbies or bathrooms are'],
    parentGuideTip: 'Draw a tiny heart on your wrist and theirs so you stay connected all day long.'
  },

  // --- Category: Emotional & Social ---
  {
    id: 'separation_anxiety',
    category: 'emotional_social',
    categoryGroupLabel: 'Emotional & Social',
    label: 'Separation anxiety / saying goodbye (drop-offs, parents traveling)',
    description: 'Reassures children that love connects parents and kids no matter how many miles or hours lie between them.',
    iconName: 'HeartHandshake',
    samplePrompts: ['Parent going on a business trip', 'Tears at preschool drop-off line'],
    parentGuideTip: 'Create an invisible thread story where love travels down a golden cord between your hearts.'
  },
  {
    id: 'feeling_left_out',
    category: 'emotional_social',
    categoryGroupLabel: 'Emotional & Social',
    label: 'Feeling left out or excluded',
    description: 'Soothes the quiet sting of being excluded and highlights how special true friends are.',
    iconName: 'UserMinus',
    samplePrompts: ['Not invited to play at recess', 'Friends played a game without them'],
    parentGuideTip: 'Validate that exclusion hurts, and remind them that their value is not determined by who invited them today.'
  },
  {
    id: 'friendship_conflicts',
    category: 'emotional_social',
    categoryGroupLabel: 'Emotional & Social',
    label: 'Friendship conflicts and making up',
    description: 'Explores how to listen, apologize, forgive, and repair special friendships after a disagreement.',
    iconName: 'Sparkles',
    samplePrompts: ['Had an argument over a game during break', 'Felt hurt by a best friend'],
    parentGuideTip: 'Model how saying "I care about our friendship more than winning this argument" repairs bonds.'
  },
  {
    id: 'handling_big_feelings',
    category: 'emotional_social',
    categoryGroupLabel: 'Emotional & Social',
    label: 'Handling big feelings (anger/sadness)',
    description: 'Gives emotional storm clouds permission to pass while breathing through intense anger or sadness.',
    iconName: 'Wind',
    samplePrompts: ['Had a big meltdown after school', 'Felt overwhelming anger when things didn’t go as planned'],
    parentGuideTip: 'Teach "balloon breathing" — breathing deep into the belly to gently let out hot air.'
  },
  {
    id: 'jealousy_comparing',
    category: 'emotional_social',
    categoryGroupLabel: 'Emotional & Social',
    label: 'Jealousy or comparing yourself to others',
    description: 'Shifts focus from what others have to celebrating one’s own unique gifts and personal path.',
    iconName: 'Compass',
    samplePrompts: ['Wishing they had another child’s toy or talent', 'Feeling jealous of a classmate'],
    parentGuideTip: 'Remind them that flowers bloom at different times in a garden, and every bloom is lovely.'
  },
  {
    id: 'shyness_nervous',
    category: 'emotional_social',
    categoryGroupLabel: 'Emotional & Social',
    label: 'Shyness / feeling nervous around new people',
    description: 'Honors quiet observation while taking gentle, brave steps to say hello at their own comfortable pace.',
    iconName: 'UserCheck',
    samplePrompts: ['Hiding behind parents when guests arrive', 'Hesitant to join a playgroup'],
    parentGuideTip: 'Shyness is just a quiet superpower — let them observe first until they feel ready.'
  },
  {
    id: 'empathy_kindness',
    category: 'emotional_social',
    categoryGroupLabel: 'Emotional & Social',
    label: 'Empathy and kindness toward others',
    description: 'Inspires children to step into others’ shoes and discover the warm magic of small acts of kindness.',
    iconName: 'Smile',
    samplePrompts: ['Noticing someone sitting alone', 'Learning to comfort a sad peer'],
    parentGuideTip: 'Ask at bedtime: "What is one gentle thing you noticed or did for someone today?"'
  },
  {
    id: 'patience_waiting',
    category: 'emotional_social',
    categoryGroupLabel: 'Emotional & Social',
    label: 'Patience and waiting for things',
    description: 'Transforms boring waiting times into creative imagination journeys and peaceful practice.',
    iconName: 'Clock',
    samplePrompts: ['Impatient for a holiday or birthday', 'Trouble waiting for their turn in line'],
    parentGuideTip: 'Give them a mini counting or breathing game while waiting to make time feel like play.'
  },

  // --- Category: Fears & Worries ---
  {
    id: 'fear_monsters',
    category: 'fears_worries',
    categoryGroupLabel: 'Fears & Worries',
    label: 'Fear of monsters or "what’s under the bed"',
    description: 'Disarms bedtime monster worries with humor, cozy monster sprays, and friendly gentle guardians.',
    iconName: 'ShieldAlert',
    samplePrompts: ['Checking under the bed repeatedly', 'Worried about creaky floorboard sounds'],
    parentGuideTip: 'Give them a "bravery flashlight" or imaginary protective shield they can activate at night.'
  },
  {
    id: 'fear_loud_noises',
    category: 'fears_worries',
    categoryGroupLabel: 'Fears & Worries',
    label: 'Fear of loud noises (thunder, fireworks)',
    description: 'Soothes startle reflexes during thunderstorms or fireworks, framing noise as nature playing big drums.',
    iconName: 'Zap',
    samplePrompts: ['Scared of thunder claps or loud sirens', 'Startled by fireworks on celebrations'],
    parentGuideTip: 'Explain what makes thunder or fireworks happen so knowledge replaces the unknown threat.'
  },
  {
    id: 'fear_alone_room',
    category: 'fears_worries',
    categoryGroupLabel: 'Fears & Worries',
    label: 'Fear of being alone in a room',
    description: 'Builds comforting association with independent bedroom space, making it a safe personal sanctuary.',
    iconName: 'Home',
    samplePrompts: ['Refusing to stay in their room without a parent sitting right there', 'Calling out repeatedly'],
    parentGuideTip: 'Use a check-in routine ("I will come back in 3 minutes to tuck your blanket in") so they feel supported.'
  },
  {
    id: 'general_worry_bedtime',
    category: 'fears_worries',
    categoryGroupLabel: 'Fears & Worries',
    label: 'General worry or an anxious mind at bedtime',
    description: 'Provides a "worry box" routine to put daytime thoughts to sleep so the mind can rest deeply.',
    iconName: 'Brain',
    samplePrompts: ['Mind racing with "what if" questions', 'Fidgeting unable to settle down'],
    parentGuideTip: 'Have them blow their bedtime worries into a imaginary bubble and watch it float up to the stars.'
  },
  {
    id: 'nightmares_safety',
    category: 'fears_worries',
    categoryGroupLabel: 'Fears & Worries',
    label: 'Nightmares and how to feel safe after one',
    description: 'Empowers children to rewrite bad dream endings into triumphant or funny bedtime adventures.',
    iconName: 'CloudRain',
    samplePrompts: ['Woke up frightened from a bad dream', 'Hesitant to go back to sleep after waking up'],
    parentGuideTip: 'Re-author the nightmare together: "If you were a magical wizard in that dream, what spell would you cast?"'
  },

  // --- Category: Confidence & Growth ---
  {
    id: 'trying_something_new',
    category: 'confidence_growth',
    categoryGroupLabel: 'Confidence & Growth',
    label: 'Trying something new / courage',
    description: 'Sparks curiosity and brave steps when facing unfamiliar activities, sports, or food.',
    iconName: 'Flame',
    samplePrompts: ['Nervous about first swimming lesson or bike ride', 'Hesitant to try a new taste or game'],
    parentGuideTip: 'Celebrate courage over outcome. Being brave means trying even when butterflies are fluttering.'
  },
  {
    id: 'sleeping_own_bed',
    category: 'confidence_growth',
    categoryGroupLabel: 'Confidence & Growth',
    label: 'Sleeping/staying in your own bed',
    description: 'Celebrates big-kid bedroom milestones, turning all-night sleep into a proud bedtime achievement.',
    iconName: 'Award',
    samplePrompts: ['Sneaking into parents’ bed every midnight', 'Transitioning from co-sleeping'],
    parentGuideTip: 'Use positive reinforcement and a sticker milestone chart for staying tucked in all night.'
  },
  {
    id: 'making_mistakes',
    category: 'confidence_growth',
    categoryGroupLabel: 'Confidence & Growth',
    label: 'Making mistakes and self-forgiveness',
    description: 'Teaches that mistakes are stepping stones that help brains grow stronger and smarter.',
    iconName: 'RotateCcw',
    samplePrompts: ['Upset after spilling or knocking down a build', 'Frustrated when a task doesn’t work on try one'],
    parentGuideTip: 'Model enthusiasm for "oops" moments by saying "What a great mistake to learn from!"'
  },
  {
    id: 'perfectionism',
    category: 'confidence_growth',
    categoryGroupLabel: 'Confidence & Growth',
    label: 'Perfectionism / it’s okay not to be perfect',
    description: 'Relieves pressure to be perfect, celebrating joy, messiness, and genuine effort over flawless results.',
    iconName: 'CheckCircle',
    samplePrompts: ['Tearing up drawings if lines aren’t straight', 'Anxious about doing everything right'],
    parentGuideTip: 'Praise their process, creativity, and perseverance rather than just the final product.'
  },
  {
    id: 'feeling_proud',
    category: 'confidence_growth',
    categoryGroupLabel: 'Confidence & Growth',
    label: 'Feeling proud of yourself',
    description: 'Encourages internal validation so children feel a warm glow of pride from within.',
    iconName: 'Star',
    samplePrompts: ['Accomplished a new skill today', 'Overcame a challenge and wants to celebrate'],
    parentGuideTip: 'Ask "How did it feel inside your heart when you kept going?" to nurture intrinsic pride.'
  },
  {
    id: 'standing_up_self',
    category: 'confidence_growth',
    categoryGroupLabel: 'Confidence & Growth',
    label: 'Standing up for yourself',
    description: 'Teaches children how to set clear, confident boundaries and speak up with a calm, strong voice.',
    iconName: 'Megaphone',
    samplePrompts: ['Difficulty saying "stop" when a friend is too rough', 'Yielding toys out of pressure'],
    parentGuideTip: 'Practice a "stop sign hand pose" and firm tone at home during play.'
  },

  // --- Category: Change & Transitions ---
  {
    id: 'moving_new_house',
    category: 'change_transitions',
    categoryGroupLabel: 'Change & Transitions',
    label: 'Moving to a new house',
    description: 'Framing moving as an adventure, finding cozy new nooks, and carrying home memories in your heart.',
    iconName: 'Package',
    samplePrompts: ['Surrounded by packing boxes', 'Missing old neighborhood parks and friends'],
    parentGuideTip: 'Let them choose where their nightlight or favorite stuffed animal goes first in the new room.'
  },
  {
    id: 'new_sibling_arriving',
    category: 'change_transitions',
    categoryGroupLabel: 'Change & Transitions',
    label: 'A new sibling arriving',
    description: 'Welcomes the new baby into the home while honoring the older child’s vital, irreplaceable role.',
    iconName: 'Heart',
    samplePrompts: ['Mom or dad busy caring for the newborn', 'Adjusting to baby crying at night'],
    parentGuideTip: 'Reserve 10 minutes of undivided 1-on-1 bedtime connection with the older child every single night.'
  },
  {
    id: 'starting_new_school',
    category: 'change_transitions',
    categoryGroupLabel: 'Change & Transitions',
    label: 'Starting at a new school or class',
    description: 'Sparks hope and confidence when transitioning to a brand-new school, teacher, or grade level.',
    iconName: 'BookOpen',
    samplePrompts: ['First week at a new school', 'Switching classrooms or teacher groups'],
    parentGuideTip: 'Reassure them that other kids are looking for new friends too.'
  },
  {
    id: 'losing_pet_loved_one',
    category: 'change_transitions',
    categoryGroupLabel: 'Change & Transitions',
    label: 'Losing a pet or a loved one (grief, gently handled)',
    description: 'Gently holds sadness, honoring warm memories that live forever like stars in the night sky.',
    iconName: 'Feather',
    samplePrompts: ['Saying goodbye to a dog or cat', 'Missing a grandparent who passed away'],
    parentGuideTip: 'Validate that tears are love flowing out, and warm memories stay tucked safely inside us.'
  },
  {
    id: 'big_family_changes',
    category: 'change_transitions',
    categoryGroupLabel: 'Change & Transitions',
    label: 'Big family changes',
    description: 'Provides deep emotional stability during family changes, reinforcing that love for the child remains constant.',
    iconName: 'Shield',
    samplePrompts: ['Parents living in two homes', 'Schedule or household shift'],
    parentGuideTip: 'Reiterate continuously: "You are safe, you are cherished, and our love for you never changes."'
  },

  // --- Category: Everyday Themes ---
  {
    id: 'gratitude_small_things',
    category: 'everyday',
    categoryGroupLabel: 'Everyday Bedtime Themes',
    label: 'Gratitude / noticing small good things in the day',
    description: 'Winds down the evening by harvesting sweet moments, warm smiles, and cozy daytime highlights.',
    iconName: 'Sun',
    samplePrompts: ['Reflecting on a happy day', 'Learning to appreciate everyday moments'],
    parentGuideTip: 'Share 3 "bedtime roses" (happy highlights) before turning off the main lamp.'
  },
  {
    id: 'letting_go_day',
    category: 'everyday',
    categoryGroupLabel: 'Everyday Bedtime Themes',
    label: 'Letting go of the day, especially after a busy or overstimulating one',
    description: 'A sensory breathing story that washes away overstimulation, loud noises, and busy energy.',
    iconName: 'CloudMoon',
    samplePrompts: ['After a noisy birthday party or trip', 'Feeling hyper or wired at bedtime'],
    parentGuideTip: 'Dim all lights and talk in a progressively slower, whispering cadence.'
  },
  {
    id: 'screen_time_slowing_down',
    category: 'everyday',
    categoryGroupLabel: 'Everyday Bedtime Themes',
    label: 'Screen time and slowing down before bed',
    description: 'Gently shifts brainwaves from bright tablet screens to peaceful offline imagination and rest.',
    iconName: 'Tv',
    samplePrompts: ['Trouble turning off TV or tablet', 'Overstimulated brain after video games'],
    parentGuideTip: 'Transition screens off at least 30-45 minutes before sleep with a warm bath or story transition.'
  },
  {
    id: 'sharing_cooperation',
    category: 'everyday',
    categoryGroupLabel: 'Everyday Bedtime Themes',
    label: 'Sharing and cooperation',
    description: 'Celebrates how working together like a cozy team makes every adventure twice as joyful.',
    iconName: 'Users',
    samplePrompts: ['Difficulty sharing playground gear', 'Learning teamwork during family chores'],
    parentGuideTip: 'Praise moments when they work alongside someone else: "Look how much fun you made together!"'
  },
  {
    id: 'honesty_truth',
    category: 'everyday',
    categoryGroupLabel: 'Everyday Bedtime Themes',
    label: 'Honesty and telling the truth',
    description: 'Shows that telling the truth brings relief, safety, and deep trust, making honesty feel courageous.',
    iconName: 'ShieldCheck',
    samplePrompts: ['Told a lie out of fear of getting in trouble', 'Holding a small secret'],
    parentGuideTip: 'Thank them immediately when they tell the truth so they feel safe being honest.'
  },
  {
    id: 'body_awareness_safety',
    category: 'everyday',
    categoryGroupLabel: 'Everyday Bedtime Themes',
    label: 'Body awareness and feeling safe in your own body',
    description: 'Guides children to tune into bodily sensations, feeling grounded, rested, and safe.',
    iconName: 'Heart',
    samplePrompts: ['Restless legs in bed', 'Tense shoulders or tight tummy'],
    parentGuideTip: 'Do a progressive muscle squeeze — tighten toes, then relax like a warm bowl of noodles.'
  },
  {
    id: 'body_boundaries',
    category: 'everyday',
    categoryGroupLabel: 'Everyday Bedtime Themes',
    label: 'Body boundaries',
    description: 'Teaches bodily autonomy, personal space, and the confidence to say a clear, respected "no thanks".',
    iconName: 'Shield',
    samplePrompts: ['Learning when hugs or tickles feel like too much', 'Respecting personal space of peers'],
    parentGuideTip: 'Empower them by honoring their boundary when they say "I don’t want a hug right now, just a wave."'
  }
];
