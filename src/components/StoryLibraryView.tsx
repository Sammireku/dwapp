import React, { useState, useMemo } from 'react';
import { BookOpen, Star, Play, ShoppingBag, Plus, Search, Heart, Sparkles, Clock, Trash2, Filter, ArrowUpDown, Calendar, RefreshCw, X } from 'lucide-react';
import { Story, ChildProfile } from '../types';

interface StoryLibraryViewProps {
  stories: Story[];
  activeChild: ChildProfile;
  onOpenReadView: (story: Story) => void;
  onOpenAudiobook: (story: Story) => void;
  onOpenMarketplace: (story: Story) => void;
  onOpenStoryWizard: () => void;
  onToggleFavorite: (storyId: string) => void;
  onDeleteStory: (storyId: string) => void;
}

export const StoryLibraryView: React.FC<StoryLibraryViewProps> = ({
  stories,
  activeChild,
  onOpenReadView,
  onOpenAudiobook,
  onOpenMarketplace,
  onOpenStoryWizard,
  onToggleFavorite,
  onDeleteStory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'modified' | 'theme' | 'title' | 'readingTime'>('newest');

  // Extract all unique emotional themes from current stories
  const availableThemes = useMemo(() => {
    const themeSet = new Set<string>();
    stories.forEach((story) => {
      if (story.themeLabel) themeSet.add(story.themeLabel);
    });
    return Array.from(themeSet).sort();
  }, [stories]);

  // Filter and sort stories for current active child or general
  const filteredStories = useMemo(() => {
    return stories
      .filter((story) => {
        const matchesChild =
          story.childName.toLowerCase() === activeChild.name.toLowerCase() || stories.length <= 2;
        const matchesQuery =
          story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.themeLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.summary.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFav = !filterFavorites || story.isFavorite;
        const matchesTheme = selectedTheme === 'all' || story.themeLabel === selectedTheme;
        return matchesChild && matchesQuery && matchesFav && matchesTheme;
      })
      .sort((a, b) => {
        if (sortBy === 'modified') {
          const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
          const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
          return dateB - dateA;
        }
        if (sortBy === 'newest') {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        }
        if (sortBy === 'oldest') {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateA - dateB;
        }
        if (sortBy === 'theme') {
          return a.themeLabel.localeCompare(b.themeLabel);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'readingTime') {
          return (a.readingTimeMinutes || 0) - (b.readingTimeMinutes || 0);
        }
        return 0;
      });
  }, [stories, activeChild.name, searchQuery, filterFavorites, selectedTheme, sortBy]);

  const hasActiveFilters = searchQuery !== '' || filterFavorites || selectedTheme !== 'all' || sortBy !== 'newest';

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterFavorites(false);
    setSelectedTheme('all');
    setSortBy('newest');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 text-slate-100 space-y-6">
      {/* Library Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Bedtime Story Vault</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-slate-100">
            {activeChild.name}'s Story Library
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Repetition is key for emotional processing. Re-read favorite tales or filter by emotional themes and creation dates.
          </p>
        </div>

        <button
          onClick={onOpenStoryWizard}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs hover:from-amber-300 hover:to-amber-400 shadow-md flex items-center gap-1.5 shrink-0 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create Story for {activeChild.name}</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs font-medium">
          {/* Search Box */}
          <div className="relative md:col-span-5">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, theme, or text..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-8 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Emotional Theme Filter */}
          <div className="relative md:col-span-3">
            <div className="relative flex items-center">
              <Filter className="w-3.5 h-3.5 text-amber-400 absolute left-3 pointer-events-none" />
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-slate-100 appearance-none focus:outline-none focus:border-amber-400/80 cursor-pointer"
              >
                <option value="all">All Emotional Themes ({availableThemes.length})</option>
                {availableThemes.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 pointer-events-none text-slate-500 text-[10px]">▼</div>
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative md:col-span-2">
            <div className="relative flex items-center">
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400 absolute left-3 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-slate-100 appearance-none focus:outline-none focus:border-amber-400/80 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="modified">Recently Changed / Modified</option>
                <option value="oldest">Oldest First</option>
                <option value="theme">By Theme Name</option>
                <option value="title">By Title (A-Z)</option>
                <option value="readingTime">Shortest Read</option>
              </select>
              <div className="absolute right-3 pointer-events-none text-slate-500 text-[10px]">▼</div>
            </div>
          </div>

          {/* Favorites Only Toggle */}
          <div className="md:col-span-2 flex items-center justify-end">
            <button
              onClick={() => setFilterFavorites(!filterFavorites)}
              className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                filterFavorites
                  ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${filterFavorites ? 'fill-amber-300 text-amber-300' : ''}`} />
              <span>Favorites</span>
            </button>
          </div>
        </div>

        {/* Filter Summary & Reset Bar */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-amber-300">{filteredStories.length}</strong> of {stories.length} stories
            </span>
            {selectedTheme !== 'all' && (
              <span className="bg-amber-400/10 text-amber-300 text-[10px] px-2 py-0.5 rounded-md border border-amber-400/20 flex items-center gap-1">
                Theme: {selectedTheme}
                <button onClick={() => setSelectedTheme('all')} className="hover:text-amber-100">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {sortBy !== 'newest' && (
              <span className="bg-indigo-500/10 text-indigo-300 text-[10px] px-2 py-0.5 rounded-md border border-indigo-500/20 flex items-center gap-1">
                Sorted: {sortBy === 'modified' ? 'Recently Modified' : sortBy === 'oldest' ? 'Oldest First' : sortBy === 'theme' ? 'Theme' : sortBy === 'title' ? 'Title' : 'Length'}
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors text-[11px]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Story Grid */}
      {filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all group relative"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold text-amber-300/90 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 truncate max-w-[200px]">
                    {story.themeLabel}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleFavorite(story.id)}
                      className="p-1 text-slate-500 hover:text-amber-300 transition-colors"
                      title={story.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <Star className={`w-4 h-4 ${story.isFavorite ? 'fill-amber-300 text-amber-300' : ''}`} />
                    </button>
                    {onDeleteStory && (
                      <button
                        onClick={() => onDeleteStory(story.id)}
                        className="p-1 text-slate-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete story"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="font-serif text-lg font-bold text-slate-100 group-hover:text-amber-200 transition-colors mb-1.5 line-clamp-2">
                  {story.title}
                </h3>

                <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                  {story.summary}
                </p>
              </div>

              {/* Card Footer & Actions */}
              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {story.readingTimeMinutes || 3} min read
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Calendar className="w-3 h-3 text-indigo-400" />
                    {story.createdAt
                      ? new Date(story.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Recent'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <button
                    onClick={() => onOpenReadView(story)}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                    <span>Read Live</span>
                  </button>

                  <button
                    onClick={() => onOpenAudiobook(story)}
                    className="py-2 px-3 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-200 hover:bg-purple-500/30 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                    <span>Audiobook</span>
                  </button>
                </div>

                <button
                  onClick={() => onOpenMarketplace(story)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-400/40 text-amber-300/90 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Order Printed Illustrated Book</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-slate-200">No Stories Match Your Filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {hasActiveFilters
              ? 'Try resetting your search query or theme filters to view all bedtime stories.'
              : `Generate a new custom bedtime story addressing a specific emotional lesson for ${activeChild.name}!`}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            {hasActiveFilters ? (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs hover:bg-slate-700"
              >
                Clear All Filters
              </button>
            ) : null}
            <button
              onClick={onOpenStoryWizard}
              className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 shadow-md"
            >
              Create New Story
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

