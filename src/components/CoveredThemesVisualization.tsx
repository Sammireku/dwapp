import React, { useMemo } from 'react';
import { Sparkles, CheckCircle2, Circle, ArrowRight, BookOpen, Compass, Award, Shield, Star, Plus, Check } from 'lucide-react';
import { ChildProfile, EmotionalTheme } from '../types';
import { CURATED_THEMES } from '../data/curatedThemes';

interface CoveredThemesVisualizationProps {
  activeChild: ChildProfile;
  onSelectThemeForStory?: (theme: EmotionalTheme) => void;
  onToggleCoveredTheme?: (themeId: string, themeLabel: string) => void;
  compact?: boolean;
}

export const CoveredThemesVisualization: React.FC<CoveredThemesVisualizationProps> = ({
  activeChild,
  onSelectThemeForStory,
  onToggleCoveredTheme,
  compact = false,
}) => {
  // Normalize covered themes list
  const coveredRecords = activeChild.coveredThemes || [];
  
  // Set of covered theme IDs and labels (case-insensitive label matching)
  const coveredThemeIds = useMemo(() => {
    const set = new Set<string>();
    coveredRecords.forEach((item) => {
      if (item.themeId) set.add(item.themeId.toLowerCase());
      if (item.themeLabel) set.add(item.themeLabel.toLowerCase());
    });
    return set;
  }, [coveredRecords]);

  // Total available curated themes
  const totalThemesCount = CURATED_THEMES.length;

  // Count unique covered themes matched against CURATED_THEMES or custom
  const matchedCoveredCount = useMemo(() => {
    let count = 0;
    CURATED_THEMES.forEach((theme) => {
      if (
        coveredThemeIds.has(theme.id.toLowerCase()) ||
        coveredThemeIds.has(theme.label.toLowerCase())
      ) {
        count++;
      }
    });
    // Add extra count if coveredRecords has custom themes not in CURATED_THEMES
    const customCount = coveredRecords.filter(
      (r) =>
        !CURATED_THEMES.some(
          (t) =>
            t.id.toLowerCase() === (r.themeId || '').toLowerCase() ||
            t.label.toLowerCase() === (r.themeLabel || '').toLowerCase()
        )
    ).length;
    return count + customCount;
  }, [coveredThemeIds, coveredRecords]);

  const percentage = Math.min(100, Math.round((matchedCoveredCount / totalThemesCount) * 100));

  // Determine Rank / Milestone badge
  const milestone = useMemo(() => {
    if (percentage >= 80) return { title: 'Master Storyteller', subtitle: 'Mastered 80%+ Core Emotional Lessons', icon: Award, color: 'text-amber-300', bg: 'from-amber-500/20 to-yellow-500/10 border-amber-400/30' };
    if (percentage >= 50) return { title: 'Mindful Hero', subtitle: 'Over 50% Emotional Milestones Unlocked', icon: Star, color: 'text-purple-300', bg: 'from-purple-500/20 to-indigo-500/10 border-purple-400/30' };
    if (percentage >= 20) return { title: 'Emotional Explorer', subtitle: 'Building Bedtime Courage & Comfort', icon: Compass, color: 'text-indigo-300', bg: 'from-indigo-500/20 to-cyan-500/10 border-indigo-400/30' };
    return { title: 'Bedtime Beginner', subtitle: 'Beginning the Emotional Journey', icon: Sparkles, color: 'text-emerald-300', bg: 'from-emerald-500/20 to-teal-500/10 border-emerald-400/30' };
  }, [percentage]);

  const MilestoneIcon = milestone.icon;

  // Theme suggestions (unexplored themes)
  const suggestedThemes = useMemo(() => {
    const unexplored = CURATED_THEMES.filter(
      (theme) =>
        !coveredThemeIds.has(theme.id.toLowerCase()) &&
        !coveredThemeIds.has(theme.label.toLowerCase())
    );

    // Score unexplored themes based on child's traits and age appropriateness
    return unexplored.map((theme) => {
      let reason = 'Essential bedtime milestone';
      let priorityScore = 1;

      const lowerLabel = theme.label.toLowerCase();
      const lowerDesc = theme.description.toLowerCase();

      // Check trait matches
      (activeChild.traits || []).forEach((trait) => {
        const lowerTrait = trait.toLowerCase();
        if (lowerLabel.includes(lowerTrait) || lowerDesc.includes(lowerTrait)) {
          reason = `Gently addresses "${trait}" trait`;
          priorityScore += 3;
        }
      });

      // Age specific hints
      if (activeChild.age <= 5 && (lowerLabel.includes('dark') || lowerLabel.includes('sharing') || lowerLabel.includes('school'))) {
        reason = `Highly recommended for age ${activeChild.age}`;
        priorityScore += 2;
      } else if (activeChild.age >= 6 && (lowerLabel.includes('bullying') || lowerLabel.includes('frustration') || lowerLabel.includes('confidence'))) {
        reason = `Great for growing readers (age ${activeChild.age})`;
        priorityScore += 2;
      }

      return { theme, reason, priorityScore };
    }).sort((a, b) => b.priorityScore - a.priorityScore);
  }, [coveredThemeIds, activeChild.traits, activeChild.age]);

  // SVG Progress Ring calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.76
  const strokeDashoffset = circumference - (circumference * percentage) / 100;

  return (
    <div className="space-y-6">
      {/* Progress Ring & Header Banner */}
      <div className={`bg-gradient-to-br ${milestone.bg} border rounded-3xl p-5 md:p-6 shadow-xl flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden`}>
        {/* Glow Effects */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Circular SVG Progress Ring */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-slate-800"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Gradient Progress Arc */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="url(#progressGradient)"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Text Badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-bold font-serif text-amber-200 tracking-tight leading-none">
              {percentage}%
            </span>
            <span className="text-[10px] text-slate-300/80 font-medium mt-0.5">
              {matchedCoveredCount}/{totalThemesCount}
            </span>
          </div>
        </div>

        {/* Progress Text & Milestone info */}
        <div className="flex-1 text-center sm:text-left space-y-1.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 flex items-center gap-1 ${milestone.color}`}>
              <MilestoneIcon className="w-3.5 h-3.5" />
              {milestone.title}
            </span>
            <span className="text-[11px] text-slate-400">
              {matchedCoveredCount} Emotional Lessons Explored
            </span>
          </div>

          <h3 className="font-serif text-lg font-bold text-slate-100">
            {activeChild.name}'s Emotional Theme Progress
          </h3>

          <p className="text-xs text-slate-300/90 leading-relaxed max-w-lg">
            {milestone.subtitle}. Reading stories covering diverse emotional themes helps {activeChild.name} build resilience, empathy, and bedtime comfort.
          </p>
        </div>
      </div>

      {/* Covered Themes Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-serif text-sm font-bold text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Explored Emotional Themes ({coveredRecords.length})</span>
          </h4>
          <span className="text-[11px] text-slate-400">
            Automated from generated bedtime tales
          </span>
        </div>

        {coveredRecords.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {coveredRecords.map((item, index) => {
              const matchedTheme = CURATED_THEMES.find(
                (t) =>
                  t.id.toLowerCase() === (item.themeId || '').toLowerCase() ||
                  t.label.toLowerCase() === (item.themeLabel || '').toLowerCase()
              );

              return (
                <div
                  key={`${item.themeId}_${index}`}
                  className="bg-slate-900/90 border border-emerald-500/20 rounded-2xl p-3 flex items-start gap-2.5 shadow-sm hover:border-emerald-500/40 transition-colors"
                >
                  <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-xs text-slate-100 block truncate">
                      {item.themeLabel || matchedTheme?.label || 'Custom Theme'}
                    </span>
                    <span className="text-[10px] text-emerald-400/90 font-mono block">
                      Explored {item.date ? new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recently'}
                    </span>
                  </div>
                  {onToggleCoveredTheme && (
                    <button
                      onClick={() => onToggleCoveredTheme(item.themeId || item.themeLabel, item.themeLabel)}
                      className="text-slate-500 hover:text-rose-400 text-[10px] p-1"
                      title="Remove theme"
                    >
                      ✕
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-dashed border-slate-800 text-center space-y-1">
            <p className="text-xs text-slate-400">
              No emotional themes recorded yet for {activeChild.name}.
            </p>
            <p className="text-[11px] text-amber-300">
              Generate a bedtime story to automatically track lessons!
            </p>
          </div>
        )}
      </div>

      {/* Theme Suggestions Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-serif text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Recommended Next Emotional Themes</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Suggested bedtime topics tailored for {activeChild.name}'s age ({activeChild.age}y) & traits
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestedThemes.slice(0, 4).map(({ theme, reason }) => (
            <div
              key={theme.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-amber-400/50 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-md group transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/20">
                    {reason}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">
                    {theme.categoryGroupLabel || theme.category}
                  </span>
                </div>

                <h5 className="font-serif text-sm font-bold text-slate-100 group-hover:text-amber-200 transition-colors">
                  {theme.label}
                </h5>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {theme.description}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
                {onToggleCoveredTheme && (
                  <button
                    onClick={() => onToggleCoveredTheme(theme.id, theme.label)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Plus className="w-3 h-3 text-emerald-400" />
                    <span>Mark Explored</span>
                  </button>
                )}

                {onSelectThemeForStory && (
                  <button
                    onClick={() => onSelectThemeForStory(theme)}
                    className="px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center gap-1 ml-auto transition-all"
                  >
                    <span>Create Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
