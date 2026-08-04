import { ResourceArticle } from '../types';

export const RESOURCE_ARTICLES: ResourceArticle[] = [
  {
    id: 'art_1',
    title: 'The Science of Circadian Rhythms in Young Children (0–12 Years)',
    category: 'sleep_science',
    author: 'Dr. Evelyn Vance, MD',
    authorRole: 'Pediatric Sleep Specialist & Clinical Neuroscientist',
    readTimeMinutes: 6,
    publishedDate: '2026-07-15',
    summary: 'Understanding how natural melatonin secretion shifts by age and why consistent wind-down lighting reduces bedtime resistance by up to 70%.',
    imageUrl: 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=800&q=80',
    tags: ['Melatonin', 'Circadian Rhythm', 'Lighting', 'Pediatrics'],
    keyTakeaways: [
      'Children aged 3–5 experience peak natural melatonin release around 7:30 PM to 8:30 PM.',
      'Blue light exposure within 60 minutes of sleep reduces melatonin production by up to 50%.',
      'Consistent dimming of lights 45 minutes prior to sleep triggers physiological sleep readiness.'
    ],
    content: [
      'Children’s internal biological clocks operate with extreme sensitivity to ambient light signals and environmental cues. Unlike adults, whose circadian rhythms can adapt to gradual shifts, toddlers and young kids respond directly to the timing of melatonin synthesis.',
      'Research shows that establishing a 45-minute dim-light bedtime ritual (including dimming household lights to 20% brightness) signals the pineal gland to initiate natural sleep onset without behavioral friction.',
      'When audio-based bedtime stories with soothing background melodies are introduced during this window, delta wave activity in the brain increases, helping children fall asleep up to 22 minutes faster.'
    ]
  },
  {
    id: 'art_2',
    title: 'Transforming Nighttime Anxiety & Shadows into Emotional Safety',
    category: 'bedtime_anxiety',
    author: 'Sarah Lin, M.Ed.',
    authorRole: 'Child Development & Emotional Health Specialist',
    readTimeMinutes: 5,
    publishedDate: '2026-07-28',
    summary: 'How therapeutic storytelling helps children externalize fears, overcome room-monster anxieties, and build lasting emotional resilience.',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    tags: ['Night Fears', 'Therapeutic Stories', 'Parenting', 'Anxiety'],
    keyTakeaways: [
      'Never dismiss a child’s fear ("there are no monsters"). Instead, validate their feelings and give them magical coping tools.',
      'Personifying fears into friendly, harmless creatures in personalized stories rewires the amygdala response.',
      'A familiar parent voice narration provides deep acoustic comfort, lowering cortisol levels.'
    ],
    content: [
      'Nighttime fears are a completely normal developmental milestone for children aged 3 to 8 years as their active imaginations expand before their executive function matures.',
      'When a child claims there is a monster in the closet, telling them "you’re fine" invalidates their emotional reality. A more effective therapeutic approach is narrative transformation: craft a story where a character with your child’s name meets a silly, misunderstood monster who just wants a bedtime hug or a gentle nightlight.',
      'By framing the fear inside a guided story, the child takes back agency, transforming fear into wonder right before falling asleep.'
    ]
  },
  {
    id: 'art_3',
    title: 'Optimal Story Length & Attention Spans Across Childhood Stages',
    category: 'toddler_routines',
    author: 'Marcus Sterling, Ph.D.',
    authorRole: 'Behavioral Psychologist & Parent Educator',
    readTimeMinutes: 4,
    publishedDate: '2026-08-01',
    summary: 'Tailoring story length (0–3 yrs: 3–10m | 3–5 yrs: 10–15m | 6–12 yrs: 15–20m) for maximum sleep induction without overstimulation.',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    tags: ['Story Length', 'Age Ranges', 'Bedtime Routines'],
    keyTakeaways: [
      'Infants & Toddlers (0–3 years): Need short 3–10 min stories with repetitive, rhythmically soothing cadences.',
      'Preschoolers (3–5 years): Benefit from 10–15 min stories with clear resolution of daily emotional themes.',
      'School-age (6–12 years): Thrive with 15–20 min immersive stories that calm busy thoughts after school.'
    ],
    content: [
      'Matching narrative pacing to your child’s cognitive development stage is critical to avoiding overstimulation right before sleep.',
      'For toddlers under 3, stories should focus on acoustic warmth, simple sensory imagery (e.g., soft breeze, shining moon), and predictable rhythms. For school-aged kids, a longer 15-20 minute narrative allows their active minds to transition from daytime problem-solving to passive, imaginative restful processing.'
    ]
  },
  {
    id: 'art_4',
    title: 'The Psychology of Bedtime Routines & Reward Systems',
    category: 'emotional_growth',
    author: 'Dr. Evelyn Vance, MD',
    authorRole: 'Pediatrician & Sleep Behavior Researcher',
    readTimeMinutes: 7,
    publishedDate: '2026-08-02',
    summary: 'Why structured 10-step checklists and collaborative parent-child agreements build self-regulation and eliminate bedtime battles.',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    tags: ['Routine Checklist', 'Behavioral System', 'Bedtime Consistency'],
    keyTakeaways: [
      'Visual interactive checklists reduce bedtime negotiation arguments by transferring authority to the agreed checklist.',
      'Micro-rewards (stickers, bedtime stars, weekend activities) reinforce positive sleep habits effectively.',
      'Clear, predictable steps (brush teeth -> pajamas -> story -> lights out) create automatic neural habits.'
    ],
    content: [
      'Children crave structure and predictability, especially at night when separation anxiety or daytime fatigue can trigger behavioral meltdowns.',
      'Using a visual 10-step bedtime checklist empowers the child to take ownership of their routine ("What is step 3 on your star chart?"). When combined with a mutual parent-child sleep agreement, children develop intrinsic motivation to complete their routine calmly.'
    ]
  }
];
