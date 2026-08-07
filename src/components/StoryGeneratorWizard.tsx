import React, { useState } from 'react';
import { Sparkles, Moon, Heart, ShieldAlert, Sliders, Wand2, Compass, AlertCircle, BookOpen, User, Check, X, Plus, Search, ChevronDown } from 'lucide-react';
import { ChildProfile, EmotionalTheme, Story, StoryTone, StarringMode } from '../types';
import { CURATED_THEMES, THEME_CATEGORY_GROUPS } from '../data/curatedThemes';
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
  // Multi-theme selection state (up to 5 themes)
  const [selectedThemes, setSelectedThemes] = useState<EmotionalTheme[]>([CURATED_THEMES[0]]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [themeLimitWarning, setThemeLimitWarning] = useState<string | null>(null);

  const [customThemeText, setCustomThemeText] = useState('');
  const [tone, setTone] = useState<StoryTone>('soothing');
  const [lengthMinutes, setLengthMinutes] = useState<number>(5);
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

  // Theme selection helper logic
  const toggleTheme = (theme: EmotionalTheme) => {
    setThemeLimitWarning(null);
    const exists = selectedThemes.some(t => t.id === theme.id);
    if (exists) {
      if (selectedThemes.length <= 1) {
        setThemeLimitWarning('At least one emotional theme must remain selected.');
        return;
      }
      setSelectedThemes(prev => prev.filter(t => t.id !== theme.id));
    } else {
      if (selectedThemes.length >= 5) {
        setThemeLimitWarning('Up to 5 themes can be combined per bedtime story. Remove one to add another.');
        return;
      }
      setSelectedThemes(prev => [...prev, theme]);
    }
  };

  const addThemeById = (themeId: string) => {
    if (!themeId) return;
    setThemeLimitWarning(null);
    const theme = CURATED_THEMES.find(t => t.id === themeId);
    if (!theme) return;

    if (selectedThemes.some(t => t.id === theme.id)) {
      return;
    }

    if (selectedThemes.length >= 5) {
      setThemeLimitWarning('Up to 5 themes can be combined per bedtime story. Remove one to add another.');
      return;
    }

    setSelectedThemes(prev => [...prev, theme]);
  };

  const removeTheme = (themeId: string) => {
    setThemeLimitWarning(null);
    if (selectedThemes.length <= 1) {
      setThemeLimitWarning('At least one emotional theme must remain selected.');
      return;
    }
    setSelectedThemes(prev => prev.filter(t => t.id !== themeId));
  };

  // Filtered themes list for grid display
  const filteredThemes = CURATED_THEMES.filter(theme => {
    const matchesCategory = selectedCategoryFilter === 'all' || theme.category === selectedCategoryFilter;
    const matchesSearch = !searchQuery.trim() || 
      theme.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theme.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const themeLabelsArray = selectedThemes.map(t => t.label);
  const combinedThemeLabelsString = themeLabelsArray.join(' + ');

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
      themeLabel: combinedThemeLabelsString,
      themeLabels: themeLabelsArray,
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

      if (!generatedStory) {
        setGenerationStep('Crafting personalized bedtime story...');
        generatedStory = generateFallbackStory(payload);
      }

      setGenerationStep('Formatting pages & illustration cues...');
      onStoryGenerated(generatedStory);
    } catch (err: any) {
      console.error('Generation error:', err);
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
            Select up to <strong className="text-amber-300">5 bedtime emotional themes</strong> below.
            DreamWeaver seamlessly weaves them into a comforting, therapeutic bedtime story for {combinedName}.
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

          {/* Main Theme Selector Section */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 md:p-6 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h2 className="font-serif text-base font-bold text-slate-100 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>Step 1: Choose Bedtime Emotional Themes</span>
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Combine up to 5 themes from our 35 child-psychologist curated topics.
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold shrink-0 self-start sm:self-auto">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{selectedThemes.length} / 5 Selected</span>
              </div>
            </div>

            {/* Selected Themes Chips Display */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Selected Themes ({selectedThemes.length}/5):
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedThemes.map((theme) => (
                  <div
                    key={theme.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/15 border border-amber-400/40 text-amber-200 text-xs font-semibold shadow-sm"
                  >
                    <span>{theme.label}</span>
                    <button
                      type="button"
                      onClick={() => removeTheme(theme.id)}
                      className="p-0.5 hover:bg-amber-400/30 rounded-full text-amber-300 transition-colors"
                      title="Remove theme"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {themeLimitWarning && (
              <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{themeLimitWarning}</span>
              </div>
            )}

            {/* Categorized Dropdown Selector */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold text-slate-300">
                Quick Select from Categorized Dropdown
              </label>
              <div className="relative">
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      addThemeById(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-700 hover:border-amber-400 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-400 cursor-pointer appearance-none pr-10"
                >
                  <option value="">➕ Choose a theme from dropdown (Category Grouped)...</option>
                  {THEME_CATEGORY_GROUPS.map(group => (
                    <optgroup key={group.id} label={group.name} className="bg-slate-900 text-amber-300 font-bold">
                      {CURATED_THEMES.filter(t => t.category === group.id).map(t => {
                        const isSel = selectedThemes.some(st => st.id === t.id);
                        return (
                          <option
                            key={t.id}
                            value={t.id}
                            disabled={isSel}
                            className={isSel ? "text-slate-500 bg-slate-950" : "text-slate-100 bg-slate-950"}
                          >
                            {isSel ? '✓ ' : ''}{t.label}
                          </option>
                        );
                      })}
                    </optgroup>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* Filter Category Pills & Search Bar */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-300">Or Browse & Search Grid Below:</span>
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search all 35 themes..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`px-3 py-1 rounded-full font-medium transition-all ${
                    selectedCategoryFilter === 'all'
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  All ({CURATED_THEMES.length})
                </button>
                {THEME_CATEGORY_GROUPS.map(group => {
                  const count = CURATED_THEMES.filter(t => t.category === group.id).length;
                  const isSelected = selectedCategoryFilter === group.id;
                  return (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => setSelectedCategoryFilter(group.id)}
                      className={`px-3 py-1 rounded-full font-medium transition-all ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {group.name.split('&')[0].trim()} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid of Theme Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1 no-scrollbar pt-1">
              {filteredThemes.map((theme) => {
                const isSelected = selectedThemes.some(t => t.id === theme.id);
                const isCovered = (activeChild.coveredThemes || []).some(
                  (ct) =>
                    (ct.themeId && ct.themeId.toLowerCase() === theme.id.toLowerCase()) ||
                    (ct.themeLabel && ct.themeLabel.toLowerCase() === theme.label.toLowerCase())
                );

                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => toggleTheme(theme)}
                    className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400/15 border-amber-400/60 shadow-md shadow-amber-500/5'
                        : isCovered
                        ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className={`text-xs font-bold truncate ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                            {theme.label}
                          </span>
                          {isCovered && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                              ✓ Explored
                            </span>
                          )}
                        </div>
                        {isSelected ? (
                          <div className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center shrink-0">
                            <Plus className="w-2.5 h-2.5 text-slate-400" />
                          </div>
                        )}
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
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <span className="text-amber-300 font-bold block">💡 Parent Guidance Tips for Selected Themes:</span>
              <div className="space-y-1.5">
                {selectedThemes.map(theme => (
                  <div key={theme.id} className="text-slate-300 leading-normal border-l-2 border-amber-400/50 pl-2 text-[11px]">
                    <strong className="text-amber-200/90">{theme.label}:</strong> {theme.parentGuideTip}
                  </div>
                ))}
              </div>
            </div>

            {/* Free text custom prompt */}
            <div className="pt-2">
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
                  onChange={(e) => setLengthMinutes(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value={3}>3 Minutes (Short Bedtime)</option>
                  <option value={5}>5 Minutes (Standard Bedtime)</option>
                  <option value={10}>10 Minutes (Extended Journey)</option>
                  <option value={15}>15 Minutes (Deep Rest)</option>
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
                <span className="text-slate-400">Selected Themes ({selectedThemes.length}):</span>
                <span className="font-semibold text-amber-300 text-right max-w-[180px] truncate" title={combinedThemeLabelsString}>
                  {combinedThemeLabelsString}
                </span>
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
              disabled={isGenerating || selectedThemes.length === 0}
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
                  <span>Generate Story for {combinedName}</span>
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
