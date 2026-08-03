import React, { useState } from 'react';
import { ArrowLeft, Moon, Sun, Volume2, VolumeX, MessageCircleHeart, Sparkles, ChevronLeft, ChevronRight, BookOpen, Bookmark } from 'lucide-react';
import { Story } from '../types';
import { ambientSound } from '../utils/audioSynthesizer';

interface ParentReadViewProps {
  story: Story;
  onBack: () => void;
  onOpenAudiobook: (story: Story) => void;
  onOpenMarketplace: (story: Story) => void;
}

export const ParentReadView: React.FC<ParentReadViewProps> = ({
  story,
  onBack,
  onOpenAudiobook,
  onOpenMarketplace,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [fontSize, setFontSize] = useState<'md' | 'lg' | 'xl' | '2xl'>('lg');
  const [ambientMode, setAmbientMode] = useState<'off' | 'rain' | 'lullaby' | 'crickets'>('off');
  const [showParentTips, setShowParentTips] = useState(true);
  const [highlightLine, setHighlightLine] = useState(false);

  const currentPage = story.pages[currentPageIndex] || story.pages[0];

  const handleAmbientChange = (mode: 'off' | 'rain' | 'lullaby' | 'crickets') => {
    setAmbientMode(mode);
    ambientSound.playMode(mode);
  };

  const fontClasses = {
    md: 'text-base leading-relaxed',
    lg: 'text-lg md:text-xl leading-relaxed',
    xl: 'text-xl md:text-2xl leading-relaxed',
    '2xl': 'text-2xl md:text-3xl leading-relaxed',
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 text-slate-100 p-4 md:p-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-3 px-4 shadow-lg backdrop-blur-md">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-amber-300 bg-slate-800 px-3 py-1.5 rounded-xl transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Library</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-medium">
            {/* Ambient Sound selector */}
            <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800">
              <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              <select
                value={ambientMode}
                onChange={(e) => handleAmbientChange(e.target.value as any)}
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
              >
                <option value="off" className="bg-slate-900">Quiet Room</option>
                <option value="lullaby" className="bg-slate-900">🎵 Lullaby Chimes</option>
                <option value="rain" className="bg-slate-900">🌧️ Soft Rain Bed</option>
                <option value="crickets" className="bg-slate-900">🌙 Night Crickets</option>
              </select>
            </div>

            {/* Font Size Selector */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[11px] px-1">Text:</span>
              {(['md', 'lg', 'xl'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`px-2 py-0.5 rounded text-[11px] uppercase font-bold ${
                    fontSize === size ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Switch to Audiobook */}
            <button
              onClick={() => onOpenAudiobook(story)}
              className="flex items-center gap-1.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-xl hover:bg-purple-500/30 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Audiobook</span>
            </button>
          </div>
        </div>

        {/* Story Book Card Container */}
        <div className="relative bg-slate-900 border border-slate-800/80 rounded-3xl p-6 md:p-12 shadow-2xl min-h-[500px] flex flex-col justify-between overflow-hidden">
          {/* Subtle star background effect */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* Book Header info */}
          <div className="border-b border-slate-800/80 pb-4 mb-6 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[11px] uppercase font-semibold text-amber-400/90 tracking-wider">
                {story.themeLabel} • For {story.childName}
              </span>
              <h1 className="font-serif text-xl md:text-2xl font-bold text-slate-100">
                {story.title}
              </h1>
            </div>
            <div className="text-xs text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
              Page {currentPageIndex + 1} of {story.pages.length}
            </div>
          </div>

          {/* Main Story Text Content */}
          <div className="my-auto space-y-6 max-w-2xl mx-auto w-full">
            {currentPage.title && (
              <h2 className="font-serif text-lg md:text-xl text-amber-200/90 font-semibold text-center italic">
                "{currentPage.title}"
              </h2>
            )}

            <div className={`font-serif text-slate-100 text-left font-normal ${fontClasses[fontSize]} space-y-4 tracking-wide`}>
              <p className={highlightLine ? 'bg-amber-400/10 p-2 rounded-lg border-l-2 border-amber-400' : ''}>
                {currentPage.text}
              </p>
            </div>

            {/* Illustration Prompt Description Badge */}
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300/90 block mb-0.5">Storybook Visual Scene:</span>
                <p className="italic text-slate-300">{currentPage.illustrationPrompt}</p>
              </div>
            </div>

            {/* Parent Discussion Cue */}
            {currentPage.parentalDiscussionPrompt && showParentTips && (
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs shadow-md space-y-1 animate-fade-in">
                <div className="flex items-center gap-2 font-bold text-indigo-300">
                  <MessageCircleHeart className="w-4 h-4 text-indigo-400" />
                  <span>Bedtime Co-Reading Prompt</span>
                </div>
                <p className="text-slate-200 text-xs italic">
                  {currentPage.parentalDiscussionPrompt}
                </p>
              </div>
            )}
          </div>

          {/* Page Turn Controls Footer */}
          <div className="pt-8 mt-6 border-t border-slate-800/80 flex items-center justify-between">
            <button
              onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentPageIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>

            <button
              onClick={() => onOpenMarketplace(story)}
              className="hidden sm:flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 font-medium"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Order Printed Illustrated Book</span>
            </button>

            {currentPageIndex < story.pages.length - 1 ? (
              <button
                onClick={() => setCurrentPageIndex((prev) => Math.min(story.pages.length - 1, prev + 1))}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs hover:from-amber-300 hover:to-amber-400 shadow-md transition-colors"
              >
                <span>Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onBack}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 shadow-md transition-colors"
              >
                <span>Story Complete • Return to Library</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
