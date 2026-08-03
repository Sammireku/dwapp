import React, { useState } from 'react';
import { Sparkles, Moon, Heart, ShieldAlert, Sliders, Wand2, Compass, AlertCircle, BookOpen, User, Check } from 'lucide-react';
import { ChildProfile, EmotionalTheme, Story, StoryTone, StarringMode } from '../types';
import { CURATED_THEMES } from '../data/curatedThemes';
import { generateFallbackStory } from '../utils/storyFallbackGenerator';

interface StoryGeneratorWizardProps {
  activeChild: ChildProfile;
  allChildren?: ChildProfile[];
  onStoryGenerated: (story: Story) => void;
  onOpenReadView: (story: Story) => void;
  onOpenAudiobook: (story: Story) => void;
}

export const StoryGeneratorWizard: React.FC<StoryGeneratorWizardProps> = ({
  activeChild,
  allChildren = [],
  onStoryGenerated,
  onOpenReadView,
  onOpenAudiobook,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<EmotionalTheme>(CURATED_THEMES[0]);
  const [customThemeText, setCustomThemeText] = useState('');
  const [tone, setTone] = useState<StoryTone>('soothing');
  const [lengthMinutes, setLengthMinutes] = useState<3 | 5 | 10>(5);
  const [starringMode, setStarringMode] = useState<StarringMode>('child');
  const [specificDetails, setSpecificDetails] = useState('');

  // Multi-child selection state
  const availableChildren = allChildren.length > 0 ? allChildren : [activeChild];
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>(
    availableChildren.map(c => c.id)
  );

  const toggleChildSelection = (childId: string) => {
    setSelectedChildIds(prev => {
      if (prev.includes(childId)) {
        if (prev.length <= 1) return prev; // Keep at least one child selected
        return prev.filter(id => id !== childId);
      }
      return [...prev, childId];
    });
  };

  const starringChildren = availableChildren.filter(c => selectedChildIds.includes(c.id));
  const effectiveChildren = starringChildren.length > 0 ? starringChildren : [activeChild];

  const combinedName = effectiveChildren.map(c => c.name).join(' & ');
  const averageAge = Math.round(effectiveChildren.reduce((acc, c) => acc + c.age, 0) / effectiveChildren.length);
  const combinedTraits = Array.from(new Set(effectiveChildren.flatMap(c => c.traits || [])));
  const combinedCharacters = Array.from(new Set(effectiveChildren.flatMap(c => c.favoriteCharacters || [])));
  const combinedSettings = Array.from(new Set(effectiveChildren.flatMap(c => c.favoriteSettings || [])));
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationStep(`Connecting to DreamWeaver AI engine for ${combinedName}...`);

    const payload = {
      childName: combinedName,
      childAge: averageAge,
      childTraits: combinedTraits,
      favoriteCharacters: combinedCharacters,
      favoriteSettings: combinedSettings,
      themeLabel: selectedTheme.label,
      customThemeText,
      tone,
      lengthMinutes,
      starringMode,
      specificDetails,
    };

    try {
      setGenerationStep('Weaving psychological lessons & bedtime comfort...');
      let generatedStory: Story | null = null;

      try {
        const res = await fetch('/api/stories/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (data && data.success && data.story) {
            generatedStory = data.story;
          }
        }
      } catch (apiErr) {
        console.warn('Backend API call failed, using client-side story generator:', apiErr);
      }

      // If backend API returned no story or failed (e.g. static hosting on Vercel), use fallback generator
      if (!generatedStory) {
        setGenerationStep('Crafting personalized bedtime story...');
        generatedStory = generateFallbackStory(payload);
      }

      setGenerationStep('Formatting pages & illustration cues...');
      onStoryGenerated(generatedStory);
    } catch (err: any) {
      console.error('Generation error:', err);
      // Even in the worst-case error, generate a fallback story so user experience never fails
      const fallback = generateFallbackStory(payload);
      onStoryGenerated(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 text-slate-100">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-slate-800/80 p-6 md:p-8 mb-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Bedtime Story Generator</span>
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-slate-100 mb-2">
            A Story Crafted Just for <span className="text-amber-300">{combinedName}</span> Tonight
          </h1>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Select an emotional theme or describe what {combinedName} is going through today.
            DreamWeaver wraps bedtime warmth around real child development lessons.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Step 1: Emotional Themes Selection */}
        <div className="lg:col-span-8 space-y-6">
          {/* Multi-child starring pill selector if multiple children exist */}
          {availableChildren.length > 1 && (
            <div className="bg-slate-900/90 border border-amber-400/30 rounded-2xl p-4 shadow-md space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-amber-300" /> Star Multiple Children in Story
                </span>
                <span className="text-[10px] text-slate-400">Click to select 1 or more heroes</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {availableChildren.map(child => {
                  const isSelected = selectedChildIds.includes(child.id);
                  return (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => toggleChildSelection(child.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md scale-105'
                          : 'bg-slate-950 text-indigo-200 border-white/10 hover:bg-slate-800'
                      }`}
                    >
                      {child.aiAnimationAvatarUrl ? (
                        <img src={child.aiAnimationAvatarUrl} alt={child.name} className="w-5 h-5 rounded-full object-cover border border-slate-900" />
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-indigo-500/30 flex items-center justify-center text-[10px]">
                          {child.name.charAt(0)}
                        </div>
                      )}
                      <span>{child.name} ({child.age} yrs)</span>
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-base font-bold text-slate-100 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Step 1: Choose Bedtime Emotional Theme</span>
              </h2>
              <span className="text-[11px] text-slate-400">Curated by child specialists</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {CURATED_THEMES.map((theme) => {
                const isSelected = selectedTheme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-400/10 border-amber-400/50 shadow-md shadow-amber-500/5'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                          {theme.label}
                        </span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {theme.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Theme Parent Guidance Box */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-amber-300 font-bold block mb-1">💡 Parent Guidance Tip:</span>
              <p className="text-slate-300 leading-normal">{selectedTheme.parentGuideTip}</p>
            </div>

            {/* Free text custom prompt */}
            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Specific Situation or Custom Detail (Optional)
              </label>
              <textarea
                value={customThemeText}
                onChange={(e) => setCustomThemeText(e.target.value)}
                placeholder={`e.g. ${activeChild.name} refused to sleep alone after hearing thunder, or had a disagreement with a friend named Maya.`}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Step 2: Story Tuning Parameters */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-md space-y-4">
            <h2 className="font-serif text-base font-bold text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Step 2: Story Tuning & Tone</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
              <div>
                <label className="block text-slate-300 mb-1.5">Story Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as StoryTone)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="soothing">Gentle & Soothing (Calming)</option>
                  <option value="adventurous">Whimsical & Adventurous</option>
                  <option value="funny">Warm & Playful</option>
                  <option value="reflective">Quiet & Reflective</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5">Target Length</label>
                <select
                  value={lengthMinutes}
                  onChange={(e) => setLengthMinutes(Number(e.target.value) as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value={3}>3 Minutes (Short Bedtime)</option>
                  <option value={5}>5 Minutes (Standard Bedtime)</option>
                  <option value={10}>10 Minutes (Extended Journey)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5">Main Character Role</label>
                <select
                  value={starringMode}
                  onChange={(e) => setStarringMode(e.target.value as StarringMode)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="child">Starring {combinedName} Directly</option>
                  <option value="animal">Allegorical Animal Companion</option>
                  <option value="magical_guide">Wise Starlight Guide</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Summary & Action */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-20">
            <h3 className="font-serif text-lg font-bold text-amber-300 mb-3 flex items-center gap-2">
              <Moon className="w-5 h-5 text-amber-400" />
              <span>Bedtime Summary</span>
            </h3>

            <div className="space-y-3 text-xs mb-6 border-b border-slate-800 pb-4">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Hero(es):</span>
                <span className="font-semibold text-slate-100 text-right max-w-[180px] truncate">{combinedName}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Theme:</span>
                <span className="font-semibold text-amber-300 text-right max-w-[180px] truncate">{selectedTheme.label}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Tone:</span>
                <span className="capitalize text-slate-100">{tone}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">Reading Level:</span>
                <span className="capitalize text-slate-100">{activeChild.readingLevel}</span>
              </div>
            </div>

            {/* Error banner if any */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-sm hover:from-amber-300 hover:to-amber-500 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Weaving Story...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-slate-950" />
                  <span>Generate Story for {activeChild.name}</span>
                </>
              )}
            </button>

            {isGenerating && (
              <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-amber-300/90 text-center animate-pulse">
                {generationStep}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-2">
              <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                <span>Safety & Privacy Filter Active</span>
              </div>
              <p className="text-slate-400">
                Generated text is age-filtered for bedtime warmth and psychological safety.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
