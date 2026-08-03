import React, { useState } from 'react';
import { BookOpen, Star, Play, ShoppingBag, Plus, Search, Heart, Sparkles, Clock, Trash2 } from 'lucide-react';
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

  // Filter stories for current active child or general
  const filteredStories = stories.filter((story) => {
    const matchesChild = story.childName.toLowerCase() === activeChild.name.toLowerCase() || stories.length <= 2;
    const matchesQuery = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.themeLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFav = !filterFavorites || story.isFavorite;
    return matchesChild && matchesQuery && matchesFav;
  });

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
            Repetition is key for emotional processing. Re-read favorite tales or generate a new custom lesson.
          </p>
        </div>

        <button
          onClick={onOpenStoryWizard}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs hover:from-amber-300 hover:to-amber-400 shadow-md flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Story for {activeChild.name}</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-medium">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stories by title, theme, or character..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <button
          onClick={() => setFilterFavorites(!filterFavorites)}
          className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition-all ${
            filterFavorites
              ? 'bg-amber-400/20 border-amber-400 text-amber-300 font-bold'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Star className={`w-4 h-4 ${filterFavorites ? 'fill-amber-300' : ''}`} />
          <span>Favorites Only</span>
        </button>
      </div>

      {/* Story Grid */}
      {filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold text-amber-300/90 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 truncate max-w-[200px]">
                    {story.themeLabel}
                  </span>

                  <button
                    onClick={() => onToggleFavorite(story.id)}
                    className="p-1 text-slate-500 hover:text-amber-300"
                    title="Toggle Favorite"
                  >
                    <Star className={`w-4 h-4 ${story.isFavorite ? 'fill-amber-300 text-amber-300' : ''}`} />
                  </button>
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
                    {story.readingTimeMinutes} min read
                  </span>
                  <span>{story.pages.length} Pages</span>
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
          <h3 className="font-serif text-lg font-bold text-slate-200">No Stories Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Generate a new custom bedtime story addressing a specific emotional lesson for {activeChild.name}!
          </p>
          <button
            onClick={onOpenStoryWizard}
            className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 shadow-md"
          >
            Create First Story
          </button>
        </div>
      )}
    </div>
  );
};
